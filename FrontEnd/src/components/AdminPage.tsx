import { useState } from 'react'
import { properties, type Navigate } from '../data'
import { Icon, type IconName } from './Icon'

export type AdminKind = 'dashboard' | 'listings' | 'reviews' | 'documents' | 'verifications' | 'duplicates' | 'disputes' | 'reports' | 'users' | 'suspensions' | 'deletions' | 'audit' | 'buildings' | 'areas' | 'taxonomy'

interface AdminPageProps {
  kind: AdminKind
  navigate: Navigate
  notify: (message: string) => void
}

const config: Record<AdminKind, { label: string; title: string; text: string; action: string; icon: IconName; variant: 'dashboard' | 'queue' | 'people' | 'audit' | 'catalog' }> = {
  dashboard: { label: 'Control operațional', title: 'Dashboard administrare', text: 'Moderare, verificări, risc și integritatea datelor platformei.', action: 'Deschide coada prioritară', icon: 'chart', variant: 'dashboard' },
  listings: { label: 'Moderare', title: 'Moderare anunțuri', text: 'Listări noi, modificări sensibile și anunțuri semnalate.', action: 'Reguli moderare', icon: 'building', variant: 'queue' },
  reviews: { label: 'Moderare', title: 'Moderare recenzii', text: 'Recenzii noi, contestate și conținut cu risc de date personale.', action: 'Reguli recenzii', icon: 'star', variant: 'queue' },
  documents: { label: 'Verificare', title: 'Documente încărcate', text: 'Fișiere anonimizate și solicitări de completare.', action: 'Politica documentelor', icon: 'file', variant: 'queue' },
  verifications: { label: 'Încredere', title: 'Verificări în lucru', text: 'Identitate, legătura cu proprietatea și sursele datelor.', action: 'Configurează priorități', icon: 'shield', variant: 'queue' },
  duplicates: { label: 'Integritate', title: 'Proprietăți posibil duplicate', text: 'Adrese, anunțuri și dosare care necesită reconciliere.', action: 'Rulează potrivirea', icon: 'compare', variant: 'queue' },
  disputes: { label: 'Cazuri', title: 'Dispute și contestații', text: 'Conflicte privind recenziile, istoricul și dreptul de publicare.', action: 'Politica de soluționare', icon: 'shield', variant: 'queue' },
  reports: { label: 'Siguranță', title: 'Raportări comunitate', text: 'Conținut înșelător, date incorecte și probleme de siguranță.', action: 'Configurează risc', icon: 'file', variant: 'queue' },
  users: { label: 'Utilizatori', title: 'Administrarea utilizatorilor', text: 'Conturi, roluri, verificări și activitate recentă.', action: 'Invită administrator', icon: 'user', variant: 'people' },
  suspensions: { label: 'Siguranță', title: 'Suspendări și restricții', text: 'Conturi restricționate, motive și termene de revizuire.', action: 'Vezi politica', icon: 'shield', variant: 'people' },
  deletions: { label: 'Date personale', title: 'Solicitări de ștergere', text: 'Cereri de acces, portabilitate și ștergere a datelor.', action: 'Exportă raportul', icon: 'file', variant: 'people' },
  audit: { label: 'Trasabilitate', title: 'Jurnal de audit', text: 'Modificări administrative și decizii de moderare.', action: 'Exportă jurnalul', icon: 'history', variant: 'audit' },
  buildings: { label: 'Catalog', title: 'Administrarea blocurilor', text: 'Dosare de clădiri, administratori și potrivirea adreselor.', action: 'Adaugă bloc', icon: 'building', variant: 'catalog' },
  areas: { label: 'Catalog', title: 'Administrarea zonelor', text: 'Sectoare, cartiere, scoruri și puncte de interes.', action: 'Adaugă zonă', icon: 'map', variant: 'catalog' },
  taxonomy: { label: 'Configurare', title: 'Categorii și facilități', text: 'Tipuri de clădiri, facilități, probleme și reguli de afișare.', action: 'Categorie nouă', icon: 'filter', variant: 'catalog' },
}

const adminMenu: Array<[string, string, IconName, AdminKind]> = [
  ['Dashboard', '/admin', 'home', 'dashboard'],
  ['Anunțuri', '/admin/anunturi', 'building', 'listings'],
  ['Recenzii', '/admin/recenzii', 'star', 'reviews'],
  ['Documente', '/admin/documente', 'file', 'documents'],
  ['Verificări', '/admin/verificari', 'shield', 'verifications'],
  ['Duplicate', '/admin/duplicate', 'compare', 'duplicates'],
  ['Dispute', '/admin/dispute', 'shield', 'disputes'],
  ['Raportări', '/admin/raportari', 'file', 'reports'],
  ['Utilizatori', '/admin/utilizatori', 'user', 'users'],
  ['Suspendări', '/admin/suspendari', 'shield', 'suspensions'],
  ['Ștergeri date', '/admin/stergeri', 'file', 'deletions'],
  ['Audit', '/admin/audit', 'history', 'audit'],
  ['Blocuri', '/admin/blocuri', 'building', 'buildings'],
  ['Zone', '/admin/zone', 'map', 'areas'],
  ['Categorii', '/admin/categorii', 'filter', 'taxonomy'],
]

function downloadText(filename: string, content: string, notify: (message: string) => void) {
  const href = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = href
  link.download = filename
  link.click()
  URL.revokeObjectURL(href)
  notify('Fișierul demonstrativ a fost exportat')
}

export function AdminPage({ kind, navigate, notify }: AdminPageProps) {
  const info = config[kind]
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')

  const primaryAction = () => {
    if (kind === 'dashboard') return navigate('/admin/anunturi')
    if (kind === 'listings') return navigate('/reguli-anunturi')
    if (kind === 'reviews') return navigate('/reguli-recenzii')
    if (kind === 'documents') return navigate('/cum-verificam-datele')
    if (kind === 'suspensions') return navigate('/siguranta')
    if (kind === 'buildings') return navigate('/bloc/toro-center')
    if (kind === 'areas') return navigate('/zona/centru')
    if (kind === 'audit' || kind === 'deletions') {
      downloadText(kind === 'audit' ? 'jurnal-audit.csv' : 'solicitari-date.csv', 'id,status,actualizat\nADM-001,În analiză,2026-07-22', notify)
      return
    }
    notify(`${info.action}: acțiune demonstrativă pornită`)
  }

  return <div className='admin-page'><div className={`admin-shell ${menuOpen ? 'menu-open' : ''}`}>
    <aside className='admin-sidebar'>
      <button className='admin-brand' type='button' onClick={() => navigate('/admin')}><span className='brand-mark'><i /><i /><i /></span><span><strong>Locuința</strong><small>Admin</small></span></button><button className='admin-drawer-close' type='button' aria-label='Închide meniul administrativ' onClick={() => setMenuOpen(false)}><Icon name='close' /></button>
      <div className='admin-environment'><span>Mediu demonstrativ</span><b>Operațiuni Chișinău</b></div>
      <nav>{adminMenu.map(([label, path, icon, menuKind]) => <button className={kind === menuKind ? 'active' : ''} type='button' onClick={() => { navigate(path); setMenuOpen(false) }} key={path}><Icon name={icon} size={17} /><span>{label}</span>{['Anunțuri', 'Recenzii', 'Documente', 'Verificări'].includes(label) && <b>{[18, 12, 9, 7][['Anunțuri', 'Recenzii', 'Documente', 'Verificări'].indexOf(label)]}</b>}</button>)}</nav>
      <button className='admin-back' type='button' onClick={() => navigate('/dashboard')}><Icon name='arrow-right' className='back-icon' /> Ieși din administrare</button>
    </aside>
    <main className='admin-main'>
      <header className='admin-topbar'><div><button className='admin-menu-button' type='button' aria-label='Deschide meniul administrativ' aria-expanded={menuOpen} onClick={() => setMenuOpen((current) => !current)}><Icon name='menu' /></button><span>Administrare</span><small>/</small><strong>{info.title}</strong></div><div><label><Icon name='search' size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder='Caută ID, adresă sau utilizator' /></label><button className='admin-notifications' type='button' aria-label='Deschide raportările prioritare' onClick={() => navigate('/admin/raportari')}><Icon name='shield' /><span>7</span></button><button className='admin-user' type='button' onClick={() => notify('Meniul administratorului a fost deschis')}><span>DP</span><div><strong>Dana P.</strong><small>Administrator</small></div></button></div></header>
      <div className='admin-content'>
        <header className='admin-page-header'><div><span><Icon name={info.icon} size={17} /> {info.label}</span><h1>{info.title}</h1><p>{info.text}</p></div><button className='button button-primary' type='button' onClick={primaryAction}>{info.action}</button></header>
        {info.variant === 'dashboard' && <AdminDashboard navigate={navigate} notify={notify} />}
        {info.variant === 'queue' && <ModerationQueue kind={kind} query={query} notify={notify} />}
        {info.variant === 'people' && <PeopleAdmin kind={kind} query={query} notify={notify} />}
        {info.variant === 'audit' && <AuditLog query={query} notify={notify} />}
        {info.variant === 'catalog' && <CatalogAdmin kind={kind} query={query} navigate={navigate} notify={notify} />}
      </div>
    </main>
  </div></div>
}

function AdminDashboard({ navigate, notify }: { navigate: Navigate; notify: (message: string) => void }) {
  const priorityRows = [
    ['AN-2891', 'Anunț nou · €118.500', 'Adresă posibil duplicată', 'Risc ridicat', '/admin/anunturi'],
    ['REC-821', 'Recenzie nouă', 'Conține posibil nume complet', 'Analiză', '/admin/recenzii'],
    ['DOC-442', 'Extras cadastral', 'Pagina 2 lipsește', 'Completare', '/admin/documente'],
    ['REP-117', 'Raportare comunitate', 'Fotografii neactuale', 'Prioritar', '/admin/raportari'],
  ]
  return <div className='admin-dashboard-content'>
    <div className='admin-kpis'>{[['În moderare', '46', '+8 astăzi'], ['Verificări restante', '17', '4 prioritare'], ['Raportări deschise', '12', '2 risc ridicat'], ['Duplicate posibile', '9', 'scor > 85%'], ['Timp mediu', '3h 24m', '−18%']].map(([label, value, note], index) => <article key={label}><span><Icon name={['building', 'shield', 'file', 'compare', 'clock'][index] as IconName} /></span><div><small>{label}</small><strong>{value}</strong><b>{note}</b></div></article>)}</div>
    <div className='admin-dashboard-grid'>
      <section className='admin-panel moderation-priority'><header><div><h2>Coada prioritară</h2><p>Sortată după risc și timp de așteptare</p></div><button type='button' onClick={() => navigate('/admin/anunturi')}>Vezi coada</button></header>{priorityRows.map(([id, title, reason, status, path]) => <article key={id}><span>{id}</span><div><strong>{title}</strong><small>{reason}</small></div><b>{status}</b><button type='button' onClick={() => { notify(`Cazul ${id} a fost selectat`); navigate(path) }}>Analizează</button></article>)}</section>
      <section className='admin-panel integrity-panel'><header><div><h2>Sănătatea datelor</h2><p>Ultimele 7 zile</p></div></header><div className='integrity-score'><strong>92%</strong><span>date cu sursă</span></div>{[['Dosare verificate', 94], ['Adrese normalizate', 88], ['Prețuri cu sursă', 91], ['Blocuri complete', 76]].map(([label, value]) => <div className='integrity-row' key={label as string}><span>{label as string}</span><i><b style={{ width: `${value}%` }} /></i><strong>{value}%</strong></div>)}</section>
    </div>
    <AdminActivityChart />
  </div>
}

function AdminActivityChart() {
  const [period, setPeriod] = useState('Ultimele 30 de zile')
  return <section className='admin-panel admin-activity-chart'><header><div><h2>Activitate de moderare</h2><p>Decizii pe zi și rata de aprobare</p></div><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>Ultimele 7 zile</option><option>Ultimele 30 de zile</option><option>Ultimele 90 de zile</option></select></header><div><div className='admin-bars'>{[32, 45, 38, 61, 54, 70, 66, 82, 71, 88, 79, 92, 85, 76].map((height, index) => <i style={{ height: `${height}%` }} key={index} />)}</div><aside><span><b>684</b> decizii</span><span><b>81%</b> aprobate</span><span><b>13%</b> completări</span><span><b>6%</b> respinse</span></aside></div></section>
}

function ModerationQueue({ kind, query, notify }: { kind: AdminKind; query: string; notify: (message: string) => void }) {
  const noun = kind === 'reviews' ? 'recenzie' : kind === 'documents' ? 'document' : kind === 'duplicates' ? 'potrivire' : kind === 'reports' ? 'raportare' : kind === 'disputes' ? 'dispută' : kind === 'verifications' ? 'verificare' : 'anunț'
  const filters = ['Toate', 'Prioritare', 'În așteptare', 'Necesită completări']
  const [activeFilter, setActiveFilter] = useState('Toate')
  const [risk, setRisk] = useState('Orice nivel de risc')
  const [moderator, setModerator] = useState('Toți moderatorii')
  const [selected, setSelected] = useState<number[]>([])
  const normalized = query.trim().toLocaleLowerCase('ro-RO')
  const rows = [0, 1, 2, 3, 4].map((item) => ({
    item,
    id: `${noun.toUpperCase().slice(0, 3)}-${2891 - item * 137}`,
    title: kind === 'reviews' ? 'Experiență despre Lev Tolstoi 24/1' : kind === 'documents' ? 'Extras cadastral anonimizat' : properties[item % properties.length].address,
    signal: item % 2 === 0 ? 'Posibil duplicat' : 'Sursă incompletă',
    status: item === 0 ? 'Prioritar' : item === 1 ? 'Completare' : 'În analiză',
  })).filter((row) => (!normalized || `${row.id} ${row.title} ${row.signal} ${row.status}`.toLocaleLowerCase('ro-RO').includes(normalized)) && (activeFilter === 'Toate' || (activeFilter === 'Prioritare' && row.status === 'Prioritar') || (activeFilter === 'În așteptare' && row.status === 'În analiză') || (activeFilter === 'Necesită completări' && row.status === 'Completare')))

  return <div className='admin-queue'>
    <div className='admin-filters'><div>{filters.map((item) => <button className={activeFilter === item ? 'active' : ''} type='button' onClick={() => setActiveFilter(item)} key={item}>{item}</button>)}</div><div><select value={risk} onChange={(event) => setRisk(event.target.value)}><option>Orice nivel de risc</option><option>Risc ridicat</option><option>Risc mediu</option></select><select value={moderator} onChange={(event) => setModerator(event.target.value)}><option>Toți moderatorii</option><option>Dana P.</option><option>Mihai R.</option></select></div></div>
    <div className='admin-table-head'><span>Selectare</span><span>ID și tip</span><span>Conținut / proprietate</span><span>Semnale</span><span>Timp</span><span>Status</span><span>Acțiuni</span></div>
    {rows.length ? rows.map(({ item, id, title, signal, status }) => <article key={item}><label><input type='checkbox' checked={selected.includes(item)} onChange={() => setSelected((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])} /></label><span><b>{id}</b><small>{noun}</small></span><div>{kind === 'listings' && <img src={properties[item % properties.length].image} alt='' />}<span><strong>{title}</strong><small>{kind === 'documents' ? 'PDF · 2,4 MB' : 'Centru · actualizat recent'}</small></span></div><span className='risk-signals'>{signal}</span><span>{item + 1}h {item * 7}m</span><b className={item === 0 ? 'danger' : item === 1 ? 'warning' : 'neutral'}>{status}</b><button type='button' onClick={() => notify(`${id} a fost deschis pentru analiză`)}>Deschide</button></article>) : <div className='empty-state'><span>⌕</span><h2>Niciun element găsit</h2><p>Schimbă filtrul sau termenul de căutare.</p></div>}
  </div>
}

function PeopleAdmin({ kind, query, notify }: { kind: AdminKind; query: string; notify: (message: string) => void }) {
  const normalized = query.trim().toLocaleLowerCase('ro-RO')
  const people = [['AM', 'Ana M.', 'Căutător', 'Email', 'astăzi, 12:42', 'Activ'], ['VI', 'Victor I.', 'Proprietar', 'Identitate + proprietate', 'astăzi, 11:08', 'Verificat'], ['IC', 'Irina C.', 'Agent', 'Profesional', 'ieri, 19:20', 'Verificat'], ['DM', 'Dan M.', 'Agent', 'În așteptare', '14 iulie', 'Limitat']].filter((row) => !normalized || row.join(' ').toLocaleLowerCase('ro-RO').includes(normalized))
  return <div className='admin-people'><div className='people-summary'>{[['Conturi active', '18.420'], ['Verificate', '6.284'], [kind === 'deletions' ? 'Cereri deschise' : 'Restricționate', kind === 'deletions' ? '14' : '36'], ['Conturi noi azi', '82']].map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}</div><div className='people-list'><header><span>Utilizator</span><span>Rol</span><span>Verificare</span><span>Activitate</span><span>Status</span><span>Acțiuni</span></header>{people.map((row) => <article key={row[1]}><span><b>{row[0]}</b><strong>{row[1]}</strong></span>{row.slice(2).map((cell) => <span key={cell}>{cell}</span>)}<button type='button' onClick={() => notify(`Administrarea contului ${row[1]} a fost deschisă`)}>Gestionează</button></article>)}</div></div>
}

function AuditLog({ query, notify }: { query: string; notify: (message: string) => void }) {
  const normalized = query.trim().toLocaleLowerCase('ro-RO')
  const entries = [['12:42:18', 'Dana P.', 'AN-2891', 'A solicitat completarea adresei', 'Moderare anunț'], ['12:31:04', 'Sistem', 'LOC-2481', 'A detectat o posibilă modificare de preț', 'Regulă automată'], ['11:58:22', 'Mihai R.', 'REC-821', 'A mascat o informație personală', 'Moderare recenzie'], ['11:20:11', 'Dana P.', 'DOC-442', 'A confirmat sursa documentului', 'Verificare'], ['10:47:09', 'Sistem', 'USR-1821', 'A aplicat limită temporară', 'Protecție abuz']].filter((row) => !normalized || row.join(' ').toLocaleLowerCase('ro-RO').includes(normalized))
  return <div className='audit-log'>{entries.map(([time, user, target, action, type]) => <article key={time}><span>{time}</span><div><strong>{user}</strong><small>{type}</small></div><b>{target}</b><p>{action}</p><button type='button' onClick={() => notify(`Detaliile auditului pentru ${target} au fost deschise`)}>Detalii</button></article>)}</div>
}

function CatalogAdmin({ kind, query, navigate, notify }: { kind: AdminKind; query: string; navigate: Navigate; notify: (message: string) => void }) {
  const sourceItems = kind === 'buildings'
    ? [['Toro Center', 'Centru', '184 apartamente', '92% complet'], ['Oasis Residence', 'Râșcani', '236 apartamente', '86% complet'], ['Eldorado Terra', 'Botanica', '148 apartamente', '78% complet']]
    : kind === 'areas'
      ? [['Centru', '312 recenzii', '4,5 scor', '96% complet'], ['Râșcani', '248 recenzii', '4,4 scor', '89% complet'], ['Botanica', '196 recenzii', '4,2 scor', '83% complet']]
      : [['Facilități interior', '24 opțiuni', '3 limbi', 'Activ'], ['Tipuri clădire', '12 opțiuni', '3 limbi', 'Activ'], ['Probleme raportate', '18 categorii', '7 severe', 'Activ']]
  const normalized = query.trim().toLocaleLowerCase('ro-RO')
  const items = sourceItems.filter((row) => !normalized || row.join(' ').toLocaleLowerCase('ro-RO').includes(normalized))
  const edit = (title: string) => {
    if (kind === 'buildings' && title === 'Toro Center') return navigate('/bloc/toro-center')
    if (kind === 'areas' && title === 'Centru') return navigate('/zona/centru')
    notify(`Editorul pentru „${title}” a fost deschis`)
  }
  return <div className='admin-catalog'><div className='catalog-grid'>{items.map(([title, detail, meta, status], index) => <article key={title}><span><Icon name={kind === 'areas' ? 'map' : kind === 'buildings' ? 'building' : 'filter'} /></span><div><strong>{title}</strong><p>{detail}</p><small>{meta}</small></div><b>{status}</b><button type='button' onClick={() => edit(title)}>Editează</button><div className='catalog-completeness'><i style={{ width: `${92 - index * 8}%` }} /></div></article>)}</div><aside><h3>Calitatea catalogului</h3><p>Elementele incomplete reduc acuratețea căutării și a comparațiilor.</p><div><span>Complete <b>82%</b></span><span>Necesită revizuire <b>14%</b></span><span>Fără sursă <b>4%</b></span></div></aside></div>
}
