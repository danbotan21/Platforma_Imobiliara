import type { Property, SharedPageProps } from '../data'
import { money } from '../data'
import { Icon } from './Icon'

interface PropertyCardProps extends Pick<SharedPageProps, 'navigate' | 'favorites' | 'compare' | 'toggleFavorite' | 'toggleCompare'> {
  property: Property
  compact?: boolean
}

export function PropertyCard({ property, compact = false, navigate, favorites, compare, toggleFavorite, toggleCompare }: PropertyCardProps) {
  const saved = favorites.includes(property.id)
  const compared = compare.includes(property.id)
  const trendPositive = property.trend >= 0
  const detailPath = `/proprietate/${property.slug}`

  return (
    <article className={`property-card is-${property.mode} ${property.special ? `is-${property.special}` : ''} ${compact ? 'compact' : ''} ${property.status === 'unavailable' ? 'unavailable' : ''}`}>
      <div className='property-photo'>
        <img src={property.image} alt={`Apartament pe ${property.address}`} loading='lazy' />
        <div className='card-badges'>
          <span className={`badge badge-${property.mode}`}>{property.mode === 'rent' ? 'De închiriat' : 'De vânzare'}</span>
          {property.verified ? <span className='badge badge-verified'><Icon name='shield' size={14} /> Verificat</span> : <span className='badge badge-unverified'>Neverificat</span>}
          {property.special === 'reduced' && <span className='badge badge-reduced'>Preț redus</span>}
          {property.special === 'new' && <span className='badge badge-new'>Nou listat</span>}
        </div>
        <button className={saved ? 'favorite-button active' : 'favorite-button'} type='button' onClick={() => toggleFavorite(property.id)} aria-label={saved ? 'Elimină din favorite' : 'Adaugă la favorite'}><Icon name='heart' /></button>
        {property.status === 'unavailable' && <div className='unavailable-overlay'><Icon name='clock' /><strong>Indisponibilă</strong><span>Istoricul rămâne vizibil</span></div>}
      </div>

      <div className='property-content'>
        <div className='price-block'>
          <div className='current-price'><strong>{money(property.price)}{property.mode === 'rent' && <small>/lună</small>}</strong>{property.mode === 'sale' && <span>{money(property.pricePerSqm)}/m²</span>}</div>
          <div className='price-context'>
            <span>Anterior <b>{money(property.previousPrice)}{property.mode === 'rent' ? '/lună' : ''}</b></span>
            <span className={trendPositive ? 'price-change positive' : 'price-change negative'}>{trendPositive ? '+' : '−'}{Math.abs(property.trend).toLocaleString('ro-RO')}% <small>{property.trendLabel}</small></span>
          </div>
        </div>

        <div className='property-identity'>
          <button type='button' onClick={() => navigate(detailPath)}>{property.address}</button>
          <p>{property.district} <span>•</span> {property.complex}</p>
        </div>

        <div className='property-specs'>
          <span><b>{property.rooms}</b> camere</span><span><b>{property.area}</b> m²</span><span>Etaj <b>{property.floor}</b></span>
        </div>

        <div className='property-evidence'>
          <div className='property-rating'><Icon name='star' size={16} /><strong>{property.rating.toLocaleString('ro-RO')}</strong><span>{property.reviews} recenzii</span></div>
          <span className='history-signal'><Icon name='history' size={16} /> {property.mode === 'rent' ? '2 perioade de chirie' : '3 listări anterioare'}</span>
        </div>

        <div className='property-actions'>
          <label className={compared ? 'compare-choice active' : 'compare-choice'}><input type='checkbox' checked={compared} onChange={() => toggleCompare(property.id)} /><Icon name='compare' size={17} /> Compară</label>
          <button className='details-link' type='button' onClick={() => navigate(detailPath)}>Vezi detalii <Icon name='arrow-right' size={17} /></button>
        </div>
      </div>
    </article>
  )
}
