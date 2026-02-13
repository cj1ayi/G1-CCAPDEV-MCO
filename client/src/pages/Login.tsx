import React from "react";
import AnimoForumsLogoWhite from "@/assets/AnimoForumsLogoWhite.svg";
import LegendsYuch from "@/assets/legendsyuch.jpg";
import SunriseHenry from "@/assets/sunerisehenry.jpg";
import SunriseMig from "@/assets/sunrisestmig.jpg";
import SundownHenry from "@/assets/sundownhenry.jpg";

// React
import { useState } from "react";

// Libraries
import { Link, useNavigate } from "react-router-dom";

// Icons
import { AtSign, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

// UI Components
import { Input, Button, Checkbox } from "@/components/ui";

// Hooks
import { useImageRotation } from "@/hooks/useImageRotation";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

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
  ];

  const { currentIndex } = useImageRotation({
    images: BACKGROUND_IMAGES,
    interval: 30000,
    random: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!usernameOrEmail || !password) {
      setError("Please enter your credentials.");
      return;
    }
    const success = login(usernameOrEmail, password, remember);
    if (success) {
      navigate("/explore");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="relative hidden w-1/2 lg:block">
        {/* Rotating Background Images  */}
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
        <div className="w-full max-w-xl">
          {/* Heading */}
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Sign In
            </h1>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Email or username"
              leftIcon={<AtSign className="h-5 w-5" />}
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              autoFocus
            />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              leftIcon={<Lock className="h-5 w-5" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              <Checkbox
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>
            {/* Error Message */}
            {error && <div className="text-red-500 text-sm">{error}</div>}
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
            <Button
              type="submit"
              rightIcon={<ArrowRight className="h-5 w-5" />}
              fullWidth
            >
              Sign In to AnimoForums
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
