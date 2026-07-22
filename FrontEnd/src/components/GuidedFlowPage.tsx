import { useState } from 'react'
import { galleryImages, type SharedPageProps } from '../data'
import { Icon, type IconName } from './Icon'

type FlowKind = 'publish' | 'review' | 'contribute'

interface GuidedFlowPageProps extends SharedPageProps { kind: FlowKind }

const publishSteps = ['Tipul anunțului', 'Adresa', 'Caracteristici', 'Preț', 'Fotografii', 'Facilități', 'Contact', 'Verificare', 'Previzualizare', 'Publicare']
const reviewSteps = ['Proprietatea', 'Relația', 'Perioada', 'Ratinguri', 'Avantaje', 'Experiența', 'Fotografii', 'Verificare', 'Previzualizare', 'Moderare']
const contributeSteps = ['Proprietatea', 'Tipul informației', 'Detalii', 'Verificare', 'Previzualizare']

const copy = {
  publish: { eyebrow: 'Flux separat', title: 'Publică un anunț', description: 'Adaugă o proprietate pentru chirie sau vânzare. Poți salva și continua mai târziu.', action: 'Trimite spre publicare' },
  review: { eyebrow: 'Experiență personală', title: 'Scrie o recenzie', description: 'Recenzia va fi asociată proprietății și trimisă spre moderare înainte de publicare.', action: 'Trimite spre moderare' },
  contribute: { eyebrow: 'Completează dosarul', title: 'Adaugă informații despre o proprietate', description: 'Adaugă un eveniment concret fără să creezi un anunț sau o recenzie.', action: 'Trimite informația' },
}

export function GuidedFlowPage({ kind, navigate, notify }: GuidedFlowPageProps) {
  const steps = kind === 'publish' ? publishSteps : kind === 'review' ? reviewSteps : contributeSteps
  const [step, setStep] = useState(1)
  const [listingType, setListingType] = useState<'rent' | 'sale'>('rent')
  const [relation, setRelation] = useState('fost chiriaș')
  const [contribution, setContribution] = useState('Preț anterior')
  const [submitted, setSubmitted] = useState(false)
  const info = copy[kind]

  const saveDraft = () => {
    window.localStorage.setItem(`locuinta:draft:${kind}`, JSON.stringify({ step, listingType, relation, contribution, savedAt: new Date().toISOString() }))
    notify('Progresul demonstrativ a fost salvat ca draft')
  }

  const next = () => {
    if (step < steps.length) setStep((current) => current + 1)
    else setSubmitted(true)
  }

  if (submitted) return <div className="flow-success"><div><span>✓</span><h1>{kind === 'publish' ? 'Anunț trimis spre verificare' : kind === 'review' ? 'Recenzie trimisă spre moderare' : 'Informație trimisă spre verificare'}</h1><p>Acesta este un ecran demonstrativ. În produsul real vei primi aici statusul și eventualele solicitări de completare.</p><div><button className="button button-primary" type="button" onClick={() => navigate(kind === 'publish' ? '/anunturile-mele' : '/dashboard')}>Vezi statusul</button><button className="button button-secondary" type="button" onClick={() => navigate('/')}>Înapoi acasă</button></div></div></div>

  return (
    <div className="guided-flow-page">
      <header className="flow-header"><div className="container"><button type="button" onClick={() => navigate('/')}>← Renunță</button><div><span className="eyebrow">{info.eyebrow}</span><h1>{info.title}</h1><p>{info.description}</p></div><button type="button" onClick={saveDraft}>Salvează ca draft</button></div></header>
      <div className="container flow-layout">
        <aside className="flow-stepper" aria-label="Pașii formularului">{steps.map((label, index) => <button className={step === index + 1 ? 'active' : step > index + 1 ? 'done' : ''} type="button" onClick={() => setStep(index + 1)} key={label}><span>{step > index + 1 ? '✓' : index + 1}</span><strong>{label}</strong></button>)}</aside>
        <main className="flow-form-card">
          <div className="flow-progress"><span>Pasul {step} din {steps.length}</span><i><b style={{ width: `${(step / steps.length) * 100}%` }} /></i></div>
          <div className="flow-form-heading"><h2>{steps[step - 1]}</h2><p>Completează datele demonstrative necesare pentru această etapă.</p></div>
          {kind === 'publish' && <PublishStep step={step} listingType={listingType} setListingType={setListingType} notify={notify} />}
          {kind === 'review' && <ReviewStep step={step} relation={relation} setRelation={setRelation} notify={notify} />}
          {kind === 'contribute' && <ContributionStep step={step} contribution={contribution} setContribution={setContribution} notify={notify} />}
          <div className="flow-actions"><button type="button" disabled={step === 1} onClick={() => setStep((current) => Math.max(1, current - 1))}>Înapoi</button><button className="button button-primary" type="button" onClick={next}>{step === steps.length ? info.action : 'Continuă'}</button></div>
        </main>
        <aside className="flow-summary">
          <span>Rezumat</span><h3>{kind === 'publish' ? (listingType === 'rent' ? 'Anunț de închiriere' : 'Anunț de vânzare') : kind === 'review' ? `Recenzie · ${relation}` : contribution}</h3>
          <div><span>Adresă</span><strong>str. Lev Tolstoi 24/1</strong></div>
          {kind === 'publish' && <><div><span>Proprietate</span><strong>2 camere · 64 m²</strong></div><div><span>Preț</span><strong>{listingType === 'rent' ? '€650/lună' : '€118.500'}</strong></div><div><span>Fotografii</span><strong>4 încărcate</strong></div></>}
          {kind === 'review' && <><div><span>Perioadă</span><strong>2023–2025</strong></div><div><span>Rating general</span><strong>4,6/5</strong></div></>}
          <div><span>Status</span><strong className="status-chip draft">Draft</strong></div>
          <p>Datele nu sunt publicate automat. Conținutul este verificat înainte de afișare.</p>
        </aside>
      </div>
      <FlowStateLibrary kind={kind} navigate={navigate} notify={notify} />
    </div>
  )
}

function FlowStateLibrary({ kind, navigate, notify }: { kind: FlowKind; navigate: SharedPageProps['navigate']; notify: SharedPageProps['notify'] }) {
  const states: Array<[string,string,string,IconName,string]> = kind === 'publish' ? [
    ['Draft salvat','Poți continua editarea de pe orice pas.','draft','file','Continuă editarea'],
    ['Informații lipsă','Lipsesc anul construcției și două fotografii.','missing','alert','Completează'],
    ['Proprietate existentă','Am găsit un dosar la aceeași adresă. Anunțul poate fi legat de el.','review','search','Analizează potrivirea'],
    ['Posibil duplicat','Datele seamănă cu anunțul LOC-2481. Confirmă diferențele.','warning','compare','Compară datele'],
    ['Revendicare necesară','Legătura cu proprietatea trebuie confirmată înainte de publicare.','warning','shield','Revendică proprietatea'],
    ['În verificare','Adresa, dreptul de publicare și documentele sunt analizate.','review','clock','Vezi progresul'],
    ['Document respins','Fișierul este ilizibil sau conține date care trebuie mascate.','rejected','file','Încarcă din nou'],
    ['Publicat','Anunțul este vizibil și poate primi cereri de vizionare.','published','check','Vezi pagina publică'],
    ['Expirat','Disponibilitatea nu a fost confirmată în ultimele 30 de zile.','neutral','clock','Reînnoiește anunțul'],
  ] : kind === 'review' ? [
    ['Draft salvat','Ratingurile și textul pot fi completate mai târziu.','draft','file','Continuă'],
    ['Verificare lipsă','Relația cu proprietatea nu este încă confirmată.','missing','shield','Alege verificarea'],
    ['În moderare','Textul este analizat pentru relevanță și date personale.','review','clock','Vezi progresul'],
    ['Completări cerute','Perioada experienței trebuie clarificată.','warning','message','Completează'],
    ['Contestată','Persoana vizată a cerut revizuirea unor afirmații.','rejected','alert','Vezi contestația'],
    ['Publicată','Recenzia apare cu relația și statutul de verificare.','published','check','Vezi recenzia'],
  ] : [
    ['Sursă lipsă','Informația poate fi trimisă, dar va apărea ca neverificată.','missing','info','Adaugă sursa'],
    ['Document încărcat','Fișierul este păstrat separat de informația publică.','review','file','Vezi fișierul'],
    ['Date personale detectate','Documentul trebuie anonimizat înainte de analiză.','warning','shield','Maschează datele'],
    ['În verificare','Evenimentul este comparat cu dosarul existent.','review','clock','Vezi progresul'],
    ['Contestată','O altă sursă a raportat informații diferite.','rejected','alert','Vezi sursele'],
    ['Adăugată în dosar','Evenimentul apare în cronologie cu sursa și statutul său.','published','history','Vezi dosarul'],
  ]
  const runStateAction = (action: string) => {
    const routes: Record<string, string> = {
      'Vezi pagina publică': '/proprietate/lev-tolstoi-24',
      'Vezi recenzia': '/recenzii',
      'Vezi dosarul': '/proprietate/lev-tolstoi-24',
      'Vezi progresul': kind === 'publish' ? '/anunturile-mele' : '/dashboard',
      'Vezi contestația': '/contestatii',
    }
    const route = routes[action]
    if (route) navigate(route)
    else notify(`${action}: acțiune demonstrativă activată.`)
  }
  return <section className='container flow-state-library'><header><div><span className='section-kicker'>Stări demonstrative</span><h2>{kind === 'publish' ? 'Ciclul complet al unui anunț' : kind === 'review' ? 'Ce se întâmplă după trimiterea recenziei' : 'Cum este procesată o contribuție'}</h2><p>Fiecare stare explică problema și oferă o acțiune principală directă.</p></div><span>{states.length} stări proiectate</span></header><div>{states.map(([title,text,status,icon,action]) => <article key={title}><span className={`flow-state-icon ${status}`}><Icon name={icon} /></span><div><span className={`status-chip ${status}`}>{title}</span><p>{text}</p></div><button type='button' onClick={() => runStateAction(action)}>{action}<Icon name='arrow-right' size={14} /></button></article>)}</div></section>
}

interface PublishStepProps { step: number; listingType: 'rent' | 'sale'; setListingType: (value: 'rent' | 'sale') => void; notify: SharedPageProps['notify'] }

function PublishStep({ step, listingType, setListingType, notify }: PublishStepProps) {
  const [photoCount, setPhotoCount] = useState(2)
  const [beforeAfterAdded, setBeforeAfterAdded] = useState(false)
  const [documentUploaded, setDocumentUploaded] = useState(false)
  const [rightsConfirmed, setRightsConfirmed] = useState(false)
  if (step === 1) return <div className="choice-grid two"><button className={listingType === 'rent' ? 'active' : ''} type="button" onClick={() => setListingType('rent')}><span>⌂</span><strong>Dau în chirie</strong><p>Publică chiria, garanția, costurile și disponibilitatea.</p></button><button className={listingType === 'sale' ? 'active' : ''} type="button" onClick={() => setListingType('sale')}><span>▤</span><strong>Vând</strong><p>Publică prețul, prețul/m² și detaliile pentru cumpărători.</p></button></div>
  if (step === 2) return <div className="form-grid"><label>Sector<select><option>Centru</option><option>Râșcani</option><option>Botanica</option></select></label><label>Stradă<input defaultValue="Lev Tolstoi" /></label><label>Numărul blocului<input defaultValue="24/1" /></label><label>Apartament<input defaultValue="47" /></label><div className="form-map-placeholder"><span>⌖</span><strong>Confirmă poziția pe hartă</strong><small>str. Lev Tolstoi 24/1</small></div></div>
  if (step === 3) return <div className="form-grid three"><label>Camere<select><option>2 camere</option></select></label><label>Suprafață<input defaultValue="64 m²" /></label><label>Etaj<input defaultValue="7 din 12" /></label><label>An construcție<input defaultValue="2019" /></label><label>Tipul clădirii<select><option>Bloc nou</option></select></label><label>Stare<select><option>Renovat</option></select></label></div>
  if (step === 4) return <div className="form-grid"><label>Preț actual<input defaultValue={listingType === 'rent' ? '€650/lună' : '€118.500'} /></label><label className="check-line"><input type="checkbox" /> Preț negociabil</label>{listingType === 'rent' ? <><label>Garanție<input defaultValue="€650" /></label><label>Costuri lunare estimate<input defaultValue="€85–120" /></label></> : <><label>Preț/m²<input defaultValue="€1.851" /></label><label>Estimare de piață<input defaultValue="€114.000–121.000" /></label></>}<label className="full-field">Prețuri anterioare cunoscute<textarea defaultValue="Ianuarie 2025 — €615/lună" /></label></div>
  if (step === 5) return <div className="upload-section"><div className="upload-guidance"><strong>Fotografii ale proprietății</strong><p>Încarcă imagini luminoase și actuale. Nu adăuga documente personale.</p></div><div className="upload-grid"><button className="upload-success" type="button" onClick={() => notify('Aceasta este imaginea principală a anunțului.')}><img src={galleryImages[0].src} alt="Imagine încărcată" /><span>✓ Imagine principală</span></button><button className="upload-success" type="button" onClick={() => notify('Fotografia a fost încărcată cu succes.')}><img src={galleryImages[1].src} alt="Imagine încărcată" /><span>✓ Încărcare reușită</span></button><button className="upload-empty" type="button" onClick={() => { setPhotoCount((current) => current + 1); notify('Fotografie demonstrativă adăugată.') }}><span>＋</span><strong>Adaugă fotografii ({photoCount})</strong><small>JPG sau PNG, maximum 15 MB</small></button></div><div className="before-after-upload"><strong>Fotografii înainte / după</strong><button className={beforeAfterAdded ? 'active' : ''} type="button" onClick={() => { setBeforeAfterAdded((current) => !current); notify(beforeAfterAdded ? 'Setul before/after a fost eliminat.' : 'Setul before/after a fost adăugat.') }}>{beforeAfterAdded ? '✓ Set before/after adăugat' : '＋ Adaugă set before/after'}</button></div></div>
  if (step === 6) return <div className="amenities-form">{['Mobilat', 'Aer condiționat', 'Încălzire autonomă', 'Parcare', 'Ascensor', 'Curte închisă', 'Animale acceptate', 'Balcon'].map((item, index) => <label key={item}><input type="checkbox" defaultChecked={index < 6} />{item}</label>)}<label className="full-field">Descriere<textarea defaultValue="Apartament luminos cu două camere, orientat spre curtea interioară." /></label></div>
  if (step === 7) return <div className="form-grid"><label>Numele persoanei de contact<input defaultValue="Victor I." /></label><label>Telefon<input defaultValue="+373 6xx xxx xx" /></label><label>Email<input defaultValue="victor@example.md" /></label><label>Disponibil pentru vizionări<select><option>Luni–sâmbătă, 10:00–19:00</option></select></label></div>
  if (step === 8) return <div className="verification-panel"><span>▣</span><h3>Verificarea crește încrederea</h3><p>Documentele sunt folosite doar pentru confirmarea legăturii cu proprietatea și nu vor fi afișate public.</p><button className={documentUploaded ? 'upload-success' : 'upload-empty'} type="button" onClick={() => { setDocumentUploaded((current) => !current); notify(documentUploaded ? 'Documentul a fost eliminat.' : 'Document demonstrativ încărcat.') }}><span>{documentUploaded ? '✓' : '＋'}</span><strong>{documentUploaded ? 'Document încărcat' : 'Încarcă documentul'}</strong><small>Contract, extras sau procură · datele pot fi mascate</small></button><label className="check-line"><input type="checkbox" checked={rightsConfirmed} onChange={(event) => setRightsConfirmed(event.target.checked)} /> Confirm că am dreptul să public acest anunț.</label></div>
  if (step === 9) return <div className="listing-preview"><span className="status-chip draft">Previzualizare</span><img src={galleryImages[0].src} alt="Previzualizare anunț" /><div><span>{listingType === 'rent' ? 'De închiriat' : 'De vânzare'} · Centru</span><h3>str. Lev Tolstoi 24/1</h3><strong>{listingType === 'rent' ? '€650/lună' : '€118.500'}</strong><p>2 camere · 64 m² · etaj 7 din 12</p></div></div>
  return <div className="final-check"><span>✓</span><h3>Anunțul este pregătit pentru trimitere</h3><p>Verifică încă o dată adresa, prețul și datele de contact. După trimitere, statusul va fi „În verificare”.</p><div><span>Conținut complet <b>100%</b></span><span>Fotografii <b>{photoCount}</b></span><span>Document <b>{documentUploaded ? 'încărcat' : 'lipsește'}</b></span><span>Drept de publicare <b>{rightsConfirmed ? 'confirmat' : 'neconfirmat'}</b></span></div></div>
}

interface ReviewStepProps { step: number; relation: string; setRelation: (value: string) => void; notify: SharedPageProps['notify'] }

function ReviewStep({ step, relation, setRelation, notify }: ReviewStepProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [photoAdded, setPhotoAdded] = useState(false)
  const [verification, setVerification] = useState('Document anonimizat')
  if (step === 1) return <div className="form-grid"><label className="full-field">Caută proprietatea<input defaultValue="str. Lev Tolstoi 24/1" /></label><div className="selected-property"><img src={galleryImages[0].src} alt="Proprietate selectată" /><div><strong>str. Lev Tolstoi 24/1</strong><span>Centru · Toro Center</span></div><b>✓ Selectată</b></div></div>
  if (step === 2) return <div className="choice-grid three">{['chiriaș actual', 'fost chiriaș', 'cumpărător', 'proprietar', 'vecin'].map((item) => <button className={relation === item ? 'active' : ''} type="button" onClick={() => setRelation(item)} key={item}><strong>{item[0].toUpperCase() + item.slice(1)}</strong><p>Alege această relație dacă descrie experiența ta.</p></button>)}</div>
  if (step === 3) return <div className="form-grid"><label>De la<input type="month" defaultValue="2023-03" /></label><label>Până la<input type="month" defaultValue="2025-06" /></label><label className="check-line full-field"><input type="checkbox" /> Locuiesc în continuare aici</label></div>
  if (step === 4) return <div className="ratings-form">{['Starea apartamentului', 'Izolare fonică', 'Încălzire', 'Utilități', 'Proprietar', 'Vecini', 'Bloc', 'Zonă', 'Raport calitate/preț'].map((item) => { const rating = ratings[item] ?? 4; return <div key={item}><span>{item}</span><div>{[1, 2, 3, 4, 5].map((star) => <button className={star > rating ? 'muted-star' : ''} type="button" onClick={() => setRatings((current) => ({ ...current, [item]: star }))} aria-label={`${star} stele pentru ${item}`} key={star}>★</button>)}</div><b>{rating}/5</b></div> })}</div>
  if (step === 5) return <div className="form-grid"><label className="full-field">Avantaje<textarea defaultValue="Liniște, lumină naturală, proprietar receptiv" /></label><label className="full-field">Dezavantaje<textarea defaultValue="Parcarea se ocupă repede seara" /></label></div>
  if (step === 6) return <div className="form-grid"><label className="full-field">Descrie experiența<textarea className="tall" defaultValue="Apartamentul a corespuns fotografiilor. Proprietarul a rezolvat rapid problemele raportate." /></label><small className="field-help">Nu include nume complete, numere de telefon sau alte date personale.</small></div>
  if (step === 7) return <div className="upload-section"><div className="upload-grid"><button className={photoAdded ? 'upload-success' : 'upload-empty'} type="button" onClick={() => { setPhotoAdded((current) => !current); notify(photoAdded ? 'Fotografia a fost eliminată.' : 'Fotografie demonstrativă adăugată.') }}><span>{photoAdded ? '✓' : '＋'}</span><strong>{photoAdded ? 'Fotografie adăugată' : 'Adaugă fotografii opționale'}</strong><small>Nu încărca documente în această zonă</small></button></div></div>
  if (step === 8) return <div className="verification-panel"><span>▣</span><h3>Verifică legătura cu proprietatea</h3><p>Poți încărca un extras anonimizat din contract sau solicita confirmarea proprietarului.</p><div className="choice-grid two">{['Document anonimizat', 'Confirmare de la proprietar'].map((item) => <button className={verification === item ? 'active' : ''} type="button" onClick={() => setVerification(item)} key={item}><strong>{item}</strong><p>{item === 'Document anonimizat' ? 'Cea mai rapidă verificare.' : 'Trimitem o solicitare separată.'}</p></button>)}</div></div>
  if (step === 9) return <div className="review-preview"><span className="trust-label verified">Fost chiriaș verificat</span><h3>Nicoleta M. <b>★ 4,6/5</b></h3><p>Apartamentul a corespuns fotografiilor. Proprietarul a rezolvat rapid problemele raportate.</p><div><span className="pros"><b>Avantaje</b> Liniște, lumină naturală</span><span className="cons"><b>Dezavantaje</b> Parcarea se ocupă repede</span></div></div>
  return <div className="final-check"><span>✓</span><h3>Recenzia este pregătită</h3><p>După trimitere va fi verificată și moderată. Datele personale din document nu vor deveni publice.</p></div>
}

interface ContributionStepProps { step: number; contribution: string; setContribution: (value: string) => void; notify: SharedPageProps['notify'] }

function ContributionStep({ step, contribution, setContribution, notify }: ContributionStepProps) {
  const [evidenceAdded, setEvidenceAdded] = useState(false)
  const types = ['Preț anterior', 'Contract de chirie', 'Tranzacție', 'Renovare', 'Problemă', 'Reparație', 'Schimbare de proprietar', 'Informații despre bloc']
  if (step === 1) return <div className="form-grid"><label className="full-field">Caută proprietatea<input defaultValue="str. Lev Tolstoi 24/1" /></label><div className="selected-property"><img src={galleryImages[0].src} alt="Proprietate selectată" /><div><strong>str. Lev Tolstoi 24/1</strong><span>Centru · Toro Center</span></div><b>✓ Selectată</b></div></div>
  if (step === 2) return <div className="choice-grid three">{types.map((item) => <button className={contribution === item ? 'active' : ''} type="button" onClick={() => setContribution(item)} key={item}><strong>{item}</strong><p>Adaugă acest tip de eveniment în dosar.</p></button>)}</div>
  if (step === 3) return <div className="form-grid"><label>Data informației<input type="date" defaultValue="2024-08-20" /></label><label>Valoare sau cost<input defaultValue="€18.400" /></label><label className="full-field">Descriere<textarea defaultValue={`${contribution}: informație demonstrativă pentru dosarul proprietății.`} /></label><label className="full-field">Sursa informației<select><option>Document</option><option>Confirmare proprietar</option><option>Experiență personală</option><option>Raport comunitate</option></select></label></div>
  if (step === 4) return <div className="verification-panel"><span>▣</span><h3>Adaugă o dovadă, dacă există</h3><p>Documentele pot fi anonimizate. Nicio informație nu este prezentată automat ca adevărată.</p><button className={evidenceAdded ? 'upload-success' : 'upload-empty'} type="button" onClick={() => { setEvidenceAdded((current) => !current); notify(evidenceAdded ? 'Dovada a fost eliminată.' : 'Dovadă demonstrativă încărcată.') }}><span>{evidenceAdded ? '✓' : '＋'}</span><strong>{evidenceAdded ? 'Dovadă încărcată' : 'Încarcă document sau fotografie'}</strong><small>PDF, JPG sau PNG</small></button></div>
  return <div className="review-preview"><span className="trust-label unverified">În așteptarea verificării</span><h3>{contribution}</h3><p>20 august 2024 · cost raportat €18.400</p><div><span>Sursa: document încărcat</span><span>Status public după verificare: „Verificat prin document”</span></div></div>
}
