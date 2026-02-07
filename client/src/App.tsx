import { MainLayout } from '@/components/layout/MainLayout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  Home,
  PostDetail,
  Profile,
  Space,
  Login,
  Signup,
  Search,
  ComponentShowcase,
  TestPosts,
  TestComments
} from './pages'

import { 
  commentService 
} from "@/features/comments/services/commentService";

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
    .has('showcase');

  if (showShowcase) {
    return (
      <BrowserRouter>
        <ComponentShowcase />
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/post/:id" element={<PostDetail/>} />
          <Route path="/profile/:id" element={<Profile/>} />
          <Route path="/space/:name" element={<Space/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/search" element={<Search/>} />
          <Route path="/test-posts" element={<TestPosts />} />
          <Route path="/test-comments" element={<TestComments />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
