import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/features/auth/AuthContext";
import { LoadingBar } from "@/components/shared";
import { VotingProvider } from "./features/votes/VotingContext";

import {
  Home,
  PostDetail,
  Profile,
  EditProfile,
  Explore,
  Space,
  SpacesDirectory,
  CreateSpace,
  Login,
  Signup,
  Search,
  CreatePost,
  EditPost,
} from "./pages";


const App = () => {
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <VotingProvider>
        <LoadingBar />
        
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
          <Route path="/profile/:username" element={<Profile/>} />
          <Route path="/profile/edit" element={<EditProfile/>} />
          <Route path="/r/:name" element={<Space/>} />
          <Route path="/spaces" element={<SpacesDirectory />} />
          <Route path="/spaces/create" element={<CreateSpace />} />
 
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          
          {/* Search */}
          <Route path="/search" element={<Search/>} />
     </Routes>
    </VotingProvider>
    </AuthProvider>
  </BrowserRouter>
  );
};

export default App;
