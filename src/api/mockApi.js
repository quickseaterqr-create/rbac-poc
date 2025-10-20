// src/api/mockApi.js (robust version)
const STORAGE_KEY = 'rbac_mock_db_v1';

const defaultData = {
  roles: [
    {
      id:'role_admin',
      name:'Admin',
      description:'Full access',
      permissions:{
        project:{create:true,view:true,edit:true,delete:true},
        design:{create:true,view:true,edit:true,delete:true},
        task:{create:true,view:true,edit:true,delete:true},
        roles:{create:true,view:true,edit:true,delete:true},
        users:{view:true,manageRoles:true,invite:true},
      }
    }
  ],
  users:[
     ],
  projects: [],
  modules: ['project','design','task','users','documents','roles']
};

function deepClone(v){ return JSON.parse(JSON.stringify(v)); }

function load(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw){
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
      return deepClone(defaultData);
    }
    const parsed = JSON.parse(raw) || {};
    // Ensure all expected top-level keys exist; merge defaults if missing
    const merged = Object.assign({}, defaultData, parsed);
    // For arrays/objects inside, ensure they're at least defaults (avoid undefined)
    merged.roles = Array.isArray(parsed.roles) ? parsed.roles : deepClone(defaultData.roles);
    merged.users = Array.isArray(parsed.users) ? parsed.users : deepClone(defaultData.users);
    merged.projects = Array.isArray(parsed.projects) ? parsed.projects : deepClone(defaultData.projects);
    merged.modules = Array.isArray(parsed.modules) ? parsed.modules : deepClone(defaultData.modules);
    // Persist merged if original was incomplete (helps self-heal)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return deepClone(merged);
  }catch(err){
    // If parsing fails, reset to defaults
    console.warn('mockApi.load(): malformed data, resetting to defaults', err);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return deepClone(defaultData);
  }
}

function save(db){ localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }

/* API functions below — unchanged behavior but defensive about missing arrays */

export async function loginWithRole(roleId){
  const db = load();
  const role = (db.roles || []).find(r=>r.id===roleId);
  if(!role) throw new Error('role not found');
  const user = (db.users || []).find(u=>u.roleId===roleId) || {id:'guest', firstName:role.name, lastName:'', email:role.name+'@example.com', roleId};
  const res = { token: 'mock.token.'+roleId, user: {...user, roleName: role.name }, permissions: role.permissions || {} };
  return new Promise(r=>setTimeout(()=>r(res), 200));
}

export async function getRoles(){
  const db = load();
  return new Promise(r=>setTimeout(()=>r(Array.isArray(db.roles) ? db.roles.concat() : []), 120));
}

export async function createRole(role){
  const db = load();
  db.roles = Array.isArray(db.roles) ? db.roles : [];
  db.roles.push(role);
  save(db);
  return new Promise(r=>setTimeout(()=>r(role),120));
}

export async function getUsers(){
  const db = load();
  return new Promise(r=>setTimeout(()=>r(Array.isArray(db.users) ? db.users.concat() : []),120));
}

export async function inviteUser(user){
  const db = load();
  db.users = Array.isArray(db.users) ? db.users : [];
  user.id = 'u'+(db.users.length+1);
  db.users.push(user);
  save(db);
  return new Promise(r=>setTimeout(()=>r(user),120));
}

export async function getUser(id){
  const db = load();
  return new Promise(r=>setTimeout(()=>r((db.users || []).find(u=>u.id===id)),120));
}

export async function getModules(){
  const db = load();
  return new Promise(r=>setTimeout(()=>r(Array.isArray(db.modules) ? db.modules.concat() : []),120));
}

/* Example project API (if you added/are calling it) */
export async function getProjects(){
  const db = load();
  return new Promise(r=>setTimeout(()=>r(Array.isArray(db.projects) ? db.projects.concat() : []),120));
}

export async function createProject(project){
  const db = load();
  db.projects = Array.isArray(db.projects) ? db.projects : [];
  project.id = 'p' + (db.projects.length + 1);
  db.projects.push(project);
  save(db);
  return new Promise(res=>setTimeout(()=>res(project),120));
}

export async function getProjectRolePermissions(projectId){
  const db = load();
  // return deep copy to avoid accidental mutation
  const perms = (db.projectPermissions && db.projectPermissions[projectId]) ? JSON.parse(JSON.stringify(db.projectPermissions[projectId])) : {};
  return new Promise(r=>setTimeout(()=>r(perms), 120));
}

export async function setProjectRolePermissions(projectId, roleId, permissions){
  const db = load();
  if(!db.projectPermissions) db.projectPermissions = {};
  if(!db.projectPermissions[projectId]) db.projectPermissions[projectId] = {};
  db.projectPermissions[projectId][roleId] = permissions;
  save(db);
  return new Promise(r=>setTimeout(()=>r(true), 120));
}