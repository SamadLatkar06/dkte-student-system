function StudentCard({ student }) {
  const cgpaValue = Number(student.cgpa) || 0
  const normalizedCgpa = Math.min(Math.max(cgpaValue, 0), 10)
  const cgpaPercent = (normalizedCgpa / 10) * 100

  return (
    <section className="card student-card">
      <div className="profile-photo-wrap">
        <img
          src={student.photo_url || 'https://placehold.co/140x140?text=Photo'}
          alt={`${student.name} profile`}
          className="profile-photo"
        />
      </div>
      <div className="student-info">
        <h2>{student.name}</h2>
        <p>
          <strong>PRN:</strong> {student.prn}
        </p>
        <p>
          <strong>Branch:</strong> {student.branch}
        </p>
        <p>
          <strong>Year:</strong> {student.year}
        </p>
        <div className="cgpa-widget" aria-label={`CGPA ${normalizedCgpa.toFixed(2)} out of 10`}>
          <div className="cgpa-meter">
            <div className="cgpa-meter-fill" style={{ width: `${cgpaPercent}%` }} />
          </div>
          <div className="cgpa-label-row">
            <strong>CGPA</strong>
            <span>{normalizedCgpa.toFixed(2)} / 10</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StudentCard
