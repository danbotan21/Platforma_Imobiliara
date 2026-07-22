import { useState } from 'react'
import type { Navigate } from '../data'

interface AuthPageProps { register: boolean; navigate: Navigate; notify: (message: string) => void }

export function AuthPage({ register, navigate, notify }: AuthPageProps) {
  const [tab, setTab] = useState(register ? 'register' : 'login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accepted, setAccepted] = useState(false)

  const changeTab = (nextTab: 'login' | 'register') => {
    setTab(nextTab)
    setPassword('')
  }

  const submit = () => {
    if (tab === 'register' && !name.trim()) {
      notify('Completează numele pentru a crea contul')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      notify('Introdu o adresă de email validă')
      return
    }
    if (password.length < 10) {
      notify('Parola trebuie să conțină minimum 10 caractere')
      return
    }
    if (tab === 'register' && !accepted) {
      notify('Acceptă termenii și politica de confidențialitate')
      return
    }

    notify(tab === 'register' ? 'Cont demonstrativ creat' : 'Autentificare demonstrativă reușită')
    navigate(tab === 'register' ? '/onboarding' : '/dashboard')
  }

  return (
    <div className="auth-page">
      <section className="auth-benefits"><div>
        <button className="brand brand-static" type="button" onClick={() => navigate('/')}><span className="brand-mark"><i /><i /><i /></span><span><strong>Locuința</strong><small>.md</small></span></button>
        <h1>Decizii imobiliare mai bine informate.</h1>
        <p>Salvează proprietăți, creează alerte, publică anunțuri și urmărește contribuțiile tale.</p>
        <ul><li>Favorite și comparații într-un singur loc</li><li>Alerte pentru prețuri și proprietăți noi</li><li>Dashboard pentru proprietari și agenți</li><li>Recenzii și contribuții verificate</li></ul>
      </div></section>
      <main className="auth-form-wrap"><form className="auth-card" onSubmit={(event) => { event.preventDefault(); submit() }}>
        <button className="auth-back" type="button" onClick={() => navigate('/')}>← Înapoi acasă</button>
        <div className="mode-tabs"><button className={tab === 'login' ? 'active' : ''} type="button" onClick={() => changeTab('login')}>Intră în cont</button><button className={tab === 'register' ? 'active' : ''} type="button" onClick={() => changeTab('register')}>Creează cont</button></div>
        <h2>{tab === 'login' ? 'Bine ai revenit' : 'Creează un cont'}</h2>
        <p>{tab === 'login' ? 'Continuă de unde ai rămas.' : 'Începe cu datele de bază, apoi alegi rolul și preferințele.'}</p>
        {tab === 'register' && <label>Nume<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Numele tău" autoComplete="name" /></label>}
        <label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="nume@exemplu.md" autoComplete="email" /></label>
        <label>Parolă<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Minimum 10 caractere" autoComplete={tab === 'register' ? 'new-password' : 'current-password'} /></label>
        {tab === 'register' && <label className="check-line"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} /> Accept termenii și politica de confidențialitate</label>}
        <button className="button button-primary button-full" type="submit">{tab === 'login' ? 'Intră în cont' : 'Creează contul și continuă'}</button>
        <div className="auth-divider"><span>sau</span></div>
        <button className="button button-secondary button-full" type="button" onClick={() => notify('Conectare socială demonstrativă')}>Continuă cu Google</button>
        <button className="forgot-link" type="button" onClick={() => navigate('/parola-uitata')}>Ai uitat parola?</button>
      </form></main>
    </div>
  )
}
