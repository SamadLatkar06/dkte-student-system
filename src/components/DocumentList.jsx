import JSZip from 'jszip'

async function downloadAllDocuments(documents) {
  const zip = new JSZip()

  await Promise.all(
    documents.map(async (doc) => {
      const response = await fetch(doc.file_url)
      const blob = await response.blob()
      const extension = doc.file_url.split('.').pop()?.split('?')[0] || 'bin'
      zip.file(`${doc.doc_name}.${extension}`, blob)
    }),
  )

  const content = await zip.generateAsync({ type: 'blob' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(content)
  link.download = 'student-documents.zip'
  link.click()
  URL.revokeObjectURL(link.href)
}

function DocumentList({ documents = [] }) {
  if (!documents.length) {
    return (
      <section className="card">
        <h3>Documents</h3>
        <p>No documents available.</p>
      </section>
    )
  }

  return (
    <section className="card">
      <div className="section-row">
        <h3>Documents</h3>
        <button type="button" className="secondary-btn" onClick={() => downloadAllDocuments(documents)}>
          Download All
        </button>
      </div>
      <ul className="docs-list">
        {documents.map((doc) => (
          <li key={doc.id}>
            <div>
              <strong>{doc.doc_name}</strong>
              <small>{new Date(doc.uploaded_at).toLocaleString()}</small>
            </div>
            <a href={doc.file_url} target="_blank" rel="noreferrer" className="link-btn">
              View / Download
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default DocumentList
