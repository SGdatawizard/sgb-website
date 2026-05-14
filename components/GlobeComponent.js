'use client'

import { useEffect, useRef, useState } from 'react'

const COUNTRIES = [
  { iso: 'GB', name: 'Great Britain', lat: 52.5, lng: -1.5 },
  { iso: 'FK', name: 'Falkland Islands', lat: -51.7, lng: -59.0 },
  { iso: 'BM', name: 'Bermuda', lat: 32.3, lng: -64.8 },
]

// Satellite texture sources — tried in order until one loads
const TEXTURE_SOURCES = [
  'https://eoimages.gsfc.nasa.gov/images/imagerecords/74000/74117/world.200408.3x5400x2700.jpg',
  'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
  'https://unpkg.com/three@0.128.0/examples/textures/planets/earth_atmos_2048.jpg',
]

function latLngToXYZ(lat, lng, r) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return {
    x: -(r * Math.sin(phi) * Math.cos(theta)),
    y: r * Math.cos(phi),
    z: r * Math.sin(phi) * Math.sin(theta),
  }
}

function project(lat, lng, W, H) {
  return [((lng + 180) / 360) * W, ((90 - lat) / 180) * H]
}

// Minimal TopoJSON → GeoJSON decoder
function topoToGeo(topology, object) {
  const arcs = topology.arcs
  const scale = topology.transform?.scale || [1, 1]
  const translate = topology.transform?.translate || [0, 0]

  function decodeArc(arcIndex) {
    const reverse = arcIndex < 0
    const arc = arcs[reverse ? ~arcIndex : arcIndex]
    const coords = []
    let x = 0, y = 0
    for (const [dx, dy] of arc) {
      x += dx; y += dy
      coords.push([x * scale[0] + translate[0], y * scale[1] + translate[1]])
    }
    return reverse ? coords.reverse() : coords
  }

  function decodeRings(rings) {
    return rings.map(ring => {
      const coords = []
      for (const arcIdx of ring) {
        const decoded = decodeArc(arcIdx)
        coords.push(...(coords.length ? decoded.slice(1) : decoded))
      }
      return coords
    })
  }

  function convertGeometry(geo) {
    if (geo.type === 'Polygon') return { type: 'Polygon', coordinates: decodeRings(geo.arcs) }
    if (geo.type === 'MultiPolygon') return { type: 'MultiPolygon', coordinates: geo.arcs.map(decodeRings) }
    return null
  }

  return {
    type: 'FeatureCollection',
    features: object.geometries
      .map(g => ({ type: 'Feature', properties: g.properties || {}, geometry: convertGeometry(g) }))
      .filter(f => f.geometry),
  }
}

// Fallback canvas texture (used if satellite image fails to load)
function buildFallbackTexture(geojson) {
  const TW = 4096, TH = 2048
  const tc = document.createElement('canvas')
  tc.width = TW; tc.height = TH
  const ctx = tc.getContext('2d')

  // Deep ocean
  const ocean = ctx.createLinearGradient(0, 0, 0, TH)
  ocean.addColorStop(0, '#1a3a5c')
  ocean.addColorStop(0.5, '#0f2840')
  ocean.addColorStop(1, '#0a1e30')
  ctx.fillStyle = ocean
  ctx.fillRect(0, 0, TW, TH)

  if (geojson) {
    const drawRing = (coords) => {
      if (!coords || coords.length < 2) return
      ctx.beginPath()
      const [sx, sy] = project(coords[0][1], coords[0][0], TW, TH)
      ctx.moveTo(sx, sy)
      for (let i = 1; i < coords.length; i++) {
        const [x, y] = project(coords[i][1], coords[i][0], TW, TH)
        const [px] = project(coords[i - 1][1], coords[i - 1][0], TW, TH)
        if (Math.abs(x - px) > TW * 0.5) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }
    const drawGeo = (geo) => {
      if (!geo) return
      if (geo.type === 'Polygon') geo.coordinates.forEach(drawRing)
      else if (geo.type === 'MultiPolygon') geo.coordinates.forEach(p => p.forEach(drawRing))
    }
    ctx.fillStyle = '#2d5a27'
    ctx.strokeStyle = '#1e3d1a'
    ctx.lineWidth = 0.8
    geojson.features.forEach(f => drawGeo(f.geometry))
  }

  // Subtle grid
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 0.5
  for (let lat = -80; lat <= 80; lat += 20) {
    const [, y] = project(lat, 0, TW, TH)
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(TW, y); ctx.stroke()
  }
  for (let lng = -180; lng <= 160; lng += 20) {
    const [x] = project(0, lng, TW, TH)
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, TH); ctx.stroke()
  }
  return tc
}

// Randomly placed star dots rendered on a canvas overlay
function StarField() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const W = canvas.offsetWidth, H = canvas.offsetHeight
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')
    for (let i = 0; i < 280; i++) {
      const x = Math.random() * W
      const y = Math.random() * H
      const r = Math.random() < 0.08 ? Math.random() * 1.2 + 0.6 : Math.random() * 0.7 + 0.2
      const alpha = (Math.random() * 0.5 + 0.3).toFixed(2)
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${alpha})`
      ctx.fill()
    }
  }, [])
  return (
    <canvas
      ref={ref}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}

// Creates a pin mesh: a sphere head on a tapered stem
function createPinMesh(THREE) {
  const group = new THREE.Group()

  // Pin head (sphere)
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.028, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xFFAE55 })
  )
  head.position.set(0, 0.06, 0)
  group.add(head)

  // Pin stem (thin cone pointing inward)
  const stem = new THREE.Mesh(
    new THREE.ConeGeometry(0.008, 0.065, 8),
    new THREE.MeshBasicMaterial({ color: 0x02393A })
  )
  // Cone tip points toward globe centre (negative Y in local space)
  stem.rotation.x = Math.PI
  stem.position.set(0, 0.026, 0)
  group.add(stem)

  return group
}

export default function GlobeComponent({ onCountrySelect }) {
  const mountRef = useRef(null)
  const [threeLoaded, setThreeLoaded] = useState(false)
  const [geoData, setGeoData] = useState(null)
  const [geoReady, setGeoReady] = useState(false)
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  // Load Three.js
  useEffect(() => {
    if (window.THREE) { setThreeLoaded(true); return }
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    s.onload = () => setThreeLoaded(true)
    document.head.appendChild(s)
  }, [])

  // Load world TopoJSON fallback data
  useEffect(() => {
    fetch('https://unpkg.com/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(topo => {
        setGeoData(topoToGeo(topo, topo.objects.countries))
        setGeoReady(true)
      })
      .catch(() => setGeoReady(true))
  }, [])

  useEffect(() => {
    if (!threeLoaded || !geoReady || !mountRef.current) return
    const THREE = window.THREE
    const el = mountRef.current
    const W = el.clientWidth
    const H = el.clientHeight
    const RADIUS = 1

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 1000)
    camera.position.z = 2.9

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)

    // ── Texture: try satellite image, fall back to canvas ──────────
    const globeMat = new THREE.MeshPhongMaterial({
      specular: new THREE.Color(0x111a22),  // very dark = almost no glare
      shininess: 6,                          // low = matte/diffuse look
    })

    const loader = new THREE.TextureLoader()
    let sourceIdx = 0

    function tryNextTexture() {
      if (sourceIdx >= TEXTURE_SOURCES.length) {
        // All failed — use canvas fallback
        globeMat.map = new THREE.CanvasTexture(buildFallbackTexture(geoData))
        globeMat.needsUpdate = true
        return
      }
      loader.load(
        TEXTURE_SOURCES[sourceIdx++],
        (tex) => {
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy()
          globeMat.map = tex
          globeMat.needsUpdate = true
        },
        undefined,
        () => tryNextTexture()  // on error, try next
      )
    }
    tryNextTexture()

    // Globe mesh
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 96, 96),
      globeMat
    )
    scene.add(globe)

    // Atmosphere rim — more visible against dark bg
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 1.02, 64, 64),
      new THREE.MeshPhongMaterial({
        color: 0x4499cc,
        transparent: true,
        opacity: 0.13,
        side: THREE.FrontSide,
        depthWrite: false,
      })
    ))
    // Thin outer halo
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 1.04, 64, 64),
      new THREE.MeshPhongMaterial({
        color: 0x2266aa,
        transparent: true,
        opacity: 0.05,
        side: THREE.FrontSide,
        depthWrite: false,
      })
    ))

    // Lighting: strong key from upper-right, cooler fill
    scene.add(new THREE.AmbientLight(0xffffff, 0.45))
    const sun = new THREE.DirectionalLight(0xfff5e8, 1.1)
    sun.position.set(5, 2, 4)
    scene.add(sun)
    const fill = new THREE.DirectionalLight(0x3355aa, 0.15)
    fill.position.set(-4, -1, -3)
    scene.add(fill)

    // ── Pin markers ────────────────────────────────────────────────
    const markerGroup = new THREE.Group()
    scene.add(markerGroup)

    const hitMeshes = []   // spheres used for raycasting
    const pins = []

    COUNTRIES.forEach((country, idx) => {
      const surfacePos = latLngToXYZ(country.lat, country.lng, RADIUS)
      const normal = new THREE.Vector3(surfacePos.x, surfacePos.y, surfacePos.z).normalize()

      // Position pin so the stem tip sits on the surface
      const pinPos = normal.clone().multiplyScalar(RADIUS + 0.065)

      const pin = createPinMesh(THREE)
      pin.position.copy(pinPos)

      // Orient pin so its local -Y points toward globe centre
      pin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal)

      pin.userData = { iso: country.iso, name: country.name, idx }
      markerGroup.add(pin)

      // Invisible hit sphere around the pin head for easy raycasting
      const hitSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 8, 8),
        new THREE.MeshBasicMaterial({ visible: false })
      )
      const headWorldPos = normal.clone().multiplyScalar(RADIUS + 0.12)
      hitSphere.position.copy(headWorldPos)
      hitSphere.userData = { iso: country.iso, name: country.name, idx }
      markerGroup.add(hitSphere)

      hitMeshes.push(hitSphere)
      pins.push({ pin, hitSphere, idx })
    })

    // ── Interaction ────────────────────────────────────────────────
    let isDragging = false, prev = { x: 0, y: 0 }, velY = 0, autoRotate = true
    const canvas = renderer.domElement
    canvas.style.cursor = 'grab'
    const raycaster = new THREE.Raycaster()

    const toNDC = e => {
      const r = el.getBoundingClientRect()
      return { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: -((e.clientY - r.top) / r.height) * 2 + 1 }
    }
    const syncMarkers = () => {
      markerGroup.rotation.y = globe.rotation.y
      markerGroup.rotation.x = globe.rotation.x
    }

    const onDown = e => {
      isDragging = true; autoRotate = false; velY = 0
      prev = { x: e.clientX, y: e.clientY }
      canvas.style.cursor = 'grabbing'
    }
    const onMove = e => {
      if (isDragging) {
        const dx = e.clientX - prev.x, dy = e.clientY - prev.y
        velY = dx * 0.004
        globe.rotation.y += velY
        globe.rotation.x += dy * 0.004
        syncMarkers()
        prev = { x: e.clientX, y: e.clientY }
        // Clear tooltip while dragging
        setHoveredCountry(null)
      } else {
        raycaster.setFromCamera(toNDC(e), camera)
        const hits = raycaster.intersectObjects(hitMeshes)
        if (hits.length > 0) {
          const { name } = hits[0].object.userData
          const rect = el.getBoundingClientRect()
          setHoveredCountry(name)
          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
          canvas.style.cursor = 'pointer'
        } else {
          setHoveredCountry(null)
          canvas.style.cursor = 'grab'
        }
      }
    }
    const onUp = () => { isDragging = false; canvas.style.cursor = 'grab' }
    const onLeave = () => setHoveredCountry(null)
    const onWheel = e => {
      e.preventDefault()
      camera.position.z = Math.max(1.6, Math.min(5.5, camera.position.z + e.deltaY * 0.003))
    }
    const onClick = e => {
      raycaster.setFromCamera(toNDC(e), camera)
      const hits = raycaster.intersectObjects(hitMeshes)
      if (hits.length > 0 && onCountrySelect) onCountrySelect(hits[0].object.userData.iso)
    }

    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseup', onUp)
    canvas.addEventListener('mouseleave', onLeave)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('click', onClick)

    let raf, t = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      t += 0.016
      if (autoRotate) {
        globe.rotation.y += 0.0018
        syncMarkers()
      } else if (!isDragging && Math.abs(velY) > 0.0001) {
        globe.rotation.y += velY
        syncMarkers()
        velY *= 0.95
      }

      // Gentle pin head pulse
      pins.forEach(({ pin, idx }) => {
        const head = pin.children[0]
        const s = 1 + 0.12 * Math.sin(t * 1.8 + idx * 2.1)
        head.scale.setScalar(s)
      })

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('mouseleave', onLeave)
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('click', onClick)
      if (el.contains(canvas)) el.removeChild(canvas)
      renderer.dispose()
    }
  }, [threeLoaded, geoReady, geoData, onCountrySelect])

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: 'radial-gradient(ellipse at 60% 40%, #1a2744 0%, #0c1628 50%, #050a14 100%)',
      overflow: 'hidden',
    }}>

      {/* Star field */}
      <StarField />

      {/* Radial glow behind globe */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '520px',
        height: '520px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,120,200,0.13) 0%, rgba(30,70,140,0.06) 50%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {(!threeLoaded || !geoReady) && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Open Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.4)',
        }}>
          Loading globe…
        </div>
      )}

      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Hover tooltip */}
      {hoveredCountry && (
        <div style={{
          position: 'absolute',
          left: tooltipPos.x + 14,
          top: tooltipPos.y - 36,
          background: 'rgba(255,174,85,0.95)',
          color: '#1a0e00',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          padding: '6px 12px',
          borderRadius: '6px',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          {hoveredCountry}
          <div style={{
            position: 'absolute',
            bottom: '-5px',
            left: '12px',
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid rgba(255,174,85,0.95)',
          }} />
        </div>
      )}

      {/* Hint */}
      <div style={{
        position: 'absolute', top: '16px', right: '20px',
        fontFamily: 'Open Sans, sans-serif', fontSize: '11px',
        color: 'rgba(255,255,255,0.25)', letterSpacing: '0.04em',
      }}>
        Drag · Scroll · Click a pin
      </div>
    </div>
  )
}
