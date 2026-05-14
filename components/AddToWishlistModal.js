'use client'

import { useState } from 'react'
import { addToWishlist } from '../lib/wishlist'

export default function AddToWishlistModal({ stamp, variation, onClose, onAdded }) {
  const [condition, setCondition] = useState('Mint')
  const [saving, setSaving] = useState(false)

  const sgNum = variation ? variation.sg_sub_number : stamp?.sg_number
  const desc = variation ? (variation.colour_shade || stamp?.colour_primary || '') : (stamp?.colour_primary || '')
  const denom = stamp?.denomination || ''

  async function handleSave() {
    if (!variation?.id) return
    setSaving(true)
    const result = await addToWishlist({ variationId: variation.id, condition })
    setSaving(false)
    if (result) {
      if (onAdded) onAdded(result)
      onClose()
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: '10px', width: '100%', maxWidth: '380px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>

        <div style={{ background: '#7a1a2e', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>Add to Wishlist</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '16px', fontWeight: '600', color: '#fff' }}>SG {sgNum} {denom && '· ' + denom}</div>
            {desc && <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{desc}</div>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '20px', cursor: 'pointer', padding: '4px', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Condition wanted</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Mint', 'Used', 'Either'].map(c => (
                <button key={c} onClick={() => setCondition(c)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: condition === c ? '2px solid #7a1a2e' : '1px solid #ddd', background: condition === c ? '#fdf0f2' : '#fff', color: condition === c ? '#7a1a2e' : '#666', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: '6px', border: '0.5px solid #ddd', background: '#fff', color: '#666', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: '11px', borderRadius: '6px', border: 'none', background: saving ? '#aaa' : '#7a1a2e', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '13px', cursor: saving ? 'default' : 'pointer' }}>
              {saving ? 'Saving...' : '♥ Add to wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
