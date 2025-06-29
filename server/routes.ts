import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDownloadSchema } from "@shared/schema";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execAsync = promisify(exec);

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Get video info endpoint
  app.get("/api/video-info/:videoId", async (req, res) => {
    try {
      const { videoId } = req.params;
      
      // Validate video ID format
      if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return res.status(400).json({ error: "Invalid video ID format" });
      }
      
      // Use yt-dlp to get video information with timeout
      const command = `timeout 30s yt-dlp --no-warnings --print-json "https://www.youtube.com/watch?v=${videoId}"`;
      const { stdout, stderr } = await execAsync(command);
      
      if (!stdout.trim()) {
        throw new Error("No video information received");
      }
      
      const videoInfo = JSON.parse(stdout.trim());
      
      // Filter and process formats
      const mp4Formats = videoInfo.formats?.filter((f: any) => 
        f.ext === 'mp4' && f.vcodec !== 'none' && f.acodec !== 'none'
      ) || [];
      
      const processedFormats = mp4Formats.map((f: any) => ({
        format_id: f.format_id,
        ext: f.ext,
        quality: f.height ? `${f.height}p` : (f.format_note || 'unknown'),
        filesize: f.filesize || 0
      })).slice(0, 5); // Limit to 5 formats
      
      res.json({
        title: videoInfo.title || 'Unknown Title',
        duration: videoInfo.duration || 0,
        description: videoInfo.description || '',
        thumbnail: videoInfo.thumbnail || '',
        formats: processedFormats
      });
    } catch (error) {
      console.error("Error getting video info:", error);
      res.status(400).json({ 
        error: "Failed to get video information. Please check if the video exists and is public." 
      });
    }
  });

  // Start download endpoint
  app.post("/api/downloads", async (req, res) => {
    try {
      const result = insertDownloadSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data" });
      }

      const download = await storage.createDownload(result.data);
      
      // Start download process in background
      downloadVideo(download.id, download.videoId, download.format);
      
      res.json(download);
    } catch (error) {
      console.error("Error starting download:", error);
      res.status(500).json({ error: "Failed to start download" });
    }
  });

  // Get download status endpoint
  app.get("/api/downloads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const download = await storage.getDownload(id);
      
      if (!download) {
        return res.status(404).json({ error: "Download not found" });
      }
      
      res.json(download);
    } catch (error) {
      console.error("Error getting download:", error);
      res.status(500).json({ error: "Failed to get download" });
    }
  });

  // Get all downloads endpoint
  app.get("/api/downloads", async (req, res) => {
    try {
      const downloads = await storage.getAllDownloads();
      res.json(downloads);
    } catch (error) {
      console.error("Error getting downloads:", error);
      res.status(500).json({ error: "Failed to get downloads" });
    }
  });

  // Download file endpoint
  app.get("/api/downloads/:id/file", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const download = await storage.getDownload(id);
      
      if (!download || download.status !== "completed" || !download.downloadPath) {
        return res.status(404).json({ error: "Download not available" });
      }
      
      const filePath = download.downloadPath;
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
      }
      
      const fileName = path.basename(filePath);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', 'video/mp4');
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ error: "Failed to download file" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

// Background download function
async function downloadVideo(downloadId: number, videoId: string, format: string) {
  try {
    await storage.updateDownloadStatus(downloadId, "downloading", 0);
    
    // Create downloads directory if it doesn't exist
    const downloadsDir = path.join(process.cwd(), "downloads");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }
    
    // Set output filename
    const outputPath = path.join(downloadsDir, `${videoId}_${format}.%(ext)s`);
    
    // Execute yt-dlp command
    const command = `yt-dlp -f "${format}" -o "${outputPath}" "https://www.youtube.com/watch?v=${videoId}"`;
    
    const { stdout, stderr } = await execAsync(command);
    
    // Find the actual downloaded file
    const files = fs.readdirSync(downloadsDir);
    const downloadedFile = files.find(file => file.startsWith(`${videoId}_${format}`));
    
    if (downloadedFile) {
      const finalPath = path.join(downloadsDir, downloadedFile);
      await storage.updateDownloadStatus(downloadId, "completed", 100, finalPath);
    } else {
      throw new Error("Downloaded file not found");
    }
    
  } catch (error) {
    console.error(`Download failed for ${videoId}:`, error);
    await storage.updateDownloadStatus(downloadId, "failed", 0);
  }
}
