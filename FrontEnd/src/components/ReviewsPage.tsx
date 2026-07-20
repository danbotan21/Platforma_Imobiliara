import { useState } from 'react'
import { recentReviews, type SharedPageProps } from '../data'

export function ReviewsPage({ navigate }: SharedPageProps) {
  const [filter, setFilter] = useState('Toate')
  const [query, setQuery] = useState('')
  const visible = query.toLowerCase().includes('nimic') ? [] : recentReviews.filter((review) => filter === 'Toate' || review.role.includes(filter))

  return (
    <div className="reviews-page">
      <section className="page-hero compact-hero"><div className="container"><div><span className="eyebrow">Experiențe verificate</span><h1>Recenzii despre apartamente, proprietari și blocuri.</h1><p>Citește experiențe structurate și vezi clar cine a confirmat legătura cu proprietatea.</p></div><button className="button button-primary" type="button" onClick={() => navigate('/scrie-recenzie')}>Scrie o recenzie</button></div></section>
      <section className="section"><div className="container reviews-layout">
        <main><div className="review-filters"><label className="search-field"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Caută după adresă sau complex" /></label><div>{['Toate', 'Chiriaș', 'Cumpărător'].map((item) => <button className={filter === item ? 'active' : ''} type="button" onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><select aria-label="Sortează recenziile"><option>Cele mai recente</option><option>Cele mai utile</option><option>Rating mare</option></select></div>
          {visible.length ? <div className="review-feed">{visible.map((review) => <article className="review-card full" key={review.id}><header><span className="avatar">{review.initials}</span><div><strong>{review.name}</strong><small>{review.role} · {review.period}</small></div><b>★ {review.rating}</b></header><button className="review-property-link" type="button" onClick={() => navigate('/proprietate/lev-tolstoi-24')}>{review.property} →</button><p>{review.text}</p><div className="review-pros-cons"><span className="pros"><b>Avantaje</b>{review.pros}</span><span className="cons"><b>Dezavantaje</b>{review.cons}</span></div><div className="review-category-strip"><span>Stare <b>4,8</b></span><span>Proprietar <b>4,7</b></span><span>Bloc <b>4,4</b></span><span>Zonă <b>4,6</b></span></div><footer><span className="trust-label verified">✓ Verificat prin document</span><div><button type="button">Util ({review.helpful})</button><button type="button">Raportează</button></div></footer></article>)}</div> : <div className="empty-state"><span>☆</span><h2>Nu există recenzii pentru acest filtru</h2><p>Încearcă altă adresă sau elimină filtrul selectat.</p><button className="button button-secondary" type="button" onClick={() => { setQuery(''); setFilter('Toate') }}>Resetează filtrul</button></div>}
        </main>
        <aside className="reviews-sidebar"><div className="rating-summary"><span>Rating mediu demonstrativ</span><strong>4,5</strong><b>★★★★★</b><small>din recenziile afișate</small></div><div className="moderation-card"><strong>Cum verificăm recenziile?</strong><p>Legătura cu proprietatea poate fi confirmată printr-un document anonimizat, de proprietar sau prin alte dovezi analizate.</p><button type="button" onClick={() => navigate('/stari-ui')}>Vezi nivelurile de încredere →</button></div><div className="no-review-card"><strong>Nu găsești proprietatea?</strong><p>Poți adăuga adresa înainte de a începe recenzia.</p><button type="button" onClick={() => navigate('/adauga-informatii')}>Adaugă informații</button></div></aside>
      </div></section>
    </div>
  )
}
