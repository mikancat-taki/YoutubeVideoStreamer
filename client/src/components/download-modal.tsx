import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Download, Check, AlertCircle, Loader } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

interface VideoInfo {
  title: string;
  duration: number;
  thumbnail: string;
  formats: {
    format_id: string;
    ext: string;
    quality: string;
    filesize?: number;
  }[];
}

interface DownloadStatus {
  id: number;
  status: string;
  progress: number;
  downloadPath?: string;
}

export function DownloadModal({ isOpen, onClose, videoId }: DownloadModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [downloadId, setDownloadId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Get video info
  const { data: videoInfo, isLoading: loadingInfo } = useQuery<VideoInfo>({
    queryKey: ['/api/video-info', videoId],
    enabled: isOpen && !!videoId,
  });

  // Track download status
  const { data: downloadStatus } = useQuery<DownloadStatus>({
    queryKey: ['/api/downloads', downloadId],
    enabled: !!downloadId,
    refetchInterval: downloadId ? 2000 : false, // Poll every 2 seconds
  });

  // Start download mutation
  const startDownloadMutation = useMutation({
    mutationFn: async (data: { videoId: string; format: string; title?: string }) => {
      const response = await fetch('/api/downloads', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to start download');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setDownloadId(data.id);
      queryClient.invalidateQueries({ queryKey: ['/api/downloads'] });
    },
  });

  const handleStartDownload = () => {
    if (!selectedFormat || !videoId) return;
    
    startDownloadMutation.mutate({
      videoId,
      format: selectedFormat,
      title: videoInfo?.title,
    });
  };

  const handleDownloadFile = async () => {
    if (!downloadId) return;
    
    try {
      const response = await fetch(`/api/downloads/${downloadId}/file`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${videoInfo?.title || videoId}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "不明";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" style={{ backgroundColor: "var(--youtube-gray)" }}>
        <DialogHeader>
          <DialogTitle className="flex items-center" style={{ color: "var(--youtube-text)" }}>
            <Download className="w-5 h-5 mr-2" />
            動画をダウンロード
          </DialogTitle>
        </DialogHeader>

        {loadingInfo ? (
          <div className="text-center py-8">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: "var(--youtube-red)" }} />
            <p style={{ color: "var(--youtube-text-secondary)" }}>動画情報を取得中...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Video Info */}
            {videoInfo && (
              <div className="space-y-3">
                <h3 className="font-medium truncate" style={{ color: "var(--youtube-text)" }}>
                  {videoInfo.title}
                </h3>
                <div className="text-sm" style={{ color: "var(--youtube-text-secondary)" }}>
                  時間: {Math.floor(videoInfo.duration / 60)}分{videoInfo.duration % 60}秒
                </div>
              </div>
            )}

            {/* Format Selection */}
            {!downloadId && (
              <div className="space-y-3">
                <label className="text-sm font-medium" style={{ color: "var(--youtube-text)" }}>
                  品質を選択:
                </label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger style={{ backgroundColor: "var(--youtube-light-gray)", borderColor: "var(--youtube-light-gray)" }}>
                    <SelectValue placeholder="品質を選択してください" />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: "var(--youtube-light-gray)" }}>
                    {videoInfo?.formats.map((format) => (
                      <SelectItem key={format.format_id} value={format.format_id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{format.quality}</span>
                          <span className="ml-4 text-xs" style={{ color: "var(--youtube-text-secondary)" }}>
                            {formatFileSize(format.filesize)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  onClick={handleStartDownload}
                  disabled={!selectedFormat || startDownloadMutation.isPending}
                  className="w-full"
                  style={{ backgroundColor: "var(--youtube-red)", color: "white" }}
                >
                  {startDownloadMutation.isPending ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  ダウンロード開始
                </Button>
              </div>
            )}

            {/* Download Progress */}
            {downloadStatus && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: "var(--youtube-text)" }}>
                    ダウンロード状況:
                  </span>
                  <span className="text-sm" style={{ 
                    color: downloadStatus.status === 'completed' ? 'var(--youtube-red)' : 'var(--youtube-text-secondary)' 
                  }}>
                    {downloadStatus.status === 'pending' && '待機中...'}
                    {downloadStatus.status === 'downloading' && 'ダウンロード中...'}
                    {downloadStatus.status === 'completed' && '完了'}
                    {downloadStatus.status === 'failed' && '失敗'}
                  </span>
                </div>

                {downloadStatus.status === 'downloading' && (
                  <div className="space-y-2">
                    <Progress value={downloadStatus.progress} className="w-full" />
                    <div className="text-center text-sm" style={{ color: "var(--youtube-text-secondary)" }}>
                      {downloadStatus.progress}%
                    </div>
                  </div>
                )}

                {downloadStatus.status === 'completed' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center p-4 rounded-lg" 
                         style={{ backgroundColor: "var(--youtube-light-gray)" }}>
                      <Check className="w-6 h-6 mr-2" style={{ color: "var(--youtube-red)" }} />
                      <span style={{ color: "var(--youtube-text)" }}>ダウンロード完了!</span>
                    </div>
                    <Button
                      onClick={handleDownloadFile}
                      className="w-full"
                      style={{ backgroundColor: "var(--youtube-red)", color: "white" }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      ファイルをダウンロード
                    </Button>
                  </div>
                )}

                {downloadStatus.status === 'failed' && (
                  <div className="flex items-center justify-center p-4 rounded-lg" 
                       style={{ backgroundColor: "hsl(0, 62.8%, 30.6%, 0.3)" }}>
                    <AlertCircle className="w-6 h-6 mr-2" style={{ color: "hsl(0, 84.2%, 60.2%)" }} />
                    <span style={{ color: "hsl(0, 84.2%, 60.2%)" }}>ダウンロードに失敗しました</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}