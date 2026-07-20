import { properties, type SharedPageProps } from '../data'
import { Icon, type IconName } from './Icon'
import { PropertyCard } from './PropertyCard'

const journeys: Array<{ icon: IconName; title: string; text: string; action: string; path: string; tone: string }> = [
  { icon: 'key', title: 'Găsește o chirie', text: 'Costuri lunare, condiții, istoric și recenzii de la foști chiriași.', action: 'Vezi chirii', path: '/chirie', tone: 'rent' },
  { icon: 'home', title: 'Cumpără informat', text: 'Preț pe m², tranzacții anterioare și comparație cu blocul și zona.', action: 'Vezi proprietăți', path: '/cumpara', tone: 'sale' },
  { icon: 'history', title: 'Verifică o adresă', text: 'Caută direct o proprietate, chiar dacă nu are un anunț activ acum.', action: 'Începe verificarea', path: '/verifica', tone: 'history' },
]

export function HomeDiscovery(props: SharedPageProps) {
  return (
    <>
      <section className='journey-section'>
        <div className='container journey-grid'>
          {journeys.map((item) => <button className={`journey-card ${item.tone}`} type='button' onClick={() => props.navigate(item.path)} key={item.path}><span className='journey-icon'><Icon name={item.icon} /></span><div><h3>{item.title}</h3><p>{item.text}</p><b>{item.action} <Icon name='arrow-right' size={17} /></b></div></button>)}
        </div>
      </section>

      <section className='section featured-properties'>
        <div className='container'>
          <div className='section-heading'><div><span className='eyebrow'>Selecție actualizată</span><h2>Proprietăți care merită analizate</h2></div><div className='section-side-action'><p>Listări cu fotografii distincte, prețuri contextualizate și istoric disponibil.</p><button className='text-link' type='button' onClick={() => props.navigate('/chirie')}>Vezi toate <Icon name='arrow-right' size={17} /></button></div></div>
          <div className='property-grid'>{properties.slice(0, 3).map((property) => <PropertyCard property={property} key={property.id} {...props} />)}</div>
        </div>
      </section>

      <section className='verification-section'>
        <div className='container verification-layout'>
          <div className='verification-copy'>
            <span className='eyebrow'>Transparență, nu promisiuni</span>
            <h2>Știi de unde vine fiecare informație.</h2>
            <p>Nu prezentăm toate datele ca fiind automat adevărate. Fiecare element important primește o sursă și un nivel de încredere.</p>
            <div className='verification-labels'><span className='trust-label verified'><Icon name='file' size={15} /> Verificat prin document</span><span className='trust-label owner'><Icon name='user' size={15} /> Confirmat de proprietar</span><span className='trust-label community'>Raportat de comunitate</span><span className='trust-label estimate'>Estimare</span><span className='trust-label disputed'>Contestat</span></div>
            <button className='button button-secondary' type='button' onClick={() => props.navigate('/verifica')}>Cum verificăm datele</button>
          </div>
          <div className='verification-steps'>
            <article><span>01</span><div><Icon name='search' /><h3>Identificăm proprietatea</h3><p>Corelăm adresa, blocul și apartamentul cu înregistrările cunoscute.</p></div></article>
            <article><span>02</span><div><Icon name='file' /><h3>Verificăm sursa</h3><p>Documentele sensibile sunt procesate cu informațiile personale protejate.</p></div></article>
            <article><span>03</span><div><Icon name='shield' /><h3>Arătăm nivelul de încredere</h3><p>Poți separa rapid faptele verificate de estimări și raportări.</p></div></article>
          </div>
        </div>
      </section>

      <section className='section home-map-section'>
        <div className='container home-map-layout'>
          <div className='home-map-copy'><span className='eyebrow'>Explorează Chișinăul</span><h2>Compară proprietăți fără să pierzi contextul zonei.</h2><p>Vezi prețurile direct pe hartă și deschide informații despre bloc, transport, servicii și zgomot.</p><ul><li><Icon name='check' /> Chirie și vânzare pe straturi separate</li><li><Icon name='check' /> Prețuri vizibile fără deschiderea fiecărui anunț</li><li><Icon name='check' /> Scoruri pentru bloc și zonă</li></ul><button className='button button-primary' type='button' onClick={() => props.navigate('/harta')}><Icon name='map' /> Deschide harta</button></div>
          <div className='product-map-preview'>
            <div className='map-park'>Valea Morilor</div><div className='map-river' /><div className='map-road road-one' /><div className='map-road road-two' /><div className='map-road road-three' />
            <span className='map-district district-one'>Centru</span><span className='map-district district-two'>Râșcani</span><span className='map-district district-three'>Botanica</span>
            {properties.slice(0, 5).map((property) => <button className={`map-property-pin ${property.mode}`} style={{ left: `${property.mapX}%`, top: `${property.mapY}%` }} type='button' onClick={() => props.navigate(`/proprietate/${property.slug}`)} key={property.id}>{property.mode === 'rent' ? `€${property.price}` : `€${Math.round(property.price / 1000)}k`}</button>)}
            <div className='map-floating-card'><img src={properties[1].image} alt='' /><div><span>Râșcani</span><strong>€118.500</strong><small>3 camere · 82 m²</small></div></div>
          </div>
        </div>
      </section>
    </>
  )
}
