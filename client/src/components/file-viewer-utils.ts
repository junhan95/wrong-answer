import {
  File as FileIcon,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  Presentation,
} from "lucide-react";
import type { File as FileType, Project, Folder, Conversation } from "@shared/schema";

// ── Type definitions ──

export type ViewMode = "largeIcons" | "list" | "details";
export type SortBy = "name" | "date" | "type";
export type SortOrder = "asc" | "desc";
export type SelectedItemType = { type: "file"; id: string } | { type: "folder"; id: string } | { type: "conversation"; id: string } | null;

export interface SelectionRect {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export type SelectedItems = {
  files: Set<string>;
  folders: Set<string>;
  conversations: Set<string>;
};

export interface FileViewerProps {
  selectedProjectId: string | null;
  selectedFolderId: string | null;
  projects: Project[];
  folders: Folder[];
  conversations?: Conversation[];
  onFolderNavigate?: (folderId: string | null, projectId: string) => void;
  onConversationSelect?: (conversationId: string) => void;
  onAttachFile?: (file: FileType) => void;
  onTagConversation?: (conversation: Conversation) => void;
  onConversationSettings?: (conversationId: string) => void;
}

// ── Constants ──

export const ICON_SIZES = [64, 96, 128, 160, 192, 256];
export const DEFAULT_ICON_SIZE_INDEX = 2;

// ── Utility functions ──

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileIcon(mimeType: string, fileName?: string) {
  if (mimeType.startsWith("image/")) return FileImage;
  if (mimeType.startsWith("video/")) return FileVideo;
  if (mimeType.startsWith("audio/")) return FileAudio;
  if (mimeType.includes("zip") || mimeType.includes("archive") || mimeType.includes("compressed")) return FileArchive;
  if (mimeType.includes("javascript") || mimeType.includes("typescript") || mimeType.includes("json") || mimeType.includes("xml") || mimeType.includes("html") || mimeType.includes("css")) return FileCode;
  
  const ext = fileName?.split('.').pop()?.toLowerCase();
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel") || ext === "xlsx" || ext === "xls" || ext === "csv") return FileSpreadsheet;
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint") || ext === "pptx" || ext === "ppt") return Presentation;
  if (mimeType.includes("word") || mimeType.includes("document") || ext === "docx" || ext === "doc") return FileText;
  if (mimeType.includes("pdf") || ext === "pdf") return FileText;
  if (mimeType.startsWith("text/")) return FileText;
  
  return FileIcon;
}

export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

export function getFileType(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "Image";
  if (mimeType.startsWith("video/")) return "Video";
  if (mimeType.startsWith("audio/")) return "Audio";
  if (mimeType.includes("pdf")) return "PDF";
  if (mimeType.includes("zip") || mimeType.includes("archive")) return "Archive";
  if (mimeType.includes("javascript")) return "JavaScript";
  if (mimeType.includes("typescript")) return "TypeScript";
  if (mimeType.includes("json")) return "JSON";
  if (mimeType.includes("html")) return "HTML";
  if (mimeType.includes("css")) return "CSS";
  if (mimeType.startsWith("text/")) return "Text";
  return "File";
}
