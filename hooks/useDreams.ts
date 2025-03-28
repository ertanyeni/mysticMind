import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { database } from '@/lib/services/database'
import type { Dream } from '@/lib/services/database'

export function useDreams(userId: string) {
  return useQuery({
    queryKey: ['dreams', userId],
    queryFn: () => database.getDreams(userId),
  })
}

export function useDream(dreamId: string) {
  return useQuery({
    queryKey: ['dream', dreamId],
    queryFn: () => database.getDream(dreamId),
  })
}

export function useCreateDream() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dream: Omit<Dream, 'id' | 'created_at' | 'updated_at'>) =>
      database.createDream(dream),
    onSuccess: (_: Dream, variables: Omit<Dream, 'id' | 'created_at' | 'updated_at'>) => {
      queryClient.invalidateQueries({ queryKey: ['dreams', variables.user_id] })
    },
  })
}

export function useUpdateDream() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ dreamId, updates }: { dreamId: string; updates: Partial<Dream> }) =>
      database.updateDream(dreamId, updates),
    onSuccess: (data: Dream) => {
      queryClient.invalidateQueries({ queryKey: ['dreams', data.user_id] })
      queryClient.invalidateQueries({ queryKey: ['dream', data.id] })
    },
  })
}

export function useDeleteDream() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dreamId: string) => database.deleteDream(dreamId),
    onSuccess: (_: void, dreamId: string) => {
      queryClient.invalidateQueries({ queryKey: ['dreams'] })
      queryClient.invalidateQueries({ queryKey: ['dream', dreamId] })
    },
  })
} 