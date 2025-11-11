import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { GraduationCap, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import Spline from '@splinetool/react-spline';
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters long.");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  return (
    <div className="h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-[#1A0D2E] to-[#2A1A4D] text-white">
      {/* Left Side - Signup Form */}
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
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-gray-400">Get started with your free account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-300">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  placeholder="Nitin Pandey"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
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
                  placeholder="nitin@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
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

            {/* Submit Button */}
            <button
              type="submit"
              className="btn bg-pink-600 hover:bg-pink-700 text-white w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing Up...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Sign-in Link */}
          <div className="text-center">
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-300 hover:text-purple-400">
                Sign in
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
            className="w-full h-full scale-125"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;