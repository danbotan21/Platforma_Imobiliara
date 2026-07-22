import { useEffect, useMemo, useState } from 'react'
import { money, properties, type ListingMode, type SharedPageProps } from '../data'

export function MapPage({ navigate, notify }: SharedPageProps) {
  const [mode, setMode] = useState<ListingMode>('rent')
  const [selectedId, setSelectedId] = useState(properties[0].id)
  const [query, setQuery] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [zoom, setZoom] = useState(1)

  const visible = useMemo(() => properties.filter((property) => {
    if (property.mode !== mode) return false
    if (verifiedOnly && !property.verified) return false
    if (query.trim() && !`${property.address} ${property.district} ${property.complex}`.toLocaleLowerCase('ro-RO').includes(query.trim().toLocaleLowerCase('ro-RO'))) return false
    return true
  }), [mode, query, verifiedOnly])

  useEffect(() => {
    if (!visible.some((property) => property.id === selectedId)) setSelectedId(visible[0]?.id ?? '')
  }, [selectedId, visible])

  const selected = visible.find((property) => property.id === selectedId) ?? visible[0]
  const setListingMode = (nextMode: ListingMode) => {
    setMode(nextMode)
    setQuery('')
    setSelectedId(properties.find((property) => property.mode === nextMode)?.id ?? '')
  }
  const pinPosition = (value: number) => 50 + (value - 50) * zoom

  const locate = () => {
    const nearest = visible.reduce((best, property) => {
      const distance = Math.hypot(property.mapX - 50, property.mapY - 50)
      return !best || distance < best.distance ? { property, distance } : best
    }, null as { property: (typeof properties)[number]; distance: number } | null)
    if (nearest) {
      setSelectedId(nearest.property.id)
      notify(`Am centrat harta pe ${nearest.property.address}.`)
    } else notify('Nu există proprietăți pentru filtrele curente.')
  }

  return (
    <div className="full-map-page">
      <aside className="map-sidebar">
        <div className="map-sidebar-head"><div className="breadcrumb"><button type="button" onClick={() => navigate('/')}>Acasă</button><span>/</span><strong>Hartă</strong></div><h1>Proprietăți pe hartă</h1><div className="mode-tabs"><button className={mode === 'rent' ? 'active' : ''} type="button" onClick={() => setListingMode('rent')}>Chirie</button><button className={mode === 'sale' ? 'active' : ''} type="button" onClick={() => setListingMode('sale')}>Vânzare</button></div><label className="search-field"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Caută o zonă sau adresă" /></label></div>
        <div className="map-sidebar-results"><div className="map-result-meta"><strong>{visible.length} proprietăți</strong><button className={verifiedOnly ? 'active' : ''} type="button" onClick={() => setVerifiedOnly((current) => !current)}>{verifiedOnly ? 'Doar verificate' : 'Filtre'}</button></div>{visible.length ? visible.map((property) => <button className={selected?.id === property.id ? 'map-listing active' : 'map-listing'} type="button" onClick={() => setSelectedId(property.id)} key={property.id}><img src={property.image} alt="" /><div><span>{property.mode === 'rent' ? 'De închiriat' : 'De vânzare'} · {property.district}</span><strong>{money(property.price)}{property.mode === 'rent' && '/lună'}</strong><p>{property.address}</p><small>★ {property.rating} · {property.rooms} camere · {property.area} m²</small></div></button>) : <div className='empty-state'><span>⌖</span><h2>Nicio proprietate</h2><p>Elimină filtrul sau caută o altă adresă.</p><button type='button' onClick={() => { setQuery(''); setVerifiedOnly(false) }}>Resetează</button></div>}</div>
      </aside>
      <main className="large-map">
        <div className="map-streets" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}><i /><i /><i /><i /><i /></div>
        <span className="district-name d-centru">Centru</span><span className="district-name d-riscani">Râșcani</span><span className="district-name d-botanica">Botanica</span><span className="district-name d-buiucani">Buiucani</span>
        {visible.map((property) => <button className={`map-price-pin ${property.mode}${selected?.id === property.id ? ' selected' : ''}`} style={{ left: `${pinPosition(property.mapX)}%`, top: `${pinPosition(property.mapY)}%` }} type="button" onClick={() => setSelectedId(property.id)} key={property.id}>{property.mode === 'rent' ? `€${property.price}` : `€${Math.round(property.price / 1000)}k`}</button>)}
        {selected && <div className="map-floating-card"><img src={selected.image} alt={`Apartament ${selected.address}`} /><div><span>{selected.mode === 'rent' ? 'De închiriat' : 'De vânzare'} · {selected.district}</span><strong>{money(selected.price)}{selected.mode === 'rent' && '/lună'}</strong><p>{selected.address}</p><small>★ {selected.rating} · {selected.rooms} camere · {selected.area} m²</small><button type="button" onClick={() => navigate(`/proprietate/${selected.slug}`)}>Vezi detalii →</button></div></div>}
        <div className="map-controls"><button type="button" aria-label="Mărește harta" disabled={zoom >= 1.45} onClick={() => setZoom((current) => Math.min(1.45, Number((current + 0.15).toFixed(2))))}>+</button><button type="button" aria-label="Micșorează harta" disabled={zoom <= 0.7} onClick={() => setZoom((current) => Math.max(0.7, Number((current - 0.15).toFixed(2))))}>−</button><button type="button" aria-label="Centrează pe locația mea" onClick={locate}>⌖</button></div>
        <div className="map-legend"><span><i className="rent-dot" /> Chirie</span><span><i className="sale-dot" /> Vânzare</span><small>Zoom {Math.round(zoom * 100)}% · Date demonstrative</small></div>
      </main>
    </div>
  )
}
