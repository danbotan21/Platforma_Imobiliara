import { useState } from 'react'
import type { Navigate } from '../data'
import { Icon } from './Icon'

interface HeaderProps { path: string; favorites: number; navigate: Navigate }

const navigation = [
  { label: 'Chirie', path: '/chirie' },
  { label: 'Cumpără', path: '/cumpara' },
  { label: 'Verifică o adresă', path: '/verifica' },
  { label: 'Hartă', path: '/harta' },
  { label: 'Recenzii', path: '/recenzii' },
]

export function Header({ path, favorites, navigate }: HeaderProps) {
  const [open, setOpen] = useState(false)

  const go = (nextPath: string) => {
    navigate(nextPath)
    setOpen(false)
  }

  return (
    <header className='site-header'>
      <div className='container header-inner'>
        <button className='brand' type='button' onClick={() => go('/')} aria-label='Locuința.md, pagina principală'>
          <span className='brand-mark' aria-hidden='true'><i /><i /><i /></span>
          <span className='brand-copy'><strong>Locuința</strong><small>.md</small></span>
        </button>

        <nav className={open ? 'main-nav open' : 'main-nav'} aria-label='Navigare principală'>
          <div className='mobile-menu-heading'>
            <span>Explorează platforma</span>
            <button type='button' aria-label='Închide meniul' onClick={() => setOpen(false)}><Icon name='close' /></button>
          </div>
          {navigation.map((item) => (
            <button className={path === item.path ? 'active' : ''} type='button' onClick={() => go(item.path)} key={item.path}>{item.label}</button>
          ))}
          <div className='mobile-menu-tools'>
            <button type='button' onClick={() => go('/favorite')}><Icon name='heart' /> Favorite <b>{favorites}</b></button>
            <button type='button' onClick={() => go('/dashboard')}><Icon name='user' /> Contul meu</button>
            <button className='button button-primary' type='button' onClick={() => go('/publica')}><Icon name='plus' /> Publică un anunț</button>
          </div>
        </nav>

        <div className='header-actions'>
          <button className='header-favorite' type='button' onClick={() => go('/favorite')} aria-label={`Favorite, ${favorites} proprietăți`}>
            <Icon name='heart' /><b>{favorites}</b>
          </button>
          <button className='login-link' type='button' onClick={() => go('/autentificare')}><Icon name='user' /> Intră în cont</button>
          <button className='button button-primary publish-header' type='button' onClick={() => go('/publica')}><Icon name='plus' size={18} /> Publică un anunț</button>
          <button className='menu-toggle' type='button' aria-label={open ? 'Închide meniul' : 'Deschide meniul'} aria-expanded={open} onClick={() => setOpen((current) => !current)}>
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
      {open && <button className='menu-backdrop' type='button' aria-label='Închide meniul' onClick={() => setOpen(false)} />}
    </header>
  )
}
