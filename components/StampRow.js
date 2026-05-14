'use client'

import { useState, useEffect, useContext, createContext } from 'react'
import StampDropdown from './StampDropdown'
import AddToCollectionModal from './AddToCollectionModal'
import AddToWishlistModal from './AddToWishlistModal'
import { getCollectionVariationIds, getUpgradeWantedVariationIds } from '../lib/collection'
import { getWishlistVariationIds, removeFromWishlistByVariation } from '../lib/wishlist'

export const CatalogueStatusContext = createContext({ collectionIds: new Set(), wishlistIds: new Set(), upgradeWantedIds: new Set(), refresh: () => {}, addToCollectionIds: () => {}, addToWishlistIds: () => {}, removeFromWishlistIds: () => {} })

export function CatalogueStatusProvider({ children }) {
  const [collectionIds, setCollectionIds] = useState(new Set())
  const [wishlistIds, setWishlistIds] = useState(new Set())
  const [upgradeWantedIds, setUpgradeWantedIds] = useState(new Set())

  async function refresh() {
    const [cIds, wIds, uIds] = await Promise.all([
      getCollectionVariationIds(),
      getWishlistVariationIds(),
      getUpgradeWantedVariationIds(),
    ])
    setCollectionIds(new Set(cIds))
    setWishlistIds(new Set(wIds))
    setUpgradeWantedIds(new Set(uIds))
  }

  function addToCollectionIds(variationId) {
    setCollectionIds(prev => new Set([...prev, variationId]))
  }

  function addToWishlistIds(variationId) {
    setWishlistIds(prev => new Set([...prev, variationId]))
  }

  function removeFromWishlistIds(variationId) {
    setWishlistIds(prev => { const next = new Set(prev); next.delete(variationId); return next })
  }

  useEffect(() => { refresh() }, [])

  return (
    <CatalogueStatusContext.Provider value={{ collectionIds, wishlistIds, upgradeWantedIds, refresh, addToCollectionIds, addToWishlistIds, removeFromWishlistIds }}>
      {children}
    </CatalogueStatusContext.Provider>
  )
}

export default function StampRow({ stamp }) {
  const [open, setOpen] = useState(false)
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [showWishlistModal, setShowWishlistModal] = useState(false)
  const [modalVariation, setModalVariation] = useState(null)
  const { collectionIds, wishlistIds, upgradeWantedIds, addToCollectionIds, addToWishlistIds, removeFromWishlistIds } = useContext(CatalogueStatusContext)

  const variations = stamp.stamp_variations || []
  const baseVariation = variations.find(v => v.sg_sub_number === stamp.sg_number) || variations[0]

  const mintValue = baseVariation?.sg_cat_value_mint
  const usedValue = baseVariation?.sg_cat_value_used
  const isSet = stamp.sg_number.includes('/')
  const stampTypeNumber = stamp.type_number

  const inCollection = baseVariation && collectionIds.has(baseVariation.id)
  const inWishlist = baseVariation && wishlistIds.has(baseVariation.id) && !inCollection
  const isUpgradeWanted = baseVariation && upgradeWantedIds.has(baseVariation.id)

  let rowBg = open ? '#f0f2f6' : '#fff'
  if (inCollection && isUpgradeWanted) rowBg = open ? '#fdf5e0' : '#fffbf0'
  else if (inCollection) rowBg = open ? '#e0f0e0' : '#edf7ed'
  else if (inWishlist) rowBg = open ? '#f7e0e4' : '#fdf0f2'

  let borderLeft = isSet ? '3px solid #293451' : 'none'
  if (inCollection && isUpgradeWanted) borderLeft = '3px solid #a3925f'
  else if (inCollection) borderLeft = '3px solid #4caf50'
  else if (inWishlist) borderLeft = '3px solid #e57373'

  function openCollectionModal(e, variation) {
    e.stopPropagation()
    setModalVariation(variation)
    setShowCollectionModal(true)
  }

  async function handleWishlistToggle(e, variation) {
    e.stopPropagation()
    if (wishlistIds.has(variation.id)) {
      removeFromWishlistIds(variation.id)
      await removeFromWishlistByVariation(variation.id)
    } else {
      setModalVariation(variation)
      setShowWishlistModal(true)
    }
  }

  return (
    <>
      <div
        id={stampTypeNumber ? 'stamp-type-' + stampTypeNumber : undefined}
        onClick={() => setOpen(!open)}
        style={{
          display: 'grid',
          gridTemplateColumns: '72px 60px 1fr 110px 110px 28px 28px 28px',
          padding: '12px 20px',
          borderBottom: '0.5px solid #eee',
          cursor: 'pointer',
          alignItems: 'center',
          background: rowBg,
          borderLeft,
          transition: 'background 0.15s',
        }}
      >
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: isSet ? '#293451' : '#222' }}>
          {isSet ? (
            <span style={{ background: '#293451', color: '#fff', padding: '2px 8px', borderRadius: '3px', fontSize: '10px', fontWeight: '600', letterSpacing: '0.04em' }}>SET</span>
          ) : stamp.sg_number}
        </div>
        <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#555' }}>{stamp.denomination}</div>
        <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#222', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {stamp.colour_primary}
          {stampTypeNumber && (
            <span style={{ fontSize: '10px', padding: '2px 7px', background: '#eaecf2', color: '#293451', borderRadius: '3px', border: '0.5px solid #293451', fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}>T{stampTypeNumber}</span>
          )}
          {isUpgradeWanted && (
            <span style={{ fontSize: '10px', padding: '2px 7px', background: '#fff3dc', color: '#b87520', borderRadius: '3px', border: '0.5px solid #a3925f', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', whiteSpace: 'nowrap' }}>Seeking upgrade</span>
          )}
        </div>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '500', color: '#1a5c1a', textAlign: 'right' }}>
          {mintValue ? '£' + parseFloat(mintValue).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
        </div>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '500', color: '#7a3d00', textAlign: 'right' }}>
          {usedValue ? '£' + parseFloat(usedValue).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
        </div>
        <div style={{ textAlign: 'center' }}>
          <button onClick={e => openCollectionModal(e, baseVariation)} title="Add to collection" style={{ background: 'none', border: '0.5px solid #293451', borderRadius: '4px', color: '#293451', width: '22px', height: '22px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, lineHeight: 1 }}>+</button>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button onClick={e => handleWishlistToggle(e, baseVariation)} title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'} style={{ background: 'none', border: 'none', color: inWishlist ? '#e57373' : '#ccc', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, lineHeight: 1 }}>
            {inWishlist ? '♥' : '♡'}
          </button>
        </div>
        <div style={{ textAlign: 'right', color: '#aaa', fontSize: '14px', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#8964;</div>
      </div>

      {variations.filter(v => v.sg_sub_number !== stamp.sg_number).map(variation => (
        <VariationRow
          key={variation.id}
          stamp={stamp}
          variation={variation}
          inCollection={collectionIds.has(variation.id)}
          inWishlist={wishlistIds.has(variation.id) && !collectionIds.has(variation.id)}
          isUpgradeWanted={upgradeWantedIds.has(variation.id)}
          onAddToCollection={e => openCollectionModal(e, variation)}
          onWishlistToggle={e => handleWishlistToggle(e, variation)}
        />
      ))}

      {open && <StampDropdown stamp={stamp} variation={baseVariation} />}

      {showCollectionModal && (
        <AddToCollectionModal
          stamp={stamp}
          variation={modalVariation}
          onClose={() => setShowCollectionModal(false)}
          onAdded={() => {
            setShowCollectionModal(false)
            if (modalVariation?.id) {
              addToCollectionIds(modalVariation.id)
              removeFromWishlistIds(modalVariation.id)
              removeFromWishlistByVariation(modalVariation.id)
            }
          }}
        />
      )}
      {showWishlistModal && (
        <AddToWishlistModal
          stamp={stamp}
          variation={modalVariation}
          onClose={() => setShowWishlistModal(false)}
          onAdded={() => {
            setShowWishlistModal(false)
            if (modalVariation?.id) addToWishlistIds(modalVariation.id)
          }}
        />
      )}
    </>
  )
}

function VariationRow({ stamp, variation, inCollection, inWishlist, isUpgradeWanted, onAddToCollection, onWishlistToggle }) {
  const [open, setOpen] = useState(false)

  let rowBg = open ? '#fff5e6' : '#fffaf4'
  if (inCollection && isUpgradeWanted) rowBg = open ? '#fdf5e0' : '#fffbf0'
  else if (inCollection) rowBg = open ? '#e0f0e0' : '#edf7ed'
  else if (inWishlist) rowBg = open ? '#f7e0e4' : '#fdf0f2'

  const borderLeft = inCollection && isUpgradeWanted ? '3px solid #a3925f' : inCollection ? '3px solid #4caf50' : inWishlist ? '3px solid #e57373' : '3px solid #a3925f'

  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'grid',
          gridTemplateColumns: '72px 60px 1fr 110px 110px 28px 28px 28px',
          padding: '11px 20px',
          borderBottom: '0.5px solid #eee',
          cursor: 'pointer',
          alignItems: 'center',
          background: rowBg,
          borderLeft,
          transition: 'background 0.15s',
        }}
      >
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '600', color: '#b87520' }}>{variation.sg_sub_number}</div>
        <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#555' }}>{stamp.denomination}</div>
        <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#222', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {variation.colour_shade || variation.variation_type || stamp.colour_primary}
          {isUpgradeWanted && (
            <span style={{ fontSize: '10px', padding: '2px 7px', background: '#fff3dc', color: '#b87520', borderRadius: '3px', border: '0.5px solid #a3925f', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', whiteSpace: 'nowrap' }}>Seeking upgrade</span>
          )}
        </div>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '500', color: '#1a5c1a', textAlign: 'right' }}>
          {variation.sg_cat_value_mint ? '£' + parseFloat(variation.sg_cat_value_mint).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
        </div>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: '500', color: '#7a3d00', textAlign: 'right' }}>
          {variation.sg_cat_value_used ? '£' + parseFloat(variation.sg_cat_value_used).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
        </div>
        <div style={{ textAlign: 'center' }}>
          <button onClick={onAddToCollection} title="Add to collection" style={{ background: 'none', border: '0.5px solid #a3925f', borderRadius: '4px', color: '#b87520', width: '22px', height: '22px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, lineHeight: 1 }}>+</button>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button onClick={onWishlistToggle} title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'} style={{ background: 'none', border: 'none', color: inWishlist ? '#e57373' : '#ccc', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, lineHeight: 1 }}>
            {inWishlist ? '♥' : '♡'}
          </button>
        </div>
        <div style={{ textAlign: 'right', color: '#aaa', fontSize: '14px', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#8964;</div>
      </div>
      {open && <StampDropdown stamp={stamp} variation={variation} />}
    </>
  )
}
