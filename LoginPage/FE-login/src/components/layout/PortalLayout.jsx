import React from 'react'
import { useAuth } from '../../context/AuthContext'

export default function PortalLayout(){
  const { user, logout } = useAuth()
  return (
    <div className="app-shell">
      <header className="app-header">
        <h2>Portal</h2>
        <div>{user?.name || user?.username} <button onClick={logout}>Logout</button></div>
      </header>
      <main className="app-main">
        Your user portal goes here (apps list)
      </main>
    </div>
  )
}
