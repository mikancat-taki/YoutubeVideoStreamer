import { Button } from "@/components/ui/button";
import { Share, Download, Play, Video } from "lucide-react";
import { sampleVideos } from "@/lib/youtube";

interface VideoPlayerProps {
  videoId: string | null;
  loading: boolean;
  onSampleVideoSelect: (url: string) => void;
}

export function VideoPlayer({ videoId, loading, onSampleVideoSelect }: VideoPlayerProps) {
  if (loading) {
    return (
      <div className="rounded-2xl p-8 fade-in" style={{ backgroundColor: "var(--youtube-gray)" }}>
        <div className="text-center py-16">
          <div className="loading-spinner mx-auto mb-4" />
          <p style={{ color: "var(--youtube-text-secondary)" }}>Loading video...</p>
        </div>
      </div>
    );
  }

  if (!videoId) {
    return (
      <div className="rounded-2xl p-8 fade-in" style={{ backgroundColor: "var(--youtube-gray)" }}>
        <div className="text-center py-16">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "var(--youtube-light-gray)" }}
          >
            <Video className="w-12 h-12" style={{ color: "var(--youtube-text-secondary)" }} />
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--youtube-text)" }}>
            No video loaded
          </h3>
          <p className="mb-6" style={{ color: "var(--youtube-text-secondary)" }}>
            Enter a YouTube URL above to start watching
          </p>
          
          <div className="max-w-md mx-auto">
            <p className="text-sm mb-3" style={{ color: "var(--youtube-text-secondary)" }}>
              Try these sample videos:
            </p>
            <div className="space-y-2">
              {sampleVideos.map((video, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => onSampleVideoSelect(video.url)}
                  className="w-full text-left p-3 rounded-lg transition-colors duration-200 h-auto"
                  style={{ backgroundColor: "var(--youtube-light-gray)" }}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                      style={{ backgroundColor: "var(--youtube-red)" }}
                    >
                      <Play className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium" style={{ color: "var(--youtube-text)" }}>
                        {video.title}
                      </p>
                      <p className="text-xs" style={{ color: "var(--youtube-text-secondary)" }}>
                        {video.description}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-8 fade-in" style={{ backgroundColor: "var(--youtube-gray)" }}>
      <div className="video-container bg-black rounded-xl overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      
      <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--youtube-text)" }}>
            YouTube Video
          </h3>
          <p style={{ color: "var(--youtube-text-secondary)" }} className="text-sm">
            Video ID: <span className="font-mono">{videoId}</span>
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button
            variant="ghost"
            className="px-4 py-2 rounded-lg text-sm transition-colors duration-200"
            style={{ 
              backgroundColor: "var(--youtube-light-gray)",
              color: "var(--youtube-text)"
            }}
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            variant="ghost"
            className="px-4 py-2 rounded-lg text-sm transition-colors duration-200"
            style={{ 
              backgroundColor: "var(--youtube-light-gray)",
              color: "var(--youtube-text)"
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
