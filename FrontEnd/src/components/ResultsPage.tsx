import { useMemo, useState } from 'react'
import { properties, type ListingMode, type SharedPageProps } from '../data'
import { Icon } from './Icon'
import { ListingMap } from './ListingMap'
import { PropertyCard } from './PropertyCard'
import { ResultsFilters } from './ResultsFilters'

interface ResultsPageProps extends SharedPageProps { mode: ListingMode }

export function ResultsPage({ mode, ...shared }: ResultsPageProps) {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('q') ?? '')
  const [district, setDistrict] = useState('Toate sectoarele')
  const [rooms, setRooms] = useState('Oricâte')
  const [sort, setSort] = useState('Recomandate')
  const [showFilters, setShowFilters] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)

  const filtered = useMemo(() => properties.filter((property) => {
    if (property.mode !== mode) return false
    if (district !== 'Toate sectoarele' && property.district !== district) return false
    if (rooms !== 'Oricâte' && property.rooms !== Number(rooms)) return false
    if (query.trim() && !`${property.address} ${property.district} ${property.complex}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  }), [district, mode, query, rooms])

  const clearFilters = () => { setQuery(''); setDistrict('Toate sectoarele'); setRooms('Oricâte') }
  const label = mode === 'rent' ? 'închiriat' : 'cumpărat'

  return (
    <div className={`results-page-v2 mode-${mode}`}>
      <div className='container breadcrumb'><button type='button' onClick={() => shared.navigate('/')}>Acasă</button><span>/</span><strong>Apartamente de {mode === 'rent' ? 'închiriat' : 'vânzare'}</strong></div>

      <section className='container results-heading-v2'>
        <div><span className={`results-mode-label ${mode}`}><Icon name={mode === 'rent' ? 'key' : 'home'} /> {mode === 'rent' ? 'Chirie' : 'Vânzare'}</span><h1>Apartamente de {label} în Chișinău</h1><p>Compară prețul actual cu istoricul proprietății, blocului și zonei.</p></div>
        <button className='button button-secondary' type='button' onClick={() => shared.notify('Căutarea a fost salvată. Vei primi alerte pentru oferte noi.')}><Icon name='heart' size={18} /> Salvează căutarea</button>
      </section>

      <section className='results-search-workspace'>
        <div className='container'>
          <div className='results-mode-tabs'><button className={mode === 'rent' ? 'active rent' : ''} type='button' onClick={() => shared.navigate('/chirie')}><Icon name='key' /> Chirie</button><button className={mode === 'sale' ? 'active sale' : ''} type='button' onClick={() => shared.navigate('/cumpara')}><Icon name='home' /> Vânzare</button></div>
          <div className='results-search-bar'>
            <label className='results-query'><Icon name='search' /><span><small>Locație</small><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder='Adresă, stradă, sector sau complex' /></span></label>
            <label><small>Preț</small><select><option>Orice preț</option><option>€400 – €600</option><option>€600 – €900</option><option>Peste €900</option></select></label>
            <label><small>Camere</small><select value={rooms} onChange={(event) => setRooms(event.target.value)}><option>Oricâte</option><option value='1'>1 cameră</option><option value='2'>2 camere</option><option value='3'>3 camere</option></select></label>
            <label><small>Sector</small><select value={district} onChange={(event) => setDistrict(event.target.value)}><option>Toate sectoarele</option><option>Centru</option><option>Râșcani</option><option>Botanica</option><option>Buiucani</option></select></label>
            <button className='results-filter-button' type='button' onClick={() => setShowFilters(true)}><Icon name='filter' /> Toate filtrele <span>3</span></button>
          </div>
          <div className='quick-filters'><span>Filtre rapide</span>{['Verificate', 'Cu istoric', 'Preț redus', 'Parcare', 'Ascensor'].map((filter) => <button type='button' key={filter}>{filter}</button>)}</div>
        </div>
      </section>

      <section className='container results-content-v2'>
        <div className='results-list-v2'>
          <div className='applied-filter-row'><div><span className='applied-chip'>Chișinău <button type='button'>×</button></span><span className='applied-chip'>Cu istoric <button type='button'>×</button></span><button type='button' onClick={clearFilters}>Șterge filtrele</button></div><small>Datele sunt prezentate cu sursa și nivelul de încredere.</small></div>
          <div className='results-meta-v2'><div><strong>{filtered.length} proprietăți</strong><span>care corespund criteriilor tale</span></div><div><button className='mobile-map-button' type='button' onClick={() => setMapOpen(true)}><Icon name='map' /> Hartă</button><label>Sortează după <select value={sort} onChange={(event) => setSort(event.target.value)}><option>Recomandate</option><option>Preț crescător</option><option>Cele mai noi</option><option>Rating</option><option>Cele mai complete dosare</option></select></label></div></div>
          {filtered.length > 0 ? <div className='results-cards-v2'>{filtered.map((property) => <PropertyCard property={property} key={property.id} {...shared} />)}</div> : <div className='empty-state results-empty'><span><Icon name='search' /></span><h2>Nicio proprietate nu corespunde</h2><p>Elimină unul dintre filtre sau extinde intervalul de preț pentru a vedea mai multe rezultate.</p><button className='button button-secondary' type='button' onClick={clearFilters}>Resetează filtrele</button></div>}
        </div>

        <aside className={mapOpen ? 'results-map-v2 mobile-open' : 'results-map-v2'}><button className='mobile-map-close' type='button' aria-label='Închide harta' onClick={() => setMapOpen(false)}><Icon name='close' /></button><ListingMap items={filtered} mode={mode} navigate={shared.navigate} /><div className='market-insight'><span>Reper de piață</span><strong>{mode === 'rent' ? '€590/lună chiria mediană în Centru' : '€1.820/m² prețul median în Centru'}</strong><small>Estimare bazată pe proprietățile disponibile în platformă.</small></div></aside>
      </section>
      <ResultsFilters open={showFilters} onClose={() => setShowFilters(false)} onClear={clearFilters} />
    </div>
  )
}
