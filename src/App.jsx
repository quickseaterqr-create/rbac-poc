import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import RolesPage from './pages/RolesPage'
import UsersPage from './pages/UsersPage'
import ProjectsPage from './pages/ProjectsPage'
import RequireAuth from './auth/RequireAuth'
import SideNav from './components/SideNav'

export default function App(){
  return (
    <AuthProvider>
      <div className='app'>
        <SideNav />
        <div className='content'>
          <TopBar />
          <Routes>
            <Route path='/login' element={<LoginPage/>} />
            <Route path='/' element={<RequireAuth><Dashboard/></RequireAuth>} />
            <Route path='/dashboard' element={<RequireAuth><Dashboard/></RequireAuth>} />
            <Route path='/roles' element={<RequireAuth permission={{module:'roles',action:'view'}}><RolesPage/></RequireAuth>} />
            <Route path='/users' element={<RequireAuth permission={{module:'users',action:'view'}}><UsersPage/></RequireAuth>} />
            <Route path='/tasks' element={<RequireAuth permission={{module:'tasks',action:'view'}}></RequireAuth>} />
            <Route path='/projects' element={<RequireAuth permission={{module:'project',action:'view'}}><ProjectsPage/></RequireAuth>} />
            <Route path='*' element={<div>Not found. <Link to='/'>Home</Link></div>} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  )
}

function TopBar(){
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className='topbar'>
      <div>
        <strong>RBAC POC</strong>
        <div className='small-muted'>Demo - client-side only</div>
      </div>
      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        {user ? <>
          <div className='small-muted'>{user.firstName} {user.lastName} — <span style={{color:'#0b3b45'}}>{user.roleName}</span></div>
          <button className='btn' onClick={()=>{ logout(); navigate('/login') }}>Logout</button>
        </> : <Link to='/login' className='btn'>Login</Link>}
      </div>
    </div>
  )
}
