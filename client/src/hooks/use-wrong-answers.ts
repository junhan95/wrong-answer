import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { WrongAnswer, InsertWrongAnswer, SpacedRepetition } from "@shared/schema";

export function useWrongAnswers() {
  const queryClient = useQueryClient();

  const query = useQuery<WrongAnswer[]>({
    queryKey: ["/api/wrong-answers"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertWrongAnswer) => {
      const res = await apiRequest("POST", "/api/wrong-answers", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wrong-answers"] });
    },
  });

  return {
    wrongAnswers: query.data || [],
    isLoading: query.isLoading,
    createWrongAnswer: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
}

export function useDueReviews(limit: number = 10) {
  const query = useQuery<Array<{ repetition: SpacedRepetition; wrongAnswer: WrongAnswer }>>({
    queryKey: ["/api/wrong-answers/due", limit],
  });

  return {
    dueReviews: query.data || [],
    isLoading: query.isLoading,
  };
}
