import AnimoForumsLogoWhite from '@/assets/AnimoForumsLogoWhite.svg'
import LegendsYuch from '@/assets/legendsyuch.jpg'
import SunriseHenry from '@/assets/sunerisehenry.jpg'
import SunriseMig from '@/assets/sunrisestmig.jpg'

// React
import { useState } from 'react'

// Libraries
import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

// Icons
import { 
  GraduationCap,  // Logo
  Mail,           // Email input
  AtSign,         // Username input
  Lock,           // Password input
  Eye,            // Show password
  EyeOff,         // Hide password
  ArrowRight      // Button arrow
} from 'lucide-react'

// UI Components
import { Input, Button, Avatar } from '@/components/ui'

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Panel */}
      <div className="hidden lg:flex relative">
        {/* Background Image */}
        <img src={LegendsYuch} className="absolute inset-0 w-full h-full object-cover" />

        {/* Green Overlay */}
        <div className="absolute inset-0 bg-primary/70" />

        {/* Content */}
        <div className="relative z-10 flex flex-col p-8 w-full h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={AnimoForumsLogoWhite} alt="AnimoForums" className="h-9 w-9" />
            <span className="text-white font-extrabold text-lg">AnimoForums</span>
          </Link>
          
          {/* Testimonial */}
          <div className="flex-1 flex items-center px-4">
            <div className="space-y-6">
              <blockquote className="text-white text-2xl lg:text-3xl font-light leading-relaxed">
                "tips / advice for dating someone from accountancy? lol i want us to work but parang he dsnt have time"

              </blockquote>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white text-lg">?</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Anonymous Lasallian</p>
                  <p className="text-white/70 text-sm">ID12X</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel */}
      <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Heading */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Join the Community</h1>
              <p className="text-gray-600">Create your account to access exclusive DLSU discussions and resources.</p>
            </div>
            {/* Form */}
            <form className="space-y-4">
              <Input 
                label="DLSU Email Address"
                placeholder="id_number@dlsu.edu.ph"
                leftIcon={<Mail className="h-5 w-5" />}
              />
              <Input 
                label="Username"
                placeholder="Choose a unique handle"
                leftIcon={<AtSign className="h-5 w-5" />}
              />
              <Input 
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                leftIcon={<Lock className="h-5 w-5" />}
                rightIcon={
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center justify-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                }
              />
            </form>
            {/* Links */}
        </div>
      </div>
    </div>
  )
}

export default Signup