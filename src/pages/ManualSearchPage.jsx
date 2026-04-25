import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isValidPrn, normalizePrn } from '../lib/validators'

function ManualSearchPage() {
  const navigate = useNavigate()
  const [manualPrn, setManualPrn] = useState('')
  const [error, setError] = useState('')

  const handleManualSearch = (event) => {
    event.preventDefault()
    const prn = normalizePrn(manualPrn)
    if (!isValidPrn(prn)) {
      setError('Please enter a valid PRN (8-20 alphanumeric characters).')
      return
    }

    setError('')
    navigate(`/student/${prn}`)
  }

  return (
    <section className="card narrow manual-search-page">
      <h2>Manual PRN Search</h2>
      <p>Enter the PRN to fetch verified student records.</p>
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
  )
}

export default ManualSearchPage
