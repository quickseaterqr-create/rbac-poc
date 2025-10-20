import React, { createContext, useContext, useEffect, useState } from 'react'
import * as mockApi from '../api/mockApi'

const AuthContext = createContext(null)

export function AuthProvider({children}){
  const [user, setUser] = useState(null)
  const [permissions, setPermissions] = useState({})

  useEffect(()=>{
    const raw = localStorage.getItem('rbac_auth')
    if(raw){
      const data = JSON.parse(raw)
      setUser(data.user)
      setPermissions(data.permissions)
    }
  },[])

  const login = async ({roleId})=>{
    const res = await mockApi.loginWithRole(roleId)
    localStorage.setItem('rbac_auth', JSON.stringify(res))
    setUser(res.user)
    setPermissions(res.permissions)
    return res
  }

  const logout = ()=>{
    localStorage.removeItem('rbac_auth')
    setUser(null); setPermissions({})
  }

  const refresh = async ()=>{
    if(!user) return
    const data = await mockApi.getUser(user.id)
    // not used in this POC
  }

  return <AuthContext.Provider value={{user, permissions, login, logout, refresh}}>
    {children}
  </AuthContext.Provider>
}

export const useAuth = ()=> useContext(AuthContext)
