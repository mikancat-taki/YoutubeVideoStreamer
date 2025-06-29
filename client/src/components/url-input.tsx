import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Play } from "lucide-react";
import { getYouTubeVideoId } from "@/lib/youtube";

interface UrlInputProps {
  onVideoLoad: (videoId: string) => void;
  loading: boolean;
}

export function UrlInput({ onVideoLoad, loading }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleLoadVideo = () => {
    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    const videoId = getYouTubeVideoId(url.trim());
    if (!videoId) {
      setError("Invalid YouTube URL. Please check the format and try again.");
      return;
    }

    setError("");
    onVideoLoad(videoId);
  };

  const handleInputChange = (value: string) => {
    setUrl(value);
    if (error) setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLoadVideo();
    }
  };

  return (
    <div className="rounded-2xl p-8 mb-8 fade-in" style={{ backgroundColor: "var(--youtube-gray)" }}>
      <div className="max-w-2xl mx-auto">
        <Label htmlFor="youtube-url" className="block text-lg font-medium mb-4" style={{ color: "var(--youtube-text)" }}>
          YouTube Video URL
        </Label>
        
        <div className="relative">
          <Input
            id="youtube-url"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-4 pr-24 rounded-xl text-base input-focus"
            style={{
              backgroundColor: "var(--youtube-light-gray)",
              borderColor: "var(--youtube-light-gray)",
              color: "var(--youtube-text)"
            }}
            disabled={loading}
          />
          <Button
            onClick={handleLoadVideo}
            disabled={loading}
            className="absolute right-2 top-2 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            style={{
              backgroundColor: "var(--youtube-red)",
              color: "white"
            }}
          >
            {loading ? (
              <div className="loading-spinner w-4 h-4" />
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Load Video
              </>
            )}
          </Button>
        </div>
        
        {error && (
          <div className="mt-3 p-3 rounded-lg border" style={{
            backgroundColor: "hsl(0, 62.8%, 30.6%, 0.3)",
            borderColor: "hsl(0, 62.8%, 30.6%, 0.3)"
          }}>
            <p className="text-sm flex items-center" style={{ color: "hsl(0, 84.2%, 60.2%)" }}>
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </p>
          </div>
        )}
        
        <div className="mt-6">
          <p className="text-sm mb-3" style={{ color: "var(--youtube-text-secondary)" }}>
            Supported URL formats:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {[
              "https://www.youtube.com/watch?v=...",
              "https://youtu.be/...",
              "https://www.youtube.com/embed/...",
              "https://youtube.com/shorts/..."
            ].map((format, index) => (
              <div
                key={index}
                className="p-3 rounded-lg"
                style={{ backgroundColor: "var(--youtube-light-gray)" }}
              >
                <code style={{ color: "var(--youtube-text-secondary)" }}>{format}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
