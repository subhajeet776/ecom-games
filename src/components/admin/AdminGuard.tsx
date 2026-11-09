"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ShieldAlert, LogIn, Store, Info, Lock } from "lucide-react";
import { DEMO_ADMIN_EMAIL } from "@/lib/auth";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isAdmin, isLoaded, loginAdmin } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-neon/20 border-t-neon rounded-full animate-spin" />
          <p className="text-xs text-muted font-mono uppercase tracking-wider">
            Checking Admin Authorizations...
          </p>
        </div>
      </div>
    );
  }

  // If user is logged in AND is admin -> render protected admin content
  if (isAuthenticated && isAdmin) {
    return <>{children}</>;
  }

  // Access Denied / Demo Admin Auth Screen
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#121418] border border-[#22242b] rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
          <ShieldAlert size={32} />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-black text-white font-display uppercase tracking-wide mb-2">
            Admin Access Required
          </h2>
          <p className="text-muted text-xs leading-relaxed">
            The Admin Console is restricted to authorized store administrators. Normal customer accounts cannot view backend metrics or game settings.
          </p>
        </div>

        {/* Explicit Portfolio Demo Warning */}
        <div className="bg-[#181c24] border border-[#262b36] rounded-xl p-4 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[11px] tracking-wide">
            <Info size={14} />
            <span>Portfolio Demo Security Notice</span>
          </div>
          <p className="text-white/70 text-[11px]">
            This is a frontend demo application using browser <code className="text-neon bg-black/40 px-1 py-0.5 rounded">localStorage</code> state. It does not use a real production database or secure server-side session cookies.
          </p>
          <div className="pt-1 text-[11px] text-muted flex items-center gap-1.5">
            <Lock size={12} className="text-neon" />
            <span>Demo Admin Account: <strong className="text-white">{DEMO_ADMIN_EMAIL}</strong></span>
          </div>
        </div>

        {/* Current user badge if logged in as customer */}
        {isAuthenticated && user && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-300">
            Currently logged in as customer: <strong>{user.email}</strong>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => loginAdmin()}
            className="w-full py-3 bg-neon text-black font-extrabold text-sm uppercase tracking-wider rounded-xl hover:bg-neon-dark transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,232,90,0.3)] cursor-pointer"
          >
            <LogIn size={18} />
            <span>Log In as Demo Admin</span>
          </button>

          <Link
            href="/"
            className="w-full py-2.5 bg-[#181c24] border border-[#262b36] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2"
          >
            <Store size={16} />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
