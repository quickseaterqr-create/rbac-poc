export default function hasPermission(permissions, module, action){
  // permissions shape: { project: {create:true,view:true,edit:false,delete:false}, users: {view:true,manageRoles:true} }
  if(!permissions) return false
  const m = permissions[module]
  if(!m) return false
  // some actions are custom like 'manageRoles'
  return !!m[action]
}
