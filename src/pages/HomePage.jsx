import { useNavigate } from 'react-router-dom'
import { START_FLAG_KEY } from '../components/StartGateRoute'

function HomePage() {
  const navigate = useNavigate()
  const handleStart = () => {
    window.sessionStorage.setItem(START_FLAG_KEY, 'true')
    navigate('/app')
  }

  return (
    <section className="entry-page">
      <div className="card narrow entry-card">
        <span className="hero-badge">DKTE Idea Lab 2026</span>
        <h2>Welcome to DKTE Student Access Portal</h2>
        <p>Scan student QR, verify details securely, and view academic records in a clean dashboard.</p>
        <button type="button" onClick={handleStart}>
          Start
        </button>
      </div>
    </section>
  )
}

export default HomePage
