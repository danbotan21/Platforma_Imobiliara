import { useState } from 'react'
import { galleryImages, historyEvents, type SharedPageProps } from '../data'

export function AddressCheckPage({ navigate }: SharedPageProps) {
  const [query, setQuery] = useState('str. Lev Tolstoi 24/1')
  const [checked, setChecked] = useState(true)

  return (
    <div className="address-page">
      <section className="address-hero"><div className="container"><span className="eyebrow">Verifică înainte să semnezi</span><h1>Istoricul unei adrese, într-un singur loc.</h1><p>Introdu o adresă exactă pentru a vedea prețuri cunoscute, perioade de chirie, renovări, recenzii și informații despre bloc.</p><div className="address-search"><span>⌖</span><input value={query} onChange={(event) => { setQuery(event.target.value); setChecked(false) }} placeholder="Stradă, număr, bloc, apartament" /><button className="button button-primary" type="button" onClick={() => setChecked(Boolean(query.trim()))}>Verifică adresa</button></div><small>Datele sensibile și identitatea chiriașilor nu sunt afișate public.</small></div></section>

      {checked ? <section className="section"><div className="container address-report">
        <div className="report-heading"><div><span className="trust-label verified">✓ Adresă identificată</span><h2>str. Lev Tolstoi 24/1, ap. 47</h2><p>Centru · Toro Center · cod dosar LOC-2481</p></div><button className="button button-secondary" type="button" onClick={() => navigate('/proprietate/lev-tolstoi-24')}>Deschide dosarul complet</button></div>
        <div className="report-grid"><div className="report-cover"><img src={galleryImages[0].src} alt="Apartamentul identificat" /><div><strong>Potrivire confirmată</strong><span>Fotografii din iulie 2026</span></div></div><div className="report-facts"><article><span>Preț actual cunoscut</span><strong>€650/lună</strong><small className="semantic-positive">+5,8% în 12 luni</small></article><article><span>Evenimente în istoric</span><strong>7</strong><small>4 verificate prin document</small></article><article><span>Perioade de chirie</span><strong>2</strong><small>anonimizate</small></article><article><span>Renovări</span><strong>1</strong><small>cu fotografii înainte/după</small></article><article><span>Recenzii</span><strong>46</strong><small>rating 4,6/5</small></article><article><span>Probleme active</span><strong>1</strong><small>raportată de comunitate</small></article></div></div>
        <div className="trust-explanation"><h3>Cum citim datele</h3><div><span className="trust-label verified">Verificat prin document</span><span className="trust-label owner">Confirmat de proprietar</span><span className="trust-label tenant">Confirmat de chiriaș</span><span className="trust-label community">Raportat de comunitate</span><span className="trust-label estimate">Estimare</span><span className="trust-label unverified">Neverificat</span><span className="trust-label disputed">Contestat</span></div></div>
        <div className="compact-timeline"><h3>Ultimele evenimente cunoscute</h3>{historyEvents.slice(0, 3).map((event) => <div key={event.date}><span>{event.date}</span><strong>{event.event}</strong><b>{event.price}</b><small className="trust-label verified">{event.trust}</small></div>)}</div>
      </div></section> : <section className="section"><div className="container empty-state"><span>⌖</span><h2>Introdu o adresă completă</h2><p>Adaugă strada, numărul blocului și, dacă este relevant, apartamentul.</p></div></section>}
    </div>
  )
}
