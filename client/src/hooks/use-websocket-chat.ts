import { useState, useRef, useEffect } from "react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import type { SearchResult } from "@shared/schema";

interface SubscriptionData {
  subscription: { plan: string; billingCycleStart?: string; billingCycleEnd?: string | null; pendingPlan?: string | null };
  usage: { projects: number; conversations: number; aiQueries: number; storageMB: number; dailyFreeUsed: number; credits: number };
  limits: { projects: number; conversations?: number; aiQueries: number; storageMB: number; dailyFreeLimit: number };
}

interface UseWebSocketChatOptions {
  selectedConversationId: string | null;
  fileViewerProjectId: string | null;
  subscriptionData?: SubscriptionData;
  setUpgradeLimitType: (type: "projects" | "conversations" | "aiQueries" | "storage") => void;
  setUpgradeLimitOpen: (open: boolean) => void;
}

export function useWebSocketChat({
  selectedConversationId,
  fileViewerProjectId,
  subscriptionData,
  setUpgradeLimitType,
  setUpgradeLimitOpen,
}: UseWebSocketChatOptions) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<{
    role: string;
    content: string;
  } | null>(null);
  const [optimisticUserMessage, setOptimisticUserMessage] = useState<{
    content: string;
    timestamp: Date;
  } | null>(null);
  const [contextSources, setContextSources] = useState<SearchResult[] | undefined>(undefined);
  const [conversionStatus, setConversionStatus] = useState<{
    isConverting: boolean;
    currentFile: string | null;
    results: Array<{
      originalFile: { id: string; name: string };
      convertedFile: { id: string; name: string; size: number; downloadUrl: string };
    }>;
  }>({ isConverting: false, currentFile: null, results: [] });

  // WebSocket ref for persistent connection
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const currentConversationIdRef = useRef(selectedConversationId);
  const reconnectAttemptsRef = useRef(0);
  const reconnectDelayRef = useRef(2000); // Start with 2 seconds
  const fileViewerProjectIdRef = useRef<string | null>(fileViewerProjectId);
  const maxReconnectAttempts = 10;
  const maxReconnectDelay = 30000; // Max 30 seconds

  // Update ref when selectedConversationId changes
  useEffect(() => {
    currentConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  // Update ref when fileViewerProjectId changes
  useEffect(() => {
    fileViewerProjectIdRef.current = fileViewerProjectId;
  }, [fileViewerProjectId]);

  // Setup WebSocket connection
  useEffect(() => {
    mountedRef.current = true;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/chat`;

    const connectWS = () => {
      if (!mountedRef.current) return;

      // Check if page is visible - don't reconnect if user left the tab
      if (document.visibilityState === "hidden") {
        return;
      }

      // Check max reconnect attempts
      if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        toast({
          title: "연결 실패",
          description: "서버에 연결할 수 없습니다. 페이지를 새로고침해주세요.",
          variant: "destructive",
        });
        return;
      }

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        // Reset reconnect attempts and delay on successful connection
        reconnectAttemptsRef.current = 0;
        reconnectDelayRef.current = 2000;
      };

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "context") {
            setContextSources(data.sources);
          } else if (data.type === "context_delayed") {
            // RAG search completed after AI streaming started
            // Update context sources with delayed results
            setContextSources(data.sources);
            console.log("[RAG] Delayed context received:", data.sources.length, "sources");
          } else if (data.type === "content") {
            setStreamingMessage((prev) => ({
              role: "assistant",
              content: (prev?.content || "") + data.content,
            }));
          } else if (data.type === "done") {
            // Use ref to get current conversationId
            const activeConversationId = currentConversationIdRef.current;
            if (activeConversationId) {
              // Wait for query to complete before clearing streaming state
              // This prevents flickering when transitioning from streaming to stored messages
              await queryClient.invalidateQueries({
                queryKey: ["/api/messages", activeConversationId],
              });
            }
            // Invalidate subscription cache to update AI query count
            queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
            setStreamingMessage(null);
            setOptimisticUserMessage(null);
            setIsStreaming(false);
          } else if (data.type === "error") {
            toast({ title: "오류 발생", description: data.error, variant: "destructive" });
            setStreamingMessage(null);
            setOptimisticUserMessage(null);
            setIsStreaming(false);
          } else if (data.type === "conversion_started") {
            setConversionStatus(prev => ({
              ...prev,
              isConverting: true,
              currentFile: data.filename,
            }));
            toast({
              title: t("chat.conversion.started"),
              description: data.filename,
            });
          } else if (data.type === "conversion_completed") {
            const result = data.result;
            if (result?.originalFile && result?.convertedFile) {
              setConversionStatus(prev => ({
                ...prev,
                isConverting: false,
                currentFile: null,
                results: [...prev.results, result],
              }));
              toast({
                title: t("chat.conversion.completed"),
                description: result.convertedFile.name,
              });
              // Refresh file and project lists to show new PDF
              queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
              const activeProjectId = fileViewerProjectIdRef.current;
              if (activeProjectId) {
                queryClient.invalidateQueries({ queryKey: ["/api/projects", activeProjectId, "files"] });
              }
            } else {
              console.warn("Received incomplete conversion result:", data);
            }
          } else if (data.type === "conversion_error") {
            setConversionStatus(prev => ({
              ...prev,
              isConverting: false,
              currentFile: null,
            }));
            toast({
              title: t("chat.conversion.error"),
              description: data.filename,
              variant: "destructive",
            });
          }
        } catch (e) {
          // Failed to parse message
        }
      };

      ws.onerror = (error) => {
        console.error("[WebSocket] Error:", error);
        // Force close on error to trigger reconnection
        if (ws.readyState !== WebSocket.CLOSED) {
          ws.close();
        }
      };

      ws.onclose = (event) => {
        console.log(`[WebSocket] Closed: code=${event.code}, reason=${event.reason}`);
        wsRef.current = null; // Clear the reference to ensure proper reconnection check

        if (mountedRef.current && document.visibilityState === "visible") {
          reconnectAttemptsRef.current += 1;

          // Exponential backoff: double the delay each time, up to max
          const currentDelay = reconnectDelayRef.current;
          reconnectTimeoutRef.current = setTimeout(connectWS, currentDelay);

          reconnectDelayRef.current = Math.min(currentDelay * 2, maxReconnectDelay);
        }
      };
    };

    // Handle page visibility change - reconnect immediately when user comes back
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // User came back to the tab
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          // Reset attempts when user actively returns
          reconnectAttemptsRef.current = 0;
          reconnectDelayRef.current = 2000;
          connectWS();
        }
      } else {
        // User left the tab - cancel any pending reconnection
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    connectWS();

    return () => {
      mountedRef.current = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const sendMessage = async (message: string, attachments?: any[], taggedFilesParam?: any[]) => {
    if (!selectedConversationId || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      toast({ title: "연결 오류", description: "서버에 연결되지 않았습니다", variant: "destructive" });
      return;
    }

    // Check AI query limit for non-unlimited plans
    const plan = subscriptionData?.subscription?.plan || "free";
    const aiQueryLimit = subscriptionData?.limits?.aiQueries ?? 30;
    const currentAiQueries = subscriptionData?.usage?.aiQueries ?? 0;

    // Free plan has limited AI queries, basic and pro are unlimited (limit = -1 or very high)
    if (plan === "free" && aiQueryLimit > 0 && currentAiQueries >= aiQueryLimit) {
      setUpgradeLimitType("aiQueries");
      setUpgradeLimitOpen(true);
      return;
    }

    setIsStreaming(true);
    setContextSources(undefined);

    // 태그된 파일이 있으면 메시지 앞에 파일 정보 추가 (백엔드 파싱용 @{} 형식 유지)
    let fullMessage = message;
    if (taggedFilesParam && taggedFilesParam.length > 0) {
      const fileRefs = taggedFilesParam.map((f) => `@{${f.originalName}}`).join(" ");
      fullMessage = `${fileRefs}\n\n${message}`;
    }

    // 사용자 메시지를 즉시 화면에 표시
    setOptimisticUserMessage({
      content: fullMessage,
      timestamp: new Date(),
    });

    setStreamingMessage({ role: "assistant", content: "" });

    try {
      // Send message via WebSocket
      wsRef.current.send(JSON.stringify({
        conversationId: selectedConversationId,
        content: fullMessage,
        attachments,
        taggedFiles: taggedFilesParam,
      }));
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({ title: "메시지 전송 실패", variant: "destructive" });
      setStreamingMessage(null);
      setOptimisticUserMessage(null);
      setIsStreaming(false);
    }
  };

  return {
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
  };
}
