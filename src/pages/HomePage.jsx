import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QRScanner from '../components/QRScanner'
import { extractPrnFromQr, isValidPrn, normalizePrn } from '../lib/validators'

function HomePage() {
  const navigate = useNavigate()
  const [manualPrn, setManualPrn] = useState('')
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

  const handleManualSearch = (event) => {
    event.preventDefault()
    const prn = normalizePrn(manualPrn)
    if (!isValidPrn(prn)) {
      setError('Please enter a valid PRN (8-20 alphanumeric characters).')
      return
    }
    goToStudent(prn)
  }

  return (
    <div className="page-grid">
      <QRScanner onResult={handleQrResult} onError={setError} />

      <section className="card">
        <h2>Manual PRN Search</h2>
        <form onSubmit={handleManualSearch} className="stack-form">
          <label htmlFor="manual-prn">Enter PRN</label>
          <input
            id="manual-prn"
            value={manualPrn}
            onChange={(event) => setManualPrn(event.target.value)}
            placeholder="e.g. DKTE20240001"
            maxLength={20}
          />
          <button type="submit">Search Student</button>
        </form>
        {error ? <p className="error-text">{error}</p> : null}
      </section>
    </div>
  )
}

export default HomePage
