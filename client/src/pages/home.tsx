import { useState, useCallback, useRef, useEffect, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

// Lazy load main panel components for faster initial load
const ExplorerSidebar = lazy(() => import("@/components/explorer-sidebar").then(m => ({ default: m.ExplorerSidebar })));
const FileViewer = lazy(() => import("@/components/file-viewer").then(m => ({ default: m.FileViewer })));
const ChatInterface = lazy(() => import("@/components/chat-interface").then(m => ({ default: m.ChatInterface })));
const ChatInput = lazy(() => import("@/components/chat-input").then(m => ({ default: m.ChatInput })));
const ExplorerToolbar = lazy(() => import("@/components/explorer-toolbar").then(m => ({ default: m.ExplorerToolbar })));
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useMutations } from "@/hooks/use-mutations";
import { useWebSocketChat } from "@/hooks/use-websocket-chat";
import type { Project, Conversation, Message, SearchResult, Folder } from "@shared/schema";

// Lazy load dialogs - only loaded when needed
const SearchDialog = lazy(() => import("@/components/search-dialog").then(m => ({ default: m.SearchDialog })));
const RenameDialog = lazy(() => import("@/components/rename-dialog").then(m => ({ default: m.RenameDialog })));
const CreateDialog = lazy(() => import("@/components/create-dialog").then(m => ({ default: m.CreateDialog })));
const CreateConversationDialog = lazy(() => import("@/components/create-conversation-dialog").then(m => ({ default: m.CreateConversationDialog })));
const EditConversationDialog = lazy(() => import("@/components/edit-conversation-dialog").then(m => ({ default: m.EditConversationDialog })));
const UpgradeLimitDialog = lazy(() => import("@/components/upgrade-limit-dialog").then(m => ({ default: m.UpgradeLimitDialog })));
const OnboardingTutorial = lazy(() => import("@/components/onboarding-tutorial").then(m => ({ default: m.OnboardingTutorial })));
const SettingsPanel = lazy(() => import("@/components/settings-dialog").then(m => ({ default: m.SettingsPanel })));

function SidebarSkeleton() {
  return (
    <div className="flex flex-col h-full bg-sidebar p-3 gap-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-full" />
      <div className="space-y-2 mt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-6 w-full" />
            <div className="ml-4 space-y-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FileViewerSkeleton() {
  return (
    <div className="flex flex-col h-full bg-background p-3 gap-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <Skeleton className="h-16 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full bg-background p-4 gap-4">
      <div className="flex-1 space-y-4">
        <div className="flex gap-3">
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <div className="space-y-2 flex-1 max-w-[70%]">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(new Set());
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const highlightPendingRef = useRef(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [highlightKey, setHighlightKey] = useState(0);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [createConversationOpen, setCreateConversationOpen] = useState(false);
  const [createConversationProjectId, setCreateConversationProjectId] = useState<string | null>(null);
  const [renameProjectOpen, setRenameProjectOpen] = useState(false);
  const [renameProjectId, setRenameProjectId] = useState<string | null>(null);
  const [renameConversationOpen, setRenameConversationOpen] = useState(false);
  const [renameConversationId, setRenameConversationId] = useState<string | null>(null);
  const [editConversationOpen, setEditConversationOpen] = useState(false);
  const [editConversationId, setEditConversationId] = useState<string | null>(null);
  const [deleteProjectDialogOpen, setDeleteProjectDialogOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [deleteConversationDialogOpen, setDeleteConversationDialogOpen] = useState(false);
  const [deleteConversationId, setDeleteConversationId] = useState<string | null>(null);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [createFolderProjectId, setCreateFolderProjectId] = useState<string | null>(null);
  const [createFolderParentId, setCreateFolderParentId] = useState<string | null>(null);
  const [createConversationFolderId, setCreateConversationFolderId] = useState<string | null>(null);
  const [renameFolderOpen, setRenameFolderOpen] = useState(false);
  const [renameFolderId, setRenameFolderId] = useState<string | null>(null);
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);
  const [deleteFolderId, setDeleteFolderId] = useState<string | null>(null);
  const [fileViewerProjectId, setFileViewerProjectId] = useState<string | null>(null);
  const [fileViewerFolderId, setFileViewerFolderId] = useState<string | null>(null);
  const [upgradeLimitOpen, setUpgradeLimitOpen] = useState(false);
  const [upgradeLimitType, setUpgradeLimitType] = useState<"projects" | "conversations" | "aiQueries" | "storage">("projects");
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [taggedFiles, setTaggedFiles] = useState<Array<{
    id: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    type?: "file" | "conversation"; // 파일 또는 대화 구분
  }>>([]);

  const { data: projectsData = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    staleTime: 30 * 1000,
  });

  // 프로젝트를 order로 정렬
  const projects = [...projectsData].sort((a, b) => a.order - b.order);

  const { data: conversations = [], isLoading: conversationsLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    staleTime: 30 * 1000,
  });

  // Subscription data for limit checking
  interface SubscriptionData {
    subscription: { plan: string; billingCycleStart?: string; billingCycleEnd?: string | null; pendingPlan?: string | null };
    usage: { projects: number; conversations: number; aiQueries: number; storageMB: number; dailyFreeUsed: number; credits: number };
    limits: { projects: number; conversations?: number; aiQueries: number; storageMB: number; dailyFreeLimit: number };
  }

  const { data: subscriptionData } = useQuery<SubscriptionData>({
    queryKey: ["/api/subscription"],
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });

  const { data: foldersData = [], isLoading: foldersLoading } = useQuery<Folder[]>({
    queryKey: ["/api/folders"],
    staleTime: 30 * 1000,
  });

  const isDataLoading = projectsLoading || conversationsLoading || foldersLoading;

  // 폴더를 order로 정렬
  const folders = [...foldersData].sort((a, b) => a.order - b.order);

  // 폴더의 모든 상위 폴더 ID를 가져오는 헬퍼 함수
  const getParentFolderIds = (folderId: string | null): string[] => {
    if (!folderId) return [];
    const parentIds: string[] = [];
    let currentFolder = folders.find((f) => f.id === folderId);
    while (currentFolder?.parentFolderId) {
      parentIds.push(currentFolder.parentFolderId);
      currentFolder = folders.find((f) => f.id === currentFolder?.parentFolderId);
    }
    return parentIds;
  };

  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages", selectedConversationId],
    enabled: !!selectedConversationId,
  });

  // Clear highlight and timeout when conversation changes (unless highlight is pending from search)
  const prevConversationIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (prevConversationIdRef.current !== null && prevConversationIdRef.current !== selectedConversationId) {
      // Only clear if highlight is not pending from a search result click
      if (!highlightPendingRef.current) {
        if (highlightTimeoutRef.current) {
          clearTimeout(highlightTimeoutRef.current);
          highlightTimeoutRef.current = null;
        }
        setHighlightedMessageId(null);
      }
    }
    prevConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  // Cleanup highlight timeout on unmount
  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  const {
    createProjectMutation,
    updateProjectMutation,
    deleteProjectMutation,
    createFolderMutation,
    updateFolderMutation,
    deleteFolderMutation,
    createConversationMutation,
    updateConversationMutation,
    updateConversationSettingsMutation,
    moveConversationMutation,
    moveFolderMutation,
    reorderProjectsMutation,
    deleteConversationMutation,
  } = useMutations({ selectedConversationId, setSelectedConversationId });

  const {
    isStreaming,
    setIsStreaming,
    streamingMessage,
    setStreamingMessage,
    optimisticUserMessage,
    setOptimisticUserMessage,
    contextSources,
    conversionStatus,
    wsRef,
    currentConversationIdRef,
    sendMessage,
  } = useWebSocketChat({
    selectedConversationId,
    fileViewerProjectId,
    subscriptionData,
    setUpgradeLimitType,
    setUpgradeLimitOpen,
  });

  const handleProjectToggle = (projectId: string) => {
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const handleConversationSelect = (conversationId: string) => {
    setNavigationHistory((prev) => [...prev.slice(0, historyIndex + 1), conversationId]);
    setHistoryIndex((prev) => prev + 1);
    setSelectedConversationId(conversationId);
    setShowSettings(false);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setSelectedConversationId(navigationHistory[historyIndex - 1]);
    }
  };

  const handleForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setSelectedConversationId(navigationHistory[historyIndex + 1]);
    }
  };

  const handleUp = () => {
    setSelectedConversationId(null);
  };

  const handleSearch = async (query: string): Promise<SearchResult[]> => {
    try {
      const res = await apiRequest("POST", "/api/search", { query });
      const results = await res.json();
      return results as SearchResult[];
    } catch (error) {
      toast({ title: "검색 실패", variant: "destructive" });
      return [];
    }
  };

  const handleSearchResultClick = (conversationId: string, messageId: string) => {
    // Clear any existing state completely to handle rapid clicks
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = null;
    }
    highlightPendingRef.current = false;

    // Navigate to conversation
    handleConversationSelect(conversationId);

    // Set highlight with incremented key to force re-render even for same messageId
    setHighlightedMessageId(messageId);
    setHighlightKey(prev => prev + 1);

    // Mark as pending to prevent conversation change effect from clearing
    highlightPendingRef.current = true;

    // Clear highlight and all state after 3 seconds
    highlightTimeoutRef.current = setTimeout(() => {
      setHighlightedMessageId(null);
      highlightTimeoutRef.current = null;
      highlightPendingRef.current = false;
    }, 3000);

    // Close search dialog
    setSearchOpen(false);
  };

  const handleCreateProject = () => {
    const plan = subscriptionData?.subscription?.plan || "free";
    const projectLimit = subscriptionData?.limits?.projects ?? 3;
    // 항상 실제 projects 배열 길이를 사용하여 정확한 프로젝트 수 확인
    const currentProjects = projects.length;

    if (plan === "free" && projectLimit > 0 && currentProjects >= projectLimit) {
      setUpgradeLimitType("projects");
      setUpgradeLimitOpen(true);
      return;
    }

    setCreateProjectOpen(true);
  };

  const handleCreateConversation = (projectId: string, folderId?: string) => {
    const plan = subscriptionData?.subscription?.plan || "free";
    const conversationLimit = subscriptionData?.limits?.conversations ?? 50;
    // 항상 실제 conversations 배열 길이를 사용하여 정확한 대화 수 확인
    const currentConversations = conversations.length;

    if (plan === "free" && conversationLimit > 0 && currentConversations >= conversationLimit) {
      setUpgradeLimitType("conversations");
      setUpgradeLimitOpen(true);
      return;
    }

    setCreateConversationProjectId(projectId);
    setCreateConversationFolderId(folderId || null);
    setCreateConversationOpen(true);
  };

  const handleCreateFolder = (projectId: string, parentFolderId?: string) => {
    setCreateFolderProjectId(projectId);
    setCreateFolderParentId(parentFolderId || null);
    setCreateFolderOpen(true);
  };

  const handleRenameFolder = (folderId: string) => {
    setRenameFolderId(folderId);
    setRenameFolderOpen(true);
  };

  const handleDeleteFolder = (folderId: string) => {
    setDeleteFolderId(folderId);
    setDeleteFolderDialogOpen(true);
  };

  const handleRenameProject = (projectId: string) => {
    setRenameProjectId(projectId);
    setRenameProjectOpen(true);
  };

  const handleDeleteProject = (projectId: string) => {
    setDeleteProjectId(projectId);
    setDeleteProjectDialogOpen(true);
  };

  const confirmDeleteProject = () => {
    if (deleteProjectId) {
      deleteProjectMutation.mutate(deleteProjectId);
      setDeleteProjectDialogOpen(false);
      setDeleteProjectId(null);
    }
  };

  const confirmDeleteFolder = () => {
    if (deleteFolderId) {
      deleteFolderMutation.mutate(deleteFolderId);
      setDeleteFolderDialogOpen(false);
      setDeleteFolderId(null);
    }
  };

  const handleEditConversation = (conversationId: string) => {
    setEditConversationId(conversationId);
    setEditConversationOpen(true);
  };

  const handleRenameConversation = (conversationId: string) => {
    setRenameConversationId(conversationId);
    setRenameConversationOpen(true);
  };

  const handleDeleteConversation = (conversationId: string) => {
    setDeleteConversationId(conversationId);
    setDeleteConversationDialogOpen(true);
  };

  const confirmDeleteConversation = () => {
    if (deleteConversationId) {
      deleteConversationMutation.mutate(deleteConversationId);
      setDeleteConversationDialogOpen(false);
      setDeleteConversationId(null);
    }
  };

  const handleReorderProjects = (fromIndex: number, toIndex: number) => {
    const reordered = [...projects];
    const [movedProject] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, movedProject);

    const updates = reordered.map((project, index) => ({
      id: project.id,
      order: index,
    }));

    reorderProjectsMutation.mutate(updates);
  };

  const handleExport = (format: "json" | "txt") => {
    if (!currentConversation || !messages || messages.length === 0) {
      toast({ title: t('home.noMessagesToExport'), variant: "destructive" });
      return;
    }

    const conversationName = currentConversation.name;
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `${conversationName}_${timestamp}.${format}`;

    let content: string;
    let mimeType: string;

    if (format === "json") {
      const exportData = {
        conversation: {
          id: currentConversation.id,
          name: currentConversation.name,
          projectId: currentConversation.projectId,
          createdAt: currentConversation.createdAt,
          updatedAt: currentConversation.updatedAt,
        },
        messages: messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: m.createdAt,
        })),
      };
      content = JSON.stringify(exportData, null, 2);
      mimeType = "application/json";
    } else {
      const lines = [
        `대화: ${conversationName}`,
        `날짜: ${new Date(currentConversation.createdAt).toLocaleString("ko-KR")}`,
        `메시지 수: ${messages.length}`,
        "",
        "=".repeat(60),
        "",
      ];

      messages.forEach((message, index) => {
        const time = new Date(message.createdAt).toLocaleString("ko-KR");
        const role = message.role === "user" ? "사용자" : "AI";
        lines.push(`[${index + 1}] ${role} - ${time}`);
        lines.push(message.content);
        lines.push("");
        lines.push("-".repeat(60));
        lines.push("");
      });

      content = lines.join("\n");
      mimeType = "text/plain";
    }

    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ title: `${format.toUpperCase()} 파일로 내보내기 완료` });
  };

  const currentConversation = conversations.find((c) => c.id === selectedConversationId);
  const currentProject = currentConversation
    ? projects.find((p) => p.id === currentConversation.projectId)
    : undefined;

  const renameProject = projects.find((p) => p.id === renameProjectId);
  const renameConversation = conversations.find((c) => c.id === renameConversationId);
  const renameFolder = folders.find((f) => f.id === renameFolderId);
  const editConversation = conversations.find((c) => c.id === editConversationId);

  return (
    <div className="h-screen overflow-hidden bg-background">
      <Suspense fallback={null}>
        <OnboardingTutorial forceShow={showTutorial} onClose={() => setShowTutorial(false)} />
      </Suspense>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={18} minSize={12} maxSize={30}>
          <Suspense fallback={<SidebarSkeleton />}>
            {isDataLoading ? (
              <SidebarSkeleton />
            ) : (
              <ExplorerSidebar
                projects={projects}
                conversations={conversations}
                folders={folders}
                selectedConversationId={selectedConversationId}
                selectedProjectId={fileViewerProjectId}
                selectedFolderId={fileViewerFolderId}
                expandedProjects={expandedProjects}
                expandedFolderIds={expandedFolderIds}
                onProjectToggle={(projectId) => {
                  handleProjectToggle(projectId);
                }}
                onProjectSelect={(projectId) => {
                  setFileViewerProjectId(projectId);
                  setFileViewerFolderId(null);
                  setSelectedConversationId(null);
                }}
                onConversationSelect={(conversationId) => {
                  handleConversationSelect(conversationId);
                  const conv = conversations.find((c) => c.id === conversationId);
                  if (conv) {
                    setFileViewerProjectId(conv.projectId);
                    setFileViewerFolderId(conv.folderId || null);
                  }
                }}
                onFolderSelect={(folderId, projectId) => {
                  setFileViewerProjectId(projectId);
                  setFileViewerFolderId(folderId);
                  setSelectedConversationId(null);
                }}
                onFolderToggle={(folderId) => {
                  setExpandedFolderIds((prev) => {
                    const newSet = new Set(prev);
                    if (newSet.has(folderId)) {
                      newSet.delete(folderId);
                    } else {
                      newSet.add(folderId);
                    }
                    return newSet;
                  });
                }}
                onCreateProject={handleCreateProject}
                onCreateFolder={handleCreateFolder}
                onCreateConversation={handleCreateConversation}
                onRenameProject={handleRenameProject}
                onDeleteProject={handleDeleteProject}
                onRenameFolder={handleRenameFolder}
                onDeleteFolder={handleDeleteFolder}
                onEditConversation={handleEditConversation}
                onRenameConversation={handleRenameConversation}
                onDeleteConversation={handleDeleteConversation}
                onMoveConversation={(conversationId, projectId, folderId) =>
                  moveConversationMutation.mutate({ id: conversationId, projectId, folderId })
                }
                onMoveFolder={(folderId, projectId, parentFolderId) =>
                  moveFolderMutation.mutate({ id: folderId, projectId, parentFolderId })
                }
                onReorderProjects={handleReorderProjects}
                onOpenSettings={() => {
                  setSelectedConversationId(null);
                  setShowSettings(true);
                }}
              />
            )}
          </Suspense>
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" data-testid="sidebar-resize-handle" />

        <Panel defaultSize={22} minSize={15} maxSize={40}>
          <Suspense fallback={<FileViewerSkeleton />}>
            <FileViewer
              selectedProjectId={fileViewerProjectId}
              selectedFolderId={fileViewerFolderId}
              projects={projects}
              folders={folders}
              conversations={conversations}
              onConversationSelect={(conversationId) => {
                handleConversationSelect(conversationId);
              }}
              onFolderNavigate={(folderId, projectId) => {
                setFileViewerProjectId(projectId);
                setFileViewerFolderId(folderId);

                // 프로젝트 확장
                setExpandedProjects((prev) => {
                  const newSet = new Set(prev);
                  newSet.add(projectId);
                  return newSet;
                });

                // 현재 폴더 및 상위 폴더들 모두 확장
                if (folderId) {
                  const parentIds = getParentFolderIds(folderId);
                  setExpandedFolderIds((prev) => {
                    const newSet = new Set(prev);
                    // 현재 진입한 폴더와 모든 상위 폴더 확장
                    newSet.add(folderId);
                    parentIds.forEach((id) => newSet.add(id));
                    return newSet;
                  });
                }
              }}
              onAttachFile={(file) => {
                // 이미 태그된 파일은 중복 추가하지 않음
                if (!taggedFiles.some((f) => f.id === file.id)) {
                  setTaggedFiles((prev) => [...prev, {
                    id: file.id,
                    originalName: file.originalName,
                    mimeType: file.mimeType,
                    size: file.size,
                    url: `/api/files/${file.id}/download`,
                    type: "file",
                  }]);
                }
              }}
              onTagConversation={(conv) => {
                // 이미 태그된 대화는 중복 추가하지 않음
                if (!taggedFiles.some((f) => f.id === conv.id)) {
                  setTaggedFiles((prev) => [...prev, {
                    id: conv.id,
                    originalName: conv.name,
                    mimeType: "application/x-conversation",
                    size: 0,
                    url: "",
                    type: "conversation",
                  }]);
                }
              }}
              onConversationSettings={(conversationId) => {
                setEditConversationId(conversationId);
                setEditConversationOpen(true);
              }}
            />
          </Suspense>
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" data-testid="fileviewer-resize-handle" />

        <Panel defaultSize={60}>
          <div className="flex flex-col h-full">
            <Suspense fallback={<div className="h-12 bg-background border-b" />}>
              <ExplorerToolbar
                currentProject={currentProject}
                currentConversation={currentConversation}
                onBack={handleBack}
                onForward={handleForward}
                onUp={handleUp}
                onSearch={() => setSearchOpen(true)}
                onExport={handleExport}
                canGoBack={historyIndex > 0}
                canGoForward={historyIndex < navigationHistory.length - 1}
                onStartTutorial={() => setShowTutorial(true)}
              />
            </Suspense>

            {showSettings ? (
              <Suspense fallback={null}>
                <SettingsPanel onClose={() => setShowSettings(false)} />
              </Suspense>
            ) : selectedConversationId ? (
              <Suspense fallback={<ChatSkeleton />}>
                <>
                  <ChatInterface
                    messages={messages}
                    streamingMessage={streamingMessage}
                    contextSources={contextSources}
                    isLoading={messagesLoading}
                    optimisticUserMessage={optimisticUserMessage}
                    highlightedMessageId={highlightedMessageId}
                    highlightKey={highlightKey}
                  />
                  <ChatInput
                    onSend={(message, attachments, taggedFilesParam) => {
                      sendMessage(message, attachments, taggedFilesParam);
                      setTaggedFiles([]);
                    }}
                    disabled={isStreaming}
                    isStreaming={isStreaming}
                    onStopGeneration={async () => {
                      // Close WebSocket to stop streaming
                      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                        wsRef.current.close();
                      }
                      // Clear streaming state but keep partial response
                      if (streamingMessage && streamingMessage.content) {
                        toast({
                          title: t('chat.input.generationStopped', { defaultValue: '응답이 중지되었습니다' })
                        });
                      }
                      setStreamingMessage(null);
                      setOptimisticUserMessage(null);
                      setIsStreaming(false);

                      // Refresh messages to show user's question that was already saved to DB
                      const activeConversationId = currentConversationIdRef.current;
                      if (activeConversationId) {
                        await queryClient.invalidateQueries({
                          queryKey: ["/api/messages", activeConversationId],
                        });
                      }
                    }}
                    taggedFiles={taggedFiles}
                    onRemoveTaggedFile={(fileId) => {
                      setTaggedFiles((prev) => prev.filter((f) => f.id !== fileId));
                    }}
                  />
                </>
              </Suspense>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md">
                  <h2 className="text-2xl font-semibold text-foreground">
                    {isAuthenticated && user ? t('home.greeting', { name: user.firstName || user.email }) : t('home.guestGreeting')}
                  </h2>
                  <p className="text-muted-foreground">
                    {t('home.instructions')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Panel>
      </PanelGroup>

      {/* Lazy-loaded dialogs wrapped in Suspense */}
      <Suspense fallback={null}>
        <SearchDialog
          open={searchOpen}
          onOpenChange={setSearchOpen}
          onSearch={handleSearch}
          onResultClick={handleSearchResultClick}
        />
      </Suspense>

      <Suspense fallback={null}>
        <CreateDialog
          open={createProjectOpen}
          onOpenChange={setCreateProjectOpen}
          title={t('dialogs.createProject.title')}
          placeholder={t('dialogs.createProject.namePlaceholder')}
          onCreate={(name) => createProjectMutation.mutate(name)}
        />
      </Suspense>

      <Suspense fallback={null}>
        <CreateDialog
          open={createFolderOpen}
          onOpenChange={(open) => {
            setCreateFolderOpen(open);
            if (!open) {
              setCreateFolderParentId(null);
            }
          }}
          title={t('dialogs.createFolder.title')}
          placeholder={t('dialogs.createFolder.namePlaceholder')}
          onCreate={(name) => {
            if (createFolderProjectId) {
              createFolderMutation.mutate({
                projectId: createFolderProjectId,
                name,
                parentFolderId: createFolderParentId || undefined
              });
            }
          }}
        />
      </Suspense>

      <Suspense fallback={null}>
        <CreateConversationDialog
          open={createConversationOpen}
          onOpenChange={(open) => {
            setCreateConversationOpen(open);
            if (!open) {
              setCreateConversationFolderId(null);
            }
          }}
          projectId={createConversationProjectId || ""}
          onCreate={(data) => {
            if (createConversationProjectId) {
              createConversationMutation.mutate({
                projectId: createConversationProjectId,
                ...data,
                folderId: createConversationFolderId || undefined,
              });
            }
          }}
        />
      </Suspense>

      <Suspense fallback={null}>
        {renameProject && (
          <RenameDialog
            open={renameProjectOpen}
            onOpenChange={setRenameProjectOpen}
            currentName={renameProject.name}
            title={t('home.renameProjectTitle')}
            onRename={(name) => updateProjectMutation.mutate({ id: renameProject.id, name })}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {renameConversation && (
          <RenameDialog
            open={renameConversationOpen}
            onOpenChange={setRenameConversationOpen}
            currentName={renameConversation.name}
            title={t('home.renameConversationTitle')}
            onRename={(name) =>
              updateConversationMutation.mutate({ id: renameConversation.id, name })
            }
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {editConversation && (
          <EditConversationDialog
            open={editConversationOpen}
            onOpenChange={setEditConversationOpen}
            conversation={editConversation}
            onUpdate={async (data) => {
              await updateConversationSettingsMutation.mutateAsync(data);
            }}
          />
        )}
      </Suspense>

      <AlertDialog open={deleteProjectDialogOpen} onOpenChange={setDeleteProjectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.confirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('home.deleteProjectConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProject}>
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteConversationDialogOpen} onOpenChange={setDeleteConversationDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.confirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('home.deleteConversationConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteConversation}>
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Suspense fallback={null}>
        {renameFolder && (
          <RenameDialog
            open={renameFolderOpen}
            onOpenChange={setRenameFolderOpen}
            currentName={renameFolder.name}
            title={t('home.renameFolderTitle')}
            onRename={(name) => updateFolderMutation.mutate({ id: renameFolder.id, name })}
          />
        )}
      </Suspense>

      <AlertDialog open={deleteFolderDialogOpen} onOpenChange={setDeleteFolderDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.confirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('home.deleteFolderConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteFolder}>
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Suspense fallback={null}>
        <UpgradeLimitDialog
          open={upgradeLimitOpen}
          onOpenChange={setUpgradeLimitOpen}
          limitType={upgradeLimitType}
          currentCount={
            upgradeLimitType === "projects"
              ? (subscriptionData?.usage?.projects ?? projects.length)
              : upgradeLimitType === "conversations"
                ? (subscriptionData?.usage?.conversations ?? conversations.length)
                : upgradeLimitType === "aiQueries"
                  ? (subscriptionData?.usage?.aiQueries ?? 0)
                  : upgradeLimitType === "storage"
                    ? (subscriptionData?.usage?.storageMB ?? 0) + " MB"
                    : 0
          }
          maxLimit={
            upgradeLimitType === "projects"
              ? (subscriptionData?.limits?.projects ?? 3)
              : upgradeLimitType === "conversations"
                ? (subscriptionData?.limits?.conversations ?? -1)
                : upgradeLimitType === "aiQueries"
                  ? (subscriptionData?.limits?.aiQueries ?? 50)
                  : upgradeLimitType === "storage"
                    ? (subscriptionData?.limits?.storageMB ?? 250) + " MB"
                    : 0
          }
          currentPlan={subscriptionData?.subscription?.plan}
        />
      </Suspense>
    </div>
  );
}
