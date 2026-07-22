import { useState } from 'react'
import { properties, type SharedPageProps } from '../data'
import { Icon, type IconName } from './Icon'
import { PropertyCard } from './PropertyCard'

export type WorkspaceKind = 'recommendations' | 'recent' | 'browsing' | 'collections' | 'alert-detail' | 'visit-detail' | 'my-offers' | 'my-reports' | 'corrections' | 'claim' | 'property-verification' | 'listing-performance' | 'leads' | 'requests' | 'owner-offers' | 'calendar' | 'review-responses' | 'disputes' | 'documents' | 'owner-profile' | 'archive' | 'listing-status' | 'portfolio' | 'agent-leads' | 'members' | 'roles' | 'agency-stats' | 'agency-verification'
type Role = 'seeker' | 'owner' | 'agent'
type Variant = 'properties' | 'activity' | 'collections' | 'alert' | 'calendar' | 'cases' | 'verification' | 'stats' | 'table' | 'pipeline' | 'profile'

interface PageInfo { role: Role; label: string; title: string; description: string; action: string; variant: Variant }

const pages: Record<WorkspaceKind, PageInfo> = {
  recommendations: { role: 'seeker', label: 'Descoperire', title: 'Recomandări pentru tine', description: 'Proprietăți ordonate după criteriile, favoritele și alertele tale.', action: 'Ajustează preferințele', variant: 'properties' },
  recent: { role: 'seeker', label: 'Activitate', title: 'Vizualizate recent', description: 'Continuă analiza proprietăților deschise în ultimele zile.', action: 'Șterge lista', variant: 'properties' },
  browsing: { role: 'seeker', label: 'Activitate', title: 'Istoric de navigare', description: 'Căutări, filtre și proprietăți consultate, grupate cronologic.', action: 'Șterge istoricul', variant: 'activity' },
  collections: { role: 'seeker', label: 'Favorite', title: 'Colecțiile tale', description: 'Grupează proprietățile pentru vizionare, comparație sau discuții.', action: 'Creează o colecție', variant: 'collections' },
  'alert-detail': { role: 'seeker', label: 'Alertă salvată', title: '2 camere în Centru', description: '€450–€700 · mobilat · animale acceptate · numai cu istoric.', action: 'Editează alerta', variant: 'alert' },
  'visit-detail': { role: 'seeker', label: 'Vizionare', title: 'Vizionare la Lev Tolstoi 24/1', description: 'Sâmbătă, 18 iulie · 11:30 · proprietar confirmat.', action: 'Reprogramează', variant: 'calendar' },
  'my-offers': { role: 'seeker', label: 'Negociere', title: 'Ofertele mele', description: 'Urmărește ofertele trimise și răspunsurile proprietarilor.', action: 'Vezi proprietăți', variant: 'table' },
  'my-reports': { role: 'seeker', label: 'Siguranță', title: 'Raportările mele', description: 'Statusul informațiilor, anunțurilor sau recenziilor raportate.', action: 'Raportează o problemă', variant: 'cases' },
  corrections: { role: 'seeker', label: 'Date corecte', title: 'Solicitări de corectare', description: 'Urmărește completările și corectările trimise pentru dosare.', action: 'Solicită o corectare', variant: 'cases' },
  claim: { role: 'owner', label: 'Proprietate', title: 'Revendică o proprietate', description: 'Confirmă legătura cu o proprietate existentă fără a crea un duplicat.', action: 'Caută proprietatea', variant: 'verification' },
  'property-verification': { role: 'owner', label: 'Verificare', title: 'Verificarea proprietății', description: 'Documente, adresă și statutul confirmării pentru Lev Tolstoi 24/1.', action: 'Continuă verificarea', variant: 'verification' },
  'listing-performance': { role: 'owner', label: 'Analiză', title: 'Performanța anunțului', description: 'Vizualizări, salvări, lead-uri și comparație cu proprietăți similare.', action: 'Optimizează anunțul', variant: 'stats' },
  leads: { role: 'owner', label: 'Interes', title: 'Lead-uri și contacte', description: 'Persoane care au salvat, întrebat sau cerut o vizionare.', action: 'Exportă lista', variant: 'pipeline' },
  requests: { role: 'owner', label: 'Solicitări', title: 'Cereri primite', description: 'Vizionări, întrebări și documente solicitate de potențiali clienți.', action: 'Setează disponibilitatea', variant: 'table' },
  'owner-offers': { role: 'owner', label: 'Negociere', title: 'Oferte primite', description: 'Compară valoarea, termenii și statusul fiecărei oferte.', action: 'Configurează ofertele', variant: 'table' },
  calendar: { role: 'owner', label: 'Program', title: 'Calendarul proprietăților', description: 'Vizionări, expirări, publicări și lucrări programate.', action: 'Adaugă disponibilitate', variant: 'calendar' },
  'review-responses': { role: 'owner', label: 'Reputație', title: 'Răspunsuri la recenzii', description: 'Răspunde public și urmărește feedbackul legat de proprietăți.', action: 'Vezi ghidul de răspuns', variant: 'cases' },
  disputes: { role: 'owner', label: 'Transparență', title: 'Contestații și dispute', description: 'Cazuri deschise despre prețuri, istoric sau recenzii.', action: 'Deschide o contestație', variant: 'cases' },
  documents: { role: 'owner', label: 'Documente', title: 'Documentele proprietăților', description: 'Fișiere anonimizate, verificări și termene de valabilitate.', action: 'Încarcă document', variant: 'table' },
  'owner-profile': { role: 'owner', label: 'Identitate publică', title: 'Profilul tău de proprietar', description: 'Informațiile publice, ratingul și timpul mediu de răspuns.', action: 'Editează profilul', variant: 'profile' },
  archive: { role: 'owner', label: 'Arhivă', title: 'Proprietăți închiriate sau vândute', description: 'Anunțuri încheiate, rezultate și istoricul păstrat.', action: 'Exportă arhiva', variant: 'table' },
  'listing-status': { role: 'owner', label: 'Status anunț', title: 'Gestionează statutul anunțului', description: 'Marchează închiriat, vândut, expirat sau pregătește reînnoirea.', action: 'Actualizează statusul', variant: 'verification' },
  portfolio: { role: 'agent', label: 'Portofoliu', title: 'Portofoliul agenției', description: 'Proprietăți, statusuri, agenți responsabili și performanță.', action: 'Adaugă proprietate', variant: 'table' },
  'agent-leads': { role: 'agent', label: 'CRM', title: 'Lead-uri agenție', description: 'Pipeline comun pentru cereri, vizionări și oferte.', action: 'Adaugă lead', variant: 'pipeline' },
  members: { role: 'agent', label: 'Echipă', title: 'Membrii agenției', description: 'Roluri, portofolii alocate, activitate și disponibilitate.', action: 'Invită membru', variant: 'table' },
  roles: { role: 'agent', label: 'Acces', title: 'Roluri și permisiuni', description: 'Controlează accesul la lead-uri, documente și publicare.', action: 'Creează rol', variant: 'verification' },
  'agency-stats': { role: 'agent', label: 'Analiză', title: 'Statisticile agenției', description: 'Conversie, timp de răspuns, portofoliu și activitate pe agenți.', action: 'Descarcă raportul', variant: 'stats' },
  'agency-verification': { role: 'agent', label: 'Încredere', title: 'Verificarea agenției', description: 'Date juridice, membri confirmați și documente valabile.', action: 'Continuă verificarea', variant: 'verification' },
}

const roleMenu: Record<Role, Array<[string, string]>> = {
  seeker: [['Recomandări', '/recomandari'], ['Vizualizate recent', '/vizualizate-recent'], ['Colecții', '/colectii'], ['Alerte', '/cautari-salvate'], ['Vizionări', '/vizionari'], ['Oferte', '/ofertele-mele'], ['Raportări', '/raportarile-mele']],
  owner: [['Anunțuri', '/anunturile-mele'], ['Performanță', '/performanta-anunt'], ['Lead-uri', '/lead-uri'], ['Cereri', '/cereri'], ['Oferte', '/oferte'], ['Calendar', '/calendar'], ['Documente', '/documente'], ['Arhivă', '/arhiva']],
  agent: [['Portofoliu', '/portofoliu'], ['Lead-uri', '/agent-lead-uri'], ['Membri', '/membri-agentie'], ['Roluri', '/roluri-agentie'], ['Statistici', '/statistici-agentie'], ['Verificare', '/verificare-agentie']],
}

export function WorkspaceHubPage({ kind, ...shared }: SharedPageProps & { kind: WorkspaceKind }) {
  const info = pages[kind]
  const [query, setQuery] = useState('')
  const [filterActive, setFilterActive] = useState(false)
  const [sort, setSort] = useState('Actualizate recent')
  const [cleared, setCleared] = useState(false)

  const runPrimaryAction = () => {
    const routeActions: Partial<Record<WorkspaceKind, string>> = {
      recommendations: '/onboarding',
      'my-offers': '/chirie',
      'my-reports': '/stari-ui',
      corrections: '/adauga-informatii',
      claim: '/verifica',
      'property-verification': '/documente',
      'listing-performance': `/anunt/editare/${properties[0].id}`,
      requests: '/calendar',
      'review-responses': '/reguli-recenzii',
      portfolio: '/publica',
    }
    if (kind === 'recent' || kind === 'browsing') {
      setCleared(true)
      shared.notify(kind === 'recent' ? 'Lista vizualizărilor recente a fost golită' : 'Istoricul de navigare a fost golit')
      return
    }
    const route = routeActions[kind]
    if (route) {
      shared.navigate(route)
      return
    }
    shared.notify(`${info.action}: acțiune demonstrativă înregistrată`)
  }

  return <div className={`hub-page role-${info.role}`}><div className='container hub-shell'>
    <aside className='hub-sidebar'><div><span>{info.role === 'seeker' ? 'AM' : info.role === 'owner' ? 'VI' : 'IC'}</span><strong>{info.role === 'seeker' ? 'Spațiul meu' : info.role === 'owner' ? 'Proprietăți' : 'Casa Nouă'}</strong></div><nav>{roleMenu[info.role].map(([label, path]) => <button type='button' onClick={() => shared.navigate(path)} key={path}>{label}</button>)}</nav><button type='button' onClick={() => shared.navigate('/dashboard')}><Icon name='arrow-right' className='back-icon' /> Dashboard</button></aside>
    <main className='hub-main'><header className='hub-header'><div><span className='eyebrow'>{info.label}</span><h1>{info.title}</h1><p>{info.description}</p></div><button className='button button-primary' type='button' onClick={runPrimaryAction}>{info.action}</button></header><div className='hub-toolbar'><label><Icon name='search' size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder='Caută în această pagină' /></label><div><button className={filterActive ? 'active' : ''} type='button' onClick={() => { setFilterActive((current) => !current); shared.notify(filterActive ? 'Filtrul a fost eliminat' : 'Sunt afișate doar elementele active sau verificate') }}><Icon name='filter' size={17} /> Filtre</button><select value={sort} onChange={(event) => setSort(event.target.value)}><option>Actualizate recent</option><option>Cele mai noi</option><option>După status</option></select></div></div><HubContent variant={info.variant} kind={kind} shared={shared} query={query} sort={sort} filterActive={filterActive} cleared={cleared} /></main>
  </div></div>
}

function HubContent({ variant, kind, shared, query, sort, filterActive, cleared }: { variant: Variant; kind: WorkspaceKind; shared: SharedPageProps; query: string; sort: string; filterActive: boolean; cleared: boolean }) {
  const normalizedQuery = query.trim().toLocaleLowerCase('ro-RO')
  if (cleared) return <div className='empty-state'><span>✓</span><h2>Lista a fost golită</h2><p>Activitatea nouă va apărea aici pe măsură ce folosești platforma.</p><button className='button button-primary' type='button' onClick={() => shared.navigate('/chirie')}>Explorează proprietăți</button></div>
  if (variant === 'properties') {
    let items = properties.filter((property) => !normalizedQuery || `${property.address} ${property.district} ${property.complex}`.toLocaleLowerCase('ro-RO').includes(normalizedQuery))
    if (filterActive) items = items.filter((property) => property.verified && property.status === 'available')
    if (sort === 'Cele mai noi') items = [...items].sort((a, b) => b.year - a.year)
    if (sort === 'După status') items = [...items].sort((a, b) => a.status.localeCompare(b.status))
    return items.length ? <div className='hub-property-grid'>{items.slice(0, 6).map((property) => <PropertyCard property={property} key={property.id} {...shared} />)}</div> : <div className='empty-state'><span>⌕</span><h2>Niciun rezultat</h2><p>Schimbă căutarea sau elimină filtrul activ.</p></div>
  }
  if (variant === 'activity') {
    const activity = [
      ['Astăzi, 11:42', 'Ai deschis dosarul proprietății Lev Tolstoi 24/1', 'Istoric preț și recenzii', `/proprietate/${properties[0].slug}`],
      ['Astăzi, 10:18', 'Ai aplicat filtre pentru chirie în Centru', '€450–€700 · 2 camere', '/chirie'],
      ['Ieri, 19:05', 'Ai comparat trei proprietăți', 'Centru și Râșcani', '/comparatie'],
      ['14 iulie, 16:30', 'Ai salvat o căutare', 'Cu istoric · animale acceptate', '/cautari-salvate'],
    ].filter((item) => !normalizedQuery || `${item[1]} ${item[2]}`.toLocaleLowerCase('ro-RO').includes(normalizedQuery))
    return <div className='activity-timeline'>{activity.map(([date,title,detail,path]) => <article key={date + title}><span><Icon name='history' /></span><div><small>{date}</small><strong>{title}</strong><p>{detail}</p></div><button type='button' onClick={() => shared.navigate(path)}>Deschide</button></article>)}</div>
  }
  if (variant === 'collections') {
    const collections = [['Pentru vizionat', '6', properties[0].image], ['Finaliste', '3', properties[1].image], ['Pentru familie', '8', properties[2].image], ['Investiție', '4', properties[3].image]].filter(([title]) => !normalizedQuery || title.toLocaleLowerCase('ro-RO').includes(normalizedQuery))
    return <div className='hub-collection-grid'>{collections.map(([title,count,image]) => <article key={title}><img src={image} alt='' /><div><strong>{title}</strong><span>{count} proprietăți</span></div><button type='button' onClick={() => { shared.notify(`Colecția „${title}” a fost deschisă`); shared.navigate('/favorite') }}>Deschide</button></article>)}</div>
  }
  if (variant === 'alert') return <AlertPanel shared={shared} />
  if (variant === 'calendar') return <CalendarPanel kind={kind} shared={shared} />
  if (variant === 'verification') return <VerificationPanel kind={kind} shared={shared} />
  if (variant === 'stats') return <StatsPanel shared={shared} />
  if (variant === 'pipeline') return <PipelinePanel shared={shared} />
  if (variant === 'profile') return <ProfilePanel shared={shared} />
  if (variant === 'cases') return <CasesPanel kind={kind} shared={shared} query={normalizedQuery} />
  return <RecordsTable kind={kind} shared={shared} query={normalizedQuery} sort={sort} filterActive={filterActive} />
}

function AlertPanel({ shared }: { shared: SharedPageProps }) { return <div className='hub-alert-panel'><section><span>Status alertă</span><strong>Activă</strong><p>Notificări instant pentru proprietăți noi și prețuri reduse.</p><div><span>Tip <b>Chirie</b></span><span>Sectoare <b>Centru, Râșcani</b></span><span>Buget <b>€450–€700</b></span><span>Camere <b>2</b></span></div></section><aside><h3>7 rezultate noi</h3>{properties.slice(0,2).map((property) => <button type='button' onClick={() => shared.navigate(`/proprietate/${property.slug}`)} key={property.id}><img src={property.image} alt='' /><span><strong>{property.address}</strong><small>€{property.price} · {property.district}</small></span><Icon name='arrow-right' /></button>)}</aside></div> }

function CalendarPanel({ kind, shared }: { kind: WorkspaceKind; shared: SharedPageProps }) {
  const [selectedDay, setSelectedDay] = useState(18)
  const [monthOffset, setMonthOffset] = useState(0)
  const monthLabel = monthOffset === 0 ? 'Iulie 2026' : monthOffset < 0 ? 'Iunie 2026' : 'August 2026'
  const agenda = selectedDay === 18
    ? [['11:30','Vizionare · Lev Tolstoi'], ['15:00','Apel · Ana M.'], ['18:30','Vizionare · bd. Moscova']]
    : selectedDay === 16
      ? [['10:00', 'Confirmare documente · Toro Center']]
      : selectedDay === 22
        ? [['14:00', 'Vizionare · str. Grenoble 128']]
        : []

  return <div className='hub-calendar'><div className='calendar-month'><header><button type='button' aria-label='Luna anterioară' onClick={() => setMonthOffset((current) => current - 1)}>‹</button><strong>{monthLabel}</strong><button type='button' aria-label='Luna următoare' onClick={() => setMonthOffset((current) => current + 1)}>›</button></header><div className='week-labels'>{['L','M','M','J','V','S','D'].map((d,i) => <span key={d+i}>{d}</span>)}</div><div className='month-grid'>{Array.from({length:35},(_,i) => { const day = i < 3 ? 28+i : i-2; return <button className={selectedDay === day ? 'active' : day === 16 || day === 22 ? 'has-event' : ''} type='button' onClick={() => setSelectedDay(day)} key={i}>{day}</button> })}</div></div><aside><span>{kind === 'visit-detail' ? 'Vizionarea selectată' : 'Agenda zilei'}</span><h3>{selectedDay} {monthLabel.toLocaleLowerCase('ro-RO')}</h3>{agenda.length ? agenda.map(([time,title]) => <article key={time}><b>{time}</b><strong>{title}</strong><button type='button' onClick={() => shared.notify(`Detalii deschise pentru „${title}”`)}>Detalii</button></article>) : <p>Nu există evenimente programate pentru această zi.</p>}<div className='calendar-actions'><button type='button' onClick={() => shared.notify('Alege o nouă zi și un interval pentru reprogamare')}>Reprogramează</button><button type='button' onClick={() => shared.notify('Evenimentul demonstrativ a fost anulat')}>Anulează</button></div></aside></div>
}

function VerificationPanel({ kind, shared }: { kind: WorkspaceKind; shared: SharedPageProps }) {
  const items = kind === 'listing-status'
    ? [['Publicat','Activ acum','done'],['Marchează închiriat','Păstrează istoricul public','current'],['Marchează vândut','Adaugă prețul tranzacției',''],['Expirare','26 august 2026',''],['Reînnoire','Disponibilă cu 7 zile înainte','']]
    : [['Identitatea solicitantului','Confirmată','done'],['Adresa proprietății','Confirmată','done'],['Document de legătură','În analiză','current'],['Date cadastrale','Urmează',''],['Confirmare finală','Urmează','']]
  return <div className='verification-workspace'><section><div className='verification-progress-ring'><strong>72%</strong><span>complet</span></div><h3>{kind === 'claim' ? 'Revendicare în progres' : 'Proces de verificare'}</h3><p>Nicio informație sensibilă nu va fi afișată public.</p></section><div>{items.map(([title,status,state],index) => <article className={state} key={title}><span>{state === 'done' ? <Icon name='check' /> : index+1}</span><div><strong>{title}</strong><small>{status}</small></div><button type='button' onClick={() => { if (state === 'current' && kind !== 'listing-status') shared.navigate('/documente'); else shared.notify(`${title}: ${status}`) }}>{state === 'current' ? 'Continuă' : 'Detalii'}</button></article>)}</div></div>
}

function StatsPanel({ shared }: { shared: SharedPageProps }) {
  const [scope, setScope] = useState('Toate proprietățile')
  return <div className='hub-stats'><div className='hub-stat-grid'>{[['Vizualizări','1.284','+12%'],['Salvări','86','+8%'],['Lead-uri','37','+14%'],['Vizionări','16','+3'],['Conversie','12,8%','+2,4 pp']].map(([label,value,change]) => <article key={label}><span>{label}</span><strong>{value}</strong><b>{change}</b></article>)}</div><section className='stats-chart-card'><header><div><h3>Interes în ultimele 30 de zile</h3><p>Vizualizări și contacte calificate pentru {scope.toLocaleLowerCase('ro-RO')}</p></div><select value={scope} onChange={(event) => { setScope(event.target.value); shared.notify(`Statisticile au fost filtrate pentru ${event.target.value}`) }}><option>Toate proprietățile</option><option>Lev Tolstoi 24/1</option><option>bd. Moscova 18/2</option></select></header><div className='stats-line-chart'><svg viewBox='0 0 900 260' preserveAspectRatio='none'><path d='M0 230 C120 215 160 190 260 198 S390 142 490 155 S620 100 710 82 S820 64 900 25' /></svg></div></section></div>
}

function PipelinePanel({ shared }: { shared: SharedPageProps }) {
  return <div className='hub-pipeline'>{[['Noi','12'],['Contactați','9'],['Vizionare','11'],['Ofertă','5']].map(([stage,count],column) => <section key={stage}><header><strong>{stage}</strong><span>{count}</span></header>{[0,1,2].map((item) => { const name = ['Ana M.','Dan P.','Victor C.'][(item+column)%3]; return <article key={item}><span>{['AM','DP','VC'][(item+column)%3]}</span><div><strong>{name}</strong><small>{['Chirie Centru','3 camere Râșcani','Toro Center'][(item+column)%3]}</small></div><button type='button' aria-label={`Acțiuni pentru ${name}`} onClick={() => shared.notify(`Meniul lead-ului ${name} a fost deschis`)}>•••</button></article> })}</section>)}</div>
}

function ProfilePanel({ shared }: { shared: SharedPageProps }) {
  const [name, setName] = useState('Victor I.')
  const [description, setDescription] = useState('Proprietar verificat, gestionez direct două apartamente în Chișinău.')
  const [responseTime, setResponseTime] = useState('aprox. 2 ore')
  return <div className='public-profile-editor'><aside><span>VI</span><h3>{name}</h3><p>Proprietar verificat</p><b>★ 4,8 · 26 recenzii</b><button type='button' onClick={() => shared.navigate('/profil-proprietar')}>Vezi profilul public</button></aside><section><h3>Informații publice</h3><label>Nume afișat<input value={name} onChange={(event) => setName(event.target.value)} /></label><label>Descriere<textarea value={description} onChange={(event) => setDescription(event.target.value)} /></label><div><label>Timp de răspuns<input value={responseTime} onChange={(event) => setResponseTime(event.target.value)} /></label><label>Limbi<select defaultValue='Română, rusă'><option>Română, rusă</option><option>Română</option><option>Română, rusă, engleză</option></select></label></div><button className='button button-primary' type='button' onClick={() => shared.notify('Profilul public demonstrativ a fost salvat')}>Salvează modificările</button></section></div>
}

function CasesPanel({ kind, shared, query }: { kind: WorkspaceKind; shared: SharedPageProps; query: string }) {
  const cases = [['LOC-2481', kind === 'my-reports' ? 'Fotografii neactuale' : 'Corectare preț anterior', 'În analiză', 'Actualizat acum 2 ore'], ['REC-103', kind === 'disputes' ? 'Recenzie contestată' : 'Informație despre bloc', 'Informații solicitate', 'Actualizat ieri'], ['LOC-1934', 'Confirmare document', 'Rezolvat', '12 iulie 2026']].filter(([id,title,status]) => !query || `${id} ${title} ${status}`.toLocaleLowerCase('ro-RO').includes(query))
  return <div className='case-list'>{cases.length ? cases.map(([id,title,status,date]) => <article key={id}><span><Icon name='file' /></span><div><small>{id}</small><strong>{title}</strong><p>{date}</p></div><b>{status}</b><button type='button' onClick={() => shared.notify(`Cazul ${id} a fost deschis`)}>Deschide cazul</button></article>) : <div className='empty-state'><span>⌕</span><h2>Niciun caz găsit</h2><p>Încearcă alt termen de căutare.</p></div>}</div>
}

function RecordsTable({ kind, shared, query, sort, filterActive }: { kind: WorkspaceKind; shared: SharedPageProps; query: string; sort: string; filterActive: boolean }) {
  let rows = kind === 'members'
    ? [['Irina C.','Agent senior','12 proprietăți','Activ'],['Dan M.','Agent','8 proprietăți','Activ'],['Ana P.','Fotograf','5 ședințe','Invitat']]
    : kind === 'documents'
      ? [['Extras cadastral','Lev Tolstoi 24/1','Verificat','12 iul. 2026'],['Contract mandat','bd. Moscova 18/2','În analiză','15 iul. 2026'],['Proces-verbal','Toro Center','Expiră curând','30 iul. 2026']]
      : [['Lev Tolstoi 24/1','Ana M.','Vizionare','Nou'],['bd. Moscova 18/2','Radu C.','€115.000','În negociere'],['str. Grenoble 128','Elena S.','Mesaj','Răspuns trimis']]
  rows = rows.filter((row) => !query || row.join(' ').toLocaleLowerCase('ro-RO').includes(query))
  if (filterActive) rows = rows.filter((row) => ['Activ', 'Verificat', 'Nou', 'În negociere'].some((status) => row.includes(status)))
  if (sort === 'Cele mai noi') rows = [...rows].reverse()
  if (sort === 'După status') rows = [...rows].sort((a, b) => a[3].localeCompare(b[3], 'ro'))
  return <div className='hub-records'><div className='hub-record-head'><span>Înregistrare</span><span>Proprietate / rol</span><span>Detaliu</span><span>Status</span><span>Acțiuni</span></div>{rows.length ? rows.map((row) => <article key={row[0]}>{row.map((cell) => <span key={cell}>{cell}</span>)}<button type='button' onClick={() => shared.notify(`Gestionare deschisă pentru ${row[0]}`)}>Gestionează</button></article>) : <div className='empty-state'><span>⌕</span><h2>Nicio înregistrare găsită</h2><p>Modifică termenul de căutare sau filtrul activ.</p></div>}</div>
}
