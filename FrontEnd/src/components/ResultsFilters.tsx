import { Icon } from './Icon'

export interface AdvancedFiltersValue {
  minPrice: string
  maxPrice: string
  minArea: string
  maxArea: string
  minRating: string
  floor: string
  yearFrom: string
  yearTo: string
  buildingType: string
  comfort: string[]
  trust: string[]
}

interface ResultsFiltersProps {
  open: boolean
  value: AdvancedFiltersValue
  resultCount: number
  onChange: (value: AdvancedFiltersValue) => void
  onClose: () => void
  onClear: () => void
}

const comfort = ['Mobilat', 'Parcare', 'Ascensor', 'Animale acceptate']
const trust = ['Doar proprietăți verificate', 'Cu istoric disponibil', 'Renovare recentă', 'Preț redus', 'Fără probleme raportate']

export const emptyAdvancedFilters: AdvancedFiltersValue = {
  minPrice: '',
  maxPrice: '',
  minArea: '',
  maxArea: '',
  minRating: '',
  floor: 'Orice etaj',
  yearFrom: '',
  yearTo: '',
  buildingType: 'Orice tip',
  comfort: [],
  trust: [],
}

export function ResultsFilters({ open, value, resultCount, onChange, onClose, onClear }: ResultsFiltersProps) {
  if (!open) return null

  const update = <Key extends keyof AdvancedFiltersValue>(key: Key, nextValue: AdvancedFiltersValue[Key]) => {
    onChange({ ...value, [key]: nextValue })
  }

  const toggleArrayValue = (key: 'comfort' | 'trust', item: string) => {
    const current = value[key]
    update(key, current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item])
  }

  return (
    <div className='filter-panel-shell'>
      <button className='filter-panel-backdrop' type='button' aria-label='Închide filtrele' onClick={onClose} />
      <div className='advanced-filters-v2'>
        <header><div><span>Filtre avansate</span><strong>Restrânge rezultatele</strong></div><button type='button' aria-label='Închide filtrele' onClick={onClose}><Icon name='close' /></button></header>
        <div className='advanced-filter-grid'>
          <fieldset><legend>Preț și dimensiune</legend><label>Interval de preț<div className='range-fields'><input inputMode='numeric' value={value.minPrice} onChange={(event) => update('minPrice', event.target.value)} placeholder='Minim' /><input inputMode='numeric' value={value.maxPrice} onChange={(event) => update('maxPrice', event.target.value)} placeholder='Maxim' /></div></label><label>Suprafață utilă<div className='range-fields'><input inputMode='numeric' value={value.minArea} onChange={(event) => update('minArea', event.target.value)} placeholder='Min. m²' /><input inputMode='numeric' value={value.maxArea} onChange={(event) => update('maxArea', event.target.value)} placeholder='Max. m²' /></div></label><label>Rating minim<select value={value.minRating} onChange={(event) => update('minRating', event.target.value)}><option value=''>Orice rating</option><option value='4'>4+ stele</option><option value='4.5'>4,5+ stele</option></select></label></fieldset>
          <fieldset><legend>Clădire</legend><label>Etaj<select value={value.floor} onChange={(event) => update('floor', event.target.value)}><option>Orice etaj</option><option>Nu primul</option><option>Nu ultimul</option><option>Ultimul etaj</option></select></label><label>Anul construcției<div className='range-fields'><input inputMode='numeric' value={value.yearFrom} onChange={(event) => update('yearFrom', event.target.value)} placeholder='De la' /><input inputMode='numeric' value={value.yearTo} onChange={(event) => update('yearTo', event.target.value)} placeholder='Până la' /></div></label><label>Tipul clădirii<select value={value.buildingType} onChange={(event) => update('buildingType', event.target.value)}><option>Orice tip</option><option>Bloc nou</option><option>Bloc secundar</option><option>Casă istorică</option></select></label></fieldset>
          <fieldset><legend>Confort</legend><div className='filter-checkboxes'>{comfort.map((label) => <label key={label}><input type='checkbox' checked={value.comfort.includes(label)} onChange={() => toggleArrayValue('comfort', label)} /><span><Icon name='check' size={14} /></span>{label}</label>)}</div></fieldset>
          <fieldset><legend>Încredere și istoric</legend><div className='filter-checkboxes'>{trust.map((label) => <label key={label}><input type='checkbox' checked={value.trust.includes(label)} onChange={() => toggleArrayValue('trust', label)} /><span><Icon name='check' size={14} /></span>{label}</label>)}</div></fieldset>
        </div>
        <footer><button type='button' onClick={onClear}>Resetează toate</button><div><span>{resultCount} {resultCount === 1 ? 'proprietate corespunde' : 'proprietăți corespund'}</span><button className='button button-primary' type='button' onClick={onClose}>Afișează rezultatele</button></div></footer>
      </div>
    </div>
  )
}
