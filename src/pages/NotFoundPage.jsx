import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="card narrow">
      <h2>Page Not Found</h2>
      <p>The requested page does not exist.</p>
      <Link to="/" className="link-btn">
        Go to Home
      </Link>
    </section>
  )
}

export default NotFoundPage
