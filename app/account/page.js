'use client'

import { useState, useEffect } from 'react'
import { getCollection, removeFromCollection, updateCollectionItem, markAsSold, getSoldItems, addManualSoldItem, getBudget, saveBudget, getBudgetTransactions, addBudgetTransaction, removeBudgetTransaction } from '../../lib/collection'
import { addToWishlist, getWishlist, removeFromWishlist } from '../../lib/wishlist'

const COUNTRY_MAP = { FK: 'Falkland Islands', BM: 'Bermuda', GB: 'Great Britain', AU: 'Australia', CA: 'Canada', NZ: 'New Zealand' }
function countryName(iso) { return COUNTRY_MAP[iso] || iso || '—' }

// ── Budget date helpers ───────────────────────────────────────────────────────

// Given a start_day (e.g. 25), return the Date of the most recent period start
function getCurrentPeriodStart(startDay) {
  const today = new Date()
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), startDay)
  if (today >= thisMonth) return thisMonth
  // We're before the start day this month, so period started last month
  return new Date(today.getFullYear(), today.getMonth() - 1, startDay)
}

// Return the Date of the next period start after a given period start
function getNextPeriodStart(periodStart, startDay) {
  return new Date(periodStart.getFullYear(), periodStart.getMonth() + 1, startDay)
}

// Days in the current budget period
function daysInCurrentPeriod(startDay) {
  const start = getCurrentPeriodStart(startDay)
  const end = getNextPeriodStart(start, startDay)
  return Math.round((end - start) / (1000 * 60 * 60 * 24))
}

// Start of the current 7-day window aligned to budget cycle
// Week = 7 days back from today, but anchored to the period start
function getCurrentWeekStart(startDay) {
  const today = new Date()
  const periodStart = getCurrentPeriodStart(startDay)
  // How many days since period start?
  const daysSincePeriodStart = Math.floor((today - periodStart) / (1000 * 60 * 60 * 24))
  // Which 7-day block are we in?
  const weekBlock = Math.floor(daysSincePeriodStart / 7)
  const weekStart = new Date(periodStart)
  weekStart.setDate(periodStart.getDate() + weekBlock * 7)
  return weekStart
}

// Start of the current year period (start_day of Jan, or nearest)
function getCurrentYearStart(startDay) {
  const today = new Date()
  const thisYear = new Date(today.getFullYear(), 0, startDay)
  if (today >= thisYear) return thisYear
  return new Date(today.getFullYear() - 1, 0, startDay)
}

export default function Account() {
  const [activeTab, setActiveTab] = useState('overview')
  const [collection, setCollection] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [collectionLoading, setCollectionLoading] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [budget, setBudget] = useState(null)
  const [budgetTransactions, setBudgetTransactions] = useState([])
  const [budgetLoading, setBudgetLoading] = useState(false)
  const [budgetInput, setBudgetInput] = useState('')
  const [startDayInput, setStartDayInput] = useState('1')
  const [budgetSaving, setBudgetSaving] = useState(false)
  const [txAmount, setTxAmount] = useState('')
  const [txDesc, setTxDesc] = useState('')
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0])
  const [txSaving, setTxSaving] = useState(false)
  const [collOpenCountries, setCollOpenCountries] = useState({})
  const [collOpenSeries, setCollOpenSeries] = useState({})
  const [wishOpenCountries, setWishOpenCountries] = useState({})
  const [wishOpenSeries, setWishOpenSeries] = useState({})
  const [soldItems, setSoldItems] = useState([])
  const [soldLoading, setSoldLoading] = useState(false)
  const [lookingToSellLoading, setLookingToSellLoading] = useState(false)
  const [sellModal, setSellModal] = useState(null) // { item }
  const [sellDate, setSellDate] = useState(new Date().toISOString().split('T')[0])
  const [sellPrice, setSellPrice] = useState('')
  const [sellNotes, setSellNotes] = useState('')
  const [sellSaving, setSellSaving] = useState(false)
  const [editSoldModal, setEditSoldModal] = useState(null) // { item }
  const [editSellDate, setEditSellDate] = useState('')
  const [editSellPrice, setEditSellPrice] = useState('')
  const [editSellNotes, setEditSellNotes] = useState('')
  const [editSellSaving, setEditSellSaving] = useState(false)
  const [addSoldModal, setAddSoldModal] = useState(false)
  const [manualSoldSgNum, setManualSoldSgNum] = useState('')
  const [manualSoldDesc, setManualSoldDesc] = useState('')
  const [manualSoldCondition, setManualSoldCondition] = useState('Mint')
  const [manualSoldDate, setManualSoldDate] = useState(new Date().toISOString().split('T')[0])
  const [manualSoldPrice, setManualSoldPrice] = useState('')
  const [manualSoldNotes, setManualSoldNotes] = useState('')
  const [manualSoldSaving, setManualSoldSaving] = useState(false)

  useEffect(() => {
    if (activeTab === 'overview') {
      Promise.all([getCollection(), getWishlist(), getBudget(), getBudgetTransactions(), getSoldItems()]).then(([coll, wish, b, txs, sold]) => {
        setCollection(coll)
        setWishlist(wish)
        setBudget(b)
        if (b) { setBudgetInput(b.monthly_budget.toString()); setStartDayInput((b.start_day || 1).toString()) }
        setBudgetTransactions(txs)
        setSoldItems(sold)
      })
    }
    if (activeTab === 'collection') {
      setCollectionLoading(true)
      Promise.all([getCollection(), getBudget(), getBudgetTransactions()]).then(([data, b, txs]) => {
        setCollection(data)
        setCollectionLoading(false)
        const isos = [...new Set(data.map(i => i.stamp_variations?.stamps?.country_iso).filter(Boolean))]
        const open = {}
        isos.forEach(iso => { open[iso] = true })
        setCollOpenCountries(open)
        setCollOpenSeries({})
        setBudget(b)
        if (b) { setBudgetInput(b.monthly_budget.toString()); setStartDayInput((b.start_day || 1).toString()) }
        setBudgetTransactions(txs)
      })
    }
    if (activeTab === 'budget') {
      setBudgetLoading(true)
      Promise.all([getBudget(), getBudgetTransactions()]).then(([b, txs]) => {
        setBudget(b)
        if (b) { setBudgetInput(b.monthly_budget.toString()); setStartDayInput((b.start_day || 1).toString()) }
        setBudgetTransactions(txs)
        setBudgetLoading(false)
      })
    }
    if (activeTab === 'sold') {
      setSoldLoading(true)
      getSoldItems().then(data => { setSoldItems(data); setSoldLoading(false) })
    }
    if (activeTab === 'looking-to-sell') {
      setLookingToSellLoading(true)
      getCollection().then(data => {
        setCollection(data)
        setLookingToSellLoading(false)
      })
    }
    if (activeTab === 'wishlist') {
      setWishlistLoading(true)
      getWishlist().then(data => {
        setWishlist(data)
        setWishlistLoading(false)
        const isos = [...new Set(data.map(i => i.stamp_variations?.stamps?.country_iso).filter(Boolean))]
        const open = {}
        isos.forEach(iso => { open[iso] = true })
        setWishOpenCountries(open)
        setWishOpenSeries({})
      })
    }
  }, [activeTab])

  async function handleRemoveCollection(id) {
    const ok = await removeFromCollection(id)
    if (ok) setCollection(prev => prev.filter(i => i.id !== id))
  }
  async function handleRemoveWishlist(id) {
    const ok = await removeFromWishlist(id)
    if (ok) setWishlist(prev => prev.filter(i => i.id !== id))
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'collection', label: 'My Collection' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'budget', label: 'Budget tracker' },
    { id: 'sold', label: 'Sold' },
    { id: 'looking-to-sell', label: 'Looking to sell' },
    { id: 'details', label: 'Account details' },
  ]

  const sectionTitle = { fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px', paddingBottom: '12px', borderBottom: '0.5px solid #eee' }
  const card = { background: '#fff', border: '0.5px solid #ddd', borderRadius: '8px', padding: '24px', marginBottom: '16px' }

  function fmt(val) {
    if (!val) return '—'
    return '£' + parseFloat(val).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  function cleanSeriesName(name, yearStart) {
    if (!name) return '—'
    const cleaned = name.replace(/\d{4}\([^)]+\)\.\s*/, '').split('.')[0].trim()
    if (yearStart && yearStart !== 9999) return yearStart + ' ' + cleaned
    return cleaned
  }

  const COLL_COLS = '80px 1fr 150px 72px 100px 110px 110px 56px 36px 36px 36px 36px'
  const WISH_COLS = '80px 1fr 110px 110px 110px 110px 36px'

  const collectionByCountry = collection.reduce((acc, item) => {
    const sv = item.stamp_variations
    const stamp = sv?.stamps
    const series = stamp?.stamp_series
    const iso = stamp?.country_iso || 'XX'
    const seriesName = series?.name || 'Uncategorised'
    const seriesYear = series?.year_start || 9999
    if (!acc[iso]) acc[iso] = {}
    if (!acc[iso][seriesName]) acc[iso][seriesName] = { yearStart: seriesYear, items: [] }
    acc[iso][seriesName].items.push(item)
    return acc
  }, {})

  const totalCatValue = collection.reduce((sum, item) => {
    const sv = item.stamp_variations
    const catVal = item.condition === 'Mint' ? sv?.sg_cat_value_mint : sv?.sg_cat_value_used
    const qty = item.quantity || 1
    return sum + (catVal ? parseFloat(catVal) * qty : 0)
  }, 0)

  const totalPricePaid = collection.reduce((sum, item) => sum + (item.price_paid ? parseFloat(item.price_paid) : 0), 0)

  const wishlistByCountry = wishlist.reduce((acc, item) => {
    const sv = item.stamp_variations
    const stamp = sv?.stamps
    const series = stamp?.stamp_series
    const iso = stamp?.country_iso || 'XX'
    const seriesName = series?.name || 'Uncategorised'
    const seriesYear = series?.year_start || 9999
    if (!acc[iso]) acc[iso] = {}
    if (!acc[iso][seriesName]) acc[iso][seriesName] = { yearStart: seriesYear, items: [] }
    acc[iso][seriesName].items.push(item)
    return acc
  }, {})

  // Upgrade wanted variation IDs (for wishlist badge)
  const upgradeWantedVariationIds = new Set(
    collection.filter(i => i.upgrade_wanted).map(i => i.variation_id)
  )

  // ── Budget calculations ─────────────────────────────────────────────────────
  const startDay = budget?.start_day || 1

  // Daily budget based on actual days in current period
  const periodDays = budget ? daysInCurrentPeriod(startDay) : 30
  const dailyBudget = budget ? budget.monthly_budget / periodDays : 0
  const weeklyBudget = dailyBudget * 7
  const yearlyBudget = dailyBudget * 365

  // Period boundaries
  const periodStart = budget ? getCurrentPeriodStart(startDay) : new Date()
  const weekStart = budget ? getCurrentWeekStart(startDay) : new Date()
  const yearStart = budget ? getCurrentYearStart(startDay) : new Date()

  // Spending in each window
  const spentThisPeriod = budgetTransactions
    .filter(t => new Date(t.transaction_date) >= periodStart)
    .reduce((s, t) => s + parseFloat(t.amount), 0)
  const spentThisWeek = budgetTransactions
    .filter(t => new Date(t.transaction_date) >= weekStart)
    .reduce((s, t) => s + parseFloat(t.amount), 0)
  const spentThisYear = budgetTransactions
    .filter(t => new Date(t.transaction_date) >= yearStart)
    .reduce((s, t) => s + parseFloat(t.amount), 0)

  const remainingPeriod = budget ? budget.monthly_budget - spentThisPeriod : 0
  const remainingWeek = budget ? weeklyBudget - spentThisWeek : 0
  const remainingYear = budget ? yearlyBudget - spentThisYear : 0

  // Days remaining in current period (for context)
  const today = new Date()
  const nextPeriodStart = budget ? getNextPeriodStart(periodStart, startDay) : new Date()
  const daysLeft = Math.ceil((nextPeriodStart - today) / (1000 * 60 * 60 * 24))

  async function handleSaveBudget() {
    const val = parseFloat(budgetInput)
    const day = parseInt(startDayInput)
    if (!val || val <= 0 || !day || day < 1 || day > 28) return
    setBudgetSaving(true)
    const result = await saveBudget(val, day)
    if (result) setBudget(result)
    setBudgetSaving(false)
  }

  async function handleAddTransaction() {
    const amt = parseFloat(txAmount)
    if (!amt || amt <= 0) return
    setTxSaving(true)
    const result = await addBudgetTransaction({ amount: amt, description: txDesc, transactionDate: txDate, source: 'manual' })
    if (result) setBudgetTransactions(prev => [result, ...prev])
    setTxAmount(''); setTxDesc(''); setTxDate(new Date().toISOString().split('T')[0])
    setTxSaving(false)
  }

  async function handleMarkAsSold(item) {
    setSellModal({ item })
    setSellDate(new Date().toISOString().split('T')[0])
    setSellPrice('')
    setSellNotes('')
  }

  async function handleConfirmSold() {
    if (!sellModal) return
    setSellSaving(true)
    const result = await markAsSold(sellModal.item.id, {
      soldPrice: sellPrice ? parseFloat(sellPrice) : null,
      soldAt: sellDate,
      soldNotes: sellNotes.trim() || null,
    })
    setSellSaving(false)
    if (result) {
      setCollection(prev => prev.filter(i => i.id !== sellModal.item.id))
      setSoldItems(prev => [result, ...prev])
      setSellModal(null)
    }
  }

  async function handleToggleUpgrade(item) {
    const newVal = !item.upgrade_wanted
    const result = await updateCollectionItem(item.id, { upgrade_wanted: newVal })
    if (result) {
      setCollection(prev => prev.map(i => i.id === item.id ? { ...i, upgrade_wanted: newVal } : i))
      if (newVal) {
        await addToWishlist({ variationId: item.variation_id, condition: item.condition }).catch(() => {})
      }
    }
  }

  async function handleToggleLookingToSell(item) {
    const newVal = !item.looking_to_sell
    const result = await updateCollectionItem(item.id, { looking_to_sell: newVal })
    if (result) {
      setCollection(prev => prev.map(i => i.id === item.id ? { ...i, looking_to_sell: newVal } : i))
    }
  }

  async function handleEditSold(item) {
    setEditSoldModal({ item })
    setEditSellDate(item.sold_at)
    setEditSellPrice(item.sold_price ? item.sold_price.toString() : '')
    setEditSellNotes(item.sold_notes || '')
  }

  async function handleConfirmEditSold() {
    if (!editSoldModal) return
    setEditSellSaving(true)
    const result = await updateCollectionItem(editSoldModal.item.id, {
      sold_at: editSellDate,
      sold_price: editSellPrice ? parseFloat(editSellPrice) : null,
      sold_notes: editSellNotes.trim() || null,
    })
    setEditSellSaving(false)
    if (result) {
      setSoldItems(prev => prev.map(i => i.id === editSoldModal.item.id ? { ...i, sold_at: editSellDate, sold_price: editSellPrice ? parseFloat(editSellPrice) : null, sold_notes: editSellNotes.trim() || null } : i))
      setEditSoldModal(null)
    }
  }

  async function handleRemoveSoldItem(id) {
    const ok = await removeFromCollection(id)
    if (ok) setSoldItems(prev => prev.filter(i => i.id !== id))
  }

  async function handleRemoveTransaction(id, collectionItemId = null) {
    const result = await removeBudgetTransaction(id, collectionItemId)
    if (result) {
      setBudgetTransactions(prev => prev.filter(t => t.id !== id))
      if (result.removedCollectionId) {
        setCollection(prev => prev.filter(i => i.id !== result.removedCollectionId))
      }
    }
  }

  // Group transactions by budget period for spending history
  const txByPeriod = budgetTransactions.reduce((acc, t) => {
    const d = new Date(t.transaction_date)
    // Work out which budget period this transaction falls in
    const sd = startDay
    const tPeriodStart = d.getDate() >= sd
      ? new Date(d.getFullYear(), d.getMonth(), sd)
      : new Date(d.getFullYear(), d.getMonth() - 1, sd)
    const tPeriodEnd = new Date(tPeriodStart.getFullYear(), tPeriodStart.getMonth() + 1, sd - 1)
    const key = tPeriodStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) +
      ' – ' + tPeriodEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    if (!acc[key]) acc[key] = { total: 0, items: [], periodStart: tPeriodStart }
    acc[key].total += parseFloat(t.amount)
    acc[key].items.push(t)
    return acc
  }, {})

  // Sort periods newest first
  const sortedPeriods = Object.entries(txByPeriod).sort((a, b) => b[1].periodStart - a[1].periodStart)

  // Ordinal suffix helper
  function ordinal(n) {
    const s = ['th','st','nd','rd'], v = n % 100
    return n + (s[(v-20)%10] || s[v] || s[0])
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>

      <div style={{ width: '220px', flexShrink: 0, background: '#293451', padding: '32px 0', position: 'relative' }}>
        <div style={{ padding: '0 24px 24px', borderBottom: '0.5px solid rgba(255,255,255,0.1)', marginBottom: '8px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#a3925f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '18px', color: '#293451', marginBottom: '12px' }}>DU</div>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '2px' }}>Demo User</div>
          <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Professional plan</div>
        </div>
        {tabs.map(function(tab) {
          return (
            <div key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '12px 24px', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: activeTab === tab.id ? '#a3925f' : 'rgba(255,255,255,0.7)', cursor: 'pointer', background: activeTab === tab.id ? 'rgba(163,146,95,0.1)' : 'transparent', borderLeft: activeTab === tab.id ? '3px solid #a3925f' : '3px solid transparent', transition: 'all 0.1s' }}>
              {tab.label}
              {tab.id === 'collection' && collection.length > 0 && <span style={{ marginLeft: '6px', background: '#a3925f', color: '#293451', borderRadius: '10px', padding: '1px 6px', fontSize: '10px', fontWeight: '600', fontFamily: 'Montserrat, sans-serif' }}>{collection.length}</span>}
              {tab.id === 'wishlist' && wishlist.length > 0 && <span style={{ marginLeft: '6px', background: '#e57373', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '10px', fontWeight: '600', fontFamily: 'Montserrat, sans-serif' }}>{wishlist.length}</span>}
            </div>
          )
        })}
        <div style={{ position: 'absolute', bottom: '32px', left: '24px' }}>
          <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>Sign out</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '32px 48px', background: '#f5f5f3', overflowY: 'auto' }}>

        {activeTab === 'overview' && (() => {
          // Top 3 countries by cat value
          const catByCountry = collection.reduce((acc, item) => {
            const sv = item.stamp_variations
            const iso = sv?.stamps?.country_iso || 'XX'
            const catVal = item.condition === 'Mint' ? sv?.sg_cat_value_mint : sv?.sg_cat_value_used
            const qty = item.quantity || 1
            acc[iso] = (acc[iso] || 0) + (catVal ? parseFloat(catVal) * qty : 0)
            return acc
          }, {})
          const top3Countries = Object.entries(catByCountry).sort((a, b) => b[1] - a[1]).slice(0, 3)

          return (
            <div>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: '600', color: '#293451', marginBottom: '24px' }}>Overview</div>

              {/* Subscription row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                {[{ label: 'Current plan', value: 'Professional' }, { label: 'Member since', value: 'April 2026' }, { label: 'Next renewal', value: '21 May 2026' }].map(function(stat) {
                  return (
                    <div key={stat.label} style={{ background: '#fff', border: '0.5px solid #ddd', borderRadius: '8px', padding: '20px 24px' }}>
                      <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '6px' }}>{stat.label}</div>
                      <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '20px', fontWeight: '600', color: '#293451' }}>{stat.value}</div>
                    </div>
                  )
                })}
              </div>

              {/* Subscription status */}
              <div style={{ ...card }}>
                <div style={sectionTitle}>Subscription status</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'inline-block', background: '#eaecf2', color: '#293451', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>Active</div>
                    <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#444' }}>Professional plan · £24.99/month · Renews 21 May 2026</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ padding: '7px 16px', background: '#293451', color: '#fff', border: 'none', borderRadius: '5px', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Upgrade plan</button>
                    <button style={{ padding: '7px 16px', background: 'none', color: '#c0392b', border: '0.5px solid #c0392b', borderRadius: '5px', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Cancel plan</button>
                  </div>
                </div>
              </div>

              {/* Collection summary */}
              <div style={{ ...card }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '0.5px solid #eee' }}>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>My Collection</div>
                  <button onClick={() => setActiveTab('collection')} style={{ background: 'none', border: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#293451', cursor: 'pointer', letterSpacing: '0.04em' }}>View all →</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: collection.length > 0 ? '20px' : '0' }}>
                  <div>
                    <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Items</div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: '600', color: '#293451' }}>{collection.length || '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Catalogue value</div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: '600', color: '#293451' }}>{collection.length > 0 ? fmt(totalCatValue) : '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Price paid</div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: '600', color: '#293451' }}>{totalPricePaid > 0 ? fmt(totalPricePaid) : '—'}</div>
                  </div>
                </div>
                {top3Countries.length > 0 && (
                  <div>
                    <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: '#aaa', marginBottom: '8px' }}>Top countries by catalogue value</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {top3Countries.map(([iso, val], i) => {
                        const pct = Math.round((val / totalCatValue) * 100)
                        return (
                          <div key={iso} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: '#aaa', width: '16px', textAlign: 'right' }}>{i + 1}</div>
                            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#444', width: '130px' }}>{countryName(iso)}</div>
                            <div style={{ flex: 1, height: '4px', background: '#eee', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: pct + '%', background: '#293451', borderRadius: '2px' }} />
                            </div>
                            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#293451', minWidth: '80px', textAlign: 'right' }}>{fmt(val)}</div>
                            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: '#aaa', minWidth: '32px', textAlign: 'right' }}>{pct}%</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                {collection.length === 0 && (
                  <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#aaa' }}>No items in your collection yet. <a href="/catalogue" style={{ color: '#293451', fontWeight: '600' }}>Browse the catalogue →</a></div>
                )}
              </div>

              {/* 2x2 lower grid — Wishlist, Budget, Sold, Looking to sell */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                {/* Wishlist */}
                <div style={{ ...card, marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '0.5px solid #eee' }}>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Wishlist</div>
                    <button onClick={() => setActiveTab('wishlist')} style={{ background: 'none', border: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#293451', cursor: 'pointer', letterSpacing: '0.04em' }}>View all →</button>
                  </div>
                  <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Items on wishlist</div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '28px', fontWeight: '600', color: '#293451' }}>{wishlist.length || '—'}</div>
                </div>

                {/* Budget tracker */}
                <div style={{ ...card, marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '0.5px solid #eee' }}>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Budget tracker</div>
                    <button onClick={() => setActiveTab('budget')} style={{ background: 'none', border: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#293451', cursor: 'pointer', letterSpacing: '0.04em' }}>View →</button>
                  </div>
                  {budget ? (
                    <>
                      <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Monthly budget</div>
                      <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '28px', fontWeight: '600', color: '#293451', marginBottom: '12px' }}>
                        £{parseFloat(budget.monthly_budget).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ flex: 1, height: '4px', background: '#eee', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: Math.min(100, (spentThisPeriod / budget.monthly_budget) * 100) + '%', background: spentThisPeriod > budget.monthly_budget ? '#c0392b' : spentThisPeriod / budget.monthly_budget > 0.75 ? '#a3925f' : '#293451', borderRadius: '2px' }} />
                        </div>
                        <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: remainingPeriod < 0 ? '#c0392b' : '#888', whiteSpace: 'nowrap' }}>
                          {remainingPeriod < 0 ? `£${Math.abs(remainingPeriod).toFixed(2)} over` : `£${remainingPeriod.toFixed(2)} left`} this period
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#aaa' }}>No budget set. <button onClick={() => setActiveTab('budget')} style={{ background: 'none', border: 'none', color: '#293451', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: 0 }}>Set one →</button></div>
                  )}
                </div>

                {/* Sold */}
                <div style={{ ...card, marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '0.5px solid #eee' }}>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sold</div>
                    <button onClick={() => setActiveTab('sold')} style={{ background: 'none', border: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#293451', cursor: 'pointer', letterSpacing: '0.04em' }}>View all →</button>
                  </div>
                  {soldItems.length > 0 ? (() => {
                    const totalProceeds = soldItems.reduce((s, i) => s + (i.sold_price ? parseFloat(i.sold_price) : 0), 0)
                    const now = new Date()
                    const startOfYear = new Date(now.getFullYear(), 0, 1)
                    const soldThisYear = soldItems.filter(i => new Date(i.sold_at) >= startOfYear).reduce((s, i) => s + (i.sold_price ? parseFloat(i.sold_price) : 0), 0)
                    return (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Items sold</div>
                            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '24px', fontWeight: '600', color: '#293451' }}>{soldItems.length}</div>
                          </div>
                          <div>
                            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Total proceeds</div>
                            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '24px', fontWeight: '600', color: '#293451' }}>{fmt(totalProceeds)}</div>
                          </div>
                        </div>
                        <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: '#aaa' }}>
                          {fmt(soldThisYear)} sold this year
                        </div>
                      </>
                    )
                  })() : (
                    <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#aaa' }}>No items sold yet. Mark items as sold from <button onClick={() => setActiveTab('collection')} style={{ background: 'none', border: 'none', color: '#293451', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: 0 }}>My Collection</button>.</div>
                  )}
                </div>

                {/* Looking to sell */}
                <div style={{ ...card, marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '0.5px solid #eee' }}>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Looking to sell</div>
                    <button onClick={() => setActiveTab('looking-to-sell')} style={{ background: 'none', border: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#293451', cursor: 'pointer', letterSpacing: '0.04em' }}>View →</button>
                  </div>
                  {(() => {
                    const lookingItems = collection.filter(i => i.looking_to_sell)
                    const lookingCatValue = lookingItems.reduce((s, i) => {
                      const sv = i.stamp_variations
                      const cv = i.condition === 'Mint' ? sv?.sg_cat_value_mint : sv?.sg_cat_value_used
                      return s + (cv ? parseFloat(cv) * (i.quantity || 1) : 0)
                    }, 0)
                    const meetsThreshold = lookingCatValue >= 500
                    if (lookingItems.length === 0) return (
                      <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#aaa' }}>No items flagged. Use the 🏷 button in <button onClick={() => setActiveTab('collection')} style={{ background: 'none', border: 'none', color: '#293451', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: 0 }}>My Collection</button> to flag items.</div>
                    )
                    return (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Items flagged</div>
                            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '24px', fontWeight: '600', color: '#293451' }}>{lookingItems.length}</div>
                          </div>
                          <div>
                            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Cat. value</div>
                            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '24px', fontWeight: '600', color: '#293451' }}>{fmt(lookingCatValue)}</div>
                          </div>
                        </div>
                        <div style={{ height: '4px', background: '#eee', borderRadius: '2px', overflow: 'hidden', marginBottom: '6px' }}>
                          <div style={{ height: '100%', width: Math.min(100, (lookingCatValue / 500) * 100) + '%', background: meetsThreshold ? '#293451' : '#a3925f', borderRadius: '2px' }} />
                        </div>
                        <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: meetsThreshold ? '#1a5c1a' : '#b87520', fontWeight: meetsThreshold ? '600' : '400' }}>
                          {meetsThreshold ? '✓ Eligible for valuation request' : `£${(500 - lookingCatValue).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} below £500 minimum`}
                        </div>
                      </>
                    )
                  })()}
                </div>

              </div>
            </div>
          )
        })()}

        {activeTab === 'collection' && (
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: '600', color: '#293451', marginBottom: '24px' }}>My Collection</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              {[{ label: 'Items in collection', value: collection.length.toString() }, { label: 'Total catalogue value', value: collection.length > 0 ? fmt(totalCatValue) : '—' }, { label: 'Total price paid', value: totalPricePaid > 0 ? fmt(totalPricePaid) : '—' }].map(function(stat) {
                return (
                  <div key={stat.label} style={{ background: '#fff', border: '0.5px solid #ddd', borderRadius: '8px', padding: '20px 24px' }}>
                    <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '6px' }}>{stat.label}</div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: '600', color: '#293451' }}>{stat.value}</div>
                  </div>
                )
              })}
            </div>

            {/* Compact budget widget */}
            {budget && (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', padding: '12px 16px', background: '#fff', border: '0.5px solid #ddd', borderRadius: '8px', alignItems: 'center' }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: '8px', whiteSpace: 'nowrap' }}>Budget left</div>
                {[
                  { label: 'This week', remaining: remainingWeek, total: weeklyBudget },
                  { label: `This period (${daysLeft}d left)`, remaining: remainingPeriod, total: budget.monthly_budget },
                  { label: 'This year', remaining: remainingYear, total: yearlyBudget },
                ].map(({ label, remaining, total }, i) => {
                  const pct = Math.min(100, Math.max(0, (remaining / total) * 100))
                  const over = remaining < 0
                  return (
                    <div key={label} style={{ flex: 1, borderLeft: i > 0 ? '0.5px solid #eee' : 'none', paddingLeft: i > 0 ? '10px' : '0' }}>
                      <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: '#aaa', marginBottom: '3px' }}>{label}</div>
                      <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: '600', color: over ? '#c0392b' : '#293451', marginBottom: '5px' }}>
                        {over ? '-' : ''}£{Math.abs(remaining).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div style={{ height: '3px', background: '#eee', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: pct + '%', background: over ? '#c0392b' : pct < 25 ? '#a3925f' : '#293451', borderRadius: '2px' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {collectionLoading ? (
              <div style={{ background: '#fff', borderRadius: '8px', border: '0.5px solid #ddd', padding: '60px', textAlign: 'center', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#aaa' }}>Loading your collection...</div>
            ) : collection.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '8px', border: '0.5px solid #ddd', padding: '60px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '18px', fontWeight: '600', color: '#293451', marginBottom: '10px' }}>Your collection is empty</div>
                <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#888', marginBottom: '24px' }}>Browse the catalogue and click + on any stamp row to start building your collection.</div>
                <a href="/catalogue" style={{ display: 'inline-block', padding: '11px 28px', background: '#293451', color: '#fff', borderRadius: '6px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', textDecoration: 'none' }}>Browse catalogue</a>
              </div>
            ) : (
              Object.entries(collectionByCountry).map(function([iso, seriesMap]) {
                const isCountryOpen = collOpenCountries[iso] !== false
                const countryItems = Object.values(seriesMap).flatMap(s => s.items)
                const countryCatVal = countryItems.reduce((sum, item) => {
                  const sv = item.stamp_variations
                  const catVal = item.condition === 'Mint' ? sv?.sg_cat_value_mint : sv?.sg_cat_value_used
                  const qty = item.quantity || 1
                  return sum + (catVal ? parseFloat(catVal) * qty : 0)
                }, 0)
                const countryPricePaid = countryItems.reduce((sum, item) => sum + (item.price_paid ? parseFloat(item.price_paid) : 0), 0)
                const sortedSeriesEntries = Object.entries(seriesMap).sort((a, b) => a[1].yearStart - b[1].yearStart)
                return (
                  <div key={iso} style={{ marginBottom: '24px' }}>
                    <div onClick={() => setCollOpenCountries(prev => ({ ...prev, [iso]: !prev[iso] }))} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#293451', borderRadius: isCountryOpen ? '8px 8px 0 0' : '8px', padding: '16px 20px', cursor: 'pointer', userSelect: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: '600', color: '#fff' }}>{countryName(iso)}</span>
                        <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{countryItems.length} item{countryItems.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>Cat value</div>
                          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: '600', color: '#a3925f' }}>{fmt(countryCatVal)}</div>
                        </div>
                        {countryPricePaid > 0 && (
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>Price paid</div>
                            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: '600', color: '#fff' }}>{fmt(countryPricePaid)}</div>
                          </div>
                        )}
                        <span style={{ color: '#a3925f', fontSize: '16px', transition: 'transform 0.2s', transform: isCountryOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>&#8964;</span>
                      </div>
                    </div>
                    {isCountryOpen && (
                      <div style={{ border: '0.5px solid #ddd', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden', background: '#fff' }}>
                        {sortedSeriesEntries.map(function([seriesName, group], si) {
                          const seriesKey = iso + '::' + seriesName
                          const isSeriesOpen = collOpenSeries[seriesKey] === true
                          const seriesItems = group.items.length
                          return (
                            <div key={seriesName} style={{ borderTop: si > 0 ? '0.5px solid #eee' : 'none' }}>
                              <div onClick={() => setCollOpenSeries(prev => ({ ...prev, [seriesKey]: !prev[seriesKey] }))} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0f2f6', padding: '10px 16px', cursor: 'pointer', userSelect: 'none' }}>
                                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#293451' }}>{cleanSeriesName(seriesName, group.yearStart)}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: '#888' }}>{seriesItems} stamp{seriesItems !== 1 ? 's' : ''}</span>
                                  <span style={{ color: '#293451', fontSize: '13px', transition: 'transform 0.2s', transform: isSeriesOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>&#8964;</span>
                                </div>
                              </div>
                              {isSeriesOpen && (
                                <div>
                                  <div style={{ display: 'grid', gridTemplateColumns: COLL_COLS, background: '#fafaf8', borderBottom: '0.5px solid #eee', borderTop: '0.5px solid #eee' }}>
                                    {[['SG no.', false], ['Description', false], ['Notes', false], ['Qty', true], ['Condition', false], ['Cat value', true], ['Price paid', true], ['Lot', false]].map(function(h) {
                                      return <div key={h[0]} style={{ padding: '8px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: h[1] ? 'right' : 'left', whiteSpace: 'nowrap' }}>{h[0]}</div>
                                    })}
                                    <div title="Would upgrade — flag stamps you'd replace with a nicer copy" style={{ padding: '8px 4px', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: '600', color: '#b87520', textAlign: 'center', cursor: 'help' }}>⬆ Up</div>
                                    <div title="Looking to sell — flag stamps you want to sell" style={{ padding: '8px 4px', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: '600', color: '#293451', textAlign: 'center', cursor: 'help' }}>🏷 Sell</div>
                                    <div title="Mark as sold — record a sale and move to Sold tab" style={{ padding: '8px 4px', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: '600', color: '#888', textAlign: 'center', cursor: 'help' }}>£ Sold</div>
                                    <div style={{ padding: '8px 4px' }}></div>
                                  </div>
                                  {group.items.map(function(item) {
                                    const sv = item.stamp_variations
                                    const stamp = sv?.stamps
                                    const sgNum = sv?.sg_sub_number || '—'
                                    const denom = stamp?.denomination || ''
                                    const colour = sv?.colour_shade || stamp?.colour_primary || ''
                                    const desc = [denom, colour].filter(Boolean).join(' ')
                                    const singleCatVal = item.condition === 'Mint' ? sv?.sg_cat_value_mint : sv?.sg_cat_value_used
                                    const qty = item.quantity || 1
                                    const totalCatVal = singleCatVal ? parseFloat(singleCatVal) * qty : null
                                    const rowBg = item.looking_to_sell ? '#fff8f0' : item.upgrade_wanted ? '#fffff8' : '#fff'
                                    const rowBorderLeft = item.looking_to_sell ? '3px solid #a3925f' : item.upgrade_wanted ? '3px solid #e0d860' : 'none'
                                    return (
                                      <div key={item.id} style={{ display: 'grid', gridTemplateColumns: COLL_COLS, borderBottom: '0.5px solid #f5f5f5', alignItems: 'center', background: rowBg, borderLeft: rowBorderLeft }}>
                                        <div style={{ padding: '11px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#293451' }}>{sgNum}</div>
                                        <div style={{ padding: '11px 12px', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{desc}</div>
                                        <div style={{ padding: '11px 12px', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.notes || '—'}</div>
                                        <div style={{ padding: '11px 12px', textAlign: 'right' }}>
                                          {qty > 1 ? <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', padding: '2px 6px', borderRadius: '3px', background: '#eaecf2', color: '#293451' }}>{item.item_type && item.item_type !== 'single' ? item.item_type + ' ' : ''}{qty}</span> : <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#666' }}>1</span>}
                                        </div>
                                        <div style={{ padding: '11px 12px' }}>
                                          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '20px', background: item.condition === 'Mint' ? '#e8f4e8' : '#fdf0e0', color: item.condition === 'Mint' ? '#1a5c1a' : '#7a3d00' }}>{item.condition}</span>
                                        </div>
                                        <div style={{ padding: '11px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#1a5c1a', textAlign: 'right' }}>
                                          {fmt(totalCatVal)}
                                          {qty > 1 && singleCatVal && <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '10px', color: '#aaa', fontWeight: '400' }}>{fmt(singleCatVal)} each</div>}
                                        </div>
                                        <div style={{ padding: '11px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#293451', textAlign: 'right' }}>{item.price_paid ? fmt(item.price_paid) : '—'}</div>
                                        <div style={{ padding: '11px 12px' }}>
                                          {item.auction_url ? <a href={item.auction_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#293451', textDecoration: 'none', padding: '3px 8px', border: '0.5px solid #293451', borderRadius: '4px', whiteSpace: 'nowrap' }}>Lot ↗</a> : <span style={{ color: '#ccc' }}>—</span>}
                                        </div>
                                        {/* Upgrade wanted toggle — amber when active */}
                                        <div style={{ padding: '4px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                          <button
                                            onClick={() => handleToggleUpgrade(item)}
                                            title={item.upgrade_wanted ? 'Remove upgrade flag' : 'Would upgrade this copy'}
                                            style={{ background: item.upgrade_wanted ? '#fff3dc' : 'transparent', border: item.upgrade_wanted ? '1px solid #a3925f' : '1px solid #e5e5e5', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', color: item.upgrade_wanted ? '#b87520' : '#ccc', padding: '3px 5px', lineHeight: 1, fontWeight: '600', transition: 'all 0.15s' }}
                                          >⬆</button>
                                        </div>
                                        {/* Looking to sell toggle — teal when active */}
                                        <div style={{ padding: '4px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                          <button
                                            onClick={() => handleToggleLookingToSell(item)}
                                            title={item.looking_to_sell ? 'Remove looking to sell flag' : 'Mark as looking to sell'}
                                            style={{ background: item.looking_to_sell ? '#eaecf2' : 'transparent', border: item.looking_to_sell ? '1px solid #293451' : '1px solid #e5e5e5', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', color: item.looking_to_sell ? '#293451' : '#ccc', padding: '3px 5px', lineHeight: 1, fontWeight: '600', transition: 'all 0.15s' }}
                                          >🏷</button>
                                        </div>
                                        {/* Mark as sold — amber/gold button */}
                                        <div style={{ padding: '4px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                          <button
                                            onClick={() => handleMarkAsSold(item)}
                                            title="Mark as sold"
                                            style={{ background: 'transparent', border: '1px solid #e5e5e5', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', color: '#888', padding: '3px 5px', lineHeight: 1, fontFamily: 'Montserrat, sans-serif', fontWeight: '700', transition: 'all 0.15s' }}
                                          >£</button>
                                        </div>
                                        {/* Remove */}
                                        <div style={{ padding: '4px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                          <button onClick={() => handleRemoveCollection(item.id)} style={{ background: 'none', border: 'none', color: '#ddd', cursor: 'pointer', fontSize: '16px', padding: '2px 4px', lineHeight: 1 }} title="Remove">×</button>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: '600', color: '#293451', marginBottom: '24px' }}>Wishlist</div>
            {wishlistLoading ? (
              <div style={{ background: '#fff', borderRadius: '8px', border: '0.5px solid #ddd', padding: '60px', textAlign: 'center', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#aaa' }}>Loading your wishlist...</div>
            ) : wishlist.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '8px', border: '0.5px solid #ddd', padding: '60px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '18px', fontWeight: '600', color: '#293451', marginBottom: '10px' }}>Your wishlist is empty</div>
                <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#888', marginBottom: '24px' }}>Click the heart on any stamp in the catalogue to add it to your wishlist.</div>
                <a href="/catalogue" style={{ display: 'inline-block', padding: '11px 28px', background: '#293451', color: '#fff', borderRadius: '6px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', textDecoration: 'none' }}>Browse catalogue</a>
              </div>
            ) : (
              Object.entries(wishlistByCountry).map(function([iso, seriesMap]) {
                const isCountryOpen = wishOpenCountries[iso] !== false
                const countryItems = Object.values(seriesMap).flatMap(s => s.items)
                const sortedSeriesEntries = Object.entries(seriesMap).sort((a, b) => a[1].yearStart - b[1].yearStart)
                return (
                  <div key={iso} style={{ marginBottom: '24px' }}>
                    <div onClick={() => setWishOpenCountries(prev => ({ ...prev, [iso]: !prev[iso] }))} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#7a1a2e', borderRadius: isCountryOpen ? '8px 8px 0 0' : '8px', padding: '16px 20px', cursor: 'pointer', userSelect: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: '600', color: '#fff' }}>{countryName(iso)}</span>
                        <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{countryItems.length} item{countryItems.length !== 1 ? 's' : ''}</span>
                      </div>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', transition: 'transform 0.2s', transform: isCountryOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>&#8964;</span>
                    </div>
                    {isCountryOpen && (
                      <div style={{ border: '0.5px solid #ddd', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden', background: '#fff' }}>
                        {sortedSeriesEntries.map(function([seriesName, group], si) {
                          const seriesKey = iso + '::' + seriesName
                          const isSeriesOpen = wishOpenSeries[seriesKey] === true
                          return (
                            <div key={seriesName} style={{ borderTop: si > 0 ? '0.5px solid #eee' : 'none' }}>
                              <div onClick={() => setWishOpenSeries(prev => ({ ...prev, [seriesKey]: !prev[seriesKey] }))} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fdf0f2', padding: '10px 16px', cursor: 'pointer', userSelect: 'none' }}>
                                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#7a1a2e' }}>{cleanSeriesName(seriesName, group.yearStart)}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: '#888' }}>{group.items.length} stamp{group.items.length !== 1 ? 's' : ''}</span>
                                  <span style={{ color: '#7a1a2e', fontSize: '13px', transition: 'transform 0.2s', transform: isSeriesOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>&#8964;</span>
                                </div>
                              </div>
                              {isSeriesOpen && (
                                <div>
                                  <div style={{ display: 'grid', gridTemplateColumns: WISH_COLS, background: '#fafaf8', borderBottom: '0.5px solid #eee', borderTop: '0.5px solid #eee' }}>
                                    {[['SG no.', false], ['Description', false], ['Condition', false], ['Cat (Mint)', true], ['Cat (Used)', true], ['Added', false], ['', false]].map(function(h) {
                                      return <div key={h[0]} style={{ padding: '8px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: h[1] ? 'right' : 'left', whiteSpace: 'nowrap' }}>{h[0]}</div>
                                    })}
                                  </div>
                                  {group.items.map(function(item) {
                                    const sv = item.stamp_variations
                                    const stamp = sv?.stamps
                                    const sgNum = sv?.sg_sub_number || '—'
                                    const denom = stamp?.denomination || ''
                                    const colour = sv?.colour_shade || stamp?.colour_primary || ''
                                    const desc = [denom, colour].filter(Boolean).join(' ')
                                    return (
                                      <div key={item.id} style={{ display: 'grid', gridTemplateColumns: WISH_COLS, borderBottom: '0.5px solid #f5f5f5', alignItems: 'center' }}>
                                        <div style={{ padding: '11px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#293451' }}>{sgNum}</div>
                                        <div style={{ padding: '11px 12px', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{desc}</span>
                                          {upgradeWantedVariationIds.has(item.variation_id) && (
                                            <span style={{ flexShrink: 0, fontSize: '10px', padding: '2px 7px', background: '#fff3dc', color: '#b87520', borderRadius: '3px', border: '0.5px solid #a3925f', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', whiteSpace: 'nowrap' }}>Seeking upgrade</span>
                                          )}
                                        </div>
                                        <div style={{ padding: '11px 12px' }}>
                                          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '20px', background: item.condition === 'Mint' ? '#e8f4e8' : item.condition === 'Used' ? '#fdf0e0' : '#f5f5f5', color: item.condition === 'Mint' ? '#1a5c1a' : item.condition === 'Used' ? '#7a3d00' : '#666' }}>{item.condition}</span>
                                        </div>
                                        <div style={{ padding: '11px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#1a5c1a', textAlign: 'right' }}>{fmt(sv?.sg_cat_value_mint)}</div>
                                        <div style={{ padding: '11px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#7a3d00', textAlign: 'right' }}>{fmt(sv?.sg_cat_value_used)}</div>
                                        <div style={{ padding: '11px 12px', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#aaa' }}>{new Date(item.added_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                        <div style={{ padding: '11px 12px', textAlign: 'right' }}>
                                          <button onClick={() => handleRemoveWishlist(item.id)} style={{ background: 'none', border: 'none', color: '#e57373', cursor: 'pointer', fontSize: '16px', padding: '0', lineHeight: 1 }} title="Remove">♥</button>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === 'budget' && (
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: '600', color: '#293451', marginBottom: '24px' }}>Budget tracker</div>
            {budgetLoading ? (
              <div style={{ background: '#fff', borderRadius: '8px', border: '0.5px solid #ddd', padding: '60px', textAlign: 'center', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#aaa' }}>Loading...</div>
            ) : (
              <>
                {/* Set budget */}
                <div style={{ ...card }}>
                  <div style={sectionTitle}>Budget settings</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px auto', gap: '12px', alignItems: 'flex-end', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Monthly spending limit</div>
                      <div style={{ display: 'flex', alignItems: 'center', border: '0.5px solid #ddd', borderRadius: '6px', overflow: 'hidden', background: '#fff' }}>
                        <span style={{ padding: '10px 14px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', color: '#888', background: '#f5f5f3', borderRight: '0.5px solid #ddd' }}>£</span>
                        <input type="number" value={budgetInput} onChange={e => setBudgetInput(e.target.value)} placeholder="e.g. 200.00" min="0" step="0.01" style={{ flex: 1, padding: '10px 14px', border: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: '600', color: '#293451', outline: 'none' }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Budget starts on the</div>
                      <div style={{ display: 'flex', alignItems: 'center', border: '0.5px solid #ddd', borderRadius: '6px', overflow: 'hidden', background: '#fff' }}>
                        <select value={startDayInput} onChange={e => setStartDayInput(e.target.value)} style={{ flex: 1, padding: '10px 14px', border: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: '600', color: '#293451', outline: 'none', background: '#fff', cursor: 'pointer' }}>
                          {Array.from({ length: 28 }, (_, i) => i + 1).map(d => (
                            <option key={d} value={d}>{ordinal(d)} of the month</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button onClick={handleSaveBudget} disabled={budgetSaving} style={{ padding: '10px 24px', background: budgetSaving ? '#aaa' : '#293451', color: '#fff', border: 'none', borderRadius: '6px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', cursor: budgetSaving ? 'default' : 'pointer', whiteSpace: 'nowrap', height: '42px' }}>
                      {budgetSaving ? 'Saving…' : budget ? 'Update' : 'Set budget'}
                    </button>
                  </div>

                  {budget && (
                    <>
                      {/* Period context */}
                      <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '12px' }}>
                        Current period: <strong style={{ color: '#293451' }}>{periodStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – {nextPeriodStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                        &nbsp;({periodDays} days · £{dailyBudget.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/day)
                        · <strong style={{ color: daysLeft <= 7 ? '#c0392b' : '#293451' }}>{daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining</strong>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        {[
                          { label: 'This week', value: weeklyBudget, spent: spentThisWeek, remaining: remainingWeek, sub: `${ordinal(weekStart.getDate())} ${weekStart.toLocaleDateString('en-GB', { month: 'short' })} – today` },
                          { label: 'This period', value: budget.monthly_budget, spent: spentThisPeriod, remaining: remainingPeriod, sub: `${periodDays} days · resets ${ordinal(startDay)}` },
                          { label: 'This year', value: yearlyBudget, spent: spentThisYear, remaining: remainingYear, sub: `£${dailyBudget.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/day × 365` },
                        ].map(({ label, value, spent, remaining, sub }) => {
                          const pct = Math.min(100, Math.max(0, (spent / value) * 100))
                          const over = remaining < 0
                          return (
                            <div key={label} style={{ background: '#f5f5f3', borderRadius: '8px', padding: '16px 20px' }}>
                              <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: '#888', marginBottom: '2px' }}>{label}</div>
                              <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '10px', color: '#bbb', marginBottom: '8px' }}>{sub}</div>
                              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '20px', fontWeight: '600', color: '#293451', marginBottom: '2px' }}>
                                £{value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                              <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: '#aaa', marginBottom: '10px' }}>
                                Spent: £{spent.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ·{' '}
                                <span style={{ color: over ? '#c0392b' : '#293451', fontWeight: '600' }}>
                                  {over ? `Over by £${Math.abs(remaining).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `£${remaining.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} left`}
                                </span>
                              </div>
                              <div style={{ height: '4px', background: '#ddd', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: Math.min(100, pct) + '%', background: over ? '#c0392b' : pct > 75 ? '#a3925f' : '#293451', borderRadius: '2px' }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Log a purchase */}
                <div style={{ ...card }}>
                  <div style={sectionTitle}>Log a purchase</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 160px auto', gap: '10px', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Date</div>
                      <input type="date" value={txDate} onChange={e => setTxDate(e.target.value)} style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '0.5px solid #ddd', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Description</div>
                      <input type="text" value={txDesc} onChange={e => setTxDesc(e.target.value)} placeholder="e.g. SG 24a · 1d. red" style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '0.5px solid #ddd', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '6px' }}>Amount (£)</div>
                      <input type="number" value={txAmount} onChange={e => setTxAmount(e.target.value)} placeholder="0.00" min="0" step="0.01" style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '0.5px solid #ddd', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <button onClick={handleAddTransaction} disabled={txSaving || !txAmount} style={{ padding: '9px 20px', background: txSaving || !txAmount ? '#aaa' : '#a3925f', color: '#293451', border: 'none', borderRadius: '6px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', cursor: txSaving || !txAmount ? 'default' : 'pointer', whiteSpace: 'nowrap' }}>
                      {txSaving ? 'Adding…' : '+ Add'}
                    </button>
                  </div>
                </div>

                {/* Transaction history grouped by budget period */}
                <div style={{ ...card }}>
                  <div style={sectionTitle}>Spending history</div>
                  {budgetTransactions.length === 0 ? (
                    <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#aaa', padding: '20px 0' }}>No purchases logged yet.</div>
                  ) : (
                    sortedPeriods.map(([periodLabel, group]) => (
                      <div key={periodLabel} style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#293451' }}>{periodLabel}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#a3925f' }}>
                              £{group.total.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} spent
                            </span>
                            {budget && (
                              <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: '#aaa' }}>
                                of £{parseFloat(budget.monthly_budget).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} budget
                              </span>
                            )}
                            {budget && (() => {
                              const pct = Math.min(100, (group.total / budget.monthly_budget) * 100)
                              const over = group.total > budget.monthly_budget
                              return (
                                <div style={{ width: '80px', height: '3px', background: '#eee', borderRadius: '2px', overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: pct + '%', background: over ? '#c0392b' : pct > 75 ? '#a3925f' : '#293451', borderRadius: '2px' }} />
                                </div>
                              )
                            })()}
                          </div>
                        </div>
                        {group.items.map(t => {
                          const sv = t.user_collection?.stamp_variations
                          const stamp = sv?.stamps
                          const series = stamp?.stamp_series
                          const CMAP = { FK: 'Falkland Islands', BM: 'Bermuda', GB: 'Great Britain', AU: 'Australia', CA: 'Canada', NZ: 'New Zealand' }
                          const hasStamp = !!stamp
                          const sgNum = sv?.sg_sub_number || stamp?.sg_number
                          const denom = stamp?.denomination || ''
                          const colour = sv?.colour_shade || ''
                          const seriesName = series?.name ? series.name.replace(/\d{4}\([^)]+\)\.\s*/, '').split('.')[0].trim() : ''
                          const seriesYear = series?.year_start && series.year_start !== 9999 ? series.year_start + ' ' : ''
                          const country = stamp?.country_iso ? (CMAP[stamp.country_iso] || stamp.country_iso) : ''
                          return (
                            <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '88px 1fr auto auto auto', gap: '12px', alignItems: 'center', padding: '10px 0', borderBottom: '0.5px solid #f5f5f5' }}>
                              <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#aaa' }}>
                                {new Date(t.transaction_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                              </div>
                              {hasStamp ? (
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    {country && <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: '#aaa' }}>{country}</span>}
                                    {country && <span style={{ color: '#ddd', fontSize: '10px' }}>·</span>}
                                    <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#293451' }}>SG {sgNum}</span>
                                    {denom && <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#555' }}>{denom}</span>}
                                    {colour && <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#777' }}>{colour}</span>}
                                  </div>
                                  {seriesName && <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{seriesYear}{seriesName}</div>}
                                  {t.description && t.description !== 'Collection purchase' && <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: '#bbb', fontStyle: 'italic', marginTop: '2px' }}>{t.description}</div>}
                                </div>
                              ) : (
                                <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#444' }}>{t.description || '—'}</div>
                              )}
                              <div style={{ flexShrink: 0 }}>
                                <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '10px', padding: '2px 7px', borderRadius: '3px', background: t.source === 'collection' ? '#eaecf2' : '#f5f5f3', color: t.source === 'collection' ? '#293451' : '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                  {t.source === 'collection' ? 'Collection' : 'Manual'}
                                </span>
                              </div>
                              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#293451', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                £{parseFloat(t.amount).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                              <button onClick={() => handleRemoveTransaction(t.id, t.collection_item_id || null)} title={t.collection_item_id ? 'Remove from spending history and collection' : 'Remove from spending history'} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '16px', padding: '0', lineHeight: 1 }}>×</button>
                            </div>
                          )
                        })}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}


        {activeTab === 'sold' && (() => {
          const totalSoldPrice = soldItems.reduce((s, i) => s + (i.sold_price ? parseFloat(i.sold_price) : 0), 0)
          const totalSoldCatValue = soldItems.reduce((s, i) => {
            const sv = i.stamp_variations
            const cv = i.condition === 'Mint' ? sv?.sg_cat_value_mint : sv?.sg_cat_value_used
            return s + (cv ? parseFloat(cv) : 0)
          }, 0)
          const now = new Date()
          const startOfYear = new Date(now.getFullYear(), 0, 1)
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
          const soldThisYear = soldItems.filter(i => new Date(i.sold_at) >= startOfYear).reduce((s, i) => s + (i.sold_price ? parseFloat(i.sold_price) : 0), 0)
          const soldThisMonth = soldItems.filter(i => new Date(i.sold_at) >= startOfMonth).reduce((s, i) => s + (i.sold_price ? parseFloat(i.sold_price) : 0), 0)

          return (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: '600', color: '#293451' }}>Sold</div>
                <button onClick={() => setAddSoldModal(true)} style={{ padding: '9px 18px', background: '#293451', color: '#fff', border: 'none', borderRadius: '6px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>+ Add sale</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Items sold', value: soldItems.length.toString() },
                  { label: 'Total proceeds', value: totalSoldPrice > 0 ? fmt(totalSoldPrice) : '—' },
                  { label: 'Sold this month', value: soldThisMonth > 0 ? fmt(soldThisMonth) : '—' },
                  { label: 'Sold this year', value: soldThisYear > 0 ? fmt(soldThisYear) : '—' },
                ].map(stat => (
                  <div key={stat.label} style={{ background: '#fff', border: '0.5px solid #ddd', borderRadius: '8px', padding: '20px 24px' }}>
                    <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '6px' }}>{stat.label}</div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '20px', fontWeight: '600', color: '#293451' }}>{stat.value}</div>
                  </div>
                ))}
              </div>

              {soldLoading ? (
                <div style={{ background: '#fff', borderRadius: '8px', border: '0.5px solid #ddd', padding: '60px', textAlign: 'center', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#aaa' }}>Loading...</div>
              ) : soldItems.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: '8px', border: '0.5px solid #ddd', padding: '60px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '600', color: '#293451', marginBottom: '8px' }}>No items sold yet</div>
                  <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#888' }}>Mark items as sold from the My Collection tab using the £ button.</div>
                </div>
              ) : (
                <div style={{ background: '#fff', border: '0.5px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 110px 1fr 100px 110px 110px 110px 80px 60px', background: '#fafaf8', borderBottom: '0.5px solid #eee', padding: '0' }}>
                    {[['SG no.', false], ['Country', false], ['Description', false], ['Condition', false], ['Sold', false], ['Sold for', true], ['Paid', true], ['Notes', false], ['', false]].map(h => (
                      <div key={h[0]} style={{ padding: '8px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: h[1] ? 'right' : 'left' }}>{h[0]}</div>
                    ))}
                  </div>
                  {soldItems.map(item => {
                    const sv = item.stamp_variations
                    const stamp = sv?.stamps
                    const sgNum = sv?.sg_sub_number || stamp?.sg_number || '—'
                    const denom = stamp?.denomination || ''
                    const colour = sv?.colour_shade || stamp?.colour_primary || ''
                    const desc = [denom, colour].filter(Boolean).join(' ')
                    const country = stamp?.country_iso ? (COUNTRY_MAP[stamp.country_iso] || stamp.country_iso) : item.country_name || '—'
                    const profit = item.sold_price && item.price_paid ? parseFloat(item.sold_price) - parseFloat(item.price_paid) : null
                    return (
                      <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '80px 110px 1fr 100px 110px 110px 110px 80px 60px', borderBottom: '0.5px solid #f5f5f5', alignItems: 'center' }}>
                        <div style={{ padding: '11px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#293451' }}>{sgNum}</div>
                        <div style={{ padding: '11px 12px', fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{country}</div>
                        <div style={{ padding: '11px 12px', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{desc || item.description || '—'}</div>
                        <div style={{ padding: '11px 12px' }}>
                          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '20px', background: item.condition === 'Mint' ? '#e8f4e8' : '#fdf0e0', color: item.condition === 'Mint' ? '#1a5c1a' : '#7a3d00' }}>{item.condition}</span>
                        </div>
                        <div style={{ padding: '11px 12px', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888' }}>
                          {new Date(item.sold_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <div style={{ padding: '11px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#293451', textAlign: 'right' }}>
                          {item.sold_price ? fmt(item.sold_price) : '—'}
                          {profit !== null && <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '10px', fontWeight: '400', color: profit >= 0 ? '#1a5c1a' : '#c0392b' }}>{profit >= 0 ? '+' : ''}{fmt(profit)}</div>}
                        </div>
                        <div style={{ padding: '11px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#888', textAlign: 'right' }}>{item.price_paid ? fmt(item.price_paid) : '—'}</div>
                        <div style={{ padding: '11px 12px', fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.sold_notes || '—'}</div>
                        <div style={{ padding: '6px 8px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <button onClick={() => handleEditSold(item)} style={{ background: 'none', border: '0.5px solid #ddd', borderRadius: '4px', color: '#888', cursor: 'pointer', fontSize: '10px', padding: '3px 6px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}>Edit</button>
                          <button onClick={() => handleRemoveSoldItem(item.id)} style={{ background: 'none', border: 'none', color: '#ddd', cursor: 'pointer', fontSize: '16px', padding: '0 2px', lineHeight: 1 }}>×</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })()}


        {activeTab === 'looking-to-sell' && (() => {
          const lookingItems = collection.filter(i => i.looking_to_sell)
          const lookingCatValue = lookingItems.reduce((s, i) => {
            const sv = i.stamp_variations
            const cv = i.condition === 'Mint' ? sv?.sg_cat_value_mint : sv?.sg_cat_value_used
            const qty = i.quantity || 1
            return s + (cv ? parseFloat(cv) * qty : 0)
          }, 0)
          const meetsThreshold = lookingCatValue >= 500

          return (
            <div>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: '600', color: '#293451', marginBottom: '24px' }}>Looking to sell</div>

              {/* Threshold card */}
              <div style={{ ...card, borderLeft: meetsThreshold ? '4px solid #293451' : '4px solid #a3925f' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: meetsThreshold ? '20px' : '8px' }}>
                  <div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Total catalogue value of items to sell</div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '28px', fontWeight: '600', color: meetsThreshold ? '#293451' : '#b87520' }}>
                      {lookingCatValue > 0 ? fmt(lookingCatValue) : '—'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888', marginBottom: '4px' }}>{lookingItems.length} item{lookingItems.length !== 1 ? 's' : ''} flagged</div>
                    <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: meetsThreshold ? '#1a5c1a' : '#b87520', fontWeight: '600' }}>
                      {meetsThreshold ? '✓ Minimum threshold met' : `£${Math.max(0, 500 - lookingCatValue).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} below £500 minimum`}
                    </div>
                  </div>
                </div>

                {!meetsThreshold && (
                  <div style={{ height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ height: '100%', width: Math.min(100, (lookingCatValue / 500) * 100) + '%', background: '#a3925f', borderRadius: '3px', transition: 'width 0.3s' }} />
                  </div>
                )}
                {!meetsThreshold && (
                  <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#aaa' }}>
                    Add more items from My Collection to reach the £500 minimum for a valuation request.
                  </div>
                )}

                {meetsThreshold && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ background: '#f0f2f6', borderRadius: '8px', padding: '20px' }}>
                      <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#293451', marginBottom: '8px' }}>✉ Email valuation</div>
                      <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#666', lineHeight: '1.6', marginBottom: '12px' }}>
                        Send your list to our philatelic experts for a free valuation estimate.
                      </div>
                      <a href="mailto:hnorris@stanleygibbons.com?subject=Collection valuation request" style={{ display: 'inline-block', padding: '8px 16px', background: '#293451', color: '#fff', borderRadius: '5px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '12px', textDecoration: 'none' }}>
                        Email hnorris@stanleygibbons.com
                      </a>
                    </div>
                    <div style={{ background: '#f0f2f6', borderRadius: '8px', padding: '20px' }}>
                      <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#293451', marginBottom: '8px' }}>📍 In-person valuation</div>
                      <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#666', lineHeight: '1.6' }}>
                        Stanley Gibbons Baldwins<br />
                        399 Strand, London, WC2R 0LP<br />
                        Mon–Fri, 10:00–12:00
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {lookingToSellLoading ? (
                <div style={{ background: '#fff', borderRadius: '8px', border: '0.5px solid #ddd', padding: '60px', textAlign: 'center', fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#aaa' }}>Loading...</div>
              ) : lookingItems.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: '8px', border: '0.5px solid #ddd', padding: '60px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '600', color: '#293451', marginBottom: '8px' }}>No items flagged yet</div>
                  <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#888' }}>In My Collection, click the 🏷 button on any item to mark it as looking to sell.</div>
                </div>
              ) : (
                <div style={{ background: '#fff', border: '0.5px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 110px 1fr 100px 110px 110px 36px', background: '#fafaf8', borderBottom: '0.5px solid #eee' }}>
                    {[['SG no.', false], ['Country', false], ['Description', false], ['Condition', false], ['Cat value', true], ['Paid', true], ['', false]].map(h => (
                      <div key={h[0]} style={{ padding: '8px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: h[1] ? 'right' : 'left' }}>{h[0]}</div>
                    ))}
                  </div>
                  {lookingItems.map(item => {
                    const sv = item.stamp_variations
                    const stamp = sv?.stamps
                    const sgNum = sv?.sg_sub_number || '—'
                    const denom = stamp?.denomination || ''
                    const colour = sv?.colour_shade || stamp?.colour_primary || ''
                    const desc = [denom, colour].filter(Boolean).join(' ')
                    const country = stamp?.country_iso ? (COUNTRY_MAP[stamp.country_iso] || stamp.country_iso) : '—'
                    const catVal = item.condition === 'Mint' ? sv?.sg_cat_value_mint : sv?.sg_cat_value_used
                    return (
                      <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '80px 110px 1fr 100px 110px 110px 36px', borderBottom: '0.5px solid #f5f5f5', alignItems: 'center' }}>
                        <div style={{ padding: '11px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#293451' }}>{sgNum}</div>
                        <div style={{ padding: '11px 12px', fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{country}</div>
                        <div style={{ padding: '11px 12px', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{desc}</div>
                        <div style={{ padding: '11px 12px' }}>
                          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '20px', background: item.condition === 'Mint' ? '#e8f4e8' : '#fdf0e0', color: item.condition === 'Mint' ? '#1a5c1a' : '#7a3d00' }}>{item.condition}</span>
                        </div>
                        <div style={{ padding: '11px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#1a5c1a', textAlign: 'right' }}>{catVal ? fmt(catVal) : '—'}</div>
                        <div style={{ padding: '11px 12px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#888', textAlign: 'right' }}>{item.price_paid ? fmt(item.price_paid) : '—'}</div>
                        <div style={{ padding: '11px 12px', textAlign: 'right' }}>
                          <button onClick={() => handleToggleLookingToSell(item)} title="Remove from looking to sell" style={{ background: 'none', border: 'none', color: '#ddd', cursor: 'pointer', fontSize: '16px', padding: '0', lineHeight: 1 }}>×</button>
                        </div>
                      </div>
                    )
                  })}
                  <div style={{ padding: '12px 16px', background: '#f9f9f7', borderTop: '0.5px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '24px' }}>
                    <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#888' }}>Total catalogue value</div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#293451' }}>{fmt(lookingCatValue)}</div>
                  </div>
                </div>
              )}
            </div>
          )
        })()}


        {/* Edit sold modal */}
        {editSoldModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={() => setEditSoldModal(null)}>
            <div style={{ background: '#fff', borderRadius: '10px', width: '100%', maxWidth: '400px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
              <div style={{ background: '#293451', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: '600', color: '#fff' }}>Edit sale</div>
                <button onClick={() => setEditSoldModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '20px', cursor: 'pointer', padding: '4px', lineHeight: 1 }}>×</button>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>Date sold</label>
                  <input type="date" value={editSellDate} onChange={e => setEditSellDate(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '0.5px solid #ddd', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>Sold for (£)</label>
                  <input type="number" value={editSellPrice} onChange={e => setEditSellPrice(e.target.value)} placeholder="e.g. 150.00" min="0" step="0.01" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '0.5px solid #ddd', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>Notes</label>
                  <input type="text" value={editSellNotes} onChange={e => setEditSellNotes(e.target.value)} placeholder="e.g. Sold via SGB auction" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '0.5px solid #ddd', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setEditSoldModal(null)} style={{ flex: 1, padding: '11px', borderRadius: '6px', border: '0.5px solid #ddd', background: '#fff', color: '#666', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={handleConfirmEditSold} disabled={editSellSaving} style={{ flex: 2, padding: '11px', borderRadius: '6px', border: 'none', background: editSellSaving ? '#aaa' : '#293451', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', cursor: editSellSaving ? 'default' : 'pointer' }}>
                    {editSellSaving ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Manual add sold modal */}
        {addSoldModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={() => setAddSoldModal(false)}>
            <div style={{ background: '#fff', borderRadius: '10px', width: '100%', maxWidth: '460px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
              <div style={{ background: '#293451', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#a3925f', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>Sold</div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: '600', color: '#fff' }}>Add a sale manually</div>
                </div>
                <button onClick={() => setAddSoldModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '20px', cursor: 'pointer', padding: '4px', lineHeight: 1 }}>×</button>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>SG number</label>
                    <input type="text" value={manualSoldSgNum} onChange={e => setManualSoldSgNum(e.target.value)} placeholder="e.g. 24a" style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '0.5px solid #ddd', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>Condition</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['Mint', 'Used'].map(c => (
                        <button key={c} onClick={() => setManualSoldCondition(c)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: manualSoldCondition === c ? '2px solid #293451' : '1px solid #ddd', background: manualSoldCondition === c ? '#eaecf2' : '#fff', color: manualSoldCondition === c ? '#293451' : '#666', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>{c}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>Description</label>
                  <input type="text" value={manualSoldDesc} onChange={e => setManualSoldDesc(e.target.value)} placeholder="e.g. Great Britain · 1d. red" style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '0.5px solid #ddd', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>Date sold</label>
                    <input type="date" value={manualSoldDate} onChange={e => setManualSoldDate(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '0.5px solid #ddd', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>Sold for (£)</label>
                    <input type="number" value={manualSoldPrice} onChange={e => setManualSoldPrice(e.target.value)} placeholder="0.00" min="0" step="0.01" style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '0.5px solid #ddd', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>Notes (optional)</label>
                  <input type="text" value={manualSoldNotes} onChange={e => setManualSoldNotes(e.target.value)} placeholder="e.g. Sold privately, auction house, etc." style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '0.5px solid #ddd', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setAddSoldModal(false)} style={{ flex: 1, padding: '11px', borderRadius: '6px', border: '0.5px solid #ddd', background: '#fff', color: '#666', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                  <button
                    onClick={async () => {
                      if (!manualSoldDate) return
                      setManualSoldSaving(true)
                      const result = await addManualSoldItem({
                        condition: manualSoldCondition,
                        soldAt: manualSoldDate,
                        soldPrice: manualSoldPrice ? parseFloat(manualSoldPrice) : null,
                        soldNotes: [manualSoldSgNum && ('SG ' + manualSoldSgNum), manualSoldDesc, manualSoldNotes].filter(Boolean).join(' · ') || null,
                      })
                      setManualSoldSaving(false)
                      if (result) {
                        setSoldItems(prev => [{ ...result, description: [manualSoldSgNum && ('SG ' + manualSoldSgNum), manualSoldDesc].filter(Boolean).join(' · ') }, ...prev])
                        setAddSoldModal(false)
                        setManualSoldSgNum(''); setManualSoldDesc(''); setManualSoldPrice(''); setManualSoldNotes('')
                        setManualSoldDate(new Date().toISOString().split('T')[0])
                      }
                    }}
                    disabled={manualSoldSaving}
                    style={{ flex: 2, padding: '11px', borderRadius: '6px', border: 'none', background: manualSoldSaving ? '#aaa' : '#293451', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', cursor: manualSoldSaving ? 'default' : 'pointer' }}
                  >
                    {manualSoldSaving ? 'Saving...' : 'Add sale'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Mark as sold modal */}
        {sellModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={() => setSellModal(null)}>
            <div style={{ background: '#fff', borderRadius: '10px', width: '100%', maxWidth: '400px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
              <div style={{ background: '#293451', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#a3925f', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>Mark as sold</div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: '600', color: '#fff' }}>
                    {(() => { const sv = sellModal.item.stamp_variations; return 'SG ' + (sv?.sg_sub_number || '—') })()}
                  </div>
                </div>
                <button onClick={() => setSellModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '20px', cursor: 'pointer', padding: '4px', lineHeight: 1 }}>×</button>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>Date sold</label>
                  <input type="date" value={sellDate} onChange={e => setSellDate(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '0.5px solid #ddd', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>Sold for (£)</label>
                  <input type="number" value={sellPrice} onChange={e => setSellPrice(e.target.value)} placeholder="e.g. 150.00" min="0" step="0.01" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '0.5px solid #ddd', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }}>Notes (optional)</label>
                  <input type="text" value={sellNotes} onChange={e => setSellNotes(e.target.value)} placeholder="e.g. Sold via SGB auction, lot 142" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '0.5px solid #ddd', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setSellModal(null)} style={{ flex: 1, padding: '11px', borderRadius: '6px', border: '0.5px solid #ddd', background: '#fff', color: '#666', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={handleConfirmSold} disabled={sellSaving} style={{ flex: 2, padding: '11px', borderRadius: '6px', border: 'none', background: sellSaving ? '#aaa' : '#293451', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', cursor: sellSaving ? 'default' : 'pointer' }}>
                    {sellSaving ? 'Saving...' : 'Confirm sold'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '22px', fontWeight: '600', color: '#293451', marginBottom: '24px' }}>Account details</div>
            <div style={{ ...card }}><div style={sectionTitle}>Personal information</div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>{[{ label: 'First name', value: 'Demo' }, { label: 'Last name', value: 'User' }, { label: 'Email address', value: 'demo@stanleygibbons.com' }, { label: 'Phone number', value: '+44 20 7836 8444' }].map(function(field) { return (<div key={field.label}><div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>{field.label}</div><div style={{ padding: '10px 14px', background: '#f5f5f3', border: '0.5px solid #ddd', borderRadius: '5px', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#222' }}>{field.value}</div></div>) })}</div><div style={{ padding: '10px 20px', background: '#293451', color: '#fff', borderRadius: '5px', display: 'inline-block', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.04em' }}>Save changes</div></div>
            <div style={{ ...card }}><div style={sectionTitle}>Password</div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>{['Current password', 'New password', 'Confirm new password'].map(function(label) { return (<div key={label} style={{ gridColumn: label === 'Confirm new password' ? '1' : 'auto' }}><div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>{label}</div><div style={{ padding: '10px 14px', background: '#f5f5f3', border: '0.5px solid #ddd', borderRadius: '5px', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#aaa' }}>••••••••</div></div>) })}</div><div style={{ padding: '10px 20px', background: '#293451', color: '#fff', borderRadius: '5px', display: 'inline-block', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.04em' }}>Update password</div></div>
          </div>
        )}

      </div>
    </div>
  )
}
