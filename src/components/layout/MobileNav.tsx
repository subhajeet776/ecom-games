"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Search, User as UserIcon, Package, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
}

export default function MobileNav({ isOpen, onClose, links }: MobileNavProps) {
  const { user, isAuthenticated, logout } = useAuth();
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-surface border-l border-border z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="text-lg font-bold text-foreground">Menu</span>
          <button
            onClick={onClose}
            className="p-1.5 text-foreground hover:text-neon transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search games..."
              className="w-full bg-background border border-border rounded-md py-2 pl-4 pr-10 text-sm text-foreground placeholder-muted focus:outline-none focus:border-neon/50"
            />
            <Search
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
            />
          </div>
        </div>

        {/* Links */}
        <nav className="px-4 space-y-4">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-neon hover:bg-white/5 rounded transition-colors"
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-border space-y-1">
            {isAuthenticated && user ? (
              <>
                <div className="px-3 py-2 text-xs text-muted font-semibold truncate">
                  Signed in as <span className="text-white">{user.fullName}</span>
                </div>
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-neon hover:bg-white/5 rounded transition-colors"
                  onClick={onClose}
                >
                  <UserIcon size={16} className="text-neon" />
                  <span>My Account</span>
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-neon hover:bg-white/5 rounded transition-colors"
                  onClick={onClose}
                >
                  <Package size={16} className="text-neon" />
                  <span>My Orders</span>
                </Link>
                <button
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded transition-colors text-left cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neon hover:bg-white/5 rounded transition-colors"
                onClick={onClose}
              >
                <UserIcon size={16} />
                <span>Account / Login</span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
