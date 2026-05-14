import { supabase } from './supabase'

const SUPABASE_URL = 'https://ambzwvkbxpkjuwmjnvgj.supabase.co'

export async function searchCatalogue(query, countryIso, filters = {}) {

  const seriesIds = new Set()

  if (query) {
    let seriesQuery = supabase
      .from('stamp_series')
      .select('id')

    if (countryIso && countryIso !== 'all') {
      seriesQuery = seriesQuery.eq('country_iso', countryIso)
    }

    seriesQuery = seriesQuery.ilike('name', '%' + query + '%')
    const { data: seriesMatches } = await seriesQuery
    if (seriesMatches) seriesMatches.forEach(function(s) { seriesIds.add(s.id) })
  }

  let stampQuery = supabase
    .from('stamps')
    .select('series_id')

  if (countryIso && countryIso !== 'all') {
    stampQuery = stampQuery.eq('country_iso', countryIso)
  }

  if (query) {
    stampQuery = stampQuery.or(
      'sg_number.ilike.%' + query + '%,' +
      'common_name.ilike.%' + query + '%,' +
      'colour_primary.ilike.%' + query + '%,' +
      'denomination.ilike.%' + query + '%'
    )
  }

  Object.entries(filters).forEach(function(entry) {
    const key = entry[0]
    const val = entry[1]
    if (val === null || val === undefined) return
    if (key === 'is_error' || key === 'is_proof' || key === 'is_booklet_pane') return
    if (typeof val === 'object' && val.op && val.val) {
      const op = val.op
      const v = val.val
      if (op === 'includes') stampQuery = stampQuery.ilike(key, '%' + v + '%')
      else if (op === 'excludes') stampQuery = stampQuery.not(key, 'ilike', '%' + v + '%')
      else if (op === 'is') stampQuery = stampQuery.eq(key, v)
      else if (op === 'is_not') stampQuery = stampQuery.neq(key, v)
      else if (op === 'gte') stampQuery = stampQuery.gte(key, v)
      else if (op === 'lte') stampQuery = stampQuery.lte(key, v)
    }
  })

  const { data: matchedStamps, error: matchError } = await stampQuery
  if (matchError) { console.error('Match error:', matchError); return [] }
  if (matchedStamps) matchedStamps.forEach(function(s) { if (s.series_id) seriesIds.add(s.series_id) })

  if (seriesIds.size === 0) return []

  const allSeriesIds = [...seriesIds]

  let fullQuery = supabase
    .from('stamps')
    .select(`
      *,
      stamp_series (
        id,
        name,
        year_start,
        year_end,
        country_iso,
        sg_section_ref,
        notes,
        image_folder
      ),
      stamp_variations (
        id,
        sg_sub_number,
        variation_type,
        colour_shade,
        perforation_gauge,
        gum_type,
        overprint_details,
        is_error,
        is_proof,
        is_booklet_pane,
        is_coil,
        sg_cat_value_mint,
        sg_cat_value_used,
        cat_value_year,
        parent_sg_number
      )
    `)
    .in('series_id', allSeriesIds)

  if (countryIso && countryIso !== 'all') {
    fullQuery = fullQuery.eq('country_iso', countryIso)
  }

  const { data, error } = await fullQuery
  if (error) { console.error('Search error:', error); return [] }
  return data || []
}

export async function getSeriesWithStamps(countryIso) {
  const { data, error } = await supabase
    .from('stamp_series')
    .select('*, stamps (*, stamp_variations (*))')
    .eq('country_iso', countryIso)
    .order('year_start')
  if (error) { console.error('Series error:', error); return [] }
  return data
}

export async function getHistoricValues(variationId) {
  const { data, error } = await supabase
    .from('historic_catalogue_values')
    .select('*')
    .eq('variation_id', variationId)
    .order('catalogue_year')
  if (error) { console.error('Historic values error:', error); return [] }
  return data
}

export async function getSalesRecords(variationId) {
  const { data, error } = await supabase
    .from('sales_records')
    .select('*')
    .eq('variation_id', variationId)
    .order('sale_date', { ascending: false })
  if (error) { console.error('Sales error:', error); return [] }
  return data
}

export async function getCountries() {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .order('name')
  if (error) { console.error('Countries error:', error); return [] }
  return data
}

export function getSeriesImageUrls(imageFolder) {
  if (!imageFolder) return []
  return Array.from({ length: 20 }, function(_, i) {
    return SUPABASE_URL + '/storage/v1/object/public/series-images/' + imageFolder + '/' + (i + 15) + '.jpg'
  })
}

export function getAuctionImageUrl(saleNumber, lotNumber) {
  if (!saleNumber || !lotNumber) return null
  return SUPABASE_URL + '/storage/v1/object/public/auction-images/' + saleNumber + '/' + lotNumber + '-1.jpg'
}
