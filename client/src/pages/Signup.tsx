// Location: client/src/pages/Signup.tsx
// 
// With Google OAuth, there's no separate signup flow.
// New users are automatically created on first Google login.
// This page just redirects to Login.

import { Navigate } from "react-router-dom"

const Signup = () => {
  return <Navigate to="/login" replace />
}

export default Signup
