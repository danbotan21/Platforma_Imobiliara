import { Icon } from './Icon'

interface ResultsFiltersProps { open: boolean; onClose: () => void; onClear: () => void }

const comfort = ['Mobilat', 'Parcare', 'Ascensor', 'Animale acceptate']
const trust = ['Doar proprietăți verificate', 'Cu istoric disponibil', 'Renovare recentă', 'Preț redus', 'Fără probleme raportate']

export function ResultsFilters({ open, onClose, onClear }: ResultsFiltersProps) {
  if (!open) return null

  return (
    <div className='filter-panel-shell'>
      <button className='filter-panel-backdrop' type='button' aria-label='Închide filtrele' onClick={onClose} />
      <div className='advanced-filters-v2'>
        <header><div><span>Filtre avansate</span><strong>Restrânge rezultatele</strong></div><button type='button' aria-label='Închide filtrele' onClick={onClose}><Icon name='close' /></button></header>
        <div className='advanced-filter-grid'>
          <fieldset><legend>Preț și dimensiune</legend><label>Interval de preț<div className='range-fields'><input placeholder='Minim' /><input placeholder='Maxim' /></div></label><label>Suprafață utilă<div className='range-fields'><input placeholder='Min. m²' /><input placeholder='Max. m²' /></div></label><label>Rating minim<select><option>Orice rating</option><option>4+ stele</option><option>4,5+ stele</option></select></label></fieldset>
          <fieldset><legend>Clădire</legend><label>Etaj<select><option>Orice etaj</option><option>Nu primul</option><option>Nu ultimul</option><option>Ultimul etaj</option></select></label><label>Anul construcției<div className='range-fields'><input placeholder='De la' /><input placeholder='Până la' /></div></label><label>Tipul clădirii<select><option>Orice tip</option><option>Bloc nou</option><option>Bloc secundar</option><option>Casă istorică</option></select></label></fieldset>
          <fieldset><legend>Confort</legend><div className='filter-checkboxes'>{comfort.map((label) => <label key={label}><input type='checkbox' /><span><Icon name='check' size={14} /></span>{label}</label>)}</div></fieldset>
          <fieldset><legend>Încredere și istoric</legend><div className='filter-checkboxes'>{trust.map((label) => <label key={label}><input type='checkbox' /><span><Icon name='check' size={14} /></span>{label}</label>)}</div></fieldset>
        </div>
        <footer><button type='button' onClick={onClear}>Resetează toate</button><div><span>3 proprietăți corespund</span><button className='button button-primary' type='button' onClick={onClose}>Afișează rezultatele</button></div></footer>
      </div>
    </div>
  )
}
