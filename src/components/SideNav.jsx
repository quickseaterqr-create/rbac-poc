import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import hasPermission from '../hooks/usePermission'

export default function SideNav(){
  const { permissions } = useAuth()
  console.log('SideNav render, permissions=', permissions);
  const items = [
    {to:'/dashboard', label:'Dashboard', module:'project', action:'view'},
    {to:'/projects', label:'Projects', module:'project', action:'view'},
    {to:'/users', label:'Users', module:'users', action:'view'},
    {to:'/roles', label:'Roles', module:'roles', action:'view'},
        {to:'/task', label:'Tasks', module:'task', action:'view'}
  ]
  return (
    <div className='sidenav'>
      <div style={{marginBottom:18}}>
        <strong>BUILD4CAST</strong>
      </div>
      {items.map(it=>{
        const ok = hasPermission(permissions, it.module, it.action)
        if(!ok) return null
        return <Link key={it.to} to={it.to} className='menu-item'>{it.label}</Link>
      })}
    </div>
  )
}
