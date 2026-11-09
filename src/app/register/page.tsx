"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoaded } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to account
  React.useEffect(() => {
    if (isLoaded && isAuthenticated) {
      router.replace("/account");
    }
  }, [isAuthenticated, isLoaded, router]);

  if (isLoaded && isAuthenticated) {
    return null;
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.form) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        delete copy.form;
        return copy;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      register(formData.fullName.trim(), formData.email.trim());
      router.push("/account");
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({ form: "Failed to create account. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-10 pb-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#121418] border border-[#22242b] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neon/10 border border-neon/30 text-neon mb-2">
            <User size={24} />
          </div>
          <h1 className="text-2xl font-black text-white font-display uppercase tracking-wide">
            Create Account
          </h1>
          <p className="text-xs text-muted">
            Join Steam Games 99 to manage orders and fast checkout.
          </p>
        </div>

        {errors.form && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 flex items-center gap-3 text-red-400 text-xs">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="block text-xs font-bold text-white uppercase tracking-wide">
              Full Name <span className="text-neon">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Alex Mercer"
                className={`w-full bg-[#181b22] border ${
                  errors.fullName ? "border-red-500" : "border-[#282d38]"
                } rounded-lg py-2.5 px-4 pl-10 text-sm text-white placeholder-muted focus:outline-none focus:border-neon transition-colors`}
              />
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            </div>
            {errors.fullName && <p className="text-xs text-red-400 font-medium">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-bold text-white uppercase tracking-wide">
              Email Address <span className="text-neon">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@example.com"
                className={`w-full bg-[#181b22] border ${
                  errors.email ? "border-red-500" : "border-[#282d38]"
                } rounded-lg py-2.5 px-4 pl-10 text-sm text-white placeholder-muted focus:outline-none focus:border-neon transition-colors`}
              />
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            </div>
            {errors.email && <p className="text-xs text-red-400 font-medium">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-bold text-white uppercase tracking-wide">
              Password <span className="text-neon">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className={`w-full bg-[#181b22] border ${
                  errors.password ? "border-red-500" : "border-[#282d38]"
                } rounded-lg py-2.5 px-4 pl-10 text-sm text-white placeholder-muted focus:outline-none focus:border-neon transition-colors`}
              />
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            </div>
            {errors.password && <p className="text-xs text-red-400 font-medium">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="block text-xs font-bold text-white uppercase tracking-wide">
              Confirm Password <span className="text-neon">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={`w-full bg-[#181b22] border ${
                  errors.confirmPassword ? "border-red-500" : "border-[#282d38]"
                } rounded-lg py-2.5 px-4 pl-10 text-sm text-white placeholder-muted focus:outline-none focus:border-neon transition-colors`}
              />
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-400 font-medium">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-[#34d34a] hover:bg-[#2cc042] disabled:opacity-50 text-black font-bold text-sm py-3 rounded-full transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(52,211,74,0.3)] hover:scale-[1.01] mt-2"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Creating Account...</span>
            ) : (
              <>
                <span>Register</span>
                <CheckCircle2 size={18} strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#22242b] text-center text-xs text-muted">
          <span>Already have an account? </span>
          <Link href="/login" className="text-neon font-bold hover:underline inline-flex items-center gap-1">
            <span>Log In</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
