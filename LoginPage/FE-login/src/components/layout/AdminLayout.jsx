import React from 'react'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout(){
  const { user, logout } = useAuth()
  return (
    <div className="app-shell admin">
      <header className="app-header">
        <h2>Admin Dashboard</h2>
        <div>{user?.name} <button onClick={logout}>Logout</button></div>
      </header>
      <main className="app-main">
        Admin controls (disable users, manage apps)
      </main>
    </div>
  )
}
