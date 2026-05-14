import { supabase } from './supabase'
import { addToWishlist } from './wishlist'

const DEMO_USER_ID = 'demo-user-001'

export async function addToCollection({ variationId, condition, pricePaid, notes, quantity, itemType, auctionUrl, upgradeWanted = false }) {
  const { data, error } = await supabase
    .from('user_collection')
    .insert({
      user_id: DEMO_USER_ID,
      variation_id: variationId,
      condition,
      price_paid: pricePaid || null,
      notes: notes || null,
      quantity: quantity || 1,
      item_type: itemType || 'single',
      auction_url: auctionUrl || null,
      upgrade_wanted: upgradeWanted,
    })
    .select()
    .single()
  if (error) { console.error('Add to collection error:', error); return null }
  if (data && pricePaid) {
    await supabase.from('budget_transactions').insert({
      user_id: DEMO_USER_ID,
      amount: pricePaid,
      description: notes || 'Collection purchase',
      transaction_date: new Date().toISOString().split('T')[0],
      source: 'collection',
      collection_item_id: data.id,
    })
  }
  // If upgrade_wanted, also add to wishlist
  if (upgradeWanted) {
    await addToWishlist({ variationId, condition }).catch(() => {})
  }
  return data
}

export async function updateCollectionItem(id, updates) {
  const { data, error } = await supabase
    .from('user_collection')
    .update(updates)
    .eq('id', id)
    .eq('user_id', DEMO_USER_ID)
    .select()
    .single()
  if (error) { console.error('Update collection item error:', error); return null }
  return data
}

export async function markAsSold(id, { soldPrice, soldAt, soldNotes }) {
  const { data, error } = await supabase
    .from('user_collection')
    .update({
      sold_at: soldAt,
      sold_price: soldPrice || null,
      sold_notes: soldNotes || null,
    })
    .eq('id', id)
    .eq('user_id', DEMO_USER_ID)
    .select(`
      id, condition, price_paid, notes, quantity, item_type, sold_at, sold_price, sold_notes, added_at,
      stamp_variations (
        id, sg_sub_number, sg_cat_value_mint, sg_cat_value_used, colour_shade,
        stamps (
          id, sg_number, denomination, colour_primary, country_iso,
          stamp_series ( id, name, year_start )
        )
      )
    `)
    .single()
  if (error) { console.error('Mark as sold error:', error); return null }
  return data
}

export async function removeFromCollection(id) {
  const { error } = await supabase
    .from('user_collection')
    .delete()
    .eq('id', id)
    .eq('user_id', DEMO_USER_ID)
  if (error) { console.error('Remove from collection error:', error); return false }
  return true
}

export async function getCollection() {
  const { data, error } = await supabase
    .from('user_collection')
    .select(`
      id, condition, price_paid, notes, quantity, item_type, auction_url, added_at, variation_id,
      upgrade_wanted, looking_to_sell, sold_at, sold_price, sold_notes,
      stamp_variations (
        id, sg_sub_number, sg_cat_value_mint, sg_cat_value_used, colour_shade, variation_type,
        stamps (
          id, sg_number, denomination, colour_primary, country_iso, year_issued,
          stamp_series ( id, name, year_start, image_folder )
        )
      )
    `)
    .eq('user_id', DEMO_USER_ID)
    .is('sold_at', null)
    .order('added_at', { ascending: false })
  if (error) { console.error('Get collection error:', error); return [] }
  return data || []
}

export async function getSoldItems() {
  const { data, error } = await supabase
    .from('user_collection')
    .select(`
      id, condition, price_paid, notes, quantity, item_type, added_at, sold_at, sold_price, sold_notes,
      stamp_variations (
        id, sg_sub_number, sg_cat_value_mint, sg_cat_value_used, colour_shade,
        stamps (
          id, sg_number, denomination, colour_primary, country_iso,
          stamp_series ( id, name, year_start )
        )
      )
    `)
    .eq('user_id', DEMO_USER_ID)
    .not('sold_at', 'is', null)
    .order('sold_at', { ascending: false })
  if (error) { console.error('Get sold items error:', error); return [] }
  return data || []
}

export async function getCollectionVariationIds() {
  const { data, error } = await supabase
    .from('user_collection')
    .select('variation_id')
    .eq('user_id', DEMO_USER_ID)
    .is('sold_at', null)
  if (error) return []
  return (data || []).map(r => r.variation_id)
}

export async function getCollectionEntriesForVariation(variationId) {
  const { data, error } = await supabase
    .from('user_collection')
    .select('id, condition, price_paid, notes, quantity, item_type, auction_url, added_at, upgrade_wanted, looking_to_sell, sold_at, sold_price')
    .eq('user_id', DEMO_USER_ID)
    .eq('variation_id', variationId)
    .is('sold_at', null)
    .order('added_at', { ascending: false })
  if (error) { console.error('Get collection entries error:', error); return [] }
  return data || []
}

export async function getPersonalSalesForVariation(variationId) {
  const { data, error } = await supabase
    .from('user_collection')
    .select('id, condition, sold_at, sold_price, sold_notes, item_type')
    .eq('user_id', DEMO_USER_ID)
    .eq('variation_id', variationId)
    .not('sold_at', 'is', null)
    .order('sold_at', { ascending: false })
  if (error) return []
  return data || []
}

// ── Budget ────────────────────────────────────────────────────────────────────

export async function getBudget() {
  const { data, error } = await supabase
    .from('user_budget')
    .select('*')
    .eq('user_id', DEMO_USER_ID)
    .single()
  if (error) return null
  return data
}

export async function saveBudget(monthlyBudget, startDay = 1) {
  const { data, error } = await supabase
    .from('user_budget')
    .upsert({ user_id: DEMO_USER_ID, monthly_budget: monthlyBudget, start_day: startDay, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    .select()
    .single()
  if (error) { console.error('Save budget error:', error); return null }
  return data
}

export async function getBudgetTransactions() {
  const { data, error } = await supabase
    .from('budget_transactions')
    .select(`
      id, amount, description, transaction_date, source, collection_item_id, created_at,
      user_collection (
        id, condition, item_type, quantity,
        stamp_variations (
          sg_sub_number, colour_shade,
          stamps (
            sg_number, denomination, country_iso,
            stamp_series ( name, year_start )
          )
        )
      )
    `)
    .eq('user_id', DEMO_USER_ID)
    .order('transaction_date', { ascending: false })
  if (error) { console.error('Get transactions error:', error); return [] }
  return data || []
}

export async function addBudgetTransaction({ amount, description, transactionDate, source = 'manual', collectionItemId = null }) {
  const { data, error } = await supabase
    .from('budget_transactions')
    .insert({
      user_id: DEMO_USER_ID,
      amount,
      description: description || null,
      transaction_date: transactionDate || new Date().toISOString().split('T')[0],
      source,
      collection_item_id: collectionItemId || null,
    })
    .select()
    .single()
  if (error) { console.error('Add transaction error:', error); return null }
  return data
}

export async function removeBudgetTransaction(id, collectionItemId = null) {
  if (collectionItemId) {
    const { error: collErr } = await supabase
      .from('user_collection')
      .delete()
      .eq('id', collectionItemId)
      .eq('user_id', DEMO_USER_ID)
    if (collErr) { console.error('Remove collection item error:', collErr); return false }
    await supabase.from('budget_transactions').delete().eq('id', id).eq('user_id', DEMO_USER_ID)
    return { removedCollectionId: collectionItemId }
  }
  const { error } = await supabase
    .from('budget_transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', DEMO_USER_ID)
  if (error) { console.error('Remove transaction error:', error); return false }
  return true
}

export async function getUpgradeWantedVariationIds() {
  const { data, error } = await supabase
    .from('user_collection')
    .select('variation_id')
    .eq('user_id', DEMO_USER_ID)
    .eq('upgrade_wanted', true)
    .is('sold_at', null)
  if (error) return []
  return (data || []).map(r => r.variation_id)
}

export async function addManualSoldItem({ condition, soldAt, soldPrice, soldNotes }) {
  const { data, error } = await supabase
    .from('user_collection')
    .insert({
      user_id: DEMO_USER_ID,
      variation_id: null,
      condition,
      sold_at: soldAt,
      sold_price: soldPrice || null,
      sold_notes: soldNotes || null,
      item_type: 'single',
      quantity: 1,
    })
    .select()
    .single()
  if (error) { console.error('Add manual sold item error:', error); return null }
  return data
}
