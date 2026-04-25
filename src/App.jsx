import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import StartGateRoute from './components/StartGateRoute'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AppPage from './pages/AppPage'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import ManualSearchPage from './pages/ManualSearchPage'
import NotFoundPage from './pages/NotFoundPage'
import StudentDetailsPage from './pages/StudentDetailsPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/app"
          element={
            <StartGateRoute>
              <AppPage />
            </StartGateRoute>
          }
        />
        <Route
          path="/manual-search"
          element={
            <StartGateRoute>
              <ManualSearchPage />
            </StartGateRoute>
          }
        />
        <Route
          path="/about"
          element={
            <StartGateRoute>
              <AboutPage />
            </StartGateRoute>
          }
        />
        <Route
          path="/student/:prn"
          element={
            <StartGateRoute>
              <StudentDetailsPage />
            </StartGateRoute>
          }
        />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
