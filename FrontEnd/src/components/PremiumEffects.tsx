import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'

interface PremiumEffectsProps { path: string }

const revealSelectors = [
  '.page-hero > .container',
  '.section-heading',
  '.home-hero-v2 .hero-v2-copy',
  '.home-hero-v2 .hero-v2-visual',
  '.property-card',
  '.review-card',
  '.detail-section',
  '.workspace-panel',
  '.admin-panel',
  '.state-surface',
  '.empty-state',
  '.flow-form-card',
  '.flow-summary',
  '.account-main > header',
  '.account-main > div',
  '.building-hero > *',
  '.area-hero > *',
  '.public-profile-hero > *',
  '.compare-hero > *',
  '.info-layout > *',
].join(',')

const staggerSelectors = [
  '.property-grid',
  '.results-cards-v2',
  '.review-feed',
  '.owner-kpi-grid',
  '.admin-kpis',
  '.agent-overview',
  '.dashboard-statuses',
  '.state-demo-grid',
  '.choice-grid',
  '.hub-property-grid',
].join(',')

export function PremiumEffects({ path }: PremiumEffectsProps) {
  const progressRef = useRef<HTMLDivElement>(null)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    root.classList.toggle('motion-enabled', !reducedMotion)
    document.body.dataset.route = path.split('/').filter(Boolean)[0] || 'home'

    let frame = 0
    const updateViewportEffects = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
        const progress = Math.min(1, window.scrollY / scrollable)
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`
        root.style.setProperty('--scroll-y', `${window.scrollY}px`)
        setShowTop(window.scrollY > 850)
      })
    }

    const updatePointer = (event: PointerEvent) => {
      root.style.setProperty('--pointer-x', `${event.clientX}px`)
      root.style.setProperty('--pointer-y', `${event.clientY}px`)
      root.style.setProperty('--pointer-x-ratio', `${event.clientX / Math.max(window.innerWidth, 1)}`)
      root.style.setProperty('--pointer-y-ratio', `${event.clientY / Math.max(window.innerHeight, 1)}`)
    }

    window.addEventListener('scroll', updateViewportEffects, { passive: true })
    window.addEventListener('resize', updateViewportEffects)
    window.addEventListener('pointermove', updatePointer, { passive: true })
    updateViewportEffects()

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateViewportEffects)
      window.removeEventListener('resize', updateViewportEffects)
      window.removeEventListener('pointermove', updatePointer)
    }
  }, [path])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelectors))
    const staggerGroups = Array.from(document.querySelectorAll<HTMLElement>(staggerSelectors))

    staggerGroups.forEach((group) => {
      Array.from(group.children).forEach((child, index) => {
        if (!(child instanceof HTMLElement)) return
        child.style.setProperty('--reveal-delay', `${Math.min(index * 65, 390)}ms`)
      })
    })

    elements.forEach((element, index) => {
      element.classList.add('reveal-item')
      if (!element.dataset.reveal) {
        const direction = index % 5 === 1 ? 'right' : index % 5 === 3 ? 'left' : 'up'
        element.dataset.reveal = direction
      }
    })

    if (reducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -7% 0px' })

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [path])


  useEffect(() => {
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.entity-anchor-nav a[href^="#"], .states-anchor-nav a[href^="#"]'))
    if (!links.length || !('IntersectionObserver' in window)) return
    const targets = links.map((link) => document.getElementById(link.hash.slice(1))).filter((target): target is HTMLElement => Boolean(target))
    const activate = (id: string) => links.forEach((link) => link.classList.toggle('active', link.hash === `#${id}`))
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible?.target.id) activate(visible.target.id)
    }, { rootMargin: '-24% 0px -64% 0px', threshold: [0.05, 0.25] })
    targets.forEach((target) => observer.observe(target))
    links.forEach((link) => link.addEventListener('click', () => activate(link.hash.slice(1))))
    return () => observer.disconnect()
  }, [path])

  return (
    <>
      <div className='scroll-progress' aria-hidden='true'><div ref={progressRef} /></div>
      <div className='premium-ambient' aria-hidden='true'>
        <i className='ambient-orb orb-one' />
        <i className='ambient-orb orb-two' />
        <i className='ambient-grid' />
      </div>
      <button className={showTop ? 'back-to-top visible' : 'back-to-top'} type='button' aria-label='Înapoi sus' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <Icon name='arrow-right' className='back-to-top-icon' size={18} />
      </button>
    </>
  )
}
