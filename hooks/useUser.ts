import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { database } from '@/lib/services/database'
import type { User } from '@/lib/services/database'

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => database.getUser(userId),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: Partial<User> }) =>
      database.updateUser(userId, updates),
    onSuccess: (data: User) => {
      queryClient.invalidateQueries({ queryKey: ['user', data.id] })
    },
  })
} 