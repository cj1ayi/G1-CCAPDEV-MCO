import AnimoForumsLogoWhite from "@/assets/logo/AnimoForumsLogoWhite.svg";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Checkbox } from "@/components/ui";
import { useImageRotation } from "@/hooks/";
import { cn, BACKGROUND_IMAGES } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/apiUtils";

const Login = () => {
  const [remember, setRemember] = useState(false)
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const isUnauthorized = params.get('error') === 'unauthorized_domain'

  const { currentIndex } = useImageRotation({
    images: BACKGROUND_IMAGES,
    interval: 30000,
    random: true,
  })

  const handleGoogleLogin = () => {
    // Pass remember preference to backend as query param
    window.location.href = `${API_BASE_URL}/auth/google?remember=${remember}`
  }

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="relative h-full w-full">
          {BACKGROUND_IMAGES.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={image.alt}
              className={`
                absolute inset-0 h-full w-full object-cover 
                transition-opacity duration-1000 
                ${index === currentIndex ? "opacity-100" : "opacity-0"}
              `}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-green-900/60" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <Link to="/">
              <img src={AnimoForumsLogoWhite} alt="AnimoForums" className="h-10 w-10" />
            </Link>
            <span className="text-2xl font-bold text-white">AnimoForums</span>
          </div>
          <div className="space-y-6">
            <blockquote className="text-xl text-white">
              "tips / advice for dating someone from accountancy? lol i want us
              to work but parang he dsnt have time"
            </blockquote>
            <div className="flex items-center gap-3">
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-full bg-white/20")}>
                <span className="text-lg font-semibold text-white">?</span>
              </div>
              <div>
                <p className="font-medium text-white">Anonymous Lasallian</p>
                <p className="text-sm text-white/80">ID12X</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className={cn(
        "flex w-full flex-col items-center justify-center",
        "bg-white dark:bg-surface-dark px-8 lg:w-1/2")}>
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Sign In
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              AnimoForums is exclusively for DLSU students.
              Sign in with your DLSU Google account to continue.
            </p>
          </div>

          {/* Unauthorized domain error */}
          {isUnauthorized && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
              <p className="text-sm text-red-700 dark:text-red-400">
                Only <strong>@dlsu.edu.ph</strong> accounts are allowed.
                Please sign in with your DLSU email.
              </p>
            </div>
          )}

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              Remember me for 3 weeks
            </label>
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            fullWidth
            onClick={handleGoogleLogin}
            leftIcon={
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            }
          >
            Continue with Google
          </Button>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-green-600 hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
