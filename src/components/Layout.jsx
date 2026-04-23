import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

function Layout({ children }) {
  const location = useLocation()
  const { isAdmin } = useAuth()

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>DKTE QR Student Access</h1>
          <p>Textile and Engineering Institute, Ichalkaranji</p>
        </div>
        <nav>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
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
      <main className="main-content">{children}</main>
    </div>
  )
}

export default Layout
