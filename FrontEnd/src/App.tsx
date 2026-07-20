import { lazy, Suspense, useEffect, useState } from 'react'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { properties } from './data'

const HomePage = lazy(() => import('./components/HomePage').then((module) => ({ default: module.HomePage })))
const ResultsPage = lazy(() => import('./components/ResultsPage').then((module) => ({ default: module.ResultsPage })))
const PropertyPage = lazy(() => import('./components/PropertyPage').then((module) => ({ default: module.PropertyPage })))
const AddressCheckPage = lazy(() => import('./components/AddressCheckPage').then((module) => ({ default: module.AddressCheckPage })))
const MapPage = lazy(() => import('./components/MapPage').then((module) => ({ default: module.MapPage })))
const ReviewsPage = lazy(() => import('./components/ReviewsPage').then((module) => ({ default: module.ReviewsPage })))
const GuidedFlowPage = lazy(() => import('./components/GuidedFlowPage').then((module) => ({ default: module.GuidedFlowPage })))
const ComparePage = lazy(() => import('./components/ComparePage').then((module) => ({ default: module.ComparePage })))
const DashboardPage = lazy(() => import('./components/DashboardPage').then((module) => ({ default: module.DashboardPage })))
const UtilityPage = lazy(() => import('./components/UtilityPage').then((module) => ({ default: module.UtilityPage })))
const AuthPage = lazy(() => import('./components/AuthPage').then((module) => ({ default: module.AuthPage })))
const BuildingPage = lazy(() => import('./components/BuildingPage').then((module) => ({ default: module.BuildingPage })))
const AreaPage = lazy(() => import('./components/AreaPage').then((module) => ({ default: module.AreaPage })))
const WorkspaceHubPage = lazy(() => import('./components/WorkspaceHubPage').then((module) => ({ default: module.WorkspaceHubPage })))
const OnboardingPage = lazy(() => import('./components/OnboardingPage').then((module) => ({ default: module.OnboardingPage })))
const PublicProfessionalPage = lazy(() => import('./components/PublicProfessionalPage').then((module) => ({ default: module.PublicProfessionalPage })))
const AdminPage = lazy(() => import('./components/AdminPage').then((module) => ({ default: module.AdminPage })))
const InfoPage = lazy(() => import('./components/InfoPage').then((module) => ({ default: module.InfoPage })))
const UIStatesPage = lazy(() => import('./components/UIStatesPage').then((module) => ({ default: module.UIStatesPage })))

export function App() {
  const [path, setPath] = useState(() => window.location.pathname || '/')
  const [favorites, setFavorites] = useState<string[]>([properties[1].id])
  const [compare, setCompare] = useState<string[]>([])
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const syncPath = () => setPath(window.location.pathname || '/')
    window.addEventListener('popstate', syncPath)
    return () => window.removeEventListener('popstate', syncPath)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [path])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])

  const navigate = (nextPath: string) => {
    window.history.pushState({}, '', nextPath)
    setPath(window.location.pathname || '/')
  }

  const toggleFavorite = (id: string) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
    setToast(favorites.includes(id) ? 'Eliminat din favorite' : 'Proprietate salvată')
  }

  const toggleCompare = (id: string) => {
    setCompare((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      if (current.length >= 3) {
        setToast('Poți compara cel mult trei proprietăți')
        return current
      }
      setToast('Adăugat la comparație')
      return [...current, id]
    })
  }

  const shared = { navigate, favorites, compare, toggleFavorite, toggleCompare, notify: setToast }
  const showCompareDock = path === '/' || path === '/chirie' || path === '/cumpara' || path === '/harta' || path.startsWith('/proprietate/')
  const standalonePage = path.startsWith('/admin') || path.startsWith('/onboarding')
  let page = <UtilityPage kind="not-found" {...shared} />

  if (path === '/') page = <HomePage {...shared} />
  else if (path === '/chirie') page = <ResultsPage mode="rent" {...shared} />
  else if (path === '/cumpara') page = <ResultsPage mode="sale" {...shared} />
  else if (path === '/verifica') page = <AddressCheckPage {...shared} />
  else if (path === '/harta') page = <MapPage {...shared} />
  else if (path === '/recenzii') page = <ReviewsPage {...shared} />
  else if (path === '/publica') page = <GuidedFlowPage kind="publish" {...shared} />
  else if (path === '/scrie-recenzie') page = <GuidedFlowPage kind="review" {...shared} />
  else if (path === '/adauga-informatii') page = <GuidedFlowPage kind="contribute" {...shared} />
  else if (path === '/comparatie') page = <ComparePage {...shared} />
  else if (path === '/dashboard') page = <DashboardPage {...shared} />
  else if (path === '/onboarding') page = <OnboardingPage role="seeker" navigate={navigate} />
  else if (path === '/onboarding-proprietar') page = <OnboardingPage role="owner" navigate={navigate} />
  else if (path === '/onboarding-agent') page = <OnboardingPage role="agent" navigate={navigate} />
  else if (path.startsWith('/agent/')) page = <PublicProfessionalPage kind="agent" {...shared} />
  else if (path.startsWith('/agentie/')) page = <PublicProfessionalPage kind="agency" {...shared} />
  else if (path === '/autentificare' || path === '/inregistrare') page = <AuthPage register={path === '/inregistrare'} navigate={navigate} notify={setToast} />
  else if (path.startsWith('/proprietate/')) page = <PropertyPage slug={path.replace('/proprietate/', '')} {...shared} />
  else if (path.startsWith('/bloc/')) page = <BuildingPage {...shared} />
  else if (path.startsWith('/zona/')) page = <AreaPage {...shared} />
  else if (path === '/recomandari') page = <WorkspaceHubPage kind="recommendations" {...shared} />
  else if (path === '/vizualizate-recent') page = <WorkspaceHubPage kind="recent" {...shared} />
  else if (path === '/istoric-navigare') page = <WorkspaceHubPage kind="browsing" {...shared} />
  else if (path === '/favorite' || path === '/colectii') page = <WorkspaceHubPage kind="collections" {...shared} />
  else if (path.startsWith('/cautari-salvate/')) page = <WorkspaceHubPage kind="alert-detail" {...shared} />
  else if (path.startsWith('/vizionari/')) page = <WorkspaceHubPage kind="visit-detail" {...shared} />
  else if (path === '/ofertele-mele') page = <WorkspaceHubPage kind="my-offers" {...shared} />
  else if (path === '/raportarile-mele') page = <WorkspaceHubPage kind="my-reports" {...shared} />
  else if (path === '/solicitari-corectare') page = <WorkspaceHubPage kind="corrections" {...shared} />
  else if (path === '/revendica-proprietate') page = <WorkspaceHubPage kind="claim" {...shared} />
  else if (path === '/verificare-proprietate') page = <WorkspaceHubPage kind="property-verification" {...shared} />
  else if (path === '/performanta-anunt') page = <WorkspaceHubPage kind="listing-performance" {...shared} />
  else if (path === '/lead-uri') page = <WorkspaceHubPage kind="leads" {...shared} />
  else if (path === '/cereri') page = <WorkspaceHubPage kind="requests" {...shared} />
  else if (path === '/oferte') page = <WorkspaceHubPage kind="owner-offers" {...shared} />
  else if (path === '/calendar') page = <WorkspaceHubPage kind="calendar" {...shared} />
  else if (path === '/raspunsuri-recenzii') page = <WorkspaceHubPage kind="review-responses" {...shared} />
  else if (path === '/contestatii') page = <WorkspaceHubPage kind="disputes" {...shared} />
  else if (path === '/documente') page = <WorkspaceHubPage kind="documents" {...shared} />
  else if (path === '/profil-proprietar') page = <WorkspaceHubPage kind="owner-profile" {...shared} />
  else if (path === '/arhiva') page = <WorkspaceHubPage kind="archive" {...shared} />
  else if (path === '/status-anunt') page = <WorkspaceHubPage kind="listing-status" {...shared} />
  else if (path === '/portofoliu') page = <WorkspaceHubPage kind="portfolio" {...shared} />
  else if (path === '/agent-lead-uri') page = <WorkspaceHubPage kind="agent-leads" {...shared} />
  else if (path === '/membri-agentie') page = <WorkspaceHubPage kind="members" {...shared} />
  else if (path === '/roluri-agentie') page = <WorkspaceHubPage kind="roles" {...shared} />
  else if (path === '/statistici-agentie') page = <WorkspaceHubPage kind="agency-stats" {...shared} />
  else if (path === '/verificare-agentie') page = <WorkspaceHubPage kind="agency-verification" {...shared} />
  else if (path === '/admin') page = <AdminPage kind="dashboard" navigate={navigate} />
  else if (path === '/admin/anunturi') page = <AdminPage kind="listings" navigate={navigate} />
  else if (path === '/admin/recenzii') page = <AdminPage kind="reviews" navigate={navigate} />
  else if (path === '/admin/documente') page = <AdminPage kind="documents" navigate={navigate} />
  else if (path === '/admin/verificari') page = <AdminPage kind="verifications" navigate={navigate} />
  else if (path === '/admin/duplicate') page = <AdminPage kind="duplicates" navigate={navigate} />
  else if (path === '/admin/dispute') page = <AdminPage kind="disputes" navigate={navigate} />
  else if (path === '/admin/raportari') page = <AdminPage kind="reports" navigate={navigate} />
  else if (path === '/admin/utilizatori') page = <AdminPage kind="users" navigate={navigate} />
  else if (path === '/admin/suspendari') page = <AdminPage kind="suspensions" navigate={navigate} />
  else if (path === '/admin/stergeri') page = <AdminPage kind="deletions" navigate={navigate} />
  else if (path === '/admin/audit') page = <AdminPage kind="audit" navigate={navigate} />
  else if (path === '/admin/blocuri') page = <AdminPage kind="buildings" navigate={navigate} />
  else if (path === '/admin/zone') page = <AdminPage kind="areas" navigate={navigate} />
  else if (path === '/admin/categorii') page = <AdminPage kind="taxonomy" navigate={navigate} />
  else if (path === '/despre') page = <InfoPage kind="about" navigate={navigate} notify={setToast} />
  else if (path === '/cum-functioneaza') page = <InfoPage kind="how" navigate={navigate} notify={setToast} />
  else if (path === '/contact') page = <InfoPage kind="contact" navigate={navigate} notify={setToast} />
  else if (path === '/ajutor') page = <InfoPage kind="help" navigate={navigate} notify={setToast} />
  else if (path === '/intrebari-frecvente') page = <InfoPage kind="faq" navigate={navigate} notify={setToast} />
  else if (path === '/siguranta') page = <InfoPage kind="safety" navigate={navigate} notify={setToast} />
  else if (path === '/prevenirea-fraudelor') page = <InfoPage kind="fraud" navigate={navigate} notify={setToast} />
  else if (path === '/cum-verificam-datele') page = <InfoPage kind="data-verification" navigate={navigate} notify={setToast} />
  else if (path === '/reguli-recenzii') page = <InfoPage kind="review-rules" navigate={navigate} notify={setToast} />
  else if (path === '/reguli-anunturi') page = <InfoPage kind="listing-rules" navigate={navigate} notify={setToast} />
  else if (path === '/termeni') page = <InfoPage kind="terms" navigate={navigate} notify={setToast} />
  else if (path === '/confidentialitate') page = <InfoPage kind="privacy" navigate={navigate} notify={setToast} />
  else if (path === '/cookie-uri' || path === '/preferinte-cookie') page = <InfoPage kind="cookies" navigate={navigate} notify={setToast} />
  else if (path === '/drepturile-datelor') page = <InfoPage kind="data-rights" navigate={navigate} notify={setToast} />
  else if (path === '/403') page = <InfoPage kind="forbidden" navigate={navigate} notify={setToast} />
  else if (path === '/500') page = <InfoPage kind="server-error" navigate={navigate} notify={setToast} />
  else if (path === '/mentenanta') page = <InfoPage kind="maintenance" navigate={navigate} notify={setToast} />
  else if (path === '/offline') page = <InfoPage kind="offline" navigate={navigate} notify={setToast} />
  else if (path === '/cont-suspendat') page = <InfoPage kind="suspended" navigate={navigate} notify={setToast} />
  else if (path === '/confirma-email') page = <InfoPage kind="confirm-email" navigate={navigate} notify={setToast} />
  else if (path === '/parola-uitata') page = <InfoPage kind="forgot-password" navigate={navigate} notify={setToast} />
  else if (path === '/resetare-parola') page = <InfoPage kind="reset-password" navigate={navigate} notify={setToast} />
  else if (path === '/cautari-salvate') page = <UtilityPage kind="saved-searches" {...shared} />
  else if (path === '/recenziile-mele') page = <UtilityPage kind="my-reviews" {...shared} />
  else if (path === '/anunturile-mele') page = <UtilityPage kind="my-listings" {...shared} />
  else if (path.startsWith('/anunt/editare/')) page = <UtilityPage kind="edit-listing" {...shared} />
  else if (path === '/vizionari') page = <UtilityPage kind="visits" {...shared} />
  else if (path === '/mesaje') page = <UtilityPage kind="messages" {...shared} />
  else if (path === '/notificari') page = <UtilityPage kind="notifications" {...shared} />
  else if (path === '/setari' || path === '/cont' || path === '/profil') page = <UtilityPage kind="settings" {...shared} />
  else if (path === '/stari-ui') page = <UIStatesPage {...shared} />
  else if (path === '/proprietate-indisponibila') page = <UtilityPage kind="unavailable" {...shared} />
  else page = <InfoPage kind="not-found" navigate={navigate} notify={setToast} />

  return (
    <div className="app-shell">
      {!standalonePage && <Header path={path} favorites={favorites.length} navigate={navigate} />}
      <main>
        <Suspense fallback={<div className="page-loading" aria-live="polite"><div className="skeleton-line wide" /><div className="skeleton-grid"><i /><i /><i /></div><span>Se pregătește pagina…</span></div>}>
          <div className="page-enter" key={path}>{page}</div>
        </Suspense>
      </main>
      {!standalonePage && <Footer navigate={navigate} />}
      {compare.length > 0 && showCompareDock && (
        <div className="compare-dock" role="status">
          <div><strong>{compare.length}/3 proprietăți</strong><span>pregătite pentru comparație</span></div>
          <button className="button button-light" type="button" onClick={() => navigate('/comparatie')}>Compară acum</button>
          <button className="dock-close" type="button" aria-label="Golește comparația" onClick={() => setCompare([])}>×</button>
        </div>
      )}
      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </div>
  )
}
