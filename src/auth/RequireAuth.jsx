import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import hasPermission from '../hooks/usePermission'

export default function RequireAuth({children, permission}){
  const { user, permissions } = useAuth()
  if(!user) return <Navigate to='/login' replace />
  if(permission){
    const ok = hasPermission(permissions, permission.module, permission.action)
    if(!ok) return <div className='card'>Permission denied. Go back to <a href='/dashboard'>dashboard</a>.</div>
  }
  return children
}
