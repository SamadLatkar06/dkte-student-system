import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()

  return (
    <section className="entry-page">
      <div className="card narrow entry-card">
        <h2>Welcome to DKTE</h2>
        <p>Scan student QR and access verified academic records.</p>
        <button type="button" onClick={() => navigate('/app')}>
          Start
        </button>
      </div>
    </section>
  )
}

export default HomePage
