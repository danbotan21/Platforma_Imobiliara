import { useState } from 'react'
import { money, properties, type ListingMode, type SharedPageProps } from '../data'

export function MapPage({ navigate }: SharedPageProps) {
  const [mode, setMode] = useState<ListingMode>('rent')
  const [selected, setSelected] = useState(properties[0])
  const visible = properties.filter((property) => property.mode === mode)

  return (
    <div className="full-map-page">
      <aside className="map-sidebar">
        <div className="map-sidebar-head"><div className="breadcrumb"><button type="button" onClick={() => navigate('/')}>Acasă</button><span>/</span><strong>Hartă</strong></div><h1>Proprietăți pe hartă</h1><div className="mode-tabs"><button className={mode === 'rent' ? 'active' : ''} type="button" onClick={() => { setMode('rent'); setSelected(properties[0]) }}>Chirie</button><button className={mode === 'sale' ? 'active' : ''} type="button" onClick={() => { setMode('sale'); setSelected(properties[1]) }}>Vânzare</button></div><label className="search-field"><span>⌕</span><input placeholder="Caută o zonă sau adresă" /></label></div>
        <div className="map-sidebar-results"><div className="map-result-meta"><strong>{visible.length} proprietăți</strong><button type="button">Filtre</button></div>{visible.map((property) => <button className={selected.id === property.id ? 'map-listing active' : 'map-listing'} type="button" onClick={() => setSelected(property)} key={property.id}><img src={property.image} alt="" /><div><span>{property.mode === 'rent' ? 'De închiriat' : 'De vânzare'} · {property.district}</span><strong>{money(property.price)}{property.mode === 'rent' && '/lună'}</strong><p>{property.address}</p><small>★ {property.rating} · {property.rooms} camere · {property.area} m²</small></div></button>)}</div>
      </aside>
      <main className="large-map">
        <div className="map-streets"><i /><i /><i /><i /><i /></div>
        <span className="district-name d-centru">Centru</span><span className="district-name d-riscani">Râșcani</span><span className="district-name d-botanica">Botanica</span><span className="district-name d-buiucani">Buiucani</span>
        {visible.map((property) => <button className={`map-price-pin ${property.mode}${selected.id === property.id ? ' selected' : ''}`} style={{ left: `${property.mapX}%`, top: `${property.mapY}%` }} type="button" onClick={() => setSelected(property)} key={property.id}>{property.mode === 'rent' ? `€${property.price}` : `€${Math.round(property.price / 1000)}k`}</button>)}
        <div className="map-floating-card"><img src={selected.image} alt={`Apartament ${selected.address}`} /><div><span>{selected.mode === 'rent' ? 'De închiriat' : 'De vânzare'} · {selected.district}</span><strong>{money(selected.price)}{selected.mode === 'rent' && '/lună'}</strong><p>{selected.address}</p><small>★ {selected.rating} · {selected.rooms} camere · {selected.area} m²</small><button type="button" onClick={() => navigate(`/proprietate/${selected.slug}`)}>Vezi detalii →</button></div></div>
        <div className="map-controls"><button type="button" aria-label="Mărește harta">+</button><button type="button" aria-label="Micșorează harta">−</button><button type="button" aria-label="Centrează pe locația mea">⌖</button></div>
        <div className="map-legend"><span><i className="rent-dot" /> Chirie</span><span><i className="sale-dot" /> Vânzare</span><small>Date demonstrative</small></div>
      </main>
    </div>
  )
}
