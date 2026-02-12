import AnimoForumsLogoWhite from "@/assets/AnimoForumsLogoWhite.svg";
import LegendsYuch from "@/assets/legendsyuch.jpg";
import SunriseHenry from "@/assets/sunerisehenry.jpg";
import SunriseMig from "@/assets/sunrisestmig.jpg";
import SundownHenry from "@/assets/sundownhenry.jpg";

// React
import { useState } from "react";

// Libraries
import { Link } from "react-router-dom";

// Icons
import { 
  Mail, 
  AtSign, 
  ArrowRight 
} from "lucide-react";

// UI Components
import { 
  Input, 
  Button, 
  Checkbox,
  PasswordInput
} from "@/components/ui";

// Hooks 
import { useImageRotation } from "@/hooks/useImageRotation";

const Signup = () => {
  const [password, setPassword] = useState("");

  const BACKGROUND_IMAGES = [
   {
      src: SunriseHenry,
      alt: "Sunrise Henry",
      weight: 300,
    },
    {
      src: SunriseMig,
      alt: "Sunrise St. Miguel",
      weight: 300,
    },
    {
      src: SundownHenry,
      alt: "Sundown Henry",
      weight: 300,
    },
    {
      src: LegendsYuch,
      alt: "Legends Yuch",
      weight: 1,
    },
  ]


  const { currentIndex } = useImageRotation({
    images: BACKGROUND_IMAGES,
    interval: 30000,
    random: true,
  })

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="relative hidden w-1/2 lg:block">
        {/* Background Images with Fade */}
        <div className="relative h-full w-full">
          {BACKGROUND_IMAGES.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={image.alt}
              className={`
                absolute inset-0 h-full w-full object-cover 
                transition-opacity duration-1000 
                ${index === currentIndex ? "opacity-100" : "opacity-0"}`
              }
            />
          ))}
        </div>

        {/* Green Overlay */}
        <div className="absolute inset-0 bg-green-900/60" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/">
              <img
                src={AnimoForumsLogoWhite}
                alt="AnimoForums"
                className="h-10 w-10"
              />
            </Link>
            <span className="text-2xl font-bold text-white">AnimoForums</span>
          </div>

          {/* Testimonial */}
          <div className="space-y-6">
            <blockquote className="text-xl text-white">
              "tips / advice for dating someone from accountancy? lol i want us
              to work but parang he dsnt have time"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
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
      <div className="flex w-full flex-col items-center justify-center bg-white dark:bg-surface-dark px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Join the Community
            </h1>
            <p className="text-gray-600">
              Create your account to access exclusive DLSU discussions and
              resources.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <Input
              type="email"
              placeholder="kim_chaewon@dlsu.edu.ph"
              leftIcon={<Mail className="h-5 w-5" />}
            />

            <Input
              type="text"
              placeholder="Choose a unique handle"
              leftIcon={<AtSign className="h-5 w-5" />}
            />

            <PasswordInput
            value={password}
            onChange={setPassword}
            placeholder="Min. 8 characters"
            showStrength={true}
            />           

            {/* Confirmation */}
            <div className="flex items-start gap-2">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link to="/terms" className="text-green-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-green-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Create Account Button */}
            <Button
              type="submit"
              rightIcon={<ArrowRight className="h-5 w-5" />}
              fullWidth
            >
              Create Account
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-surface-dark px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Sign in Option */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-green-600 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
