import { useNavigate } from 'react-router-dom'
import { START_FLAG_KEY } from '../components/StartGateRoute'

function HomePage() {
  const navigate = useNavigate()

  const handleStart = () => {
    window.sessionStorage.setItem(START_FLAG_KEY, 'true')
    navigate('/app')
  }

  return (
    <section
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #4f46e5, #9333ea, #06b6d4)',
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      <div
        style={{
          backdropFilter: 'blur(15px)',
          background: 'rgba(255,255,255,0.1)',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          color: 'white',
          width: '350px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          animation: 'fadeIn 1s ease-in-out'
        }}
      >
        <span
          style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.2)',
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            marginBottom: '15px'
          }}
        >
          🚀 DKTE Idea Lab 2026
        </span>

        <h1 style={{ fontSize: '26px', marginBottom: '10px' }}>
          Student Access Portal
        </h1>

        <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '25px' }}>
          Scan QR codes, verify student details securely, and access academic
          records through a clean dashboard.
        </p>

        <button
          onClick={handleStart}
          style={{
            background: 'white',
            color: '#4f46e5',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '999px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: '0.3s'
          }}
          onMouseOver={e => {
            e.target.style.transform = 'scale(1.05)'
            e.target.style.background = '#f3f4f6'
          }}
          onMouseOut={e => {
            e.target.style.transform = 'scale(1)'
            e.target.style.background = 'white'
          }}
        >
          Get Started →
        </button>
      </div>

      {/* Animation keyframes (inline workaround) */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </section>
  )
}

export default HomePage