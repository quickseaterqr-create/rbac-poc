RBAC POC (Vite + React)
=======================

Quick start:
1. unzip or open this folder
2. run `npm install`
3. run `npm run dev`
4. Open http://localhost:5173

Notes:
- This is a frontend-only POC with a mock API that persists to localStorage.
- Login page lets you choose a role; permissions are derived from the role and stored in localStorage.
- UI demonstrates role-based menus, route guards, Create Role drawer, and Invite User drawer.

Files of interest:
- src/api/mockApi.js  (mock backend)
- src/auth/AuthContext.jsx  (auth and permissions in context)
- src/hooks/usePermission.js  (permission check helper)
- src/pages/*  (pages)
