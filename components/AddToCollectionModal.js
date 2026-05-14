'use client'

import { useState, useRef } from 'react'
import { addToCollection } from '../lib/collection'

export default function AddToCollectionModal({ stamp, variation, onClose, onAdded }) {
  const [condition, setCondition] = useState('Mint')
  const [pricePaid, setPricePaid] = useState('')
  const [notes, setNotes] = useState('')
  const [auctionUrl, setAuctionUrl] = useState('')
  const [itemType, setItemType] = useState('single')
  const [quantity, setQuantity] = useState(1)
  const [upgradeWanted, setUpgradeWanted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const sgNum = variation ? variation.sg_sub_number : stamp?.sg_number
  const desc = variation ? (variation.colour_shade || stamp?.colour_primary || '') : (stamp?.colour_primary || '')
  const denom = stamp?.denomination || ''
  const singleCatValue = condition === 'Mint' ? variation?.sg_cat_value_mint : variation?.sg_cat_value_used
  const totalCatValue = singleCatValue ? parseFloat(singleCatValue) * quantity : null

  function adjustQty(delta) { setQuantity(prev => Math.max(1, prev + delta)) }

  function handlePhotoFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = e => setPhoto(e.target.result)
    reader.readAsDataURL(file)
  }

  function removePhoto() {
    setPhoto(null); setPhotoFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSave() {
    if (!variation?.id) return
    setSaving(true)
    const result = await addToCollection({
      variationId: variation.id, condition,
      pricePaid: pricePaid ? parseFloat(pricePaid) : null,
      notes: notes.trim() || null, quantity, itemType,
      auctionUrl: auctionUrl.trim() || null,
      upgradeWanted,
      photoData: photo || null,
    })
    setSaving(false)
    if (result) {
      if (onAdded) onAdded({ ...result, photoData: photo })
      onClose()
    }
  }

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '6px', border: '0.5px solid #ddd', fontFamily: 'Open Sans, sans-serif', fontSize: '13px', outline: 'none', color: '#222', boxSizing: 'border-box' }
  const labelStyle = { fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'block' }
  const ITEM_TYPES = [{ value: 'single', label: 'Single' }, { value: 'multiple', label: 'Multiple' }, { value: 'cover', label: 'Cover' }, { value: 'proof', label: 'Proof' }]

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: '10px', width: '100%', maxWidth: '460px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>

        <div style={{ background: '#293451', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1 }}>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#a3925f', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>Add to My Collection</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '600', color: '#fff' }}>SG {sgNum} {denom && '· ' + denom}</div>
            {desc && <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{desc}</div>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '20px', cursor: 'pointer', padding: '4px', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: '24px' }}>

          {/* Condition */}
          <div style={{ marginBottom: '20px' }}>
            <span style={labelStyle}>Condition</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Mint', 'Used'].map(c => (
                <button key={c} onClick={() => setCondition(c)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: condition === c ? '2px solid #293451' : '1px solid #ddd', background: condition === c ? '#eaecf2' : '#fff', color: condition === c ? '#293451' : '#666', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Cat value */}
          {singleCatValue && (
            <div style={{ background: '#f0f2f6', borderRadius: '6px', padding: '12px 16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#666' }}>SG catalogue value ({condition}{quantity > 1 ? ' × ' + quantity : ''})</span>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: '600', color: '#293451' }}>{'£' + (totalCatValue || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}

          {/* Item type */}
          <div style={{ marginBottom: '20px' }}>
            <span style={labelStyle}>Item type</span>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              {ITEM_TYPES.map(({ value, label }) => (
                <button key={value} onClick={() => { setItemType(value); if (value !== 'multiple') setQuantity(1) }} style={{ flex: 1, padding: '9px', borderRadius: '6px', border: itemType === value ? '2px solid #293451' : '1px solid #ddd', background: itemType === value ? '#eaecf2' : '#fff', color: itemType === value ? '#293451' : '#666', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>{label}</button>
              ))}
            </div>
            {itemType === 'multiple' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: '#666' }}>Number of stamps:</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '0.5px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
                  <button onClick={() => adjustQty(-1)} style={{ width: '36px', height: '36px', border: 'none', background: '#f5f5f3', color: '#444', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <div style={{ width: '48px', textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontSize: '15px', fontWeight: '600', color: '#293451' }}>{quantity}</div>
                  <button onClick={() => adjustQty(1)} style={{ width: '36px', height: '36px', border: 'none', background: '#f5f5f3', color: '#444', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
              </div>
            )}
          </div>

          {/* Would upgrade toggle */}
          <div style={{ marginBottom: '20px', padding: '14px 16px', borderRadius: '8px', border: upgradeWanted ? '1.5px solid #a3925f' : '0.5px solid #eee', background: upgradeWanted ? '#f8f6f0' : '#fafafa', cursor: 'pointer', transition: 'all 0.15s' }} onClick={() => setUpgradeWanted(v => !v)}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: upgradeWanted ? '#b87520' : '#555', marginBottom: '2px' }}>
                  {upgradeWanted ? '⬆ Would upgrade this copy' : 'Would upgrade this copy?'}
                </div>
                <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '11px', color: '#aaa' }}>
                  Mark if you'd replace this with a better example. It'll also be added to your wishlist.
                </div>
              </div>
              <div style={{ width: '36px', height: '20px', borderRadius: '10px', background: upgradeWanted ? '#a3925f' : '#ddd', position: 'relative', flexShrink: 0, transition: 'background 0.2s', marginLeft: '12px' }}>
                <div style={{ position: 'absolute', top: '2px', left: upgradeWanted ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </div>
            </div>
          </div>

          {/* Photo upload */}
          <div style={{ marginBottom: '20px' }}>
            <span style={labelStyle}>Photo (optional)</span>
            {photo ? (
              <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '0.5px solid #ddd' }}>
                <img src={photo} alt="Stamp preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', display: 'block', background: '#f9f9f9' }} />
                <button onClick={removePhoto} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', color: '#fff', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>×</button>
              </div>
            ) : (
              <div onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); handlePhotoFile(e.dataTransfer.files[0]) }} onClick={() => fileInputRef.current?.click()} style={{ border: dragOver ? '2px dashed #293451' : '2px dashed #ddd', borderRadius: '8px', padding: '28px 16px', textAlign: 'center', cursor: 'pointer', background: dragOver ? '#f0f2f6' : '#fafafa', transition: 'all 0.15s' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📷</div>
                <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: '600', color: '#293451', marginBottom: '4px' }}>Upload a photo</div>
                <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: '#aaa' }}>Drag and drop or click to browse</div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={e => handlePhotoFile(e.target.files[0])} style={{ display: 'none' }} />
          </div>

          {/* Price paid */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Price paid (£)</label>
            <input type="number" value={pricePaid} onChange={e => setPricePaid(e.target.value)} placeholder="e.g. 125.00" min="0" step="0.01" style={inputStyle} />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Superb unmounted mint, BPA certificate, corner marginal..." rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }} />
          </div>

          {/* Auction URL */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Auction URL (optional)</label>
            <input type="url" value={auctionUrl} onChange={e => setAuctionUrl(e.target.value)} placeholder="e.g. https://sgbaldwins.com/auctions/..." style={inputStyle} />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: '6px', border: '0.5px solid #ddd', background: '#fff', color: '#666', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: '11px', borderRadius: '6px', border: 'none', background: saving ? '#aaa' : '#293451', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', cursor: saving ? 'default' : 'pointer' }}>
              {saving ? 'Saving...' : 'Add to collection'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
