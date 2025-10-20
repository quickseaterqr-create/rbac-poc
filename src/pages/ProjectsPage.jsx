import React, { useEffect, useState } from 'react'
import * as mockApi from '../api/mockApi'
import Drawer from '../components/Drawer'

export default function ProjectsPage(){
  const [projects, setProjects] = useState([])
  const [roles, setRoles] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedRole, setSelectedRole] = useState('')
  const [rolePermissions, setRolePermissions] = useState({}) // currently edited permissions for selected role
  const [formName, setFormName] = useState('')

  useEffect(()=>{ fetchAll() },[])

  async function fetchAll(){
    const [p, r] = await Promise.all([mockApi.getProjects(), mockApi.getRoles()])
    setProjects(p || [])
    setRoles(r || [])
  }

  async function createProject(){
    if(!formName.trim()){ alert('Enter project name'); return }
    const project = { name: formName.trim(), description: '' }
    await mockApi.createProject(project)
    setFormName('')
    await fetchAll()
  }

  // open drawer for a project
  async function openManagePermissions(project){
    setSelectedProject(project)
    setSelectedRole('')
    setRolePermissions({})
    setOpen(true)
  }

  // load permissions for the selected project + role
  async function loadRolePermissions(projectId, roleId){
    if(!projectId || !roleId) return
    const all = await mockApi.getProjectRolePermissions(projectId)
    const perms = all && all[roleId] ? all[roleId] : {}
    // ensure every module has an object with boolean flags to avoid controlled/uncontrolled mismatch
    const modules = ['project','design','task','documents','users']
    const normalized = {}
    for(const mod of modules){
      normalized[mod] = Object.assign({create:false,view:false,edit:false,delete:false}, perms[mod] || {})
    }
    setRolePermissions(normalized)
  }

  // ensure toggling always works and initializes module object if missing
  function togglePerm(module, action){
    setRolePermissions(prev=>{
      const next = {...prev}
      if(!next[module]) next[module] = {create:false,view:false,edit:false,delete:false}
      // flip the boolean
      next[module] = {...next[module], [action]: !next[module][action]}
      return next
    })
  }

  async function savePermissions(){
    if(!selectedProject || !selectedRole){
      alert('Select project and role')
      return
    }
    // persist the permission object for the role under the project
    await mockApi.setProjectRolePermissions(selectedProject.id, selectedRole, rolePermissions)
    alert('Permissions saved')
    setOpen(false)
  }

  return (
    <div>
      <div className='card' style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3>Projects</h3>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <input className='input' placeholder='New project name' value={formName} onChange={e=>setFormName(e.target.value)} />
          <button className='btn primary' onClick={createProject}>Create</button>
        </div>
      </div>

      <div className='card'>
        <table className='table'>
          <thead><tr><th>Project</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>
            {projects.map(p=>(
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.description || '—'}</td>
                <td>
                  <button className='btn' onClick={()=>openManagePermissions(p)}>Manage Permissions</button>
                </td>
              </tr>
            ))}
            {projects.length===0 && <tr><td colSpan={3} className='small-muted'>No projects yet</td></tr>}
          </tbody>
        </table>
      </div>

      {open && selectedProject && <Drawer title={`Manage Permissions — ${selectedProject.name}`} onClose={()=>setOpen(false)}>
        <div style={{marginBottom:12}}>
          <div style={{display:'flex', gap:12}}>
            <select
              className='input'
              value={selectedRole}
              onChange={async e=>{
                const rId = e.target.value
                setSelectedRole(rId)
                // load normalized permissions for this role immediately
                await loadRolePermissions(selectedProject.id, rId)
              }}
            >
              <option value=''>Select role to edit</option>
              {roles.map(r=> <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>

            <div style={{flex:1}} className='small-muted'>
              Select a role to view or edit its per-module permissions for this project.
            </div>
          </div>
        </div>

        {selectedRole ? (
          <div>
            <div className='checkbox-grid' style={{gridTemplateColumns:'1fr 80px 80px 80px 80px', marginBottom:8}}>
              <div><strong>Module Name</strong></div>
              <div><strong>Create</strong></div>
              <div><strong>View</strong></div>
              <div><strong>Edit</strong></div>
              <div><strong>Delete</strong></div>
            </div>

            {['project','design','task','documents','users'].map(mod=>(
              <div key={mod} className='checkbox-grid' style={{gridTemplateColumns:'1fr 80px 80px 80px 80px', marginBottom:6}}>
                <div style={{padding:'8px 0', textTransform:'capitalize'}}>{mod}</div>

                <div>
                  <input
                    type='checkbox'
                    checked={!!(rolePermissions[mod] && rolePermissions[mod].create)}
                    onChange={()=>togglePerm(mod,'create')}
                    aria-label={`${mod} create`}
                  />
                </div>

                <div>
                  <input
                    type='checkbox'
                    checked={!!(rolePermissions[mod] && rolePermissions[mod].view)}
                    onChange={()=>togglePerm(mod,'view')}
                    aria-label={`${mod} view`}
                  />
                </div>

                <div>
                  <input
                    type='checkbox'
                    checked={!!(rolePermissions[mod] && rolePermissions[mod].edit)}
                    onChange={()=>togglePerm(mod,'edit')}
                    aria-label={`${mod} edit`}
                  />
                </div>

                <div>
                  <input
                    type='checkbox'
                    checked={!!(rolePermissions[mod] && rolePermissions[mod].delete)}
                    onChange={()=>togglePerm(mod,'delete')}
                    aria-label={`${mod} delete`}
                  />
                </div>
              </div>
            ))}

            <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:18}}>
              <button className='btn outline' onClick={()=>setOpen(false)}>Cancel</button>
              <button className='btn primary-dark' onClick={savePermissions}>Save Permissions</button>
            </div>
          </div>
        ) : <div className='small-muted'>Select a role from the dropdown to edit its permissions for this project.</div>}
      </Drawer>}
    </div>
  )
}
