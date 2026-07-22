import { useState } from 'react'
import { properties, recentReviews, type SharedPageProps } from '../data'
import { Icon } from './Icon'
import { ListingMap } from './ListingMap'
import { PropertyCard } from './PropertyCard'

const places = [
  ['Transport', '14 rute', '3–6 min până la stație'], ['Școli', '9', '4 evaluate peste 4,5'], ['Magazine', '18', '2 supermarketuri 24/7'],
  ['Parcuri', '4', 'Valea Morilor la 12 min'], ['Servicii medicale', '7', '3 clinici private'], ['Restaurante', '26', 'raza de 1 km'],
]

export function AreaPage(props: SharedPageProps) {
  const [mapLayers, setMapLayers] = useState<string[]>(['Transport'])

  const toggleMapLayer = (layer: string) => {
    setMapLayers((current) => current.includes(layer) ? current.filter((item) => item !== layer) : [...current, layer])
  }

  const openTrackedPlace = (name: string) => {
    if (name === 'Toro Center') {
      props.navigate('/bloc/toro-center')
      return
    }
    props.navigate(`/chirie?q=${encodeURIComponent(name)}`)
  }

  return (
    <div className='area-page-v2'>
      <div className='container breadcrumb'><button type='button' onClick={() => props.navigate('/')}>Acasă</button><span>/</span><strong>Centru</strong></div>
      <section className='area-hero-v2'>
        <div className='container area-hero-layout'><div><span className='eyebrow'>Ghid de zonă</span><h1>Centru, Chișinău</h1><p>Prețuri, mobilitate, servicii, zgomot și experiențe reale pentru a înțelege zona înainte să alegi o proprietate.</p><div className='area-hero-actions'><button className='button button-primary' type='button' onClick={() => props.navigate('/chirie')}>Caută chirii în Centru</button><button className='button button-secondary' type='button' onClick={() => props.navigate('/cumpara')}>Vezi apartamente de vânzare</button></div></div><div className='area-scoreboard'><div className='area-main-score'><strong>4,5</strong><span><b>Scorul zonei</b><small>din 312 evaluări</small></span></div><div className='area-mini-scores'><span>Transport <b>4,8</b></span><span>Siguranță percepută <b>4,3</b></span><span>Servicii <b>4,7</b></span><span>Zgomot <b>3,6</b></span></div></div></div>
      </section>

      <nav className='entity-anchor-nav'><div className='container'>{['Piață', 'Hartă', 'Mobilitate', 'Viață', 'Recenzii', 'Proprietăți', 'Comparație'].map((item) => <a href={`#zona-${item.toLowerCase()}`} key={item}>{item}</a>)}</div></nav>

      <section className='section area-market' id='zona-piață'><div className='container'><div className='section-heading'><div><span className='eyebrow'>Piața din Centru</span><h2>Chirie și vânzare, fără amestecarea reperelor.</h2></div><p>Estimări construite din proprietățile disponibile și istorice din platformă.</p></div><div className='area-market-cards'><article className='rent'><header><Icon name='key' /><span>Chirie</span></header><strong>€590<small>/lună</small></strong><p>Mediană pentru 2 camere</p><div><span>Interval observat <b>€450–€850</b></span><span>Schimbare 12 luni <b className='semantic-positive'>+5,1%</b></span><span>Timp mediu pe piață <b>18 zile</b></span></div></article><article className='sale'><header><Icon name='home' /><span>Vânzare</span></header><strong>€1.820<small>/m²</small></strong><p>Mediană pentru apartamente finisate</p><div><span>Interval observat <b>€1.480–€2.350</b></span><span>Schimbare 12 luni <b className='semantic-positive'>+7,4%</b></span><span>Timp mediu pe piață <b>43 zile</b></span></div></article><div className='area-trend-chart'><header><span>Evoluția prețului / m²</span><div><b>Centru</b><small>Media orașului</small></div></header><svg viewBox='0 0 720 240' preserveAspectRatio='none' aria-label='Comparația prețurilor din Centru cu media orașului'><path className='city-line' d='M0 210 C100 204 150 190 220 184 S350 160 430 145 S570 118 720 95' /><path className='area-line' d='M0 220 C90 214 140 198 220 191 S330 158 420 142 S550 96 620 70 S680 50 720 32' /></svg><div className='entity-chart-axis'><span>2021</span><span>2022</span><span>2023</span><span>2024</span><span>2025</span><span>2026</span></div></div></div></div></section>

      <section className='section area-map-v2-section' id='zona-hartă'><div className='container area-map-v2-layout'><div><span className='eyebrow'>Explorează vizual</span><h2>Proprietăți și puncte importante pe hartă.</h2><p>Pozițiile proprietăților sunt aproximative. Distanțele folosesc trasee pietonale demonstrative.</p><div className='area-map-filters'>{['Transport', 'Școli', 'Parcuri', 'Magazine', 'Clinici'].map((item) => <button className={mapLayers.includes(item) ? 'active' : ''} type='button' aria-pressed={mapLayers.includes(item)} onClick={() => toggleMapLayer(item)} key={item}>{item}</button>)}</div><small>{mapLayers.length ? `Straturi active: ${mapLayers.join(', ')}` : 'Niciun strat suplimentar selectat'}</small></div><ListingMap items={properties.slice(0, 5)} mode='rent' navigate={props.navigate} /></div></section>

      <section className='section area-mobility' id='zona-mobilitate'><div className='container'><div className='section-heading'><div><span className='eyebrow'>La îndemână</span><h2>Transport și servicii cotidiene</h2></div></div><div className='area-place-grid'>{places.map(([title, value, detail]) => <article key={title}><span><Icon name={title === 'Transport' ? 'map' : title === 'Parcuri' ? 'home' : 'building'} /></span><div><strong>{value}</strong><h3>{title}</h3><p>{detail}</p></div></article>)}</div><div className='commute-card'><div><span>Destinație</span><strong>Piața Marii Adunări Naționale</strong></div><div><span>Pe jos</span><strong>14 min</strong></div><div><span>Transport public</span><strong>8 min</strong></div><div><span>Cu bicicleta</span><strong>6 min</strong></div></div></div></section>

      <section className='section area-life' id='zona-viață'><div className='container area-life-layout'><div><span className='eyebrow'>Experiența zonei</span><h2>Cum se simte viața în Centru.</h2><div className='area-pros-cons'><article><h3>Avantaje frecvente</h3>{['Transport foarte bun', 'Servicii la distanță mică', 'Acces rapid spre centru', 'Oferta mare de restaurante'].map((item) => <span key={item}><Icon name='check' size={16} /> {item}</span>)}</article><article><h3>De avut în vedere</h3>{['Trafic la orele de vârf', 'Parcare limitată pe unele străzi', 'Zgomot variabil', 'Prețuri peste media orașului'].map((item) => <span key={item}><Icon name='shield' size={16} /> {item}</span>)}</article></div></div><div className='street-complex-card'><h3>Străzi și complexe urmărite</h3>{[['str. Lev Tolstoi', '32 proprietăți'], ['bd. Ștefan cel Mare', '28 proprietăți'], ['str. Ismail', '21 proprietăți'], ['Toro Center', '12 proprietăți'], ['Crown Plaza Park', '9 proprietăți']].map(([name, count]) => <button type='button' onClick={() => openTrackedPlace(name)} key={name}><span><strong>{name}</strong><small>{count}</small></span><Icon name='arrow-right' /></button>)}</div></div></section>

      <section className='section area-reviews-v2' id='zona-recenzii'><div className='container'><div className='section-heading'><div><span className='eyebrow'>Părerea comunității</span><h2>Recenzii despre Centru</h2></div><button className='button button-secondary' type='button' onClick={() => props.navigate('/scrie-recenzie')}>Scrie despre zonă</button></div><div className='area-review-grid'>{recentReviews.map((review) => <article key={review.id}><header><span className='avatar'>{review.initials}</span><div><strong>{review.name}</strong><small>Locuiește în Centru · verificat</small></div><b><Icon name='star' size={15} /> {review.rating}</b></header><p>{review.text}</p><div><span>Zonă <b>4,6</b></span><span>Transport <b>4,8</b></span><span>Siguranță <b>4,3</b></span></div></article>)}</div></div></section>

      <section className='section area-properties-v2' id='zona-proprietăți'><div className='container'><div className='section-heading'><div><span className='eyebrow'>Disponibile acum</span><h2>Proprietăți în Centru</h2></div><button className='text-link' type='button' onClick={() => props.navigate('/chirie')}>Vezi toate <Icon name='arrow-right' size={17} /></button></div><div className='property-grid'>{properties.slice(0, 3).map((property) => <PropertyCard property={property} key={property.id} {...props} />)}</div></div></section>

      <section className='section area-compare-v2' id='zona-comparație'><div className='container'><div className='section-heading'><div><span className='eyebrow'>Compară zonele</span><h2>Centru față de alte sectoare</h2></div></div><div className='area-compare-table'><div className='compare-area-head'><span>Zonă</span><span>Chirie 2 camere</span><span>Vânzare / m²</span><span>Transport</span><span>Zgomot</span><span>Scor total</span></div>{[['Centru', '€590', '€1.820', '4,8', '3,6', '4,5'], ['Râșcani', '€540', '€1.610', '4,6', '4,0', '4,4'], ['Botanica', '€490', '€1.480', '4,4', '3,9', '4,2'], ['Buiucani', '€520', '€1.560', '4,3', '4,2', '4,3']].map((row, index) => <div className={index === 0 ? 'active' : ''} key={row[0]}>{row.map((cell, cellIndex) => <span key={`${row[0]}-${cellIndex}`}>{cell}</span>)}</div>)}</div></div></section>
    </div>
  )
}
