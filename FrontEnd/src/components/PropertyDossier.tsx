import { useState } from 'react'
import { properties, type SharedPageProps } from '../data'
import { Icon, type IconName } from './Icon'

const dossierViews: Array<{ id: string; label: string; icon: IconName; title: string; text: string; facts: string[] }> = [
  { id: 'price', label: 'Preț', icon: 'chart', title: 'Prețul a crescut cu 5,8% în 12 luni', text: 'Valoarea curentă este apropiată de media blocului și cu 4% sub media zonei pentru apartamente comparabile.', facts: ['€450 minim cunoscut', '€650 preț curent', '4 evenimente documentate'] },
  { id: 'owners', label: 'Proprietate', icon: 'user', title: '2 perioade de proprietate cunoscute', text: 'Transferul din 2024 este confirmat prin document. Identitatea proprietarului anterior rămâne protejată.', facts: ['2019–2024 proprietar anterior', '2024–prezent proprietar verificat', 'Administrator confirmat'] },
  { id: 'rent', label: 'Chirii', icon: 'key', title: '2 perioade de ocupare verificate', text: 'Ultimul contract s-a încheiat după 23 de luni. Apartamentul a fost liber aproximativ șase săptămâni.', facts: ['€480 chirie inițială', '43 luni ocupare cunoscută', '2 recenzii asociate'] },
  { id: 'works', label: 'Lucrări', icon: 'renovation', title: 'Renovare completă în august 2024', text: 'Bucătăria, baia și instalația electrică au fost refăcute. Costurile sunt susținute de facturi și fotografii.', facts: ['€18.400 cost raportat', '3 camere afectate', '+11% efect estimat'] },
]

export function PropertyDossier({ navigate }: Pick<SharedPageProps, 'navigate'>) {
  const [active, setActive] = useState('price')
  const property = properties[0]
  const view = dossierViews.find((item) => item.id === active) ?? dossierViews[0]

  return (
    <section className='dossier-section'>
      <div className='container'>
        <div className='dossier-intro'>
          <div><span className='eyebrow'>Valoarea unică a platformei</span><h2>Un dosar al proprietății, nu doar un anunț.</h2></div>
          <p>Adunăm informațiile relevante pentru o decizie importantă și arătăm clar ce este verificat, estimat sau raportat de comunitate.</p>
        </div>

        <div className='dossier-workspace'>
          <div className='dossier-property'>
            <div className='dossier-image'><img src={property.image} alt={`Interior ${property.address}`} /><span><Icon name='shield' size={15} /> Fotografii verificate</span></div>
            <div className='dossier-identity'>
              <span className='badge badge-rent'>De închiriat</span>
              <h3>{property.address}</h3>
              <p>{property.district} · {property.complex} · 2 camere · 64 m²</p>
            </div>
            <div className='dossier-price-row'>
              <div><small>Preț curent</small><strong>€650<span>/lună</span></strong></div>
              <div><small>Preț anterior</small><b>€615/lună</b></div>
              <span className='price-change positive'>+5,8% <small>în 12 luni</small></span>
            </div>
            <div className='dossier-alert'><Icon name='shield' /><p><strong>Nicio dispută activă</strong><span>Ultima verificare a datelor: 12 iulie 2026</span></p></div>
          </div>

          <div className='dossier-detail'>
            <div className='dossier-tabs' role='tablist' aria-label='Conținutul dosarului'>
              {dossierViews.map((item) => <button className={active === item.id ? 'active' : ''} type='button' role='tab' aria-selected={active === item.id} onClick={() => setActive(item.id)} key={item.id}><Icon name={item.icon} /> {item.label}</button>)}
            </div>
            <div className='dossier-view' key={view.id}>
              <div className='dossier-view-copy'><span>Rezumat verificat</span><h3>{view.title}</h3><p>{view.text}</p></div>
              <div className='dossier-facts'>{view.facts.map((fact) => <span key={fact}><Icon name='check' size={16} /> {fact}</span>)}</div>
              <div className='mini-price-chart' aria-label='Grafic demonstrativ al evoluției prețului'>
                <div className='chart-axis'><span>€700</span><span>€550</span><span>€400</span></div>
                <svg viewBox='0 0 620 150' preserveAspectRatio='none' aria-hidden='true'><defs><linearGradient id='dossier-fill' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stopColor='#1768e5' stopOpacity='.22' /><stop offset='1' stopColor='#1768e5' stopOpacity='0' /></linearGradient></defs><path className='chart-area' d='M0 124 C80 115 90 98 155 100 S250 88 310 82 S410 78 470 50 S560 42 620 18 L620 150 L0 150Z' /><path className='chart-line' d='M0 124 C80 115 90 98 155 100 S250 88 310 82 S410 78 470 50 S560 42 620 18' /><circle cx='620' cy='18' r='5' /></svg>
                <div className='chart-dates'><span>2020</span><span>2022</span><span>2024</span><span>Acum</span></div>
              </div>
              <div className='dossier-sources'><span><Icon name='file' /> Contract anonimizat</span><span><Icon name='shield' /> Extras cadastral</span><span><Icon name='user' /> Confirmare proprietar</span></div>
            </div>
            <button className='dossier-open button button-primary' type='button' onClick={() => navigate(`/proprietate/${property.slug}`)}>Vezi dosarul complet <Icon name='arrow-right' /></button>
          </div>
        </div>
      </div>
    </section>
  )
}
