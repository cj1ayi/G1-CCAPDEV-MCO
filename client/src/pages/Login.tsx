import AnimoForumsLogoWhite from "@/assets/AnimoForumsLogoWhite.svg";
import LegendsYuch from "@/assets/legendsyuch.jpg";
import SunriseHenry from "@/assets/sunerisehenry.jpg";
import SunriseMig from "@/assets/sunrisestmig.jpg";

// React
import { useState, useEffect } from "react";

// Libraries
import { Link } from "react-router-dom";
//import { motion } from "framer-motion";

// Icons
import { Mail, AtSign, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

// UI Components
import { Input, Button, Checkbox } from "@/components/ui";

const Login = () => {
  const bg_images = [LegendsYuch, SunriseHenry, SunriseMig];
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images with fade effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % bg_images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="relative hidden w-1/2 lg:block">
        {/* Background Images with Fade */}
        <div className="relative h-full w-full">
          {bg_images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index + 1}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        {/* Green Overlay */}
        <div className="absolute inset-0 bg-green-900/60" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to= "/">
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
      <div className="flex w-full flex-col items-center justify-center bg-white px-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900">Sign In</h1>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <Input
              type="email"
              placeholder="Email or username"
              leftIcon={<AtSign className="h-5 w-5" />}
            />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              leftIcon={<Lock className="h-5 w-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center justify-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
            />

            {/* Remember Me */}
            <div className="flex items-start gap-2">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Remember me{" "}
              </label>
            </div>


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
              Sign In to AnimoForums
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
