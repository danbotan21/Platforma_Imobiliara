import { properties, recentReviews, type SharedPageProps } from '../data'
import { Icon, type IconName } from './Icon'

const guides: Array<{ audience: string; title: string; time: string; image: string; path: string }> = [
  { audience: 'Pentru chiriași', title: 'Ce să verifici înainte să semnezi contractul de chirie', time: '7 min', image: properties[2].image, path: '/ajutor' },
  { audience: 'Pentru cumpărători', title: 'Cum interpretezi istoricul prețului și al proprietății', time: '9 min', image: properties[1].image, path: '/cum-functioneaza' },
  { audience: 'Pentru proprietari', title: 'Cum pregătești un anunț complet și credibil', time: '6 min', image: properties[3].image, path: '/publica' },
]

const contributions: Array<{ icon: IconName; title: string; text: string; action: string; path: string }> = [
  { icon: 'plus', title: 'Publică un anunț', text: 'Pentru o proprietate disponibilă la chirie sau vânzare.', action: 'Începe publicarea', path: '/publica' },
  { icon: 'star', title: 'Scrie o recenzie', text: 'Descrie experiența ta ca chiriaș, cumpărător sau vecin.', action: 'Scrie recenzia', path: '/scrie-recenzie' },
  { icon: 'history', title: 'Completează istoricul', text: 'Adaugă un preț, o renovare, o tranzacție sau o problemă.', action: 'Adaugă informații', path: '/adauga-informatii' },
]

export function HomeCommunity({ navigate }: Pick<SharedPageProps, 'navigate'>) {
  return (
    <>
      <section className='section reviews-home-section'>
        <div className='container'>
          <div className='section-heading'><div><span className='eyebrow'>Experiențe structurate</span><h2>Recenzii care ajută la o decizie.</h2></div><button className='text-link' type='button' onClick={() => navigate('/recenzii')}>Vezi toate recenziile <Icon name='arrow-right' size={17} /></button></div>
          <div className='home-review-layout'>
            <article className='featured-review'>
              <header><span className='avatar'>{recentReviews[0].initials}</span><div><strong>{recentReviews[0].name}</strong><small><Icon name='shield' size={14} /> {recentReviews[0].role}</small></div><b><Icon name='star' size={17} /> {recentReviews[0].rating.toLocaleString('ro-RO')}</b></header>
              <blockquote>„{recentReviews[0].text}”</blockquote>
              <div className='review-property-link'><div><small>Recenzie pentru</small><strong>{recentReviews[0].property}</strong><span>{recentReviews[0].period}</span></div><button type='button' onClick={() => navigate('/proprietate/lev-tolstoi-24')}><Icon name='arrow-right' /></button></div>
              <div className='review-sides'><span><b>Avantaje</b>{recentReviews[0].pros}</span><span><b>Dezavantaje</b>{recentReviews[0].cons}</span></div>
            </article>
            <div className='review-stack'>
              {recentReviews.slice(1).map((review) => <article key={review.id}><header><span className='avatar'>{review.initials}</span><div><strong>{review.name}</strong><small>{review.role}</small></div><b><Icon name='star' size={15} /> {review.rating.toLocaleString('ro-RO')}</b></header><p>{review.text}</p><footer><span>{review.property}</span><button type='button'>Utilă ({review.helpful})</button></footer></article>)}
            </div>
          </div>
        </div>
      </section>

      <section className='section guides-section'>
        <div className='container'>
          <div className='section-heading'><div><span className='eyebrow'>Ghiduri practice</span><h2>Pregătește-te pentru următorul pas.</h2></div><p>Explicații directe pentru decizii mai bune, fără jargon imobiliar inutil.</p></div>
          <div className='guide-grid'>{guides.map((guide) => <article className='guide-card' key={guide.title}><img src={guide.image} alt='' /><div><span>{guide.audience}</span><h3>{guide.title}</h3><p><Icon name='clock' size={15} /> {guide.time} de citit</p><button type='button' onClick={() => navigate(guide.path)}>Citește ghidul <Icon name='arrow-right' size={16} /></button></div></article>)}</div>
        </div>
      </section>

      <section className='contribution-v2-section'>
        <div className='container'>
          <div className='contribution-v2-head'><span>Construim o piață mai transparentă</span><h2>Ai informații utile despre o proprietate?</h2><p>Alege acțiunea exactă. Publicarea, recenzia și completarea istoricului sunt fluxuri separate.</p></div>
          <div className='contribution-v2-grid'>{contributions.map((item) => <article key={item.path}><span><Icon name={item.icon} /></span><h3>{item.title}</h3><p>{item.text}</p><button type='button' onClick={() => navigate(item.path)}>{item.action} <Icon name='arrow-right' size={17} /></button></article>)}</div>
        </div>
      </section>
    </>
  )
}
