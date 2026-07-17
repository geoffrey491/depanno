import { supabase } from './supabase'

export async function getAnalyses(userId) {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createAnalysis(userId, payload) {
  const { data, error } = await supabase
    .from('analyses')
    .insert([{ user_id: userId, ...payload }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteAnalysis(id) {
  const { error } = await supabase
    .from('analyses')
    .delete()
    .eq('id', id)
  if (error) throw error
}
