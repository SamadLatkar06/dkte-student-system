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
    <div className="stacked-page">
      {error ? <p className="error-text">{error}</p> : null}
      {student && !isVerified ? (
        <section className="card narrow">
          <h2>   Verification Required</h2>
          <h3>Enter Mother's Name</h3>
          <form onSubmit={handleMotherNameVerification} className="stack-form">
            <input
              placeholder="Mother's Name"
              value={motherNameInput}
              onChange={(event) => setMotherNameInput(event.target.value)}
              required
            />
            <button type="submit">Verify</button>
          </form>
        </section>
      ) : null}
      {student && isVerified ? <StudentCard student={student} /> : null}
      {student && isVerified && !error ? <DocumentList documents={documents} /> : null}
    </div>
  )
}

export default StudentDetailsPage
