import { MainLayout } from '@/components/layout/MainLayout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  Home,
  PostDetail,
  Profile,
	Explore,
  Space,
  SpacesDirectory,
  Login,
  Signup,
  Search,
  ComponentShowcase,
  TestPosts,
  TestComments,
  TestLayouts,
} from './pages'

// Import the new pages
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'

import { 
  commentService 
} from "@/features/comments/services/commentService"

const App = () => {

  const hasSeeded = localStorage.getItem('comments_seeded')
  if (!hasSeeded) {
    commentService.resetToMockData().then(() => {
      localStorage.setItem('comments_seeded', 'true')
      console.log('Comments auto-seeded on first load!')
    })
  }

  const showShowcase = new URLSearchParams(
    window.location.search)
    .has('showcase')

  if (showShowcase) {
    return (
      <BrowserRouter>
        <ComponentShowcase />
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home/>} />
					{/* Feed Routes */}
					<Route path="/explore" element={<Explore/>} />
          
          {/* Post Routes */}
          <Route path="/post/:id" element={<PostDetail/>} />
          <Route path="/post/create" element={<CreatePost/>} />
          <Route path="/post/:id/edit" element={<EditPost/>} />
          
          {/* User & Space Routes */}
          <Route path="/profile/:id" element={<Profile/>} />
          <Route path="/space/:name" element={<Space/>} />
          <Route path="/spaces" element={<SpacesDirectory />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          
          {/* Search */}
          <Route path="/search" element={<Search/>} />
          
          {/* Test Routes */}
          <Route path="/test-posts" element={<TestPosts />} />
          <Route path="/test-comments" element={<TestComments />} />
          <Route path="/test-layouts" element={<TestLayouts />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
