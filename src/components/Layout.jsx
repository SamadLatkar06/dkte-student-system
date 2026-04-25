import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const isHomePage = location.pathname === '/'

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>DKTE QR Student Access</h1>
          <p>Textile and Engineering Institute, Ichalkaranji</p>
        </div>
        <nav>
          <Link to="/app" className={location.pathname === '/app' ? 'active' : ''}>
            Scan QR
          </Link>
          {isAdmin ? (
            <Link
              to="/admin/dashboard"
              className={location.pathname.startsWith('/admin/dashboard') ? 'active' : ''}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className={location.pathname.startsWith('/admin/login') ? 'active' : ''}
            >
              Admin
            </Link>
          )}
        </nav>
      </header>
      {!isHomePage ? (
        <section className="top-actions">
          <button type="button" className="icon-btn" onClick={() => navigate(-1)} aria-label="Go back">
            ← Back
          </button>
          <button type="button" className="icon-btn" onClick={() => navigate('/about')} aria-label="About">
            ℹ️
          </button>
        </section>
      ) : null}
      <main className="main-content">{children}</main>
    </div>
  )
}

export default Layout
