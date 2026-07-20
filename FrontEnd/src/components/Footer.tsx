import type { Navigate } from '../data'

interface FooterProps { navigate: Navigate }

export function Footer({ navigate }: FooterProps) {
  const links = [
    ['Chirie', '/chirie'], ['Cumpără', '/cumpara'], ['Verifică o adresă', '/verifica'],
    ['Hartă', '/harta'], ['Recenzii', '/recenzii'], ['Cum verificăm datele', '/cum-verificam-datele'],
  ]

  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <div className="brand brand-static"><span className="brand-mark"><i /><i /><i /></span><span><strong>Locuința</strong><small>.md</small></span></div>
          <p>Anunțuri, istoric, recenzii și context local pentru decizii imobiliare mai bine informate în Chișinău.</p>
          <span className="demo-note">Toate datele afișate sunt demonstrative.</span>
        </div>
        <div className="footer-links"><strong>Explorează</strong>{links.map(([label, href]) => <button type="button" onClick={() => navigate(href)} key={href}>{label}</button>)}</div>
        <div className="footer-links"><strong>Contul tău</strong><button type="button" onClick={() => navigate('/dashboard')}>Dashboard</button><button type="button" onClick={() => navigate('/anunturile-mele')}>Anunțurile mele</button><button type="button" onClick={() => navigate('/cautari-salvate')}>Căutări salvate</button><button type="button" onClick={() => navigate('/mesaje')}>Mesaje</button></div>
        <div className="footer-contribute">
          <strong>Contribuie la transparență</strong>
          <button type="button" onClick={() => navigate('/publica')}>Publică un anunț <span>→</span></button>
          <button type="button" onClick={() => navigate('/scrie-recenzie')}>Scrie o recenzie <span>→</span></button>
          <button type="button" onClick={() => navigate('/adauga-informatii')}>Adaugă informații <span>→</span></button>
        </div>
      </div>
        <div className="container footer-bottom"><span>© 2026 Locuința.md · Date demonstrative</span><div><button type="button" onClick={() => navigate('/despre')}>Despre</button><button type="button" onClick={() => navigate('/ajutor')}>Ajutor</button><button type="button" onClick={() => navigate('/siguranta')}>Siguranță</button><button type="button" onClick={() => navigate('/confidentialitate')}>Confidențialitate</button><button type="button" onClick={() => navigate('/termeni')}>Termeni</button><button type="button" onClick={() => navigate('/contact')}>Contact</button></div></div>
    </footer>
  )
}
