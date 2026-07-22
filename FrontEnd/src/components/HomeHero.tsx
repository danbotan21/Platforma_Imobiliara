import { useState } from 'react'
import { properties, type ListingMode, type SharedPageProps } from '../data'
import { Icon } from './Icon'

export function HomeHero({ navigate }: Pick<SharedPageProps, 'navigate'>) {
  const [mode, setMode] = useState<ListingMode>('rent')
  const [query, setQuery] = useState('')
  const featured = properties[0]

  const search = () => {
    const base = mode === 'rent' ? '/chirie' : '/cumpara'
    navigate(query.trim() ? `${base}?q=${encodeURIComponent(query)}` : base)
  }

  return (
    <section className='home-hero-v2'>
      <div className='container hero-v2-layout'>
        <div className='hero-v2-copy'>
          <div className='hero-trust-line'><Icon name='shield' size={18} /> Proprietăți, istoric și recenzii într-un singur loc</div>
          <h1>Alege locuința cu <span>toate datele</span> pe masă.</h1>
          <p>Caută apartamente de închiriat sau de cumpărat în Chișinău. Vezi prețuri anterioare, renovări, perioade de chirie și recenzii verificate înainte să decizi.</p>

          <div className='hero-search-v2'>
            <div className='hero-mode-tabs' role='tablist' aria-label='Tipul căutării'>
              <button className={mode === 'rent' ? 'active rent' : ''} type='button' role='tab' aria-selected={mode === 'rent'} onClick={() => setMode('rent')}><Icon name='key' /> Vreau să închiriez</button>
              <button className={mode === 'sale' ? 'active sale' : ''} type='button' role='tab' aria-selected={mode === 'sale'} onClick={() => setMode('sale')}><Icon name='home' /> Vreau să cumpăr</button>
            </div>
            <div className='hero-search-input'>
              <Icon name='search' size={22} />
              <label><span>Adresă sau zonă</span><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && search()} placeholder='Stradă, sector, complex rezidențial' /></label>
              <button className='button button-primary' type='button' onClick={search}>Caută <span>proprietăți</span><Icon name='arrow-right' size={18} /></button>
            </div>
            <div className='hero-secondary-actions'>
              <button type='button' onClick={() => navigate('/verifica')}><Icon name='history' /> Verifică istoricul unei adrese</button>
              <button type='button' onClick={() => navigate('/harta')}><Icon name='map' /> Vezi pe hartă</button>
            </div>
          </div>

          <div className='hero-assurance'>
            <span><Icon name='check' /> Surse afișate clar</span>
            <span><Icon name='check' /> Date personale protejate</span>
            <span><Icon name='check' /> Chirie și vânzare diferențiate</span>
          </div>
        </div>

        <div className='hero-v2-visual'>
          <div className='hero-photo-frame'><img src={featured.image} alt='Apartament modern și luminos din Chișinău' /></div>
          <div className='hero-listing-chip'><span className='badge badge-rent'>De închiriat</span><strong>€650<small>/lună</small></strong><p>{featured.address}</p></div>
          <div className='hero-proof-card'>
            <div className='proof-card-head'><span><Icon name='shield' /> Dosar verificat</span><b>Actualizat acum 4 zile</b></div>
            <div className='proof-card-grid'>
              <span><Icon name='chart' /><b>4</b><small>prețuri cunoscute</small></span>
              <span><Icon name='history' /><b>2</b><small>perioade de chirie</small></span>
              <span><Icon name='renovation' /><b>1</b><small>renovare verificată</small></span>
              <span><Icon name='star' /><b>9,2</b><small>din 46 recenzii</small></span>
            </div>
            <button type='button' onClick={() => navigate(`/proprietate/${featured.slug}`)}>Deschide dosarul complet <Icon name='arrow-right' size={17} /></button>
          </div>
        </div>
      </div>
    </section>
  )
}
