import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/useAuth'
import { isValidPrn, normalizePrn } from '../lib/validators'
import {
  getAllStudents,
  insertDocument,
  uploadFileToDocumentsBucket,
  upsertStudent,
} from '../services/adminService'

const initialStudent = {
  prn: '',
  name: '',
  mother_name: '',
  branch: '',
  year: '',
  cgpa: '',
  photo_url: '',
}

function AdminDashboardPage() {
  const { signOut } = useAuth()
  const [students, setStudents] = useState([])
  const [searchPrn, setSearchPrn] = useState('')
  const [studentForm, setStudentForm] = useState(initialStudent)
  const [documentForm, setDocumentForm] = useState({ prn: '', docName: '', file: null })
  const [photoFile, setPhotoFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadStudents = async (search = '') => {
    try {
      setLoading(true)
      const data = await getAllStudents(search)
      setStudents(data)
    } catch (err) {
      setError(err.message || 'Failed to load students.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true

    async function fetchInitialStudents() {
      try {
        const data = await getAllStudents()
        if (mounted) setStudents(data)
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load students.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchInitialStudents()

    return () => {
      mounted = false
    }
  }, [])

  const updateStudentField = (field, value) => {
    setStudentForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleStudentSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const prn = normalizePrn(studentForm.prn)
    if (!isValidPrn(prn)) {
      setError('Enter a valid PRN before saving student.')
      return
    }

    try {
      setLoading(true)
      let photoUrl = studentForm.photo_url.trim()
      if (photoFile) {
        const photoPath = `photos/${prn}-${Date.now()}-${photoFile.name}`
        photoUrl = await uploadFileToDocumentsBucket(photoFile, photoPath)
      }

      await upsertStudent({
        ...studentForm,
        prn,
        cgpa: Number(studentForm.cgpa),
        photo_url: photoUrl,
      })
      setSuccess('Student record saved successfully.')
      setStudentForm(initialStudent)
      setPhotoFile(null)
      await loadStudents(searchPrn)
    } catch (err) {
      setError(err.message || 'Failed to save student.')
    } finally {
      setLoading(false)
    }
  }

  const handleDocumentUpload = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const prn = normalizePrn(documentForm.prn)
    if (!isValidPrn(prn) || !documentForm.file) {
      setError('Provide valid PRN and select a file for upload.')
      return
    }

    try {
      setLoading(true)
      const docPath = `student-docs/${prn}/${Date.now()}-${documentForm.file.name}`
      const fileUrl = await uploadFileToDocumentsBucket(documentForm.file, docPath)
      await insertDocument({
        prn,
        docName: documentForm.docName || documentForm.file.name,
        fileUrl,
      })
      setSuccess('Document uploaded successfully.')
      setDocumentForm({ prn: '', docName: '', file: null })
      await loadStudents(searchPrn)
    } catch (err) {
      setError(err.message || 'Failed to upload document.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="stacked-page">
      <section className="card section-row">
        <div>
          <h2>Admin Dashboard</h2>
          <p>Manage students and uploaded documents.</p>
        </div>
        <button type="button" className="secondary-btn" onClick={signOut}>
          Logout
        </button>
      </section>

      {error ? <p className="error-text">{error}</p> : null}
      {success ? <p className="success-text">{success}</p> : null}

      <section className="card">
        <h3>Add / Update Student</h3>
        <form onSubmit={handleStudentSubmit} className="stack-form">
          <input
            placeholder="PRN"
            value={studentForm.prn}
            onChange={(event) => updateStudentField('prn', event.target.value)}
            maxLength={20}
            required
          />
          <input
            placeholder="Name"
            value={studentForm.name}
            onChange={(event) => updateStudentField('name', event.target.value)}
            required
          />
          <input
            placeholder="Branch"
            value={studentForm.branch}
            onChange={(event) => updateStudentField('branch', event.target.value)}
            required
          />
          <input
            placeholder="Mother Name"
            value={studentForm.mother_name}
            onChange={(event) => updateStudentField('mother_name', event.target.value)}
            required
          />
          <input
            placeholder="Year"
            value={studentForm.year}
            onChange={(event) => updateStudentField('year', event.target.value)}
            required
          />
          <input
            type="number"
            step="0.01"
            min="0"
            max="10"
            placeholder="CGPA"
            value={studentForm.cgpa}
            onChange={(event) => updateStudentField('cgpa', event.target.value)}
            required
          />
          <input
            placeholder="Photo URL (optional if uploading file)"
            value={studentForm.photo_url}
            onChange={(event) => updateStudentField('photo_url', event.target.value)}
          />
          <label htmlFor="photo-file">Upload profile photo (image)</label>
          <input
            id="photo-file"
            type="file"
            accept="image/*"
            onChange={(event) => setPhotoFile(event.target.files?.[0] ?? null)}
          />
          <button type="submit" disabled={loading}>
            Save Student
          </button>
        </form>
      </section>

      <section className="card">
        <h3>Upload Student Document</h3>
        <form onSubmit={handleDocumentUpload} className="stack-form">
          <input
            placeholder="PRN"
            value={documentForm.prn}
            onChange={(event) => setDocumentForm((prev) => ({ ...prev, prn: event.target.value }))}
            maxLength={20}
            required
          />
          <input
            placeholder="Document name"
            value={documentForm.docName}
            onChange={(event) => setDocumentForm((prev) => ({ ...prev, docName: event.target.value }))}
          />
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(event) =>
              setDocumentForm((prev) => ({ ...prev, file: event.target.files?.[0] ?? null }))
            }
            required
          />
          <button type="submit" disabled={loading}>
            Upload Document
          </button>
        </form>
      </section>

      <section className="card">
        <div className="section-row">
          <h3>Students</h3>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              loadStudents(searchPrn)
            }}
            className="inline-form"
          >
            <input
              placeholder="Search by PRN"
              value={searchPrn}
              onChange={(event) => setSearchPrn(event.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
        {loading ? <p>Loading...</p> : null}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>PRN</th>
                <th>Name</th>
                <th>Mother Name</th>
                <th>Branch</th>
                <th>Year</th>
                <th>CGPA</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.prn}>
                  <td>{student.prn}</td>
                  <td>{student.name}</td>
                  <td>{student.mother_name}</td>
                  <td>{student.branch}</td>
                  <td>{student.year}</td>
                  <td>{student.cgpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboardPage
