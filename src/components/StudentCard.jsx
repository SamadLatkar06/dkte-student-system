function StudentCard({ student }) {
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
        <p>
          <strong>CGPA:</strong> {student.cgpa}
        </p>
      </div>
    </section>
  )
}

export default StudentCard
