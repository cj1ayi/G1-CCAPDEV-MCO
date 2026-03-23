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

const Home = lazy(
  () => import('./pages/Home'),
)
const Explore = lazy(
  () => import('./pages/Explore'),
)
const PostDetail = lazy(
  () => import('./pages/PostDetail'),
)
const CreatePost = lazy(
  () => import('./pages/CreatePost'),
)
const EditPost = lazy(
  () => import('./pages/EditPost'),
)
const Profile = lazy(
  () => import('./pages/Profile'),
)
const EditProfile = lazy(
  () => import('./pages/EditProfile'),
)
const Space = lazy(
  () => import('./pages/Space'),
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
    </Routes>
  )
}

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
                  <LoadingSpinner />
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
