import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../contexts/useAuth'
import { supabase } from '../lib/supabaseClient'
import { validateStrongPassword } from '../lib/validators'

function AdminLoginPage() {
  const { session, isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const destination = location.state?.from?.pathname || '/admin/dashboard'

  if (loading) return <LoadingSpinner label="Checking session..." />
  if (session && isAdmin) return <Navigate to={destination} replace />

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    if (!validateStrongPassword(password)) {
      setError('Password must contain 8+ chars, uppercase, lowercase, number and special character.')
      return
    }

    try {
      setSubmitting(true)
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authError) throw authError
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="card narrow">
      <h2>Admin Login</h2>
      <p>Authorized DKTE authority access only.</p>
      <form onSubmit={handleLogin} className="stack-form">
        <label htmlFor="admin-email">Email</label>
        <input
          id="admin-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@dkte.ac.in"
        />

        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
        />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      {error ? <p className="error-text">{error}</p> : null}
    </section>
  )
}

export default AdminLoginPage
