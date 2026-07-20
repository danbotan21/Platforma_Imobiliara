import { useState } from 'react'
import type { ListingMode, Navigate, Property } from '../data'
import { money } from '../data'
import { Icon } from './Icon'

interface ListingMapProps { items: Property[]; mode: ListingMode; navigate: Navigate }

export function ListingMap({ items, mode, navigate }: ListingMapProps) {
  const [selected, setSelected] = useState(items[0]?.id)
  const active = items.find((item) => item.id === selected) ?? items[0]

  return (
    <div className='listing-map'>
      <div className='listing-map-top'><span><Icon name='map' size={17} /> Chișinău</span><button type='button'>Straturi</button></div>
      <div className='listing-map-canvas'>
        <div className='map-park'>Parcul Valea Morilor</div><div className='map-river' /><div className='map-road road-one' /><div className='map-road road-two' /><div className='map-road road-three' />
        <span className='map-district district-one'>Centru</span><span className='map-district district-two'>Râșcani</span><span className='map-district district-three'>Botanica</span>
        {items.map((property) => <button className={`map-property-pin ${property.mode} ${selected === property.id ? 'selected' : ''}`} style={{ left: `${property.mapX}%`, top: `${property.mapY}%` }} type='button' onClick={() => setSelected(property.id)} key={property.id}>{property.mode === 'rent' ? `€${property.price}` : `€${Math.round(property.price / 1000)}k`}</button>)}
        <div className='listing-map-controls'><button type='button' aria-label='Mărește harta'><Icon name='plus' /></button><button type='button' aria-label='Micșorează harta'><Icon name='minus' /></button></div>
        {active && <article className='map-result-card'><img src={active.image} alt='' /><div><span>{active.district} · {active.complex}</span><strong>{money(active.price)}{active.mode === 'rent' && <small>/lună</small>}</strong><p>{active.address}</p><button type='button' onClick={() => navigate(`/proprietate/${active.slug}`)}>Vezi detalii <Icon name='arrow-right' size={15} /></button></div></article>}
      </div>
      <div className='listing-map-legend'><span><i className={mode} /> {mode === 'rent' ? 'Proprietăți de închiriat' : 'Proprietăți de vânzare'}</span><small>Pozițiile sunt aproximative</small></div>
    </div>
  )
}
