import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import NewTicketPage from './pages/NewTicketPage'
import TicketDetailPage from './pages/TicketDetailPage'
import EditTicketPage from './pages/EditTicketPage'
import NotFoundPage from './pages/NotFoundPage'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import TicketsPage from './pages/TicketsPage'
import AppLayout from './components/layout/AppLayout'

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/tickets"
            element={
              <ProtectedLayout>
                <TicketsPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/tickets/new"
            element={
              <ProtectedLayout>
                <NewTicketPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <ProtectedLayout>
                <TicketDetailPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/tickets/:id/edit"
            element={
              <ProtectedLayout>
                <EditTicketPage />
              </ProtectedLayout>
            }
          />
          <Route path="/" element={<Navigate to="/tickets" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
