import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const s = sessionStorage.getItem('sso_user')
    const t = sessionStorage.getItem('sso_token')
    if (s && t){
      setUser(JSON.parse(s)); setToken(t)
    }
    setLoading(false)
  },[])

  const login = (token, user)=>{
    setToken(token); setUser(user)
    sessionStorage.setItem('sso_token', token)
    sessionStorage.setItem('sso_user', JSON.stringify(user))
  }

  const logout = ()=>{
    sessionStorage.removeItem('sso_token')
    sessionStorage.removeItem('sso_user')
    authService.logout()
    setToken(null); setUser(null)
  }

  return (
    <AuthContext.Provider value={{user, token, login, logout, loading}}>
      {children}
    </AuthContext.Provider>
  )
}
    