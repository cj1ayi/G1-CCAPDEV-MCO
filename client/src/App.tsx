import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  Home,
  PostDetail,
  Profile,
  Space,
  Login,
  Signup,
  Search,
  ComponentShowcase
} from './pages'

const App = () => {

  const showShowcase = new URLSearchParams(
    window.location.search)
    .has('showcase');

  if (showShowcase) {
    return <ComponentShowcase />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/post/:id" element={<PostDetail/>} />
        <Route path="/profile/:id" element={<Profile/>} />
        <Route path="/space/:name" element={<Space/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/search" element={<Search/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
