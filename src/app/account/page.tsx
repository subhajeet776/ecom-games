"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Calendar, LogOut, Package, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoaded, logout } = useAuth();

  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      router.replace("/login?redirect=/account");
    }
  }, [isLoaded, isAuthenticated, router]);

  if (!isLoaded || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background pt-16 pb-16 flex items-center justify-center">
        <div className="text-neon font-bold text-lg font-display uppercase animate-pulse">
          Loading Account...
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e222c]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-7 bg-neon rounded-full shadow-[0_0_10px_rgba(0,232,90,0.6)]" />
              <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide">
                My Account
              </h1>
            </div>
            <p className="text-muted text-xs sm:text-sm pl-4">
              Manage your profile details and view order history.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-[#181b22] hover:bg-red-500/10 border border-[#282d38] hover:border-red-500/40 text-muted hover:text-red-400 font-bold text-xs px-4 py-2 rounded-full transition-all cursor-pointer"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-4 border-b border-[#22242b] pb-6">
            <div className="w-16 h-16 rounded-full bg-neon/10 border-2 border-neon flex items-center justify-center text-neon font-black text-xl font-display uppercase shadow-[0_0_15px_rgba(0,232,90,0.2)]">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-sans">
                {user.fullName}
              </h2>
              <span className="inline-block bg-neon/15 text-neon text-[10px] font-black px-2 py-0.5 rounded tracking-wide uppercase border border-neon/30 mt-1">
                DEMO ACCOUNT
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Full Name */}
            <div className="bg-[#181b22] border border-[#262b36] rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase">
                <User size={14} className="text-neon" />
                <span>Full Name</span>
              </div>
              <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
            </div>

            {/* Email */}
            <div className="bg-[#181b22] border border-[#262b36] rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase">
                <Mail size={14} className="text-neon" />
                <span>Email Address</span>
              </div>
              <p className="text-sm font-semibold text-white truncate">{user.email}</p>
            </div>

            {/* Account Created */}
            <div className="bg-[#181b22] border border-[#262b36] rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase">
                <Calendar size={14} className="text-neon" />
                <span>Member Since</span>
              </div>
              <p className="text-sm font-semibold text-white truncate">
                {new Date(user.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links / Dashboard Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/orders"
            className="group bg-[#121418] hover:bg-[#161a20] border border-[#22242b] hover:border-neon/40 rounded-2xl p-6 shadow-xl transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center text-neon group-hover:scale-105 transition-transform">
                <Package size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display uppercase tracking-wide">
                  My Orders
                </h3>
                <p className="text-xs text-muted">
                  View purchase history &amp; activation details
                </p>
              </div>
            </div>
            <ArrowRight size={20} className="text-muted group-hover:text-neon group-hover:translate-x-1 transition-all" />
          </Link>

          <div className="bg-[#121418] border border-[#22242b] rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center text-neon shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display uppercase tracking-wide">
                Demo Security
              </h3>
              <p className="text-xs text-muted">
                Local session active. Ready for real backend integration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
