import { useState } from 'react'
import { money, properties, type Property, type SharedPageProps } from '../data'
import { Icon } from './Icon'

type CompareRow = { group: string; label: string; value: (property: Property, index: number) => string; score?: (property: Property, index: number) => number; prefer?: 'high' | 'low' }

const rows: CompareRow[] = [
  { group: 'Preț și costuri', label: 'Preț actual', value: (item) => `${money(item.price)}${item.mode === 'rent' ? '/lună' : ''}`, score: (item) => item.price, prefer: 'low' },
  { group: 'Preț și costuri', label: 'Preț anterior', value: (item) => `${money(item.previousPrice)}${item.mode === 'rent' ? '/lună' : ''}`, score: (item) => item.previousPrice, prefer: 'low' },
  { group: 'Preț și costuri', label: 'Evoluție', value: (item) => `${item.trend >= 0 ? '+' : '−'}${Math.abs(item.trend)}%`, score: (item) => item.trend, prefer: 'low' },
  { group: 'Preț și costuri', label: 'Preț/m²', value: (item) => `${money(item.pricePerSqm)}${item.mode === 'rent' ? '/lună' : ''}`, score: (item) => item.pricePerSqm, prefer: 'low' },
  { group: 'Preț și costuri', label: 'Costuri estimate', value: (_item,index) => ['€85–120/lună','€95–135/lună','€110–145/lună'][index], score: (_item,index) => [102,115,128][index], prefer: 'low' },
  { group: 'Proprietate', label: 'Camere', value: (item) => `${item.rooms}`, score: (item) => item.rooms, prefer: 'high' },
  { group: 'Proprietate', label: 'Suprafață', value: (item) => `${item.area} m²`, score: (item) => item.area, prefer: 'high' },
  { group: 'Proprietate', label: 'Etaj', value: (item) => item.floor },
  { group: 'Proprietate', label: 'An construcție', value: (item) => `${item.year}`, score: (item) => item.year, prefer: 'high' },
  { group: 'Încredere', label: 'Rating apartament', value: (item) => `${item.rating}/5`, score: (item) => item.rating, prefer: 'high' },
  { group: 'Încredere', label: 'Recenzii verificate', value: (item) => `${item.reviews}`, score: (item) => item.reviews, prefer: 'high' },
  { group: 'Încredere', label: 'Istoric disponibil', value: (_item,index) => ['4 evenimente verificate','3 evenimente verificate','5 evenimente verificate'][index], score: (_item,index) => [4,3,5][index], prefer: 'high' },
  { group: 'Context', label: 'Renovări', value: (_item,index) => ['Completă · 2024','Baie · 2023','Bucătărie · 2025'][index] },
  { group: 'Context', label: 'Probleme raportate', value: (_item,index) => ['1 în analiză','2 rezolvate','Nicio problemă activă'][index], score: (_item,index) => [1,2,0][index], prefer: 'low' },
  { group: 'Context', label: 'Scor bloc', value: (_item,index) => ['4,4/5','4,2/5','4,6/5'][index], score: (_item,index) => [4.4,4.2,4.6][index], prefer: 'high' },
  { group: 'Context', label: 'Scor zonă', value: (_item,index) => ['4,6/5','4,3/5','4,5/5'][index], score: (_item,index) => [4.6,4.3,4.5][index], prefer: 'high' },
  { group: 'Facilități', label: 'Dotări principale', value: (item) => item.features.slice(0,4).join(' · ') },
  { group: 'Facilități', label: 'Parcare', value: (_item,index) => index === 1 ? 'Publică' : 'Subterană' },
  { group: 'Facilități', label: 'Ascensor', value: (_item,index) => index === 1 ? '1 ascensor' : '2 ascensoare' },
]

export function ComparePage({ compare, navigate, toggleCompare }: SharedPageProps) {
  const [differencesOnly, setDifferencesOnly] = useState(false)
  const fallback = properties.filter((property) => property.mode === 'rent').slice(0, 3)
  const selected = compare.length ? properties.filter((property) => compare.includes(property.id)).slice(0, 3) : fallback
  const groups = [...new Set(rows.map((row) => row.group))]
  const visibleRows = rows.filter((row) => !differencesOnly || new Set(selected.map((property,index) => row.value(property,index))).size > 1)

  const isBest = (row: CompareRow, property: Property, index: number) => {
    if (!row.score || !row.prefer || selected.length < 2) return false
    const values = selected.map((item, itemIndex) => row.score!(item, itemIndex))
    const target = row.prefer === 'high' ? Math.max(...values) : Math.min(...values)
    return row.score(property,index) === target && values.filter((value) => value === target).length === 1
  }

  return <div className='compare-page-v2'>
    <section className='compare-hero'><div className='container'><div><span><Icon name='compare' size={18} /> Comparație proprietăți</span><h1>Pune decizia pe aceleași criterii.</h1><p>Compară maximum trei proprietăți. Evidențierea arată doar cea mai bună valoare numerică, nu o recomandare automată.</p></div><button className='button button-secondary' type='button' onClick={() => navigate('/chirie')}><Icon name='plus' size={17} /> Adaugă proprietate</button></div></section>
    <section className='comparison-workspace'><div className='container'>
      <div className='comparison-toolbar'><div><strong>{selected.length} din 3 selectate</strong><span>Poți elimina sau înlocui orice proprietate</span></div><label><input type='checkbox' checked={differencesOnly} onChange={(event) => setDifferencesOnly(event.target.checked)} /><span>Arată doar diferențele</span></label></div>
      <div className='compare-scroll'><div className='comparison-table-v2' style={{ '--compare-count': selected.length } as React.CSSProperties}>
        <div className='comparison-corner'><span>Proprietăți</span><small>Actualizat demonstrativ</small></div>
        {selected.map((property,index) => <article className='compare-head-v2' key={property.id}><button className='compare-remove' type='button' aria-label={`Elimină ${property.address}`} onClick={() => toggleCompare(property.id)}><Icon name='close' size={16} /></button><div className='compare-image-wrap'><img src={property.image} alt={property.address} /><span>{property.mode === 'rent' ? 'De închiriat' : 'De vânzare'}</span></div><small>{property.district} · {property.complex}</small><h2>{property.address}</h2><div className='compare-price'><strong>{money(property.price)}</strong>{property.mode === 'rent' && <span>/lună</span>}</div><div className='compare-trust'><Icon name='verified' size={15} /> Date principale verificate</div><button type='button' onClick={() => navigate(`/proprietate/${property.slug}`)}>Vezi dosarul <Icon name='arrow-right' size={15} /></button>{index === 0 && <b className='compare-anchor'>Reper</b>}</article>)}
        {selected.length < 3 && <button className='compare-empty-column' type='button' onClick={() => navigate('/chirie')}><span><Icon name='plus' /></span><strong>Adaugă a treia proprietate</strong><small>Revino în rezultate și alege „Compară”</small></button>}
        {groups.map((group) => visibleRows.some((row) => row.group === group) && <div className='compare-group' key={group}><div className='compare-group-title'><span>{group}</span></div>{selected.map((item) => <div aria-hidden='true' key={item.id} />)}{selected.length < 3 && <div />}{visibleRows.filter((row) => row.group === group).map((row) => <div className='compare-data-row' key={row.label}><div className='compare-row-label'>{row.label}</div>{selected.map((property,index) => <div className={`compare-cell ${isBest(row,property,index) ? 'best' : ''}`} data-property={property.address} key={property.id}><strong>{row.value(property,index)}</strong>{isBest(row,property,index) && <span><Icon name='check' size={13} /> Valoare favorabilă</span>}</div>)}{selected.length < 3 && <div className='compare-cell empty' data-property='Loc liber'>—</div>}</div>)}</div>)}
      </div></div>
      <div className='compare-decision-note'><Icon name='info' /><div><strong>Folosește comparația ca punct de pornire</strong><p>Costurile, scorurile și estimările sunt demonstrative. Verifică documentele, vizitează proprietatea și cere explicații pentru diferențele importante.</p></div><button type='button' onClick={() => navigate('/cum-verificam-datele')}>Cum verificăm datele</button></div>
    </div></section>
  </div>
}
