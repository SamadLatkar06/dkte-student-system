import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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

  return (
    <div className="stacked-page">
      <Link to="/" className="link-btn">
        Back to Scan
      </Link>
      {error ? <p className="error-text">{error}</p> : null}
      {student ? <StudentCard student={student} /> : null}
      {!error ? <DocumentList documents={documents} /> : null}
    </div>
  )
}

export default StudentDetailsPage
