import { useState } from 'react'
import { galleryImages, historyEvents, money, occupancyHistory, ownerHistory, properties, propertyBySlug, recentReviews, type SharedPageProps } from '../data'
import { BeforeAfterSlider } from './BeforeAfterSlider'
import { Icon } from './Icon'
import { PropertyCard } from './PropertyCard'

interface PropertyPageProps extends SharedPageProps { slug: string }

const amenityGroups = [
  { title: 'Interior', items: ['Complet mobilat', 'Aer condiționat', 'Dressing', '2 balcoane'] },
  { title: 'Clădire', items: ['Ascensor', 'Interfon', 'Curte închisă', 'Acces adaptat'] },
  { title: 'Utilități', items: ['Încălzire autonomă', 'Fibră optică', 'Contoare individuale', 'Filtru de apă'] },
  { title: 'Parcare și reguli', items: ['Loc subteran inclus', 'Biciclete', 'Animale negociabil', 'Fumatul interzis'] },
]

export function PropertyPage({ slug, ...shared }: PropertyPageProps) {
  const property = propertyBySlug(slug)
  const [modal, setModal] = useState<'contact' | 'report' | null>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const saved = shared.favorites.includes(property.id)
  const compared = shared.compare.includes(property.id)
  const isRent = property.mode === 'rent'

  return (
    <div className="property-page">
      <div className="container property-topbar">
        <div className="breadcrumb"><button type="button" onClick={() => shared.navigate(isRent ? '/chirie' : '/cumpara')}><Icon name="arrow-right" className="back-icon" /> Înapoi la rezultate</button><span>/</span><span>{property.district}</span><span>/</span><strong>{property.address}</strong></div>
        <div className="property-top-actions"><button type="button" onClick={() => shared.toggleFavorite(property.id)}><Icon name="heart" />{saved ? 'Salvat' : 'Salvează'}</button><button type="button" onClick={() => shared.toggleCompare(property.id)}><Icon name="compare" />{compared ? 'În comparație' : 'Compară'}</button><button type="button" onClick={() => shared.notify('Linkul proprietății a fost copiat')}><Icon name="arrow-right" />Distribuie</button><button type="button" onClick={() => setModal('report')}><Icon name="shield" />Raportează</button></div>
      </div>

      <div className="container property-stage-label decision-stage"><span>01</span><div><strong>Decizia imediată</strong><small>Ofertă, fotografii, costuri și contact</small></div></div>

      <section className="container property-gallery">
        <button className="gallery-main" type="button" onClick={() => setGalleryOpen(true)}><img src={galleryImages[0].src} alt={galleryImages[0].alt} /></button>
        {galleryImages.slice(1).map((image, index) => <button className={`gallery-small gallery-${index + 1}`} type="button" onClick={() => setGalleryOpen(true)} key={image.src}><img src={image.src} alt={image.alt} />{index === 2 && <span>Vezi toate cele 18 fotografii</span>}</button>)}
        <div className="gallery-meta"><span><Icon name="shield" size={15} /> Imagini verificate</span><span><Icon name="clock" size={15} /> Fotografiate la 08 iulie 2026</span></div>
      </section>

      {property.status === 'unavailable' && <div className="container property-alert"><span>!</span><div><strong>Această proprietate nu mai este disponibilă.</strong><p>Poți consulta în continuare istoricul și recenziile sau poți vedea proprietăți similare.</p></div><button type="button" onClick={() => shared.navigate(isRent ? '/chirie' : '/cumpara')}>Vezi alternative</button></div>}

      <section className="container property-summary-layout">
        <div className="property-summary-main">
          <div className="summary-badges"><span className={`badge badge-${property.mode}`}>{isRent ? 'De închiriat' : 'De vânzare'}</span><span className="trust-label verified"><Icon name="shield" size={14} /> Verificat prin document</span><span className="trust-label owner">Confirmat de proprietar</span></div>
          <h1>{property.address}</h1><p className="summary-location">{property.district} · Complexul {property.complex} · <button type="button" onClick={() => shared.navigate('/harta')}>Vezi pe hartă</button></p>
          <div className="summary-price-row">
            <div className="summary-current-price"><span>Preț actual</span><strong>{money(property.price)}{isRent && <small>/lună</small>}</strong>{!isRent && <small>{money(property.pricePerSqm)}/m²</small>}</div>
            <div className="summary-old-price"><span>Preț anterior</span><strong>{money(property.previousPrice)}{isRent && '/lună'}</strong></div>
            <div className={property.trend >= 0 ? 'summary-trend positive' : 'summary-trend negative'}><span>Evoluție</span><strong>{property.trend >= 0 ? '↗ +' : '↘ −'}{Math.abs(property.trend).toLocaleString('ro-RO')}%</strong><small>{property.trendLabel}</small></div>
          </div>
          <div className="summary-spec-grid"><div><span>Camere</span><strong>{property.rooms}</strong></div><div><span>Suprafață</span><strong>{property.area} m²</strong></div><div><span>Etaj</span><strong>{property.floor}</strong></div><div><span>An construcție</span><strong>{property.year}</strong></div><div><span>Rating</span><strong>★ {property.rating}</strong><small>{property.reviews} recenzii</small></div><div><span>Actualizat</span><strong>12 iul. 2026</strong><small>acum 4 zile</small></div></div>
        </div>

        <aside className="contact-card">
          <span className="contact-card-label">{isRent ? 'Condiții de închiriere' : 'Detalii ofertă'}</span>
          <strong className="contact-price">{money(property.price)}{isRent && <small>/lună</small>}</strong>
          {isRent ? <div className="contact-costs"><div><span>Garanție</span><b>€650</b></div><div><span>Comision</span><b>0%</b></div><div><span>Utilități estimate</span><b>€85–120/lună</b></div><div><span>Disponibilitate</span><b className="semantic-positive">De la 1 august</b></div></div> : <div className="contact-costs"><div><span>Preț/m²</span><b>{money(property.pricePerSqm)}</b></div><div><span>Estimare de piață</span><b>€114.000–121.000</b></div><div><span>Față de media zonei</span><b className="semantic-positive">−2,1%</b></div><div><span>Disponibilitate</span><b>Vizionări în 24h</b></div></div>}
          <button className="button button-primary button-full" type="button" onClick={() => setModal('contact')}>Solicită o vizionare</button>
          <button className="button button-secondary button-full" type="button" onClick={() => setModal('contact')}>{isRent ? 'Trimite mesaj' : 'Contactează vânzătorul'}</button>
          {!isRent && <button className="contact-offer" type="button" onClick={() => setModal('contact')}>Trimite o ofertă</button>}
          <div className="contact-person"><span>VI</span><div><strong>Victor I.</strong><small>Proprietar verificat · răspunde în ~2 ore</small></div></div>
          <p className="contact-safety">Nu trimite bani înainte de vizionare și verificarea documentelor.</p>
        </aside>
      </section>

      <nav className="property-anchor-nav" aria-label="Secțiunile proprietății"><div className="container">{[['Prezentare', 'prezentare'], ['Istoric preț', 'istoric-pret'], ['Proprietate', 'proprietari'], ['Chirii', 'chirii'], ['Renovări', 'renovari'], ['Recenzii', 'recenzii-proprietate'], ['Bloc', 'bloc'], ['Zonă', 'zona']].map(([label, id]) => <a href={`#${id}`} key={id}>{label}</a>)}</div></nav>

      <div className="container property-content-layout">
        <div className="property-sections">
          <section className="detail-section" id="prezentare">
            <div className="detail-section-head"><div><span className="section-kicker">Prezentare</span><h2>Descriere și facilități</h2></div><span className="trust-label owner">Confirmat de proprietar</span></div>
            <p className="long-description">Apartament cu două camere și planificare practică, într-un bloc finalizat în 2019. Livingul este conectat cu bucătăria, dormitorul are dressing separat, iar ferestrele sunt orientate spre curtea interioară. Informațiile despre dotări provin din anunț și au fost confirmate în timpul verificării fotografiilor.</p>
            <div className="amenity-groups">{amenityGroups.map((group) => <div key={group.title}><strong>{group.title}</strong>{group.items.map((item) => <span key={item}>✓ {item}</span>)}</div>)}</div>
          </section>

          <div className="property-level-divider risk-level"><span>02</span><div><strong>Istoric și riscuri</strong><small>Prețuri, proprietate, ocupare, renovări și surse</small></div><Icon name="history" /></div>

          <section className="detail-section" id="istoric-pret">
            <div className="detail-section-head"><div><span className="section-kicker">Valoarea centrală a dosarului</span><h2>Istoricul și analiza prețului</h2><p>Evenimentele sunt marcate după tip și afișate împreună cu sursa.</p></div><div className="history-switch"><button className="active" type="button">Chirie</button><button type="button">Vânzare</button></div></div>
            <div className="history-metrics"><div><span>Preț curent</span><strong>€650/lună</strong></div><div><span>Preț anterior</span><strong>€615/lună</strong></div><div><span>Minim înregistrat</span><strong>€450/lună</strong></div><div><span>Maxim înregistrat</span><strong>€650/lună</strong></div><div><span>Schimbare totală</span><strong className="semantic-positive">+44,4%</strong></div><div><span>Preț/m²</span><strong>€10,15</strong></div></div>
            <div className="price-chart" aria-label="Grafic demonstrativ al evoluției chiriei între 2019 și 2026">
              <div className="chart-axis"><span>€700</span><span>€600</span><span>€500</span><span>€400</span></div>
              <div className="chart-grid-lines"><i /><i /><i /><i /></div>
              <div className="chart-area" />
              <div className="chart-line"><i className="segment s1" /><i className="segment s2" /><i className="segment s3" /><i className="segment s4" /><i className="segment s5" /></div>
              <div className="chart-points"><span className="p1" data-value="€450" /><span className="p2" data-value="€480" /><span className="p3" data-value="€520" /><span className="p4" data-value="€570" /><span className="p5" data-value="€615" /><span className="p6" data-value="€650" /></div>
              <div className="chart-events"><span className="e1">Listare</span><span className="e2">Contract</span><span className="e3">Renovare</span><span className="e4">Listare</span></div>
              <div className="chart-years"><span>2019</span><span>2020</span><span>2022</span><span>2024</span><span>2025</span><span>2026</span></div>
            </div>
            <div className="history-table-wrap"><table className="history-table"><thead><tr><th>Data</th><th>Eveniment</th><th>Preț</th><th>Diferență</th><th>Sursa</th><th>Verificare</th></tr></thead><tbody>{historyEvents.map((item) => <tr key={item.date}><td>{item.date}</td><td><strong>{item.event}</strong></td><td>{item.price}</td><td className={item.change.startsWith('+') ? 'semantic-positive' : ''}>{item.change}</td><td>{item.source}</td><td><span className="trust-label verified">✓ {item.trust}</span></td></tr>)}</tbody></table></div>
          </section>

          <section className="detail-section" id="proprietari">
            <div className="detail-section-head"><div><span className="section-kicker">Identități protejate</span><h2>Istoricul proprietății și administrării</h2><p>Nu publicăm nume complete sau date personale fără acord.</p></div><span className="trust-label verified">Verificat prin document</span></div>
            <div className="owner-timeline">{ownerHistory.map((item, index) => <article key={item.period + item.title}><div className="timeline-marker">{index + 1}</div><div><span>{item.period}</span><h3>{item.title}</h3><strong>{item.person}</strong><p>{item.details}</p></div><b>Rating {item.rating}</b></article>)}</div>
          </section>

          <section className="detail-section" id="chirii">
            <div className="detail-section-head"><div><span className="section-kicker">Ocupare anonimizată</span><h2>Istoricul perioadelor de chirie</h2><p>Nu afișăm public lista sau numele chiriașilor.</p></div><span className="trust-label tenant">Confirmat de chiriaș</span></div>
            <div className="occupancy-list">{occupancyHistory.map((item) => <article key={item.period}><div><span>Perioada</span><strong>{item.period}</strong></div><div><span>Chirie raportată</span><strong>{item.rent}</strong></div><div><span>Durată</span><strong>{item.duration}</strong></div><div><span>Status</span><strong>{item.status}</strong></div><div><span>Motivul plecării</span><strong>{item.reason}</strong></div><div><span>Recenzie asociată</span><strong>★ {item.review}</strong></div></article>)}</div>
          </section>

          <section className="detail-section" id="renovari">
            <div className="detail-section-head"><div><span className="section-kicker">August 2024</span><h2>Renovare completă</h2><p>Living, bucătărie, baie și instalația electrică · cost raportat €18.400</p></div><span className="trust-label verified">✓ Facturi verificate</span></div>
            <BeforeAfterSlider />
            <div className="renovation-info"><div><span>Lucrări</span><strong>Instalație electrică, pardoseală, bucătărie, baie</strong></div><div><span>Sursa</span><strong>Facturi, fotografii și confirmarea proprietarului</strong></div><div><span>Observație</span><strong>Garanție declarată pentru instalații până în 2029</strong></div></div>
          </section>

          <div className="property-level-divider context-level"><span>03</span><div><strong>Contextul deciziei</strong><small>Recenzii, bloc, zonă și alternative comparabile</small></div><Icon name="map" /></div>

          <section className="detail-section" id="recenzii-proprietate">
            <div className="detail-section-head"><div><span className="section-kicker">46 de experiențe</span><h2>Recenzii despre proprietate</h2></div><button className="button button-secondary" type="button" onClick={() => shared.navigate('/scrie-recenzie')}>Scrie o recenzie</button></div>
            <div className="review-overview"><div className="rating-total"><strong>4,6</strong><span>★★★★★</span><small>din 46 recenzii</small></div><div className="rating-bars">{[['5', 72], ['4', 20], ['3', 6], ['2', 2], ['1', 0]].map(([stars, value]) => <div key={stars}><span>{stars}</span><i><b style={{ width: `${value}%` }} /></i><small>{value}%</small></div>)}</div><div className="category-ratings">{[['Starea apartamentului', '4,8'], ['Izolare fonică', '4,1'], ['Încălzire', '4,7'], ['Proprietar', '4,8'], ['Bloc', '4,4'], ['Zonă', '4,6'], ['Calitate/preț', '4,3']].map(([label, score]) => <div key={label}><span>{label}</span><strong>{score}</strong></div>)}</div></div>
            <div className="review-toolbar"><div><button className="active" type="button">Toate</button><button type="button">Chiriași</button><button type="button">Cumpărători</button><button type="button">Cu fotografii</button></div><select aria-label="Sortează recenziile"><option>Cele mai utile</option><option>Cele mai noi</option><option>Rating mare</option></select></div>
            <div className="property-review-list">{recentReviews.slice(0, 2).map((review) => <article className="review-card" key={review.id}><header><span className="avatar">{review.initials}</span><div><strong>{review.name}</strong><small>{review.role} · {review.period}</small></div><b>★ {review.rating}</b></header><p>{review.text}</p><div className="review-pros-cons"><span className="pros"><b>Avantaje</b> {review.pros}</span><span className="cons"><b>Dezavantaje</b> {review.cons}</span></div><div className="owner-response"><strong>Răspunsul proprietarului</strong><p>Mulțumesc pentru feedback. Am transmis administratorului observația despre parcare.</p></div><footer><button type="button">Util ({review.helpful})</button><button type="button" onClick={() => setModal('report')}>Raportează</button></footer></article>)}</div>
          </section>

          <section className="detail-section" id="bloc">
            <div className="detail-section-head"><div><span className="section-kicker">Clădirea</span><h2>Blocul Toro Center</h2></div><button className="text-link" type="button" onClick={() => shared.navigate('/bloc/toro-center')}>Vezi pagina blocului →</button></div>
            <div className="building-summary"><img src={galleryImages[3].src} alt="Fațada blocului Toro Center" /><div className="building-facts"><div><span>An construcție</span><strong>2019</strong></div><div><span>Structură</span><strong>Cadru din beton armat</strong></div><div><span>Ascensoare</span><strong>2 · revizie în 2026</strong></div><div><span>Administrare</span><strong>Urban Management SRL</strong></div><div><span>Parcare</span><strong>Subterană + oaspeți</strong></div><div><span>Rating bloc</span><strong>★ 4,4/5</strong></div></div></div>
            <div className="issues-row"><div><span className="status-dot warning" /><p><strong>Presiune redusă la apă</strong><small>Raportat la etajele 10–12 · în analiză</small></p><span className="trust-label community">Raportat de comunitate</span></div><div><span className="status-dot good" /><p><strong>Reparație intrare</strong><small>Finalizată în februarie 2026</small></p><span className="trust-label owner">Confirmat de administrator</span></div></div>
          </section>

          <section className="detail-section" id="zona">
            <div className="detail-section-head"><div><span className="section-kicker">Centru</span><h2>Zona și punctele de interes</h2></div><button className="text-link" type="button" onClick={() => shared.navigate('/zona/centru')}>Vezi ghidul zonei →</button></div>
            <div className="area-layout"><div className="area-map"><div className="map-streets"><i /><i /><i /><i /><i /></div><span className="home-pin">⌂</span><span className="poi poi-1">Școală</span><span className="poi poi-2">Parc</span><span className="poi poi-3">Market</span><span className="poi poi-4">Clinică</span></div><div className="nearby-list">{[['Troleibuz 8, 17, 22', '3 min'], ['Liceul „Gheorghe Asachi”', '7 min'], ['Kaufland', '6 min'], ['Parcul Valea Trandafirilor', '12 min'], ['Clinica Medpark', '9 min']].map(([place, time]) => <div key={place}><span>⌖</span><strong>{place}</strong><b>{time}</b></div>)}<div className="area-scores"><span>Zgomot <b>Mediu</b></span><span>Siguranță percepută <b>4,3/5</b></span><span>Transport <b>4,8/5</b></span></div></div></div>
          </section>
        </div>
      </div>

      <section className="section similar-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Alternative comparabile</span><h2>Proprietăți similare</h2></div><button className="text-link" type="button" onClick={() => shared.navigate(isRent ? '/chirie' : '/cumpara')}>Vezi toate →</button></div><div className="property-grid">{properties.filter((item) => item.mode === property.mode && item.id !== property.id).slice(0, 3).map((item) => <PropertyCard property={item} key={item.id} {...shared} />)}</div></div></section>

      <div className="mobile-property-cta"><div><span>{isRent ? 'Chirie lunară' : 'Preț cerut'}</span><strong>{money(property.price)}{isRent && <small>/lună</small>}</strong></div><button className="button button-primary" type="button" onClick={() => setModal('contact')}>{isRent ? 'Solicită vizionare' : 'Contactează vânzătorul'}</button></div>

      {galleryOpen && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Galeria proprietății"><div className="gallery-modal"><button className="modal-close" type="button" aria-label="Închide galeria" onClick={() => setGalleryOpen(false)}>×</button><h2>Fotografii verificate</h2><p>4 din 18 fotografii demonstrative · realizate la 08 iulie 2026</p><div>{galleryImages.map((image) => <img src={image.src} alt={image.alt} key={image.src} />)}</div></div></div>}
      {modal && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="property-modal-title"><div className="form-modal"><button className="modal-close" type="button" aria-label="Închide" onClick={() => setModal(null)}>×</button>{modal === 'contact' ? <><span className="eyebrow">Solicitare demonstrativă</span><h2 id="property-modal-title">Programează o vizionare</h2><p>Alege o zi și lasă datele la care dorești să fii contactat.</p><label>Nume<input placeholder="Numele tău" /></label><label>Telefon<input placeholder="+373 6xx xxx xx" /></label><label>Zi preferată<select><option>Sâmbătă, 18 iulie</option><option>Duminică, 19 iulie</option><option>Luni, 20 iulie</option></select></label><button className="button button-primary button-full" type="button" onClick={() => { setModal(null); shared.notify('Solicitarea demonstrativă a fost înregistrată') }}>Trimite solicitarea</button></> : <><span className="eyebrow">Siguranța comunității</span><h2 id="property-modal-title">Raportează o informație</h2><p>Spune-ne ce pare incorect. Raportarea nu va fi publicată automat.</p><label>Motiv<select><option>Preț incorect</option><option>Fotografii neactuale</option><option>Informație personală</option><option>Conținut înșelător</option></select></label><label>Detalii<textarea placeholder="Descrie problema…" /></label><button className="button button-primary button-full" type="button" onClick={() => { setModal(null); shared.notify('Raportarea a fost trimisă spre analiză') }}>Trimite raportarea</button></>}</div></div>}
    </div>
  )
}
