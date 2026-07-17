import { supabase } from './supabase'
import { addDays, addMonths } from './dateUtils'

/**
 * Récupère l'abonnement actif d'un utilisateur
 */
export async function getSubscription(userId) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

/**
 * Crée ou met à jour un abonnement
 * plan: 'usage' | 'weekly' | 'monthly'
 */
export async function createSubscription(userId, plan) {
  const now = new Date()
  const ends_at =
    plan === 'weekly' ? addDays(now, 7).toISOString()
    : plan === 'monthly' ? addMonths(now, 1).toISOString()
    : null // 'usage' → géré par credits

  const payload = {
    user_id: userId,
    plan,
    status: 'active',
    credits: plan === 'usage' ? 1 : null,
    starts_at: now.toISOString(),
    ends_at,
    updated_at: now.toISOString(),
  }

  // Upsert : met à jour si existe déjà
  const { data, error } = await supabase
    .from('subscriptions')
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Décrémente un crédit (plan "usage")
 */
export async function consumeCredit(userId) {
  const { data, error } = await supabase.rpc('consume_credit', { uid: userId })
  if (error) throw error
  return data
}

/**
 * Annule un abonnement
 */
export async function cancelSubscription(userId) {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}
