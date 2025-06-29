import { useState } from "react";
import { Play } from "lucide-react";
import { UrlInput } from "@/components/url-input";
import { VideoPlayer } from "@/components/video-player";
import { FeaturesSection } from "@/components/features-section";
import { getYouTubeVideoId } from "@/lib/youtube";

export default function Home() {
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVideoLoad = (videoId: string) => {
    setLoading(true);
    
    // Simulate loading delay to show loading state
    setTimeout(() => {
      setCurrentVideoId(videoId);
      setLoading(false);
    }, 1500);
  };

  const handleSampleVideoSelect = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      handleVideoLoad(videoId);
    }
  };

  return (
    <div style={{ backgroundColor: "var(--youtube-dark)", color: "var(--youtube-text)" }} className="min-h-screen">
      {/* Header */}
      <header style={{ backgroundColor: "var(--youtube-dark)", borderBottomColor: "var(--youtube-gray)" }} className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "var(--youtube-red)" }}
              >
                <Play className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold youtube-logo">YouTube Player</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              <span 
                className="px-3 py-1 rounded-full text-sm"
                style={{ 
                  backgroundColor: "var(--youtube-gray)",
                  color: "var(--youtube-text-secondary)"
                }}
              >
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Watch YouTube Videos
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: "var(--youtube-text-secondary)" }}>
            Enter any YouTube URL to start watching. Supports standard links, short links, and embedded URLs.
          </p>
        </div>

        {/* URL Input Section */}
        <UrlInput onVideoLoad={handleVideoLoad} loading={loading} />

        {/* Video Player Section */}
        <VideoPlayer 
          videoId={currentVideoId} 
          loading={loading}
          onSampleVideoSelect={handleSampleVideoSelect}
        />

        {/* Features Section */}
        <FeaturesSection />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t" style={{ 
        backgroundColor: "var(--youtube-gray)",
        borderTopColor: "var(--youtube-light-gray)"
      }}>
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p style={{ color: "var(--youtube-text-secondary)" }}>
              Built with inspiration from{" "}
              <a 
                href="https://github.com/mikancat-taki/ComfyUI-YouTubeVideoPlayer" 
                className="hover:underline"
                style={{ color: "var(--youtube-red)" }}
              >
                ComfyUI-YouTubeVideoPlayer
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
