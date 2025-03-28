import { Database } from '@/types/database'
import { supabase } from '@/lib/supabase'

export type User = Database['public']['Tables']['users']['Row']
export type Dream = Database['public']['Tables']['dreams']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']

export const database = {
  // User operations
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  },

  async updateUser(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Dream operations
  async getDreams(userId: string) {
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (error) throw error
    return data
  },

  async getDream(dreamId: string) {
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .eq('id', dreamId)
      .single()

    if (error) throw error
    return data
  },

  async createDream(dream: Omit<Dream, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('dreams')
      .insert(dream)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateDream(dreamId: string, updates: Partial<Dream>) {
    const { data, error } = await supabase
      .from('dreams')
      .update(updates)
      .eq('id', dreamId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteDream(dreamId: string) {
    const { error } = await supabase
      .from('dreams')
      .delete()
      .eq('id', dreamId)

    if (error) throw error
  },

  // Tag operations
  async getTags(userId: string) {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .order('name')

    if (error) throw error
    return data
  },

  async createTag(tag: Omit<Tag, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('tags')
      .insert(tag)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateTag(tagId: string, updates: Partial<Tag>) {
    const { data, error } = await supabase
      .from('tags')
      .update(updates)
      .eq('id', tagId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteTag(tagId: string) {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', tagId)

    if (error) throw error
  },
} 