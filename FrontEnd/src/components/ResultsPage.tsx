import { useMemo, useState } from 'react'
import { properties, type ListingMode, type Property, type SharedPageProps } from '../data'
import { Icon } from './Icon'
import { ListingMap } from './ListingMap'
import { PropertyCard } from './PropertyCard'
import { emptyAdvancedFilters, ResultsFilters, type AdvancedFiltersValue } from './ResultsFilters'

interface ResultsPageProps extends SharedPageProps { mode: ListingMode }

const renovationRecent = new Set(['LOC-2481', 'LOC-4210'])
const propertiesWithIssues = new Set(['LOC-2481', 'LOC-3877'])
const propertiesWithHistory = new Set(['LOC-2481', 'LOC-1934', 'LOC-3108', 'LOC-3877'])
const quickFilterLabels = ['Verificate', 'Cu istoric', 'Preț redus', 'Parcare', 'Ascensor']

function includesFeature(property: Property, label: string) {
  return property.features.some((feature) => feature.toLocaleLowerCase('ro-RO').includes(label.toLocaleLowerCase('ro-RO')))
}

function numericValue(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

export function ResultsPage({ mode, ...shared }: ResultsPageProps) {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('q') ?? '')
  const [district, setDistrict] = useState('Toate sectoarele')
  const [rooms, setRooms] = useState('Oricâte')
  const [priceRange, setPriceRange] = useState('Orice preț')
  const [sort, setSort] = useState('Recomandate')
  const [quickFilters, setQuickFilters] = useState<string[]>([])
  const [advanced, setAdvanced] = useState<AdvancedFiltersValue>(emptyAdvancedFilters)
  const [showFilters, setShowFilters] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)

  const filtered = useMemo(() => {
    const result = properties.filter((property) => {
      if (property.mode !== mode) return false
      if (district !== 'Toate sectoarele' && property.district !== district) return false
      if (rooms !== 'Oricâte' && property.rooms !== Number(rooms)) return false
      if (query.trim() && !`${property.address} ${property.district} ${property.complex}`.toLocaleLowerCase('ro-RO').includes(query.trim().toLocaleLowerCase('ro-RO'))) return false

      if (priceRange !== 'Orice preț') {
        const [minText, maxText] = priceRange.split('-')
        const min = numericValue(minText)
        const max = maxText ? numericValue(maxText) : Number.POSITIVE_INFINITY
        if (property.price < min || property.price > max) return false
      }

      const minPrice = numericValue(advanced.minPrice)
      const maxPrice = numericValue(advanced.maxPrice)
      const minArea = numericValue(advanced.minArea)
      const maxArea = numericValue(advanced.maxArea)
      const minRating = numericValue(advanced.minRating)
      const yearFrom = numericValue(advanced.yearFrom)
      const yearTo = numericValue(advanced.yearTo)
      if (minPrice && property.price < minPrice) return false
      if (maxPrice && property.price > maxPrice) return false
      if (minArea && property.area < minArea) return false
      if (maxArea && property.area > maxArea) return false
      if (minRating && property.rating < minRating) return false
      if (yearFrom && property.year < yearFrom) return false
      if (yearTo && property.year > yearTo) return false

      const [currentFloor, totalFloors] = property.floor.split(' din ').map(Number)
      if (advanced.floor === 'Nu primul' && currentFloor === 1) return false
      if (advanced.floor === 'Nu ultimul' && currentFloor === totalFloors) return false
      if (advanced.floor === 'Ultimul etaj' && currentFloor !== totalFloors) return false
      if (advanced.buildingType === 'Bloc nou' && property.year < 2018) return false
      if (advanced.buildingType === 'Bloc secundar' && property.year >= 2018) return false
      if (advanced.buildingType === 'Casă istorică' && property.year >= 1990) return false

      if (advanced.comfort.some((item) => !includesFeature(property, item))) return false
      if (advanced.trust.includes('Doar proprietăți verificate') && !property.verified) return false
      if (advanced.trust.includes('Renovare recentă') && !renovationRecent.has(property.id)) return false
      if (advanced.trust.includes('Preț redus') && property.special !== 'reduced') return false
      if (advanced.trust.includes('Fără probleme raportate') && propertiesWithIssues.has(property.id)) return false

      if (quickFilters.includes('Verificate') && !property.verified) return false
      if (quickFilters.includes('Cu istoric') && !propertiesWithHistory.has(property.id)) return false
      if (quickFilters.includes('Preț redus') && property.special !== 'reduced') return false
      if (quickFilters.includes('Parcare') && !includesFeature(property, 'Parcare')) return false
      if (quickFilters.includes('Ascensor') && !includesFeature(property, 'Ascensor')) return false
      return true
    })

    if (sort === 'Preț crescător') return [...result].sort((a, b) => a.price - b.price)
    if (sort === 'Cele mai noi') return [...result].sort((a, b) => Number(b.special === 'new') - Number(a.special === 'new') || b.year - a.year)
    if (sort === 'Rating') return [...result].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    if (sort === 'Cele mai complete dosare') return [...result].sort((a, b) => Number(b.verified) - Number(a.verified) || b.reviews - a.reviews)
    return result
  }, [advanced, district, mode, priceRange, query, quickFilters, rooms, sort])

  const advancedCount = [advanced.minPrice, advanced.maxPrice, advanced.minArea, advanced.maxArea, advanced.minRating, advanced.yearFrom, advanced.yearTo].filter(Boolean).length
    + (advanced.floor !== 'Orice etaj' ? 1 : 0)
    + (advanced.buildingType !== 'Orice tip' ? 1 : 0)
    + advanced.comfort.length
    + advanced.trust.length
  const filterCount = (query.trim() ? 1 : 0) + (district !== 'Toate sectoarele' ? 1 : 0) + (rooms !== 'Oricâte' ? 1 : 0) + (priceRange !== 'Orice preț' ? 1 : 0) + quickFilters.length + advancedCount

  const clearFilters = () => {
    setQuery('')
    setDistrict('Toate sectoarele')
    setRooms('Oricâte')
    setPriceRange('Orice preț')
    setSort('Recomandate')
    setQuickFilters([])
    setAdvanced(emptyAdvancedFilters)
  }

  const toggleQuickFilter = (filter: string) => {
    setQuickFilters((current) => current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter])
  }

  const saveSearch = () => {
    const savedSearch = { mode, query, district, rooms, priceRange, quickFilters, advanced, savedAt: new Date().toISOString() }
    window.localStorage.setItem(`locuinta:saved-search:${mode}`, JSON.stringify(savedSearch))
    shared.notify('Căutarea a fost salvată. Vei primi alerte pentru oferte noi.')
  }

  const label = mode === 'rent' ? 'închiriat' : 'cumpărat'
  const priceOptions = mode === 'rent'
    ? [['400-600', '€400 – €600'], ['600-900', '€600 – €900'], ['900', 'Peste €900']]
    : [['0-100000', 'Până la €100.000'], ['100000-130000', '€100.000 – €130.000'], ['130000', 'Peste €130.000']]

  return (
    <div className={`results-page-v2 mode-${mode}`}>
      <div className='container breadcrumb'><button type='button' onClick={() => shared.navigate('/')}>Acasă</button><span>/</span><strong>Apartamente de {mode === 'rent' ? 'închiriat' : 'vânzare'}</strong></div>

      <section className='container results-heading-v2'>
        <div><span className={`results-mode-label ${mode}`}><Icon name={mode === 'rent' ? 'key' : 'home'} /> {mode === 'rent' ? 'Chirie' : 'Vânzare'}</span><h1>Apartamente de {label} în Chișinău</h1><p>Compară prețul actual cu istoricul proprietății, blocului și zonei.</p></div>
        <button className='button button-secondary' type='button' onClick={saveSearch}><Icon name='heart' size={18} /> Salvează căutarea</button>
      </section>

      <section className='results-search-workspace'>
        <div className='container'>
          <div className='results-mode-tabs'><button className={mode === 'rent' ? 'active rent' : ''} type='button' onClick={() => shared.navigate('/chirie')}><Icon name='key' /> Chirie</button><button className={mode === 'sale' ? 'active sale' : ''} type='button' onClick={() => shared.navigate('/cumpara')}><Icon name='home' /> Vânzare</button></div>
          <div className='results-search-bar'>
            <label className='results-query'><Icon name='search' /><span><small>Locație</small><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder='Adresă, stradă, sector sau complex' /></span></label>
            <label><small>Preț</small><select value={priceRange} onChange={(event) => setPriceRange(event.target.value)}><option>Orice preț</option>{priceOptions.map(([value, text]) => <option value={value} key={value}>{text}</option>)}</select></label>
            <label><small>Camere</small><select value={rooms} onChange={(event) => setRooms(event.target.value)}><option>Oricâte</option><option value='1'>1 cameră</option><option value='2'>2 camere</option><option value='3'>3 camere</option></select></label>
            <label><small>Sector</small><select value={district} onChange={(event) => setDistrict(event.target.value)}><option>Toate sectoarele</option><option>Centru</option><option>Râșcani</option><option>Botanica</option><option>Buiucani</option></select></label>
            <button className='results-filter-button' type='button' onClick={() => setShowFilters(true)}><Icon name='filter' /> Toate filtrele <span>{filterCount}</span></button>
          </div>
          <div className='quick-filters'><span>Filtre rapide</span>{quickFilterLabels.map((filter) => <button className={quickFilters.includes(filter) ? 'active' : ''} type='button' onClick={() => toggleQuickFilter(filter)} key={filter}>{filter}</button>)}</div>
        </div>
      </section>

      <section className='container results-content-v2'>
        <div className='results-list-v2'>
          <div className='applied-filter-row'><div><span className='applied-chip'>Chișinău <button type='button' aria-label='Chișinău este zona curentă' onClick={() => shared.notify('Platforma afișează momentan proprietăți din Chișinău.')}>×</button></span>{query.trim() && <span className='applied-chip'>{query.trim()} <button type='button' onClick={() => setQuery('')}>×</button></span>}{district !== 'Toate sectoarele' && <span className='applied-chip'>{district} <button type='button' onClick={() => setDistrict('Toate sectoarele')}>×</button></span>}{rooms !== 'Oricâte' && <span className='applied-chip'>{rooms} camere <button type='button' onClick={() => setRooms('Oricâte')}>×</button></span>}{quickFilters.map((filter) => <span className='applied-chip' key={filter}>{filter} <button type='button' onClick={() => toggleQuickFilter(filter)}>×</button></span>)}{filterCount > 0 && <button type='button' onClick={clearFilters}>Șterge filtrele</button>}</div><small>Datele sunt prezentate cu sursa și nivelul de încredere.</small></div>
          <div className='results-meta-v2'><div><strong>{filtered.length} proprietăți</strong><span>care corespund criteriilor tale</span></div><div><button className='mobile-map-button' type='button' onClick={() => setMapOpen(true)}><Icon name='map' /> Hartă</button><label>Sortează după <select value={sort} onChange={(event) => setSort(event.target.value)}><option>Recomandate</option><option>Preț crescător</option><option>Cele mai noi</option><option>Rating</option><option>Cele mai complete dosare</option></select></label></div></div>
          {filtered.length > 0 ? <div className='results-cards-v2'>{filtered.map((property) => <PropertyCard property={property} key={property.id} {...shared} />)}</div> : <div className='empty-state results-empty'><span><Icon name='search' /></span><h2>Nicio proprietate nu corespunde</h2><p>Elimină unul dintre filtre sau extinde intervalul de preț pentru a vedea mai multe rezultate.</p><button className='button button-secondary' type='button' onClick={clearFilters}>Resetează filtrele</button></div>}
        </div>

        <aside className={mapOpen ? 'results-map-v2 mobile-open' : 'results-map-v2'}><button className='mobile-map-close' type='button' aria-label='Închide harta' onClick={() => setMapOpen(false)}><Icon name='close' /></button><ListingMap items={filtered} mode={mode} navigate={shared.navigate} /><div className='market-insight'><span>Reper de piață</span><strong>{mode === 'rent' ? '€590/lună chiria mediană în Centru' : '€1.820/m² prețul median în Centru'}</strong><small>Estimare bazată pe proprietățile disponibile în platformă.</small></div></aside>
      </section>
      <ResultsFilters open={showFilters} value={advanced} resultCount={filtered.length} onChange={setAdvanced} onClose={() => setShowFilters(false)} onClear={() => setAdvanced(emptyAdvancedFilters)} />
    </div>
  )
}
