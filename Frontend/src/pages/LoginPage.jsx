import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import Spline from '@splinetool/react-spline';
import { Link } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-[#1A0D2E] to-[#2A1A4D] text-white">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
              >
                <GraduationCap className="w-6 h-6 text-purple-300" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome to CareerGuide</h1>
              <p className="text-gray-400">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-300">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-300">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn bg-pink-600 hover:bg-pink-700 text-white w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
              <p className="text-gray-500">
              Do not have an account?{" "}
              <Link to="/signup" className="text-purple-300 hover:text-purple-400">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Spline 3D Animation */}
      <div className="flex items-center justify-center p-12 sm:p-20">
        <div className="relative w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center">
          <Spline
            scene="https://prod.spline.design/8TLbzskL8jNzVBxx/scene.splinecode"
            className="w-full h-full scale-125" // Increase scale to make the animation bigger
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;