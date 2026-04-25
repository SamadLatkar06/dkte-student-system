import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DocumentList from '../components/DocumentList'
import LoadingSpinner from '../components/LoadingSpinner'
import StudentCard from '../components/StudentCard'
import { isValidPrn, normalizePrn } from '../lib/validators'
import { getDocumentsByPrn, getStudentByPrn } from '../services/studentService'

function StudentDetailsPage() {
  const { prn: rawPrn } = useParams()
  const prn = normalizePrn(rawPrn)
  const [student, setStudent] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [motherNameInput, setMotherNameInput] = useState('')
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    async function fetchStudentAndDocuments() {
      if (!isValidPrn(prn)) {
        setError('Invalid PRN format.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const [studentResult, docsResult] = await Promise.all([
          getStudentByPrn(prn),
          getDocumentsByPrn(prn),
        ])

        if (!studentResult) {
          setError('Student not found for this PRN.')
        } else {
          setIsVerified(false)
          setMotherNameInput('')
          setStudent(studentResult)
          setDocuments(docsResult)
        }
      } catch (err) {
        setError(err.message || 'Failed to load student details.')
      } finally {
        setLoading(false)
      }
    }

    fetchStudentAndDocuments()
  }, [prn])

  if (loading) return <LoadingSpinner label="Loading student details..." />

  const handleMotherNameVerification = (event) => {
    event.preventDefault()
    const entered = motherNameInput.trim().toLowerCase()
    const expected = (student?.mother_name ?? '').trim().toLowerCase()

    if (!expected) {
      setError('Mother name is not configured for this student.')
      return
    }

    if (entered === expected) {
      setError('')
      setIsVerified(true)
      return
    }

    setIsVerified(false)
    alert("Incorrect Mother's Name")
  }

  return (
    <div
  className="stacked-page"
  style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', // 🔥 fixed (was center)
    background: '#f9fafb',
    fontFamily: 'system-ui, sans-serif',
    padding: '20px',
    paddingTop: '40px' // 👈 controls how high card appears
  }}
>
  {error ? (
    <p
      style={{
        color: '#b91c1c',
        background: '#fee2e2',
        padding: '10px 16px',
        borderRadius: '6px',
        marginBottom: '16px'
      }}
    >
      {error}
    </p>
  ) : null}

  {student && !isVerified ? (
    <section
      style={{
        width: '100%',
        maxWidth: '380px',
        background: '#ffffff',
        padding: '24px',
        borderRadius: '10px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
      }}
    >
      <h2 style={{ marginBottom: '6px', color: '#111827' }}>
        Verification Required
      </h2>

      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
        Please enter mother's name to continue
      </p>

      <form
        onSubmit={handleMotherNameVerification}
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        <input
          placeholder="Mother's Name"
          value={motherNameInput}
          onChange={(event) => setMotherNameInput(event.target.value)}
          required
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            outline: 'none'
          }}
        />

        <button
          type="submit"
          style={{
            padding: '10px',
            background: '#111827',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Verify
        </button>
      </form>
    </section>
  ) : null}

  {student && isVerified ? (
    <div style={{ width: '100%', maxWidth: '600px', marginTop: '20px' }}>
      <StudentCard student={student} />
    </div>
  ) : null}

  {student && isVerified && !error ? (
    <div style={{ width: '100%', maxWidth: '600px', marginTop: '16px' }}>
      <DocumentList documents={documents} />
    </div>
  ) : null}
</div>
  )
}

export default StudentDetailsPage
