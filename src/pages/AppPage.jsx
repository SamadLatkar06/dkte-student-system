import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import QRScanner from '../components/QRScanner'
import { extractPrnFromQr, isValidPrn } from '../lib/validators'

function AppPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const goToStudent = useCallback(
    (prn) => {
      setError('')
      navigate(`/student/${prn}`)
    },
    [navigate],
  )

  const handleQrResult = useCallback(
    (decodedText) => {
      const extractedPrn = extractPrnFromQr(decodedText)
      if (!isValidPrn(extractedPrn)) {
        setError('Invalid QR content. Please scan a valid DKTE student ID QR.')
        return
      }
      goToStudent(extractedPrn)
    },
    [goToStudent],
  )

  return (
    <div className="page-grid">
      <QRScanner onResult={handleQrResult} onError={setError} />

      <section className="card scanner-side-card">
        <h2>Need Manual Entry?</h2>
        <p>Use the dedicated PRN page if QR is unreadable or camera access is unavailable.</p>
        <Link to="/manual-search" className="link-btn">
          Open Manual Search
        </Link>
        {error ? <p className="error-text">{error}</p> : null}
      </section>
    </div>
  )
}

export default AppPage
