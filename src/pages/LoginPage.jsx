import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import * as mockApi from '../api/mockApi'

export default function LoginPage(){
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [roles, setRoles] = useState([])
  const [roleId, setRoleId] = useState('')

  useEffect(()=>{ mockApi.getRoles().then(r=>{ setRoles(r); if(r[0]) setRoleId(r[0].id) }) },[])

  useEffect(()=>{ if(user) navigate('/') },[user])

  const handle = async (e)=>{
    e.preventDefault()
    await login({roleId})
    navigate('/')
  }

  return (
    <div style={{maxWidth:560, margin:'40px auto'}}>
      <div className='card'>
        <h3>Login (POC)</h3>
        <p className='small-muted'>Select a role to simulate login</p>
        <form onSubmit={handle}>
          <div style={{marginBottom:12}}>
            <select className='input' value={roleId} onChange={e=>setRoleId(e.target.value)}>
              {roles.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div style={{display:'flex', gap:8}}>
            <button className='btn primary' type='submit'>Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}
