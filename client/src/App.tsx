import { useAuth } from "./features/auth/hooks";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/features/auth/AuthContext";
import { LoadingBar } from "@/components/shared";
import { VotingProvider } from "./features/votes/VotingContext";
import { ToastProvider } from "./hooks/ToastContext";
import { JoinedSpacesProvider } from '@/features/spaces/hooks/JoinedSpacesContext'
import {
  Home,
  PostDetail,
  Profile,
  EditProfile,
  Explore,
  Space,
  SpacesDirectory,
  CreateSpace,
  EditSpace,
  Login,
  Signup,
  Search,
  CreatePost,
  EditPost,
} from "./pages";

const AppRoutes = () => {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={user ? <Navigate to="/explore" replace /> : <Home />} />

      {/* Feed Routes */}
      <Route path="/explore" element={<Explore />} />

      {/* Post Routes */}
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/post/create" element={<CreatePost />} />
      <Route path="/post/:id/edit" element={<EditPost />} />

      {/* User & Space Routes */}
      <Route path="/profile/:username" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/r/:name" element={<Space />} />
      <Route path="/r/:name/edit" element={<EditSpace />} />
      <Route path="/spaces" element={<SpacesDirectory />} />
      <Route path="/spaces/create" element={<CreateSpace />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Search */}
      <Route path="/search" element={<Search />} />
    </Routes>
  )
}

import {
  QueryProvider,
} from '@/lib/QueryProvider'

const App = () => {
  return (
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <ToastProvider>
            <VotingProvider>
              <JoinedSpacesProvider>
                <LoadingBar />
                <AppRoutes />
              </JoinedSpacesProvider>
            </VotingProvider>
          </ToastProvider>
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  )
}

export default App;
