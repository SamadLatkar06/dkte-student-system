import { useNavigate } from 'react-router-dom'
import { START_FLAG_KEY } from '../components/StartGateRoute'

function HomePage() {
  const navigate = useNavigate()

  const handleStart = () => {
    sessionStorage.setItem(START_FLAG_KEY, 'true')
    navigate('/app')
  }

  return (
    <div
      style={{
        height: '100vh',
        backgroundImage: "url('/rajwada.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      {/* Overlay for readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.55)'
        }}
      />

      {/* Main Card */}
      <div
        style={{
          position: 'relative',
          width: '380px',
          padding: '32px',
          borderRadius: '10px',
          background: 'rgba(255,255,255,0.96)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
        }}
      >
        <h2 style={{ marginBottom: '8px', color: '#111827' }}>
          DKTE Student Portal
        </h2>

        <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '24px' }}>
          Scan QR codes and securely access student academic records.
        </p>

        <button
          onClick={handleStart}
          style={{
            width: '100%',
            padding: '12px',
            background: '#111827',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Start
        </button>
      </div>
    </div>
  )
}

export default HomePage