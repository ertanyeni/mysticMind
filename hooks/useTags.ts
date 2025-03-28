import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { database } from '@/lib/services/database'
import type { Tag } from '@/lib/services/database'

export function useTags(userId: string) {
  return useQuery({
    queryKey: ['tags', userId],
    queryFn: () => database.getTags(userId),
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tag: Omit<Tag, 'id' | 'created_at'>) => database.createTag(tag),
    onSuccess: (_: Tag, variables: Omit<Tag, 'id' | 'created_at'>) => {
      queryClient.invalidateQueries({ queryKey: ['tags', variables.user_id] })
    },
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tagId, updates }: { tagId: string; updates: Partial<Tag> }) =>
      database.updateTag(tagId, updates),
    onSuccess: (data: Tag) => {
      queryClient.invalidateQueries({ queryKey: ['tags', data.user_id] })
    },
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tagId: string) => database.deleteTag(tagId),
    onSuccess: (_: void, tagId: string) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
} 