"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User as UserIcon, Menu, Package, LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import MobileNav from "./MobileNav";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "All Games", href: "/games" },
  { label: "PC Games", href: "/games?platform=PC" },
  { label: "Pre-Orders", href: "/games?priceRange=200-499" },
  { label: "Offers", href: "/games?priceRange=under-99" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Support", href: "/support" },
];

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/games?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#090b0e]/95 backdrop-blur-md border-b border-[#161a22]">
        {/* Top Header Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4 lg:gap-8">
            {/* Dragon Logo Lockup */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="relative w-10 h-10 flex items-center justify-center text-neon">
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-neon filter drop-shadow-[0_0_10px_rgba(0,232,90,0.5)]"
                >
                  <path
                    d="M20 25 C30 10, 60 10, 75 22 C85 30, 90 45, 80 60 C70 75, 45 85, 30 95 C25 80, 20 65, 25 50 C15 45, 10 35, 20 25 Z M45 35 A6 6 0 1 0 45 23 A6 6 0 1 0 45 35 M30 55 L65 50 L80 65 L50 75 Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="flex flex-col justify-center leading-none">
                <span className="text-white font-extrabold text-xl tracking-wider font-display">
                  STEAM
                </span>
                <span className="text-neon font-black text-2xl tracking-tight font-display text-glow-neon">
                  GAMES99
                </span>
              </div>
            </Link>

            {/* Pill Search Input */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl mx-auto">
              <div
                className={`relative w-full transition-all duration-200 ${
                  searchFocused
                    ? "ring-2 ring-neon/40 shadow-[0_0_15px_rgba(0,232,90,0.2)]"
                    : ""
                }`}
              >
                <input
                  type="text"
                  placeholder="Search for games, e.g. GTA V, Elden Ring..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#12161f] border border-[#222834] rounded-full py-2.5 pl-6 pr-12 text-sm text-white placeholder:text-muted/70 focus:outline-none focus:border-neon transition-colors"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-neon transition-colors cursor-pointer"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Right Controls: Cart & Account */}
            <div className="flex items-center gap-4">
              <Link
                href="/cart"
                className="relative p-2.5 text-white hover:text-neon transition-colors cursor-pointer rounded-full hover:bg-white/5"
              >
                <ShoppingCart size={22} />
                <span className="absolute top-0.5 right-0.5 bg-neon text-black text-[10px] font-black min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,232,90,0.6)]">
                  {totalItems}
                </span>
              </Link>

              {/* Account Dropdown or Login Button */}
              {isAuthenticated && user ? (
                <div className="relative hidden sm:block" ref={dropdownRef}>
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#222834] hover:border-neon/50 text-sm text-white transition-all cursor-pointer bg-[#12161f]"
                  >
                    <div className="w-5 h-5 rounded-full bg-neon/20 border border-neon/50 flex items-center justify-center text-[10px] font-black text-neon">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-xs tracking-wider uppercase truncate max-w-28">
                      {user.fullName.split(" ")[0]}
                    </span>
                    <ChevronDown size={14} className="text-muted" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#121418] border border-[#22242b] rounded-xl shadow-2xl py-2 z-50 space-y-1">
                      <div className="px-4 py-2 border-b border-[#1e222c]">
                        <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
                        <p className="text-[10px] text-muted truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-black text-neon bg-neon/10 hover:bg-neon/20 transition-colors border-b border-[#1e222c]"
                        >
                          <ShieldCheck size={14} />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white hover:bg-white/5 hover:text-neon transition-colors"
                      >
                        <UserIcon size={14} className="text-neon" />
                        <span>My Account</span>
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white hover:bg-white/5 hover:text-neon transition-colors"
                      >
                        <Package size={14} className="text-neon" />
                        <span>My Orders</span>
                      </Link>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                          router.push("/login");
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors text-left border-t border-[#1e222c] pt-2 mt-1 cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-[#222834] text-sm text-white hover:text-neon hover:border-neon/50 transition-all cursor-pointer bg-[#12161f]"
                >
                  <UserIcon size={18} />
                  <span className="font-bold text-xs tracking-wider uppercase">Account / Login</span>
                </Link>
              )}


              <button
                className="md:hidden p-2 text-white hover:text-neon transition-colors cursor-pointer"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Centered Navigation Links Row */}
        <nav className="hidden md:block border-t border-[#161a22]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center justify-center gap-6 lg:gap-8 h-11">
              {navLinks.map((link) => (
                <li key={link.href} className="relative h-full flex items-center">
                  <Link
                    href={link.href}
                    className={`text-sm font-semibold tracking-wide transition-colors ${
                      link.label === "Home"
                        ? "text-neon"
                        : "text-foreground/80 hover:text-neon"
                    }`}
                  >
                    {link.label}
                  </Link>
                  {link.label === "Home" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon rounded-t-full shadow-[0_-2px_8px_rgba(0,232,90,0.8)]" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Nav */}
      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
      />
    </>
  );
}
