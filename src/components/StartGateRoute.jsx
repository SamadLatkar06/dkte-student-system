import { Navigate, useLocation } from 'react-router-dom'

const START_FLAG_KEY = 'dkte_qr_started'

function StartGateRoute({ children }) {
  const location = useLocation()
  const hasStarted = window.sessionStorage.getItem(START_FLAG_KEY) === 'true'

  if (!hasStarted) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}

export { START_FLAG_KEY }
export default StartGateRoute
