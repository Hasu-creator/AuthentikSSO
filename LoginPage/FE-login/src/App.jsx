import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './components/auth/LoginPage'
import AuthCallback from './components/auth/AuthCallback'
import AdminLayout from './components/layout/AdminLayout'
import PortalLayout from './components/layout/PortalLayout'
import { useAuth } from './context/AuthContext'

function Protected({ children, requireAdmin }) {
  const { user, token } = useAuth()
  if (!token || !user) return <Navigate to="/login" replace />
  if (requireAdmin && !(user.is_superuser || user.role === 'admin')) {
    return <Navigate to="/portal" replace />
  }
  return children
}

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/auth/callback" element={<AuthCallback/>} />
      <Route path="/portal" element={<Protected><PortalLayout/></Protected>} />
      <Route path="/admin" element={<Protected requireAdmin={true}><AdminLayout/></Protected>} />
      <Route path="*" element={<Navigate to="/login" replace/>} />
    </Routes>
  )
}
