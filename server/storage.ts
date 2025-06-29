import { users, type User, type InsertUser, type Download, type InsertDownload } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Download methods
  createDownload(download: InsertDownload): Promise<Download>;
  getDownload(id: number): Promise<Download | undefined>;
  getDownloadsByVideoId(videoId: string): Promise<Download[]>;
  updateDownloadStatus(id: number, status: string, progress?: number, downloadPath?: string): Promise<void>;
  getAllDownloads(): Promise<Download[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private downloads: Map<number, Download>;
  private currentUserId: number;
  private currentDownloadId: number;

  constructor() {
    this.users = new Map();
    this.downloads = new Map();
    this.currentUserId = 1;
    this.currentDownloadId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDownload(insertDownload: InsertDownload): Promise<Download> {
    const id = this.currentDownloadId++;
    const download: Download = {
      ...insertDownload,
      id,
      title: insertDownload.title || null,
      status: "pending",
      progress: 0,
      downloadPath: null,
      createdAt: new Date(),
    };
    this.downloads.set(id, download);
    return download;
  }

  async getDownload(id: number): Promise<Download | undefined> {
    return this.downloads.get(id);
  }

  async getDownloadsByVideoId(videoId: string): Promise<Download[]> {
    return Array.from(this.downloads.values()).filter(
      (download) => download.videoId === videoId,
    );
  }

  async updateDownloadStatus(
    id: number,
    status: string,
    progress?: number,
    downloadPath?: string
  ): Promise<void> {
    const download = this.downloads.get(id);
    if (download) {
      download.status = status;
      if (progress !== undefined) download.progress = progress;
      if (downloadPath !== undefined) download.downloadPath = downloadPath;
      this.downloads.set(id, download);
    }
  }

  async getAllDownloads(): Promise<Download[]> {
    return Array.from(this.downloads.values());
  }
}

export const storage = new MemStorage();
