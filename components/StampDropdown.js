'use client'

import { useState, useEffect, useContext } from 'react'
import { getHistoricValues, getSalesRecords } from '../lib/catalogue'
import { getCollectionEntriesForVariation, getPersonalSalesForVariation, updateCollectionItem } from '../lib/collection'
import { removeFromWishlistByVariation } from '../lib/wishlist'
import PriceChart from './PriceChart'
import AddToCollectionModal from './AddToCollectionModal'
import { CatalogueStatusContext } from './StampRow'

const SUPABASE_URL = 'https://ambzwvkbxpkjuwmjnvgj.supabase.co'
const SGB_BASE = 'https://sgbaldwins.com/auctions/'

function lotUrl(sale) {
  if (!sale) return SGB_BASE + 'upcoming-auctions'
  if (sale.auction_slug && sale.lot_number) return SGB_BASE + sale.auction_slug + '/lot/' + sale.lot_number
  return SGB_BASE + 'upcoming-auctions'
}

function isRetail(sale) {
  return sale && sale.sale_source === 'Retail'
}

function RetailImage({ stockCode }) {
  const [hovered, setHovered] = useState(false)
  const [error, setError] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const url = SUPABASE_URL + '/storage/v1/object/public/retail-images/' + stockCode + '-1.jpg'

  if (error) return null

  function handleMouseEnter(e) {
    setPos({ x: e.clientX, y: e.clientY })
    setHovered(true)
  }

  function handleMouseMove(e) {
    setPos({ x: e.clientX, y: e.clientY })
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}>
      <img
        src={url}
        alt="Retail item"
        onError={() => setError(true)}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(false)}
        style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '3px', border: '0.5px solid #ddd', cursor: 'zoom-in', display: 'block' }}
      />
      {hovered && (
        <div style={{ position: 'fixed', zIndex: 9999, pointerEvents: 'none', left: pos.x + 12, top: pos.y - 210 }}>
          <img
            src={url}
            alt="Retail item enlarged"
            style={{ width: '200px', height: '200px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'block' }}
          />
        </div>
      )}
    </div>
  )
}

export default function StampDropdown({ stamp, variation }) {
  const [historicValues, setHistoricValues] = useState([])
  const [salesRecords, setSalesRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [auctionImgError, setAuctionImgError] = useState(false)
  const [retailImgIndex, setRetailImgIndex] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [userPhoto, setUserPhoto] = useState(null)
  const [collectionEntries, setCollectionEntries] = useState([])
  const [personalSales, setPersonalSales] = useState([])
  const { addToCollectionIds, collectionIds, removeFromWishlistIds } = useContext(CatalogueStatusContext)

  useEffect(() => {
    async function fetchData() {
      if (!variation?.id) return
      setLoading(true)
      setAuctionImgError(false)
      setRetailImgIndex(0)
      const [historic, sales, entries, personalSalesData] = await Promise.all([
        getHistoricValues(variation.id),
        getSalesRecords(variation.id),
        getCollectionEntriesForVariation(variation.id),
        getPersonalSalesForVariation(variation.id),
      ])
      setHistoricValues(historic)
      setSalesRecords(sales)
      setCollectionEntries(entries)
      setPersonalSales(personalSalesData)
      setLoading(false)
    }
    fetchData()
  }, [variation?.id])

  const latestAuctionSale = salesRecords.find(s => !isRetail(s))
  const retailSales = salesRecords.filter(s => isRetail(s) && s.stock_code)

  const auctionImageUrl = latestAuctionSale
    ? (latestAuctionSale.image_url || (SUPABASE_URL + '/storage/v1/object/public/auction-images/' + latestAuctionSale.sale_number + '/' + latestAuctionSale.lot_number + '-1.jpg'))
    : null

  const currentRetailSale = retailSales[retailImgIndex] || null
  const retailImageUrl = currentRetailSale
    ? SUPABASE_URL + '/storage/v1/object/public/retail-images/' + currentRetailSale.stock_code + '-1.jpg'
    : null

  const showAuctionImage = auctionImageUrl && !auctionImgError
  const showRetailImage = !showAuctionImage && retailImageUrl && retailImgIndex < retailSales.length

  return (
    <div style={{ borderTop: '1px solid #e0e0e0', background: '#fff' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr', borderBottom: '0.5px solid #eee' }}>

        <div style={{ padding: '20px', borderRight: '0.5px solid #eee' }}>
          <div style={sectionTitle}>Ref. image</div>
          <div style={{ width: '160px', height: '190px', background: '#f8f8f6', border: '0.5px solid #ddd', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {showAuctionImage ? (
              <img src={auctionImageUrl} alt="Reference image" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={() => setAuctionImgError(true)} />
            ) : showRetailImage ? (
              <img src={retailImageUrl} alt="Reference image" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={() => setRetailImgIndex(prev => prev + 1)} />
            ) : userPhoto ? (
              <img src={userPhoto} alt="Your stamp" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ fontSize: '11px', color: '#999', fontFamily: 'Open Sans, sans-serif', textAlign: 'center', padding: '12px', lineHeight: '1.5' }}>No reference image available</div>
            )}
          </div>
          {userPhoto && !showAuctionImage && !showRetailImage && (
            <button onClick={() => setUserPhoto(null)} style={{ marginTop: '6px', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#999', background: 'none', border: '0.5px solid #ddd', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer' }}>
              Remove photo
            </button>
          )}
          {latestAuctionSale && (
            <div>
              <div style={{ marginTop: '8px', fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                {'Lot ' + latestAuctionSale.lot_number + ' · ' + latestAuctionSale.sale_number}<br />
                {'Hammer: £' + parseFloat(latestAuctionSale.sale_price).toLocaleString('en-GB')}<br />
                {latestAuctionSale.sale_condition}
              </div>
              <a href={lotUrl(latestAuctionSale)} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '8px', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#293451', textDecoration: 'none', padding: '5px 12px', border: '1px solid #293451', borderRadius: '4px', width: '136px', textAlign: 'center' }}>View lot</a>
            </div>
          )}
        </div>

        <div style={{ padding: '20px', borderRight: '0.5px solid #eee' }}>
          <div style={sectionTitle}>Historic catalogue value</div>
          {loading ? (
            <div style={{ fontSize: '13px', color: '#aaa', fontFamily: 'Open Sans, sans-serif' }}>Loading...</div>
          ) : historicValues.length > 0 ? (
            <PriceChart data={historicValues} currentMint={variation ? variation.sg_cat_value_mint : null} currentUsed={variation ? variation.sg_cat_value_used : null} />
          ) : (
            <div style={{ fontSize: '13px', color: '#aaa', fontFamily: 'Open Sans, sans-serif' }}>No historic data available</div>
          )}

          <div style={{ ...sectionTitle, marginTop: '20px' }}>Recent sales</div>
          {loading ? (
            <div style={{ fontSize: '13px', color: '#aaa', fontFamily: 'Open Sans, sans-serif' }}>Loading...</div>
          ) : salesRecords.length > 0 ? (
            salesRecords.map(function(sale) {
              const retail = isRetail(sale)
              return (
                <div key={sale.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 0', borderBottom: '0.5px solid #f0f0f0' }}>
                  <span style={{ fontSize: '12px', color: '#888', fontFamily: 'Open Sans, sans-serif', minWidth: '80px' }}>
                    {retail ? 'Retail' : new Date(sale.sale_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                  </span>
                  {retail && sale.stock_code ? (
                    <RetailImage stockCode={sale.stock_code} />
                  ) : (
                    <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '3px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', background: sale.sale_condition && sale.sale_condition.toLowerCase().includes('mint') ? '#e8f4e8' : '#fdf0e0', color: sale.sale_condition && sale.sale_condition.toLowerCase().includes('mint') ? '#1a5c1a' : '#7a3d00' }}>
                      {sale.sale_condition || '—'}
                    </span>
                  )}
                  <span style={{ fontSize: '13px', fontWeight: '600', fontFamily: 'Montserrat, sans-serif', color: '#222', flex: 1, textAlign: 'right' }}>
                    {'£' + parseFloat(sale.sale_price).toLocaleString('en-GB')}
                  </span>
                  {retail ? (
                    <span style={{ fontSize: '11px', color: '#888', fontFamily: 'Open Sans, sans-serif' }}>{sale.stock_code || '—'}</span>
                  ) : (
                    <a href={lotUrl(sale)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#293451', fontFamily: 'Open Sans, sans-serif', textDecoration: 'none' }}>{'Lot ' + sale.lot_number}</a>
                  )}
                </div>
              )
            })
          ) : (
            <div style={{ fontSize: '13px', color: '#aaa', fontFamily: 'Open Sans, sans-serif' }}>No sales available</div>
          )}
          {personalSales.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              {personalSales.map(ps => (
                <div key={ps.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 0', borderBottom: '0.5px solid #f0f0f0' }}>
                  <span style={{ fontSize: '12px', color: '#888', fontFamily: 'Open Sans, sans-serif', minWidth: '80px' }}>
                    {new Date(ps.sold_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                  </span>
                  <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '3px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', background: '#f0f0ff', color: '#444' }}>
                    Personal sale
                  </span>
                  <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '3px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', background: ps.condition === 'Mint' ? '#e8f4e8' : '#fdf0e0', color: ps.condition === 'Mint' ? '#1a5c1a' : '#7a3d00' }}>
                    {ps.condition}
                  </span>
                  {ps.sold_price && (
                    <span style={{ fontSize: '13px', fontWeight: '600', fontFamily: 'Montserrat, sans-serif', color: '#222', flex: 1, textAlign: 'right' }}>
                      {'£' + parseFloat(ps.sold_price).toLocaleString('en-GB')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '20px' }}>
          <div style={sectionTitle}>Stamp details</div>
          <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['SG number', variation ? (variation.sg_sub_number || stamp.sg_number) : stamp.sg_number],
                ['Denomination', stamp.denomination],
                ['Colour', variation ? (variation.colour_shade || stamp.colour_primary) : stamp.colour_primary],
                ['Year issued', stamp.year_issued],
                ['Perforation', stamp.perforation_type],
                ['Perf gauge', variation ? variation.perforation_gauge : null],
                ['Printing', stamp.printing_method],
                ['Paper', stamp.paper_type],
                ['Watermark', stamp.watermark],
                ['Printer', stamp.printer],
              ].filter(function(item) { return item[1] }).map(function(item) {
                return (
                  <tr key={item[0]}>
                    <td style={{ padding: '5px 0', color: '#888', fontFamily: 'Open Sans, sans-serif', width: '45%', verticalAlign: 'top' }}>{item[0]}</td>
                    <td style={{ padding: '5px 0', fontFamily: 'Open Sans, sans-serif', color: '#222' }}>{item[1]}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <div style={{ flex: 1, background: '#f0f2f6', borderRadius: '5px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '10px', color: '#888', marginBottom: '3px' }}>Mint</div>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '600', color: '#1a5c1a' }}>
                {variation && variation.sg_cat_value_mint ? '£' + parseFloat(variation.sg_cat_value_mint).toLocaleString('en-GB') : '—'}
              </div>
            </div>
            <div style={{ flex: 1, background: '#fff5e6', borderRadius: '5px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '10px', color: '#888', marginBottom: '3px' }}>Used</div>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '600', color: '#7a3d00' }}>
                {variation && variation.sg_cat_value_used ? '£' + parseFloat(variation.sg_cat_value_used).toLocaleString('en-GB') : '—'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ marginTop: '12px', width: '100%', padding: '10px', borderRadius: '6px', border: '1.5px solid #293451', background: '#fff', color: '#293451', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '12px', cursor: 'pointer', letterSpacing: '0.04em' }}
          >
            + Add to My Collection
          </button>
        </div>
      </div>

      {collectionEntries.length > 0 && (
        <div style={{ padding: '16px 20px', background: '#fafaf8', borderTop: '0.5px solid #eee' }}>
          <div style={sectionTitle}>In your collection</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {collectionEntries.map((entry) => (
              <div key={entry.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ flexShrink: 0, background: '#293451', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', borderRadius: '4px', padding: '3px 9px', whiteSpace: 'nowrap' }}>
                  {entry.quantity > 1 ? entry.quantity + '× ' : ''}{entry.item_type.charAt(0).toUpperCase() + entry.item_type.slice(1)}
                </div>
                {entry.upgrade_wanted && (
                  <div style={{ flexShrink: 0, background: '#f8f6f0', border: '1px solid #a3925f', color: '#b87520', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: '600', borderRadius: '4px', padding: '2px 7px', whiteSpace: 'nowrap' }}>
                    ⬆ Would upgrade
                  </div>
                )}
                <div style={{ flexShrink: 0, fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#666' }}>
                  {entry.condition}
                </div>
                {entry.price_paid && <div style={{ width: '1px', height: '12px', background: '#ddd', flexShrink: 0 }} />}
                {entry.price_paid && (
                  <div style={{ flexShrink: 0, fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#a3925f' }}>
                    {'Paid £' + parseFloat(entry.price_paid).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                )}
                {entry.notes && <div style={{ width: '1px', height: '12px', background: '#ddd', flexShrink: 0 }} />}
                {entry.notes && (
                  <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#999', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                    {entry.notes}
                  </div>
                )}
                {entry.auction_url && (
                  <a href={entry.auction_url} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#293451', textDecoration: 'none', border: '0.5px solid #293451', borderRadius: '4px', padding: '2px 8px' }}>
                    View lot
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <AddToCollectionModal
          stamp={stamp}
          variation={variation}
          onClose={() => setShowModal(false)}
          onAdded={(result) => {
            setShowModal(false)
            if (result?.photoData) setUserPhoto(result.photoData)
            if (variation?.id) {
              addToCollectionIds(variation.id)
              removeFromWishlistIds(variation.id)
              removeFromWishlistByVariation(variation.id)
              getCollectionEntriesForVariation(variation.id).then(setCollectionEntries)
            }
          }}
        />
      )}
    </div>
  )
}

const sectionTitle = {
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '10px',
  fontWeight: '600',
  color: '#293451',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  marginBottom: '10px',
  paddingBottom: '6px',
  borderBottom: '1.5px solid #a3925f',
}
