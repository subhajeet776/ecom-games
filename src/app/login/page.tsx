"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Mail, Lock, CheckCircle2, AlertCircle, ArrowRight, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get("redirect") || "/account";

  const { login, isAuthenticated, isLoaded } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isLoaded && isAuthenticated) {
      router.replace(redirectTarget);
    }
  }, [isAuthenticated, isLoaded, redirectTarget, router]);

  if (isLoaded && isAuthenticated) {
    return null;
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      login(formData.email.trim());
      router.push(redirectTarget);
    } catch (err) {
      console.error("Login error:", err);
      setErrors({ form: "Invalid login credentials. Please try again." });
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotMessage(`Password reset link sent to ${forgotEmail.trim()} (Demo Mode).`);
  };

  return (
    <div className="w-full max-w-md bg-[#121418] border border-[#22242b] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neon/10 border border-neon/30 text-neon mb-2">
          <LogIn size={24} />
        </div>
        <h1 className="text-2xl font-black text-white font-display uppercase tracking-wide">
          Account Login
        </h1>
        <p className="text-xs text-muted">
          Log in to view your orders and manage your gaming account.
        </p>
      </div>

      {errors.form && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 flex items-center gap-3 text-red-400 text-xs">
          <AlertCircle size={18} className="shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="yourname@example.com"
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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-xs font-bold text-white uppercase tracking-wide">
              Password <span className="text-neon">*</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setForgotEmail(formData.email);
                setShowForgotModal(true);
              }}
              className="text-[11px] text-neon font-medium hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full bg-[#181b22] border ${
                errors.password ? "border-red-500" : "border-[#282d38]"
              } rounded-lg py-2.5 px-4 pl-10 text-sm text-white placeholder-muted focus:outline-none focus:border-neon transition-colors`}
            />
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          </div>
          {errors.password && <p className="text-xs text-red-400 font-medium">{errors.password}</p>}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded border-[#282d38] bg-[#181b22] text-neon focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-xs text-white/80 font-medium">Remember me</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-[#34d34a] hover:bg-[#2cc042] disabled:opacity-50 text-black font-bold text-sm py-3 rounded-full transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(52,211,74,0.3)] hover:scale-[1.01] mt-2"
        >
          {isSubmitting ? (
            <span className="animate-pulse">Logging In...</span>
          ) : (
            <>
              <span>Log In</span>
              <CheckCircle2 size={18} strokeWidth={2.5} />
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-[#22242b] text-center text-xs text-muted">
        <span>Don&apos;t have an account? </span>
        <Link href="/register" className="text-neon font-bold hover:underline inline-flex items-center gap-1">
          <span>Register Now</span>
          <ArrowRight size={12} />
        </Link>
      </div>

      {/* Forgot Password Modal Placeholder */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-6 w-full max-w-sm relative space-y-4 shadow-2xl">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotMessage("");
              }}
              className="absolute top-4 right-4 text-muted hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-white uppercase font-display">
              Reset Password
            </h3>

            {forgotMessage ? (
              <div className="bg-neon/10 border border-neon/30 text-neon text-xs p-3 rounded-lg">
                {forgotMessage}
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <p className="text-xs text-muted">
                  Enter your email address and we will send you a password reset simulation link.
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  className="w-full bg-[#181b22] border border-[#282d38] rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-neon"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-neon text-black font-bold text-xs py-2.5 rounded-full hover:bg-neon-dark transition-colors"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background pt-10 pb-20 flex items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="text-neon font-bold text-lg font-display uppercase animate-pulse">
            Loading Login...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
