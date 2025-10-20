import React, { useEffect, useState } from "react";
import * as mockApi from "../api/mockApi";
import Drawer from "../components/Drawer";
import { useAuth } from "../auth/AuthContext";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    permissions: {},
  });
  const [selectedRole, setSelectedRole] = useState(null);
  const { permissions: myPerm } = useAuth();

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const [r, u] = await Promise.all([mockApi.getRoles(), mockApi.getUsers()]);
    setRoles(r);
    setUsers(u);
    if (r[0]) setSelectedRole(r[0].id);
  }

  // put inside RolesPage component (near other helpers)
  function setPermission(moduleName, action, checked) {
    setForm((prev) => {
      const p = { ...(prev.permissions || {}) };
      if (!p[moduleName])
        p[moduleName] = {
          create: false,
          view: false,
          edit: false,
          delete: false,
        };
      p[moduleName] = { ...p[moduleName], [action]: !!checked };
      return { ...prev, permissions: p };
    });
  }

  async function save() {
    const role = {
      id: "role_" + (Date.now() % 100000),
      name: form.name || "Untitled",
      description: form.description || "",
      permissions: form.permissions,
    };
    await mockApi.createRole(role);
    await fetchAll();
    setOpen(false);
    setForm({ name: "", description: "", permissions: {} });
  }

  const rolesWithCount = roles.map((r) => ({
    ...r,
    count: users.filter((u) => u.roleId === r.id).length,
  }));

  return (
    <div>
      <div className="card roles-header">
        <h3>Role Management</h3>
        {myPerm && myPerm.users && myPerm.users.manageRoles ? (
          <button className="btn primary-dark" onClick={() => setOpen(true)}>
            Create Role
          </button>
        ) : (
          <button className="btn outline" disabled>
            Insufficient permission
          </button>
        )}
      </div>

      <div className="roles-container">
        <div className="roles-list card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#f0f6f6",
              }}
            ></div>
            <div>
              <div style={{ fontWeight: 600 }}>Role</div>
              <div className="small-muted">Manage application roles</div>
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            {rolesWithCount.map((r) => (
              <div
                key={r.id}
                className={
                  "role-item " + (selectedRole === r.id ? "selected" : "")
                }
                onClick={() => setSelectedRole(r.id)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <div>{r.name}</div>
                <div className="small-muted">{r.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="roles-right">
          <div className="card">
            <h4>Selected Role</h4>
            {selectedRole ? (
              (() => {
                const r = roles.find((x) => x.id === selectedRole);
                if (!r) return <div>No role selected</div>;
                return (
                  <div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>{r.name}</strong>
                    </div>
                    <div className="small-muted">{r.description}</div>
                    <div style={{ marginTop: 12 }}>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Module</th>
                            <th>Create</th>
                            <th>View</th>
                            <th>Edit</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(r.permissions || {}).map((mod) => (
                            <tr key={mod}>
                              <td>{mod}</td>
                              <td>{r.permissions[mod].create ? "✓" : "—"}</td>
                              <td>{r.permissions[mod].view ? "✓" : "—"}</td>
                              <td>{r.permissions[mod].edit ? "✓" : "—"}</td>
                              <td>{r.permissions[mod].delete ? "✓" : "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div>Select a role from left</div>
            )}
          </div>
        </div>
      </div>

      {open && (
        <Drawer title="Create Role" onClose={() => setOpen(false)}>
          <div style={{ marginBottom: 12 }}>
            <input
              className="input"
              placeholder="Role name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <input
              className="input"
              placeholder="Descriptions"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div style={{ marginTop: 8 }}>
            <div
              className="checkbox-grid"
              style={{ gridTemplateColumns: "1fr 80px 80px 80px 80px" }}
            >
              <div>
                <strong>Module Name</strong>
              </div>
              <div>
                <strong>Create</strong>
              </div>
              <div>
                <strong>View</strong>
              </div>
              <div>
                <strong>Edit</strong>
              </div>
              <div>
                <strong>Delete</strong>
              </div>
            </div>
            {["project", "design", "task", "users"].map((mod) => (
              <div
                key={mod}
                className="checkbox-grid"
                style={{ gridTemplateColumns: "1fr 80px 80px 80px 80px" }}
              >
                <div style={{ padding: "8px 0", textTransform: "capitalize" }}>
                  {mod}
                </div>

                <div>
                  <input
                    type="checkbox"
                    checked={
                      !!(form.permissions[mod] && form.permissions[mod].create)
                    }
                    onChange={(e) =>
                      setPermission(mod, "create", e.target.checked)
                    }
                  />
                </div>

                <div>
                  <input
                    type="checkbox"
                    checked={
                      !!(form.permissions[mod] && form.permissions[mod].view)
                    }
                    onChange={(e) =>
                      setPermission(mod, "view", e.target.checked)
                    }
                  />
                </div>

                <div>
                  <input
                    type="checkbox"
                    checked={
                      !!(form.permissions[mod] && form.permissions[mod].edit)
                    }
                    onChange={(e) =>
                      setPermission(mod, "edit", e.target.checked)
                    }
                  />
                </div>

                <div>
                  <input
                    type="checkbox"
                    checked={
                      !!(form.permissions[mod] && form.permissions[mod].delete)
                    }
                    onChange={(e) =>
                      setPermission(mod, "delete", e.target.checked)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 18,
            }}
          >
            <button className="btn outline" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button className="btn primary-dark" onClick={save}>
              Save Role
            </button>
          </div>
        </Drawer>
      )}
    </div>
  );
}
