import {
  lazy,
  Suspense,
} from 'react'
import {
  useAuth,
} from './features/auth/hooks'
import {
  Navigate,
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'
import {
  AuthProvider,
} from '@/features/auth/AuthContext'
import {
  LoadingBar,
  LoadingSpinner,
} from '@/components/shared'
import {
  VotingProvider,
} from './features/votes/VotingContext'
import {
  ToastProvider,
} from './hooks/ToastContext'
import {
  JoinedSpacesProvider,
} from '@/features/spaces/hooks/JoinedSpacesContext'
import {
  QueryProvider,
} from '@/lib/QueryProvider'

// ── Static imports (high traffic) ───
import Home from './pages/Home'
import Explore from './pages/Explore'
import PostDetail from './pages/PostDetail'
import Profile from './pages/Profile'
import Space from './pages/Space'

// ── Lazy imports (low traffic) ──────
const CreatePost = lazy(
  () => import('./pages/CreatePost'),
)
const EditPost = lazy(
  () => import('./pages/EditPost'),
)
const EditProfile = lazy(
  () => import('./pages/EditProfile'),
)
const EditSpace = lazy(
  () => import('./pages/EditSpace'),
)
const SpacesDirectory = lazy(
  () => import(
    './pages/SpacesDirectory'
  ),
)
const CreateSpace = lazy(
  () => import('./pages/CreateSpace'),
)
const Login = lazy(
  () => import('./pages/Login'),
)
const Signup = lazy(
  () => import('./pages/Signup'),
)
const Search = lazy(
  () => import('./pages/Search'),
)
const About = lazy(
  () => import('./pages/About'),
)


// ── Routes ──────────────────────

const AppRoutes = () => {
  const { user } = useAuth()

  return (
    <Routes>
      <Route
        path="/"
        element={
          user
            ? <Navigate
              to="/explore"
              replace
            />
            : <Home />
        }
      />
      <Route
        path="/explore"
        element={<Explore />}
      />
      <Route
        path="/post/:id"
        element={<PostDetail />}
      />
      <Route
        path="/post/create"
        element={<CreatePost />}
      />
      <Route
        path="/post/:id/edit"
        element={<EditPost />}
      />
      <Route
        path="/profile/:username"
        element={<Profile />}
      />
      <Route
        path="/profile/edit"
        element={<EditProfile />}
      />
      <Route
        path="/r/:name"
        element={<Space />}
      />
      <Route
        path="/r/:name/edit"
        element={<EditSpace />}
      />
      <Route
        path="/spaces"
        element={<SpacesDirectory />}
      />
      <Route
        path="/spaces/create"
        element={<CreateSpace />}
      />
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/signup"
        element={<Signup />}
      />
      <Route
        path="/search"
        element={<Search />}
      />
      <Route
        path="/about"
        element={<About />}
      />
 
    </Routes>
  )
}

import {
  MainLayout,
} from '@/components/layout/MainLayout'

// ── App ─────────────────────────

const App = () => (
  <BrowserRouter>
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>
          <VotingProvider>
            <JoinedSpacesProvider>
              <LoadingBar />
              <Suspense
                fallback={
                  <MainLayout>
                    <LoadingSpinner
                      size="lg"
                      text="Loading..."
                    />
                  </MainLayout>
                }
              >
                <AppRoutes />
              </Suspense>
            </JoinedSpacesProvider>
          </VotingProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryProvider>
  </BrowserRouter>
)

export default App
