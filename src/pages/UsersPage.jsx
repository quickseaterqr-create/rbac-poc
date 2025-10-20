import React, { useEffect, useState } from 'react'
import * as mockApi from '../api/mockApi'
import Drawer from '../components/Drawer'
import { useAuth } from '../auth/AuthContext'

export default function UsersPage(){
  const [users, setUsers] = useState([])
  const [open, setOpen] = useState(false)
  const [roles, setRoles] = useState([])
  const [form, setForm] = useState({firstName:'', lastName:'', email:'', phone:'', roleId:''})
  const { permissions } = useAuth()

  useEffect(()=>{ mockApi.getUsers().then(setUsers); mockApi.getRoles().then(setRoles) },[])

  async function invite(){
    if(!form.firstName || !form.email || !form.roleId){
      alert('Provide first name, email and role')
      return
    }
    await mockApi.inviteUser(form)
    const u = await mockApi.getUsers()
    setUsers(u)
    setOpen(false)
    setForm({firstName:'', lastName:'', email:'', phone:'', roleId:''})
  }

  return (
    <div>
      <div className='card' style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3>Users Management</h3>
        {permissions && permissions.users && permissions.users.invite ? <button className='btn primary-dark' onClick={()=>setOpen(true)}>Invite User</button> : <button className='btn outline' disabled>Invite (no perm)</button>}
      </div>

      <div className='card'>
        <table className='table'>
          <thead><tr><th>Name</th><th>Role</th><th>Email</th></tr></thead>
          <tbody>
            {users.map(u=>(
              <tr key={u.id}><td>{u.firstName} {u.lastName}</td><td>{roles.find(r=>r.id===u.roleId)?.name||u.roleId}</td><td>{u.email}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && <Drawer title='Create new user profile' onClose={()=>setOpen(false)}>
        <div className='form-row'>
          <input className='input' placeholder='Enter your first name' value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} />
          <input className='input' placeholder='Enter your last name' value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} />
        </div>
        <div className='form-row'>
          <input className='input' placeholder='Enter your email id' value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          <input className='input' placeholder='Enter your phone number' value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
        </div>
        <div style={{marginBottom:12}}>
          <select className='input' value={form.roleId} onChange={e=>setForm({...form,roleId:e.target.value})}>
            <option value=''>Select a Job role</option>
            {roles.map(r=> <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
          <button className='btn outline' onClick={()=>setOpen(false)}>Cancel</button>
          <button className='btn primary-dark' onClick={invite}>Invite User</button>
        </div>
      </Drawer>}
    </div>
  )
}
