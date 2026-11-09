"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Gamepad2,
  ShoppingBag,
  Users,
  Store,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Games", href: "/admin/games", icon: Gamepad2 },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Customers", href: "/admin/customers", icon: Users },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="bg-[#0e1117] border-b border-[#1f2430] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Admin Title / Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-neon/10 border border-neon/40 flex items-center justify-center text-neon shadow-[0_0_10px_rgba(0,232,90,0.3)]">
                <ShieldCheck size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-extrabold text-sm tracking-wider font-display leading-tight flex items-center gap-1.5">
                  STEAM GAMES 99
                  <span className="bg-neon/20 border border-neon/40 text-neon text-[10px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                    ADMIN
                  </span>
                </span>
                <span className="text-[10px] text-muted font-medium">Store Management Console</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? "bg-neon text-black shadow-[0_0_10px_rgba(0,232,90,0.4)]"
                      : "text-muted hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Back to Store & Logout */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-neon px-3 py-2 rounded-lg border border-[#262b36] hover:border-neon/40 transition-all bg-[#141822]"
            >
              <Store size={15} />
              <span>Back to Store</span>
            </Link>

            <div className="h-4 w-[1px] bg-[#262b36]" />

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted truncate max-w-28">
                {user?.fullName || "Admin"}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2.5 py-1.5 rounded-lg border border-red-500/20 transition-all cursor-pointer"
                title="Log out"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-muted hover:text-white rounded-lg hover:bg-white/5"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#12151c] border-b border-[#1f2430] px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? "bg-neon text-black"
                    : "text-white/80 hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-[#1f2430] flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold text-white/80 hover:bg-white/5 border border-[#262b36]"
            >
              <Store size={18} className="text-neon" />
              <span>Back to Customer Store</span>
            </Link>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold text-red-400 hover:bg-red-500/10 text-left border border-red-500/20 cursor-pointer"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
