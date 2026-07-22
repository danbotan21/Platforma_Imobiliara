import { useRef, useState } from 'react'
import { galleryImages, properties, recentReviews, type SharedPageProps } from '../data'
import { PropertyCard } from './PropertyCard'
import { Icon, type IconName } from './Icon'

type UtilityKind = 'building' | 'area' | 'favorites' | 'saved-searches' | 'my-reviews' | 'my-listings' | 'edit-listing' | 'visits' | 'messages' | 'notifications' | 'settings' | 'states' | 'unavailable' | 'not-found'

interface UtilityPageProps extends SharedPageProps { kind: UtilityKind }

export function UtilityPage({ kind, ...shared }: UtilityPageProps) {
  if (kind === 'building') return <BuildingPage {...shared} />
  if (kind === 'area') return <AreaPage {...shared} />
  if (kind === 'states') return <StatesPage {...shared} />
  if (kind === 'unavailable') return <UnavailablePage {...shared} />
  if (kind === 'not-found') return <NotFoundPage {...shared} />
  return <AccountPage kind={kind} {...shared} />
}

function AccountPage({ kind, ...shared }: UtilityPageProps) {
  const titles: Partial<Record<UtilityKind, [string, string]>> = {
    favorites: ['Favorite', 'Proprietățile pe care vrei să le urmărești sau să le compari.'],
    'saved-searches': ['Căutări salvate și alerte', 'Primește notificări când apar proprietăți potrivite sau se schimbă prețul.'],
    'my-reviews': ['Recenziile mele', 'Urmărește statusul recenziilor trimise și răspunsurile primite.'],
    'my-listings': ['Anunțurile mele', 'Gestionează anunțurile active, drafturile și verificările.'],
    'edit-listing': ['Editează anunțul', 'Actualizează informațiile publice și urmărește nivelul de completare.'],
    visits: ['Cereri de vizionare', 'Confirmă programările și păstrează istoricul solicitărilor.'],
    messages: ['Mesaje', 'Conversații demonstrative cu persoanele interesate.'],
    notifications: ['Notificări', 'Actualizări despre anunțuri, alerte, prețuri și moderare.'],
    settings: ['Profil și setări', 'Gestionează datele contului și preferințele de comunicare.'],
  }
  const [title, description] = titles[kind] ?? ['Cont', '']
  const [menuOpen, setMenuOpen] = useState(false)
  return <div className="account-page"><div className="container account-mobile-bar"><button type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Icon name="menu" /><span><small>Contul meu</small><strong>{title}</strong></span><Icon name="arrow-right" /></button></div><div className="container account-layout"><AccountSidebar active={kind} navigate={shared.navigate} open={menuOpen} close={() => setMenuOpen(false)} /><main className="account-main"><header><div><span className="eyebrow">Cont demonstrativ</span><h1>{title}</h1><p>{description}</p></div>{kind === 'my-listings' && <button className="button button-primary" type="button" onClick={() => shared.navigate('/publica')}>Publică un anunț</button>}</header><AccountContent kind={kind} {...shared} /></main></div>{menuOpen && <button className="account-menu-backdrop" type="button" aria-label="Închide meniul contului" onClick={() => setMenuOpen(false)} />}</div>
}

function AccountSidebar({ active, navigate, open, close }: { active: UtilityKind; navigate: SharedPageProps['navigate']; open: boolean; close: () => void }) {
  const menu: [UtilityKind, IconName, string][] = [['favorites', 'heart', 'Favorite'], ['saved-searches', 'search', 'Căutări și alerte'], ['my-reviews', 'star', 'Recenziile mele'], ['my-listings', 'building', 'Anunțurile mele'], ['visits', 'clock', 'Vizionări'], ['messages', 'message', 'Mesaje'], ['notifications', 'alert', 'Notificări'], ['settings', 'settings', 'Setări']]
  const go = (path: string) => { navigate(path); close() }
  return <aside className={open ? "account-sidebar mobile-open" : "account-sidebar"}><div className="account-person"><span>VI</span><div><strong>Victor I.</strong><small><Icon name='verified' size={13} /> Cont verificat</small></div><button className="account-menu-close" type="button" aria-label="Închide meniul" onClick={close}><Icon name="close" /></button></div><nav><button type="button" onClick={() => go('/dashboard')}><Icon name='home' size={17} /> Dashboard</button>{menu.map(([key, icon, label]) => <button className={active === key || (active === 'edit-listing' && key === 'my-listings') ? 'active' : ''} type="button" onClick={() => go(`/${key === 'saved-searches' ? 'cautari-salvate' : key === 'my-reviews' ? 'recenziile-mele' : key === 'my-listings' ? 'anunturile-mele' : key === 'visits' ? 'vizionari' : key === 'messages' ? 'mesaje' : key === 'notifications' ? 'notificari' : key === 'settings' ? 'setari' : 'favorite'}`)} key={key}><Icon name={icon} size={17} /> {label}</button>)}</nav><div className='account-support-card'><Icon name='help' /><strong>Ai nevoie de ajutor?</strong><p>Consultă ghidurile sau contactează echipa.</p><button type='button' onClick={() => go('/ajutor')}>Centrul de ajutor</button></div></aside>
}

function AccountContent({ kind, ...shared }: UtilityPageProps) {
  if (kind === 'edit-listing') return <EditListingPanel {...shared} />
  if (kind === 'favorites') return shared.favorites.length
    ? <div className="property-grid account-properties">{properties.filter((item) => shared.favorites.includes(item.id)).map((item) => <PropertyCard property={item} key={item.id} {...shared} />)}</div>
    : <div className="empty-state"><span>♡</span><h2>Nu ai proprietăți salvate</h2><p>Apasă pe inimă într-un card pentru a salva o proprietate.</p><button className="button button-primary" type="button" onClick={() => shared.navigate('/chirie')}>Explorează proprietăți</button></div>
  if (kind === 'saved-searches') return <SavedSearchesPanel {...shared} />
  if (kind === 'my-reviews') return <MyReviewsPanel {...shared} />
  if (kind === 'my-listings') return <MyListingsPanel {...shared} />
  if (kind === 'visits') return <VisitsPanel {...shared} />
  if (kind === 'messages') return <MessagesPanel {...shared} />
  if (kind === 'notifications') return <NotificationsPanel {...shared} />
  return <SettingsPanel notify={shared.notify} />
}

function SavedSearchesPanel(shared: SharedPageProps) {
  const searches = [
    ['Chirie · Centru', '2 camere · €450–700 · mobilat', '3 proprietăți noi', 'centru-2-camere'],
    ['Vânzare · Râșcani', '3 camere · până la €135.000', 'Preț schimbat la 1 proprietate', 'rascani-3-camere'],
    ['Orice sector', 'Cu istoric verificat · rating 4+', 'Nicio schimbare', 'istoric-verificat'],
  ]
  const [alerts, setAlerts] = useState(() => searches.map((_item, index) => index < 2))

  const toggleAlert = (index: number) => {
    setAlerts((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))
    shared.notify(alerts[index] ? 'Alerta a fost dezactivată' : 'Alerta a fost activată')
  }

  return <div className="saved-search-list">{searches.map(([name, filters, update, slug], index) => <article key={name}>
    <span className="saved-search-icon">⌕</span><div><strong>{name}</strong><p>{filters}</p><small>{update}</small></div>
    <label><input type="checkbox" checked={alerts[index]} onChange={() => toggleAlert(index)} /> Alertă activă</label>
    <button type="button" onClick={() => shared.navigate(`/cautari-salvate/${slug}`)}>Editează</button>
  </article>)}<button className="button button-secondary" type="button" onClick={() => shared.navigate('/chirie')}>＋ Creează o căutare</button></div>
}

function MyReviewsPanel(shared: SharedPageProps) {
  return <div className="account-review-list">{recentReviews.slice(0, 2).map((review, index) => <article key={review.id}>
    <header><div><span className={`status-chip ${index === 0 ? 'published' : 'review'}`}>{index === 0 ? 'Publicată' : 'În moderare'}</span><strong>{review.property}</strong></div><b>★ {review.rating}</b></header>
    <p>{review.text}</p>
    <footer><span>{index === 0 ? 'Publicată la 10 iulie 2026 · 3 răspunsuri utile' : 'Trimisă la 15 iulie 2026'}</span><button type="button" onClick={() => { shared.notify(`Recenzia ${review.id} a fost selectată`); shared.navigate('/recenzii') }}>Vezi recenzia</button></footer>
  </article>)}<button className="button button-primary" type="button" onClick={() => shared.navigate('/scrie-recenzie')}>Scrie o recenzie</button></div>
}

function MyListingsPanel(shared: SharedPageProps) {
  const listingStatuses = ['Publicat', 'Draft', 'În verificare', 'Respins', 'Informații lipsă'] as const
  const tabs = ['Toate', 'Active', 'Drafturi', 'În verificare', 'Expirate'] as const
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Toate')
  const visible = properties.slice(0, 5).map((property, index) => ({ property, status: listingStatuses[index] })).filter(({ status }) => {
    if (activeTab === 'Toate') return true
    if (activeTab === 'Active') return status === 'Publicat'
    if (activeTab === 'Drafturi') return status === 'Draft'
    if (activeTab === 'În verificare') return status === 'În verificare'
    return status === 'Respins' || status === 'Informații lipsă'
  })

  return <div className="my-listings"><div className="listing-status-tabs">{tabs.map((tab) => <button className={activeTab === tab ? 'active' : ''} type="button" onClick={() => setActiveTab(tab)} key={tab}>{tab}{tab === 'Toate' ? ' 5' : tab === 'Active' ? ' 1' : tab === 'Drafturi' ? ' 1' : tab === 'În verificare' ? ' 1' : ' 2'}</button>)}</div>
    {visible.length ? visible.map(({ property, status }, visibleIndex) => {
      const index = listingStatuses.indexOf(status)
      const statusClass = ['published', 'draft', 'review', 'rejected', 'missing'][index]
      const editAllowed = status === 'Publicat' || status === 'Draft' || status === 'Informații lipsă'
      return <article key={property.id}><img src={property.image} alt={property.address} /><div><span className={`status-chip ${statusClass}`}>{status}</span><strong>{property.address}</strong><p>{property.mode === 'rent' ? '€650/lună' : '€118.500'} · {property.district}</p><small>{status === 'Respins' ? 'Motiv: adresa nu a putut fi confirmată' : status === 'Informații lipsă' ? 'Lipsesc anul construcției și 2 fotografii' : 'Actualizat recent'}</small></div><div className="listing-performance"><span>Vizualizări <b>{visibleIndex || activeTab !== 'Toate' ? 0 : 842}</b></span><span>Salvări <b>{visibleIndex || activeTab !== 'Toate' ? 0 : 54}</b></span></div><button type="button" onClick={() => shared.navigate(editAllowed ? `/anunt/editare/${property.id}` : '/status-anunt')}>{status === 'Publicat' ? 'Editează' : status === 'Draft' ? 'Continuă' : 'Vezi statusul'}</button></article>
    }) : <div className="empty-state"><span>⌂</span><h2>Nu există anunțuri în această categorie</h2><p>Alege alt status sau publică un anunț nou.</p></div>}
  </div>
}

function VisitsPanel(shared: SharedPageProps) {
  const days = ['Joi 16', 'Vin 17', 'Sâm 18', 'Dum 19', 'Lun 20']
  const [selectedDay, setSelectedDay] = useState('Sâm 18')
  const visits = [
    ['10:30', 'Ana C.', 'str. Lev Tolstoi 24/1', 'Confirmată', 'ana-c-1030'],
    ['13:00', 'Mihai R.', 'bd. Moscova 18/2', 'În așteptare', 'mihai-r-1300'],
    ['18:30', 'Elena P.', 'str. Lev Tolstoi 24/1', 'În așteptare', 'elena-p-1830'],
  ]

  return <div className="visit-board"><div className="calendar-strip">{days.map((day) => <button className={selectedDay === day ? 'active' : ''} type="button" onClick={() => setSelectedDay(day)} key={day}>{day}</button>)}</div>
    {selectedDay === 'Sâm 18' ? visits.map(([time, person, address, status, slug]) => <article key={time}><strong>{time}</strong><span className="avatar">{person.split(' ').map((part) => part[0]).join('')}</span><div><b>{person}</b><span>{address}</span></div><span className={`status-chip ${status === 'Confirmată' ? 'published' : 'review'}`}>{status}</span><button type="button" onClick={() => shared.navigate(`/vizionari/${slug}`)}>Detalii</button></article>) : <div className="empty-state"><span>◷</span><h2>Nicio vizionare programată</h2><p>Nu există programări pentru {selectedDay.toLowerCase()}.</p></div>}
  </div>
}

function MessagesPanel(shared: SharedPageProps) {
  const conversations = [
    { initials: 'AC', name: 'Ana C.', preview: 'Este disponibil sâmbătă?', time: '2 min', property: 'str. Lev Tolstoi 24/1', messages: ['Bună ziua! Apartamentul este disponibil pentru vizionare sâmbătă?', '10:30 este perfect. Mulțumesc!'] },
    { initials: 'MR', name: 'Mihai R.', preview: 'Mulțumesc pentru răspuns.', time: 'ieri', property: 'bd. Moscova 18/2', messages: ['Bună ziua! Mai este valabil prețul afișat?', 'Mulțumesc pentru răspuns.'] },
    { initials: 'EP', name: 'Elena P.', preview: 'Am trimis solicitarea.', time: 'mar.', property: 'str. Grenoble 128', messages: ['Aș dori o vizionare în weekend.', 'Am trimis solicitarea.'] },
  ]
  const [activeConversation, setActiveConversation] = useState(0)
  const [draft, setDraft] = useState('')
  const [sent, setSent] = useState<Record<number, string[]>>({})
  const current = conversations[activeConversation]

  const send = () => {
    const value = draft.trim()
    if (!value) {
      shared.notify('Scrie un mesaj înainte de trimitere')
      return
    }
    setSent((messages) => ({ ...messages, [activeConversation]: [...(messages[activeConversation] ?? []), value] }))
    setDraft('')
    shared.notify('Mesajul demonstrativ a fost trimis')
  }

  return <div className="messages-layout"><aside>{conversations.map((conversation, index) => <button className={activeConversation === index ? 'active' : ''} type="button" onClick={() => setActiveConversation(index)} key={conversation.name}><span className="avatar">{conversation.initials}</span><div><strong>{conversation.name}</strong><p>{conversation.preview}</p></div><small>{conversation.time}</small></button>)}</aside>
    <main><header><span className="avatar">{current.initials}</span><div><strong>{current.name}</strong><small>Despre {current.property}</small></div></header><div className="chat-thread"><p className="incoming">{current.messages[0]}</p><p className="outgoing">Bună ziua! Mulțumesc pentru mesaj. Revin cu toate detaliile.</p><p className="incoming">{current.messages[1]}</p>{(sent[activeConversation] ?? []).map((message, index) => <p className="outgoing" key={`${message}-${index}`}>{message}</p>)}</div><label><input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); send() } }} placeholder="Scrie un mesaj…" /><button type="button" onClick={send}>Trimite</button></label></main>
  </div>
}

function NotificationsPanel(shared: SharedPageProps) {
  const notifications = [
    ['Preț redus', 'Apartamentul de pe bd. Moscova a scăzut cu 3,2%.', 'Astăzi, 09:24', 'price', `/proprietate/${properties[1].slug}`],
    ['Cerere nouă', 'Ana C. dorește o vizionare sâmbătă la 10:30.', 'Acum 2 ore', 'visit', '/vizionari/ana-c-1030'],
    ['Recenzie publicată', 'Recenzia pentru Lev Tolstoi 24/1 a trecut moderarea.', 'Ieri', 'review', '/recenzii'],
    ['Anunț aproape complet', 'Adaugă două fotografii pentru a trimite draftul.', '12 iulie', 'missing', `/anunt/editare/${properties[4].id}`],
  ]
  const [read, setRead] = useState<string[]>([])

  return <div className="notification-list">{notifications.map(([title, text, time, type, path]) => <article className={read.includes(title) ? 'is-read' : ''} key={title}><span className={`notification-icon ${type}`}>•</span><div><strong>{title}</strong><p>{text}</p><small>{time}</small></div><button type="button" onClick={() => { setRead((current) => current.includes(title) ? current : [...current, title]); shared.navigate(path) }}>Vezi</button></article>)}</div>
}

function EditListingPanel(shared: SharedPageProps) {
  const property = properties[0]
  const photoInput = useRef<HTMLInputElement>(null)
  const sections = [['home', 'Informații'], ['chart', 'Preț'], ['building', 'Caracteristici'], ['renovation', 'Fotografii'], ['message', 'Contact'], ['shield', 'Verificare']] as const
  const [activeSection, setActiveSection] = useState('Informații')
  const [photos, setPhotos] = useState(() => galleryImages.slice(0, 4))

  const chooseSection = (label: string, index: number) => {
    setActiveSection(label)
    const target = document.getElementById(`edit-section-${Math.min(index, 2)}`)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (index > 2) shared.notify(`Secțiunea „${label}” este demonstrativă în această etapă`)
  }

  const addPhotos = (files: FileList | null) => {
    if (!files?.length) return
    const next = Array.from(files).filter((file) => file.type.startsWith('image/')).map((file) => ({ src: URL.createObjectURL(file), alt: file.name }))
    if (!next.length) {
      shared.notify('Selectează fișiere JPG, PNG sau WebP')
      return
    }
    setPhotos((current) => [...current, ...next].slice(0, 10))
    shared.notify(`${next.length} fotografii au fost adăugate în previzualizare`)
  }

  return <div className='edit-listing-workspace'>
    <div className='edit-listing-status'><div><span className='status-chip published'>Publicat</span><strong>Completare anunț 92%</strong><p>Ultima actualizare demonstrativă: astăzi, 11:42</p></div><div className='completion-ring'><strong>92</strong><span>%</span></div></div>
    <nav className='edit-section-nav'>{sections.map(([icon, label], index) => <button className={activeSection === label ? 'active' : ''} type='button' onClick={() => chooseSection(label, index)} key={label}><Icon name={icon as IconName} size={16} /> {label}</button>)}</nav>
    <div className='edit-listing-grid'><form onSubmit={(event) => { event.preventDefault(); shared.notify('Modificările demonstrative au fost salvate') }}>
      <section id='edit-section-0'><header><div><span>01</span><h2>Informații principale</h2></div><small>Vizibile în rezultate și în dosarul proprietății</small></header><div className='form-grid'><label>Tipul anunțului<select defaultValue='rent'><option value='rent'>De închiriat</option><option value='sale'>De vânzare</option></select></label><label>Status<select><option>Disponibil</option><option>Rezervat</option><option>Indisponibil</option></select></label><label className='full-field'>Adresa<input defaultValue={property.address} /></label><label>Sector<input defaultValue={property.district} /></label><label>Complex<input defaultValue={property.complex} /></label></div></section>
      <section id='edit-section-1'><header><div><span>02</span><h2>Preț și costuri</h2></div><small>Prețul anterior rămâne în istoricul dosarului</small></header><div className='form-grid'><label>Chirie lunară<input defaultValue='€650' /></label><label>Preț anterior<input defaultValue='€615' /></label><label>Garanție<input defaultValue='€650' /></label><label>Costuri estimate<input defaultValue='€85–120/lună' /></label><label className='check-line full-field'><input type='checkbox' defaultChecked /> Prețul este negociabil</label></div></section>
      <section id='edit-section-2'><header><div><span>03</span><h2>Fotografii publice</h2></div><small>Imaginea principală apare prima în rezultate</small></header><div className='edit-photo-grid'>{photos.map((image, index) => <article key={`${image.src}-${index}`}><img src={image.src} alt={image.alt} />{index === 0 && <span>Imagine principală</span>}<button type='button' aria-label={`Șterge fotografia ${index + 1}`} onClick={() => { setPhotos((current) => current.filter((_photo, photoIndex) => photoIndex !== index)); shared.notify('Fotografia a fost eliminată din previzualizare') }}><Icon name='close' size={15} /></button></article>)}<button className='edit-add-photo' type='button' onClick={() => photoInput.current?.click()}><Icon name='plus' /><strong>Adaugă fotografii</strong><small>JPG sau PNG</small></button><input ref={photoInput} hidden type='file' accept='image/*' multiple onChange={(event) => addPhotos(event.target.files)} /></div></section>
      <div className='edit-form-actions'><button type='button' onClick={() => shared.navigate('/anunturile-mele')}>Renunță</button><button className='button button-secondary' type='button' onClick={() => shared.navigate(`/proprietate/${property.slug}`)}>Previzualizează</button><button className='button button-primary' type='submit'>Salvează modificările</button></div>
    </form><aside><div><span>Previzualizare card</span><img src={photos[0]?.src ?? property.image} alt={property.address} /><small>De închiriat · Verificat</small><h3>{property.address}</h3><strong>€650<span>/lună</span></strong><p>2 camere · 64 m² · etaj 7/12</p></div><section><h3>Înainte de publicare</h3>{[['check','Adresa este confirmată'],['check','Prețul este complet'],['check',`${photos.length} fotografii încărcate`],['alert','Lipsește certificatul energetic']].map(([icon,text]) => <span key={text}><Icon name={icon as IconName} size={15} /> {text}</span>)}</section><button type='button' onClick={() => shared.navigate(`/proprietate/${property.slug}`)}>Vezi pagina publică <Icon name='arrow-right' size={15} /></button></aside></div>
  </div>
}

function SettingsPanel({ notify }: { notify: SharedPageProps['notify'] }) {
  const exportData = () => {
    const payload = JSON.stringify({ name: 'Victor I.', email: 'victor@example.md', exportedAt: new Date().toISOString() }, null, 2)
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }))
    link.download = 'locuinta-date-cont.json'
    link.click()
    URL.revokeObjectURL(link.href)
    notify('Exportul demonstrativ a fost generat')
  }

  return <div className="settings-panel"><section><h2>Date personale</h2><div className="settings-avatar"><span>VI</span><button type="button" onClick={() => notify('Încărcarea fotografiei de profil este disponibilă în modul demonstrativ')}>Schimbă fotografia</button></div><div className="form-grid"><label>Nume<input defaultValue="Victor I." /></label><label>Email<input defaultValue="victor@example.md" /></label><label>Telefon<input defaultValue="+373 6xx xxx xx" /></label><label>Tipul contului<select><option>Proprietar</option><option>Agent</option></select></label></div></section><section><h2>Preferințe de comunicare</h2>{['Alerte pentru căutările salvate', 'Schimbări de preț', 'Mesaje și cereri de vizionare', 'Actualizări despre verificare'].map((item, index) => <label className="setting-toggle" key={item}><div><strong>{item}</strong><span>Primește această categorie prin email.</span></div><input type="checkbox" defaultChecked={index < 3} /></label>)}</section><section className="danger-zone"><h2>Confidențialitate</h2><p>Poți solicita exportul sau ștergerea datelor contului. Aceste acțiuni sunt demonstrative.</p><button className="button button-secondary" type="button" onClick={exportData}>Exportă datele</button><button className="danger-button" type="button" onClick={() => notify('Solicitarea demonstrativă de ștergere a fost înregistrată')}>Șterge contul</button></section><button className="button button-primary" type="button" onClick={() => notify('Setările demonstrative au fost salvate')}>Salvează modificările</button></div>
}

function BuildingPage({ navigate }: SharedPageProps) {
  return <div className="building-page"><section className="building-hero"><img src={galleryImages[3].src} alt="Blocul Toro Center" /><div className="container"><div><span className="trust-label verified">✓ Bloc identificat și verificat</span><h1>Toro Center</h1><p>str. Lev Tolstoi 24/1 · Centru, Chișinău</p><div><span>Construit în <b>2019</b></span><span>12 etaje</span><span>84 apartamente</span><span>Rating <b>★ 4,4/5</b></span></div></div></div></section><nav className="property-anchor-nav"><div className="container"><a href="#despre-bloc">Prezentare</a><a href="#probleme-bloc">Probleme</a><a href="#reparatii-bloc">Reparații</a><a href="#apartamente-bloc">Apartamente</a></div></nav><section className="section"><div className="container building-detail-grid"><main><section className="detail-section" id="despre-bloc"><h2>Informații despre bloc</h2><div className="building-facts expanded">{[['An construcție', '2019'], ['Structură', 'Cadru beton armat'], ['Fațadă', 'Termosistem ventilat'], ['Ascensoare', '2 · Schindler'], ['Încălzire', 'Autonomă pe apartament'], ['Administrare', 'Urban Management SRL'], ['Curte', 'Închisă, acces controlat'], ['Parcare', 'Subterană și oaspeți']].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section><section className="detail-section" id="probleme-bloc"><h2>Probleme raportate</h2><div className="issues-row vertical"><div><span className="status-dot warning" /><p><strong>Presiune redusă la apă</strong><small>Etajele 10–12 · raportat de 4 locatari · în analiză</small></p><span className="trust-label community">Raportat de comunitate</span></div><div><span className="status-dot good" /><p><strong>Iluminat în parcarea subterană</strong><small>Rezolvat în martie 2026</small></p><span className="trust-label owner">Confirmat de administrator</span></div></div></section><section className="detail-section" id="reparatii-bloc"><h2>Reparații generale</h2><div className="compact-timeline"><div><span>Feb. 2026</span><strong>Reparația intrării</strong><b>€7.800</b><small className="trust-label verified">Verificat</small></div><div><span>Oct. 2025</span><strong>Revizia ascensoarelor</strong><b>—</b><small className="trust-label owner">Confirmat</small></div></div></section></main><aside><div className="rating-summary"><span>Ratingul blocului</span><strong>4,4</strong><b>★★★★☆</b><small>din 73 de evaluări</small></div><div className="category-ratings">{[['Curățenie', '4,6'], ['Ascensor', '4,4'], ['Administrare', '4,2'], ['Izolare fonică', '4,1'], ['Curte', '4,7']].map(([label, score]) => <div key={label}><span>{label}</span><strong>{score}</strong></div>)}</div></aside></div></section><section className="section soft-section" id="apartamente-bloc"><div className="container"><div className="section-heading"><div><h2>Apartamente în acest bloc</h2><p>O ofertă activă și două dosare istorice.</p></div><button className="text-link" type="button" onClick={() => navigate('/harta')}>Vezi pe hartă →</button></div></div></section></div>
}

function AreaPage({ navigate }: SharedPageProps) {
  return <div className="area-page"><section className="page-hero area-hero"><div className="container"><div><span className="eyebrow">Ghid de zonă</span><h1>Centru, Chișinău</h1><p>Transport, servicii, nivel de zgomot și prețuri demonstrative pentru a înțelege mai bine zona.</p></div><div className="area-hero-score"><strong>4,6/5</strong><span>Scorul zonei</span><small>din evaluările afișate</small></div></div></section><section className="section"><div className="container area-page-grid"><main><div className="area-map large"><div className="map-streets"><i /><i /><i /><i /><i /></div><span className="poi poi-1">Parc</span><span className="poi poi-2">Liceu</span><span className="poi poi-3">Market</span><span className="poi poi-4">Clinică</span></div><section className="detail-section"><h2>Cum este viața în Centru</h2><div className="category-ratings expanded">{[['Transport public', '4,8'], ['Magazine și servicii', '4,9'], ['Parcuri', '4,2'], ['Școli și grădinițe', '4,6'], ['Siguranță percepută', '4,3'], ['Nivel de zgomot', '3,7']].map(([label, score]) => <div key={label}><span>{label}</span><strong>{score}/5</strong></div>)}</div></section><section className="detail-section"><h2>Observații ale comunității</h2><div className="review-feed"><article className="review-card full"><header><span className="avatar">EC</span><div><strong>Elena C.</strong><small>Locatar verificat · 4 ani în zonă</small></div><b>★ 4,5</b></header><p>Transportul este excelent și aproape toate serviciile sunt accesibile pe jos. Traficul se simte în orele de vârf.</p><footer><span className="trust-label tenant">Confirmat de locatar</span></footer></article></div></section></main><aside className="area-market-card"><span>Estimări demonstrative</span><h2>Piața din Centru</h2><div><span>Chirie mediană</span><strong>€590/lună</strong></div><div><span>Vânzare mediană</span><strong>€1.820/m²</strong></div><div><span>Timp mediu de listare</span><strong>18 zile</strong></div><button className="button button-primary button-full" type="button" onClick={() => navigate('/chirie')}>Vezi proprietățile</button></aside></div></section></div>
}

function StatesPage({ notify }: SharedPageProps) {
  const [reportOpen, setReportOpen] = useState(false)
  return <div className="states-page"><section className="page-hero small"><div className="container"><div><span className="eyebrow">Bibliotecă demonstrativă</span><h1>Stări UI și niveluri de încredere</h1><p>Exemple pentru situații reale, fără a pretinde că datele sunt automat adevărate.</p></div></div></section><section className="section"><div className="container states-grid"><article><h2>Loading / skeleton</h2><div className="state-skeleton"><i /><i /><i /><i /></div></article><article><h2>Eroare</h2><div className="inline-alert error"><span>!</span><div><strong>Pagina nu a putut fi încărcată</strong><p>Încearcă din nou sau revino mai târziu.</p></div><button type="button" onClick={() => notify('Reîncercare demonstrativă pornită')}>Reîncearcă</button></div></article><article><h2>Fără istoric</h2><div className="mini-empty"><span>◷</span><strong>Nu există evenimente cunoscute</strong><p>Poți contribui cu un preț sau o renovare.</p></div></article><article><h2>Fără recenzii</h2><div className="mini-empty"><span>☆</span><strong>Fii primul care scrie</strong><p>Recenzia va fi verificată înainte de publicare.</p></div></article><article><h2>Date neverificate</h2><div className="unverified-data"><span className="trust-label unverified">Neverificat</span><strong>Chirie raportată: €540/lună</strong><p>Sursă necunoscută · nu folosi această valoare ca fapt confirmat.</p></div></article><article><h2>Alertă și confirmare</h2><div className="inline-alert warning"><span>!</span><div><strong>Informații lipsă</strong><p>Adaugă anul construcției pentru a continua.</p></div></div><div className="inline-alert success"><span>✓</span><div><strong>Încărcare reușită</strong><p>Fotografia a fost adăugată.</p></div></div></article><article className="span-two"><h2>Niveluri de încredere</h2><div className="trust-explanation"><div><span className="trust-label verified">Verificat prin document</span><span className="trust-label owner">Confirmat de proprietar</span><span className="trust-label tenant">Confirmat de chiriaș</span><span className="trust-label community">Raportat de comunitate</span><span className="trust-label estimate">Estimare</span><span className="trust-label unverified">Neverificat</span><span className="trust-label disputed">Contestat</span></div></div></article><article className="span-two"><h2>Modal de raportare</h2><p>Raportarea este o acțiune separată și nu modifică automat conținutul.</p><button className="button button-secondary" type="button" onClick={() => setReportOpen(true)}>Deschide modalul</button></article></div></section>{reportOpen && <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="form-modal"><button className="modal-close" type="button" aria-label="Închide raportarea" onClick={() => setReportOpen(false)}>×</button><h2>Raportează o informație</h2><p>Selectează motivul și explică ce ai observat.</p><label>Motiv<select><option>Informație incorectă</option><option>Conținut personal</option></select></label><label>Detalii<textarea /></label><button className="button button-primary button-full" type="button" onClick={() => { setReportOpen(false); notify('Raportarea demonstrativă a fost trimisă') }}>Trimite raportarea</button></div></div>}</div>
}

function UnavailablePage({ navigate, ...shared }: SharedPageProps) {
  return <div className="unavailable-page"><section className="page-hero small"><div className="container"><div><span className="status-chip rejected">Proprietate indisponibilă</span><h1>Această proprietate nu mai este pe piață.</h1><p>Dosarul istoric rămâne vizibil, iar datele de contact și acțiunile de ofertare sunt dezactivate.</p></div><button className="button button-primary" type="button" onClick={() => navigate('/chirie')}>Vezi proprietăți similare</button></div></section><section className="section"><div className="container"><PropertyCard property={properties[4]} navigate={navigate} {...shared} /><div className="history-preserved"><span>i</span><div><h2>Istoricul rămâne disponibil</h2><p>Poți consulta prețurile anterioare, perioadele anonimizate de chirie, renovările și recenziile.</p></div><button type="button" onClick={() => navigate(`/proprietate/${properties[4].slug}`)}>Deschide dosarul →</button></div></div></section></div>
}

function NotFoundPage({ navigate }: SharedPageProps) {
  return <div className="not-found-page"><div><span>404</span><h1>Pagina nu a fost găsită</h1><p>Adresa poate fi incorectă sau pagina a fost mutată.</p><div><button className="button button-primary" type="button" onClick={() => navigate('/')}>Înapoi acasă</button><button className="button button-secondary" type="button" onClick={() => navigate('/chirie')}>Caută proprietăți</button></div></div></div>
}
