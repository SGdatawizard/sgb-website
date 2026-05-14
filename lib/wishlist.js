import { supabase } from './supabase'

const DEMO_USER_ID = 'demo-user-001'

export async function addToWishlist({ variationId, condition }) {
  const { data, error } = await supabase
    .from('user_wishlist')
    .insert({
      user_id: DEMO_USER_ID,
      variation_id: variationId,
      condition,
    })
    .select()
    .single()
  if (error) { console.error('Add to wishlist error:', error); return null }
  return data
}

export async function removeFromWishlist(id) {
  const { error } = await supabase
    .from('user_wishlist')
    .delete()
    .eq('id', id)
    .eq('user_id', DEMO_USER_ID)
  if (error) { console.error('Remove from wishlist error:', error); return false }
  return true
}

export async function removeFromWishlistByVariation(variationId) {
  const { error } = await supabase
    .from('user_wishlist')
    .delete()
    .eq('variation_id', variationId)
    .eq('user_id', DEMO_USER_ID)
  if (error) { console.error('Remove from wishlist by variation error:', error); return false }
  return true
}

export async function getWishlist() {
  const { data, error } = await supabase
    .from('user_wishlist')
    .select(`
      id,
      condition,
      added_at,
      variation_id,
      stamp_variations (
        id,
        sg_sub_number,
        sg_cat_value_mint,
        sg_cat_value_used,
        colour_shade,
        stamps (
          id,
          sg_number,
          denomination,
          colour_primary,
          country_iso,
          stamp_series (
            id,
            name,
            year_start
          )
        )
      )
    `)
    .eq('user_id', DEMO_USER_ID)
    .order('added_at', { ascending: false })
  if (error) { console.error('Get wishlist error:', error); return [] }
  return data || []
}

export async function getWishlistVariationIds() {
  const { data, error } = await supabase
    .from('user_wishlist')
    .select('variation_id')
    .eq('user_id', DEMO_USER_ID)
  if (error) return []
  return (data || []).map(r => r.variation_id)
}
