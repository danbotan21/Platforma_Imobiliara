import { useMemo, useState } from 'react'
import { properties, recentReviews, type SharedPageProps } from '../data'

export function ReviewsPage({ navigate, notify }: SharedPageProps) {
  const [filter, setFilter] = useState('Toate')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('Cele mai recente')
  const [helpful, setHelpful] = useState<Record<string, boolean>>({})
  const [reported, setReported] = useState<string[]>([])

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ro-RO')
    const filtered = recentReviews.filter((review) => {
      if (filter !== 'Toate' && !review.role.toLocaleLowerCase('ro-RO').includes(filter.toLocaleLowerCase('ro-RO'))) return false
      if (normalizedQuery && !`${review.property} ${review.text} ${review.pros} ${review.cons}`.toLocaleLowerCase('ro-RO').includes(normalizedQuery)) return false
      return true
    })
    if (sort === 'Cele mai utile') return [...filtered].sort((a, b) => (b.helpful + Number(helpful[b.id])) - (a.helpful + Number(helpful[a.id])))
    if (sort === 'Rating mare') return [...filtered].sort((a, b) => b.rating - a.rating)
    return filtered
  }, [filter, helpful, query, sort])

  const toggleHelpful = (id: string) => {
    setHelpful((current) => ({ ...current, [id]: !current[id] }))
  }

  const reportReview = (id: string) => {
    if (reported.includes(id)) {
      notify('Această recenzie a fost deja raportată în sesiunea curentă.')
      return
    }
    setReported((current) => [...current, id])
    notify('Recenzia a fost trimisă spre analiză.')
  }

  return (
    <div className="reviews-page">
      <section className="page-hero compact-hero"><div className="container"><div><span className="eyebrow">Experiențe verificate</span><h1>Recenzii despre apartamente, proprietari și blocuri.</h1><p>Citește experiențe structurate și vezi clar cine a confirmat legătura cu proprietatea.</p></div><button className="button button-primary" type="button" onClick={() => navigate('/scrie-recenzie')}>Scrie o recenzie</button></div></section>
      <section className="section"><div className="container reviews-layout">
        <main><div className="review-filters"><label className="search-field"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Caută după adresă sau complex" /></label><div>{['Toate', 'Chiriaș', 'Cumpărător'].map((item) => <button className={filter === item ? 'active' : ''} type="button" onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><select aria-label="Sortează recenziile" value={sort} onChange={(event) => setSort(event.target.value)}><option>Cele mai recente</option><option>Cele mai utile</option><option>Rating mare</option></select></div>
          {visible.length ? <div className="review-feed">{visible.map((review) => {
            const property = properties.find((item) => item.address === review.property)
            const helpfulCount = review.helpful + Number(Boolean(helpful[review.id]))
            return <article className="review-card full" key={review.id}><header><span className="avatar">{review.initials}</span><div><strong>{review.name}</strong><small>{review.role} · {review.period}</small></div><b>★ {review.rating}</b></header><button className="review-property-link" type="button" onClick={() => property ? navigate(`/proprietate/${property.slug}`) : notify('Dosarul acestei proprietăți nu este încă disponibil.')}>{review.property} →</button><p>{review.text}</p><div className="review-pros-cons"><span className="pros"><b>Avantaje</b>{review.pros}</span><span className="cons"><b>Dezavantaje</b>{review.cons}</span></div><div className="review-category-strip"><span>Stare <b>4,8</b></span><span>Proprietar <b>4,7</b></span><span>Bloc <b>4,4</b></span><span>Zonă <b>4,6</b></span></div><footer><span className="trust-label verified">✓ Verificat prin document</span><div><button className={helpful[review.id] ? 'active' : ''} type="button" onClick={() => toggleHelpful(review.id)}>{helpful[review.id] ? 'Marcat util' : 'Util'} ({helpfulCount})</button><button className={reported.includes(review.id) ? 'active' : ''} type="button" onClick={() => reportReview(review.id)}>{reported.includes(review.id) ? 'Raportată' : 'Raportează'}</button></div></footer></article>
          })}</div> : <div className="empty-state"><span>☆</span><h2>Nu există recenzii pentru acest filtru</h2><p>Încearcă altă adresă sau elimină filtrul selectat.</p><button className="button button-secondary" type="button" onClick={() => { setQuery(''); setFilter('Toate'); setSort('Cele mai recente') }}>Resetează filtrul</button></div>}
        </main>
        <aside className="reviews-sidebar"><div className="rating-summary"><span>Rating mediu demonstrativ</span><strong>4,5</strong><b>★★★★★</b><small>din recenziile afișate</small></div><div className="moderation-card"><strong>Cum verificăm recenziile?</strong><p>Legătura cu proprietatea poate fi confirmată printr-un document anonimizat, de proprietar sau prin alte dovezi analizate.</p><button type="button" onClick={() => navigate('/stari-ui')}>Vezi nivelurile de încredere →</button></div><div className="no-review-card"><strong>Nu găsești proprietatea?</strong><p>Poți adăuga adresa înainte de a începe recenzia.</p><button type="button" onClick={() => navigate('/adauga-informatii')}>Adaugă informații</button></div></aside>
      </div></section>
    </div>
  )
}
