import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { TutorSession, TutorMessage, InsertTutorSession, InsertTutorMessage } from "@shared/schema";

export function useTutorSessions() {
  const queryClient = useQueryClient();

  const query = useQuery<TutorSession[]>({
    queryKey: ["/api/tutor/sessions"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTutorSession) => {
      const res = await apiRequest("POST", "/api/tutor/sessions", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tutor/sessions"] });
    },
  });

  return {
    sessions: query.data || [],
    isLoading: query.isLoading,
    createSession: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}

export function useTutorMessages(sessionId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery<TutorMessage[]>({
    queryKey: [`/api/tutor/sessions/${sessionId}/messages`],
    enabled: !!sessionId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: Omit<InsertTutorMessage, "sessionId">) => {
      const res = await apiRequest("POST", `/api/tutor/sessions/${sessionId}/messages`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tutor/sessions/${sessionId}/messages`] });
    },
  });

  return {
    messages: query.data || [],
    isLoading: query.isLoading,
    sendMessage: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
  };
}
