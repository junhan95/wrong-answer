import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import type { Conversation } from "@shared/schema";

export function useMutations({
  selectedConversationId,
  setSelectedConversationId,
}: {
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
}) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const createProjectMutation = useMutation({
    mutationFn: async (name: string) => {
      return await apiRequest("POST", "/api/projects", { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      toast({ title: t('home.projectCreated') });
    },
    onError: (error: any) => {
      toast({
        title: t('home.unknownError', { defaultValue: '프로젝트 생성 실패' }),
        description: error.message || '요금제 제한에 도달했거나 알 수 없는 에러가 발생했습니다.',
        variant: "destructive"
      });
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      return await apiRequest("PATCH", `/api/projects/${id}`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: t('home.projectRenamed') });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/projects/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      toast({ title: t('home.projectDeleted') });
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: async ({ projectId, name, parentFolderId }: { projectId: string; name: string; parentFolderId?: string }) => {
      return await apiRequest("POST", "/api/folders", { projectId, name, parentFolderId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      toast({ title: t('home.folderCreated') });
    },
  });

  const updateFolderMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      return await apiRequest("PATCH", `/api/folders/${id}`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      toast({ title: t('home.folderRenamed') });
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/folders/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      toast({ title: t('home.folderDeleted') });
    },
  });

  const createConversationMutation = useMutation({
    mutationFn: async ({
      projectId,
      name,
      description,
      instructions,
      files,
      folderId
    }: {
      projectId: string;
      name: string;
      description?: string;
      instructions?: string;
      files?: File[];
      folderId?: string;
    }) => {
      const conversation = await apiRequest("POST", "/api/conversations", {
        projectId,
        name,
        description,
        instructions,
        folderId
      }) as unknown as Conversation;

      // Upload files if any
      if (files && files.length > 0) {
        const uploadResults = await Promise.allSettled(
          files.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(`/api/conversations/${conversation.id}/files`, {
              method: "POST",
              body: formData,
              credentials: "include",
            });

            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(file.name);
            }

            return res.json();
          })
        );

        // Show appropriate toast based on results
        const failedFiles = uploadResults
          .filter(r => r.status === "rejected")
          .map((f) => f.status === "rejected" ? f.reason.message : "");

        if (failedFiles.length > 0) {
          toast({
            title: t('home.conversationCreated'),
            description: t('home.uploadWarning', { files: failedFiles.join(", ") }),
            variant: "default"
          });
        } else {
          toast({ title: t('home.conversationCreated') });
        }
      } else {
        toast({ title: t('home.conversationCreated') });
      }

      return conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
    },
  });

  const updateConversationMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      return await apiRequest("PATCH", `/api/conversations/${id}`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      toast({ title: t('home.conversationRenamed') });
    },
  });

  const updateConversationSettingsMutation = useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      instructions,
      newFiles,
      deleteFileIds
    }: {
      id: string;
      name: string;
      description?: string;
      instructions?: string;
      newFiles?: File[];
      deleteFileIds?: string[];
    }) => {
      // Update conversation metadata
      await apiRequest("PATCH", `/api/conversations/${id}`, {
        name,
        description,
        instructions
      });

      // Delete files if any
      if (deleteFileIds && deleteFileIds.length > 0) {
        const deleteResults = await Promise.allSettled(
          deleteFileIds.map(async (fileId) => {
            const res = await fetch(`/api/files/${fileId}`, {
              method: "DELETE",
              credentials: "include",
            });
            if (!res.ok) {
              throw new Error(`Failed to delete file ${fileId}`);
            }
            return res;
          })
        );

        const failedDeletes = deleteResults.filter(r => r.status === "rejected");
        if (failedDeletes.length > 0) {
          throw new Error(`Failed to delete ${failedDeletes.length} file(s)`);
        }
      }

      // Upload new files if any
      if (newFiles && newFiles.length > 0) {
        const uploadResults = await Promise.allSettled(
          newFiles.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(`/api/conversations/${id}/files`, {
              method: "POST",
              body: formData,
              credentials: "include",
            });

            if (!res.ok) {
              throw new Error(file.name);
            }

            return res.json();
          })
        );

        // Show appropriate toast based on results
        const failedFiles = uploadResults
          .filter(r => r.status === "rejected")
          .map((f) => f.status === "rejected" ? f.reason.message : "");

        if (failedFiles.length > 0) {
          toast({
            title: t('home.conversationUpdated'),
            description: t('home.uploadWarning', { files: failedFiles.join(", ") }),
            variant: "default"
          });
        } else {
          toast({ title: t('home.conversationUpdated') });
        }
      } else {
        toast({ title: t('home.conversationUpdated') });
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", variables.id, "files"] });
    },
    onError: (error) => {
      toast({
        title: t('home.conversationUpdateFailed'),
        description: error instanceof Error ? error.message : t('home.unknownError'),
        variant: "destructive"
      });
    },
  });

  const moveConversationMutation = useMutation({
    mutationFn: async ({ id, projectId, folderId }: { id: string; projectId: string; folderId?: string | null }) => {
      return await apiRequest("PATCH", `/api/conversations/${id}`, { projectId, folderId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      toast({ title: t('home.conversationMoved') });
    },
  });

  const moveFolderMutation = useMutation({
    mutationFn: async ({ id, projectId, parentFolderId }: { id: string; projectId: string; parentFolderId?: string | null }) => {
      return await apiRequest("PATCH", `/api/folders/${id}`, { projectId, parentFolderId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      toast({ title: t('home.folderMoved') });
    },
  });

  const reorderProjectsMutation = useMutation({
    mutationFn: async (reorderedProjects: { id: string; order: number }[]) => {
      return await Promise.all(
        reorderedProjects.map(({ id, order }) =>
          apiRequest("PATCH", `/api/projects/${id}`, { order })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/projects"],
        refetchType: 'active'
      });
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/conversations/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      if (selectedConversationId) {
        setSelectedConversationId(null);
      }
      toast({ title: t('home.conversationDeleted') });
    },
  });

  return {
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
  };
}
