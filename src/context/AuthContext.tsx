"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, AuthState } from "@/types/user";
import {
  getCurrentSessionUser,
  loginUser,
  logoutUser,
  registerUser,
  loginAsDemoAdmin,
  isAdminUser,
} from "@/lib/auth";

export interface AuthContextType extends AuthState {
  isAdmin: boolean;
  login: (email: string) => User;
  register: (fullName: string, email: string) => User;
  loginAdmin: () => User;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate user session from localStorage on initial mount
  useEffect(() => {
    try {
      const activeUser = getCurrentSessionUser();
      if (activeUser) {
        setUser(activeUser);
      }
    } catch (e) {
      console.error("Failed to load user session", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const login = (email: string): User => {
    const loggedInUser = loginUser(email);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = (fullName: string, email: string): User => {
    const registeredUser = registerUser(fullName, email);
    setUser(registeredUser);
    return registeredUser;
  };

  const loginAdmin = (): User => {
    const adminUser = loginAsDemoAdmin();
    setUser(adminUser);
    return adminUser;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const isAdmin = isAdminUser(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isLoaded,
        login,
        register,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
