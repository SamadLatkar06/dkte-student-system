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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      <div
        style={{
          width: '380px',
          padding: '32px',
          borderRadius: '12px',
          background: '#ffffff',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
        }}
      >
        <h2 style={{ marginBottom: '10px', color: '#111827' }}>
          DKTE Student Portal
        </h2>

        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
          Scan student QR codes and securely access academic records.
        </p>

        <button
          onClick={handleStart}
          style={{
            width: '100%',
            padding: '12px',
            background: '#111827',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
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