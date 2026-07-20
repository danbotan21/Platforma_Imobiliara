import { useState } from 'react'
import { properties, type SharedPageProps } from '../data'
import { Icon, type IconName } from './Icon'

type Role = 'seeker' | 'owner' | 'agent'

const roleCopy: Record<Role, { label: string; title: string; subtitle: string }> = {
  seeker: { label: 'Caut o locuință', title: 'Bun venit, Ana.', subtitle: 'Recomandări, alerte și vizionări pentru căutarea ta.' },
  owner: { label: 'Proprietar', title: 'Bun venit, Victor.', subtitle: 'Performanța proprietăților și acțiunile care cer atenție.' },
  agent: { label: 'Agent', title: 'Bun venit, Irina.', subtitle: 'Portofoliu, lead-uri și activitatea echipei într-un singur loc.' },
}

const menu: Record<Role, Array<[string, string, IconName]>> = {
  seeker: [['Prezentare', '/dashboard', 'home'], ['Recomandări', '/recomandari', 'star'], ['Favorite', '/favorite', 'heart'], ['Alerte', '/cautari-salvate', 'shield'], ['Vizionări', '/vizionari', 'clock'], ['Ofertele mele', '/ofertele-mele', 'file'], ['Mesaje', '/mesaje', 'user']],
  owner: [['Prezentare', '/dashboard', 'home'], ['Anunțuri', '/anunturile-mele', 'building'], ['Lead-uri', '/lead-uri', 'user'], ['Vizionări', '/vizionari', 'clock'], ['Oferte', '/oferte', 'file'], ['Calendar', '/calendar', 'history'], ['Documente', '/documente', 'shield']],
  agent: [['Prezentare', '/dashboard', 'home'], ['Portofoliu', '/portofoliu', 'building'], ['Lead-uri', '/agent-lead-uri', 'user'], ['Echipă', '/membri-agentie', 'user'], ['Statistici', '/statistici-agentie', 'chart'], ['Profil public', '/agent/irina-c', 'star'], ['Agenție', '/agentie/casa-noua', 'shield']],
}

export function DashboardPage({ navigate }: SharedPageProps) {
  const [role, setRole] = useState<Role>('owner')
  const copy = roleCopy[role]

  return (
    <div className={`workspace-dashboard role-${role}`}>
      <div className='container workspace-shell'>
        <aside className='workspace-sidebar'>
          <div className='workspace-person'><span>{role === 'seeker' ? 'AM' : role === 'owner' ? 'VI' : 'IC'}</span><div><strong>{role === 'seeker' ? 'Ana M.' : role === 'owner' ? 'Victor I.' : 'Irina C.'}</strong><small>{copy.label}</small></div></div>
          <nav>{menu[role].map(([label, path, icon], index) => <button className={index === 0 ? 'active' : ''} type='button' onClick={() => navigate(path)} key={path}><Icon name={icon} size={18} /><span>{label}</span>{index > 2 && index < 5 && <b>{index + 1}</b>}</button>)}</nav>
          <div className='workspace-sidebar-footer'><button type='button' onClick={() => navigate('/setari')}><Icon name='user' size={18} /> Setări cont</button><button className='button button-primary' type='button' onClick={() => navigate('/publica')}><Icon name='plus' size={18} /> Publică un anunț</button></div>
        </aside>

        <main className='workspace-main'>
          <header className='workspace-header'><div><span className='eyebrow'>Joi, 16 iulie</span><h1>{copy.title}</h1><p>{copy.subtitle}</p></div><div className='workspace-header-actions'><div className='role-switcher'>{(Object.keys(roleCopy) as Role[]).map((item) => <button className={role === item ? 'active' : ''} type='button' onClick={() => setRole(item)} key={item}>{roleCopy[item].label}</button>)}</div><button className='workspace-alert-button' type='button' onClick={() => navigate('/notificari')}><Icon name='shield' /><span>4</span></button></div></header>
          {role === 'seeker' && <SeekerDashboard navigate={navigate} />}
          {role === 'owner' && <OwnerDashboard navigate={navigate} />}
          {role === 'agent' && <AgentDashboard navigate={navigate} />}
        </main>
      </div>
    </div>
  )
}

function SeekerDashboard({ navigate }: Pick<SharedPageProps, 'navigate'>) {
  return <div className='role-dashboard-content seeker-content'>
    <section className='search-progress-card'><div><span>Căutarea ta activă</span><h2>2 camere în Centru sau Râșcani</h2><p>€450–€700/lună · mobilat · cu istoric · animale acceptate</p><div><b>18 proprietăți noi</b><small>de la ultima vizită</small></div></div><button className='button button-primary' type='button' onClick={() => navigate('/chirie')}>Continuă căutarea</button></section>
    <div className='seeker-dashboard-grid'><section className='workspace-panel recommendation-panel'><header><div><h2>Recomandate pentru tine</h2><p>Pe baza alertelor și proprietăților salvate</p></div><button type='button' onClick={() => navigate('/recomandari')}>Vezi toate</button></header>{properties.slice(0, 3).map((property, index) => <article key={property.id}><img src={property.image} alt='' /><div><span>{property.district} · potrivire {96 - index * 4}%</span><strong>{property.address}</strong><small>€{property.price}{property.mode === 'rent' ? '/lună' : ''} · {property.rooms} camere · {property.area} m²</small></div><button type='button' onClick={() => navigate(`/proprietate/${property.slug}`)}><Icon name='arrow-right' /></button></article>)}</section>
      <aside className='seeker-side-stack'><section className='workspace-panel next-visit'><span>Următoarea vizionare</span><strong>18 iulie · 11:30</strong><h3>str. Lev Tolstoi 24/1</h3><p>Victor I. · proprietar verificat</p><div><button type='button' onClick={() => navigate('/vizionari/LOC-2481')}>Detalii</button><button type='button'>Reprogramează</button></div></section><section className='workspace-panel alert-health'><header><h3>Alertele tale</h3><b>3 active</b></header><p>Ultima alertă a găsit <strong>7 proprietăți noi</strong>.</p><button type='button' onClick={() => navigate('/cautari-salvate')}>Gestionează alertele</button></section></aside>
    </div>
    <section className='workspace-panel collection-strip'><header><div><h2>Colecții de favorite</h2><p>Organizează locuințele pentru comparații mai ușoare.</p></div><button type='button' onClick={() => navigate('/colectii')}>Colecție nouă</button></header><div>{[['Pentru vizionat', '6 proprietăți'], ['Finaliste', '3 proprietăți'], ['Pentru familie', '8 proprietăți']].map(([title, count], index) => <article key={title}><span>{['01','02','03'][index]}</span><strong>{title}</strong><small>{count}</small></article>)}</div></section>
  </div>
}

function OwnerDashboard({ navigate }: Pick<SharedPageProps, 'navigate'>) {
  return <div className='role-dashboard-content owner-content'>
    <div className='owner-kpi-grid'>{[['Anunțuri active', '3', '+1 luna aceasta'], ['Vizualizări', '1.284', '+12%'], ['Salvări', '86', '+8%'], ['Cereri de vizionare', '14', '3 noi'], ['Oferte', '4', '1 de răspuns']].map(([label, value, note], index) => <article key={label}><span><Icon name={['building','chart','heart','clock','file'][index] as IconName} /></span><div><small>{label}</small><strong>{value}</strong><b>{note}</b></div></article>)}</div>
    <div className='owner-dashboard-grid'><section className='workspace-panel owner-performance'><header><div><h2>Performanța anunțurilor</h2><p>Ultimele 30 de zile</p></div><select><option>Toate anunțurile</option></select></header><div className='owner-chart'><div className='chart-summary'><span><b>1.284</b> vizualizări</span><span><b>6,7%</b> rată de salvare</span></div><div className='dashboard-bars'>{[34,48,41,61,56,72,64,82,73,92,79,88].map((height, index) => <i style={{ height: `${height}%` }} key={`${height}-${index}`} />)}</div><div className='bar-labels'><span>16 iun.</span><span>30 iun.</span><span>16 iul.</span></div></div></section>
      <section className='workspace-panel owner-tasks'><header><div><h2>Necesită atenție</h2><p>Prioritizat după impact</p></div><b>3</b></header>{[['Cerere nouă de vizionare', 'Astăzi, 18:30 · Lev Tolstoi', 'Confirmă'], ['Ofertă primită', '€115.000 · bd. Moscova 18/2', 'Analizează'], ['Document incomplet', 'Lipsește pagina 2 din extras', 'Completează']].map(([title, text, action]) => <article key={title}><span>!</span><div><strong>{title}</strong><small>{text}</small></div><button type='button'>{action}</button></article>)}</section>
    </div>
    <section className='workspace-panel owner-listings'><header><div><h2>Portofoliul tău</h2><p>Status, interes și următoarea acțiune</p></div><button type='button' onClick={() => navigate('/anunturile-mele')}>Vezi toate</button></header>{properties.slice(0, 3).map((property, index) => <article key={property.id}><img src={property.image} alt='' /><div><strong>{property.address}</strong><span>{property.district} · {property.mode === 'rent' ? `€${property.price}/lună` : `€${property.price.toLocaleString('ro-RO')}`}</span></div><span className={`status-chip ${index === 0 ? 'published' : index === 1 ? 'review' : 'draft'}`}>{index === 0 ? 'Publicat' : index === 1 ? 'În verificare' : 'Draft'}</span><div><span>Vizualizări</span><b>{[842,301,0][index]}</b></div><div><span>Lead-uri</span><b>{[18,7,0][index]}</b></div><button type='button' onClick={() => navigate(`/anunt/editare/${property.id}`)}>Gestionează</button></article>)}</section>
  </div>
}

function AgentDashboard({ navigate }: Pick<SharedPageProps, 'navigate'>) {
  return <div className='role-dashboard-content agent-content'>
    <section className='agent-overview'><div><span>Portofoliu activ</span><strong>24</strong><small>18 vânzare · 6 chirie</small></div><div><span>Lead-uri deschise</span><strong>37</strong><small>8 fără răspuns</small></div><div><span>Vizionări săptămâna aceasta</span><strong>16</strong><small>4 astăzi</small></div><div><span>Rată de conversie</span><strong>12,8%</strong><small className='semantic-positive'>+2,4 pp</small></div></section>
    <section className='workspace-panel lead-pipeline'><header><div><h2>Pipeline de lead-uri</h2><p>Mută rapid conversațiile spre următoarea etapă.</p></div><button type='button' onClick={() => navigate('/agent-lead-uri')}>Deschide CRM</button></header><div className='pipeline-columns'>{[['Noi', '12', ['Ana M. · chirie Centru', 'Dan P. · 3 camere Râșcani']], ['Contactați', '9', ['Mihai V. · Toro Center', 'Elena S. · bd. Moscova']], ['Vizionare', '11', ['Cristina B. · 18 iulie', 'Victor N. · 19 iulie']], ['Ofertă', '5', ['Radu C. · €115.000', 'Olga T. · €96.000']]].map(([stage, count, leads]) => <div key={stage as string}><header><strong>{stage as string}</strong><span>{count as string}</span></header>{(leads as string[]).map((lead) => <article key={lead}><b>{lead}</b><small>Actualizat acum 2 ore</small></article>)}</div>)}</div></section>
    <div className='agent-bottom-grid'><section className='workspace-panel agent-calendar'><header><h2>Agenda de astăzi</h2><b>16 iulie</b></header>{[['10:00', 'Vizionare · bd. Moscova 18/2'], ['12:30', 'Apel ofertă · Radu C.'], ['16:00', 'Fotografiere · str. Grenoble 128'], ['18:30', 'Vizionare · Lev Tolstoi 24/1']].map(([time, title]) => <article key={time}><span>{time}</span><strong>{title}</strong></article>)}</section><section className='workspace-panel team-load'><header><h2>Activitatea echipei</h2><button type='button' onClick={() => navigate('/membri-agentie')}>Echipă</button></header>{[['IC', 'Irina C.', '8 lead-uri'], ['DM', 'Dan M.', '6 lead-uri'], ['AP', 'Ana P.', '5 lead-uri']].map(([initials, name, load]) => <article key={name}><span>{initials}</span><strong>{name}</strong><b>{load}</b></article>)}</section></div>
  </div>
}
