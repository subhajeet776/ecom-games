import { User } from "@/types/user";

const LOCAL_STORAGE_USERS_KEY = "steam_games_99_registered_users";
const LOCAL_STORAGE_SESSION_KEY = "steam_games_99_current_user";

export const DEMO_ADMIN_EMAIL = "admin@steamgames99.com";

const INITIAL_DEMO_USERS: User[] = [
  {
    id: "USR-100",
    fullName: "Admin Manager (Demo)",
    email: DEMO_ADMIN_EMAIL,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    role: "admin",
  },
  {
    id: "USR-101",
    fullName: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    role: "customer",
  },
  {
    id: "USR-102",
    fullName: "Priya Patel",
    email: "priya.patel@example.com",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    role: "customer",
  },
  {
    id: "USR-103",
    fullName: "Aman Gupta",
    email: "aman.g@example.com",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    role: "customer",
  },
];

/**
 * Check if a user is an admin
 */
export function isAdminUser(user: User | null): boolean {
  if (!user) return false;
  return (
    user.role === "admin" ||
    user.email.toLowerCase() === DEMO_ADMIN_EMAIL ||
    user.email.toLowerCase() === "admin@sreamgames99.com" ||
    user.email.toLowerCase().startsWith("admin@")
  );
}

/**
 * Get all registered users from localStorage.
 * Seeds ONLY when localStorage key is completely absent.
 */
export function getRegisteredUsers(): User[] {
  if (typeof window === "undefined") return INITIAL_DEMO_USERS;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    if (data === null) {
      // Key absent -> seed initial users
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(INITIAL_DEMO_USERS));
      return INITIAL_DEMO_USERS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load registered users", e);
    return [];
  }
}

/**
 * Get currently authenticated session user
 */
export function getCurrentSessionUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Failed to load active user session", e);
    return null;
  }
}

/**
 * Store active session user
 */
export function setSessionUser(user: User | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
    }
  } catch (e) {
    console.error("Failed to update active user session", e);
  }
}

/**
 * Helper to generate unique demo user ID
 */
export function generateUserId(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `USR-${random}`;
}

/**
 * Register a new demo user
 */
export function registerUser(fullName: string, email: string): User {
  const users = getRegisteredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    setSessionUser(existing);
    return existing;
  }

  const newUser: User = {
    id: generateUserId(),
    fullName: fullName.trim(),
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
    role: normalizedEmail.startsWith("admin@") ? "admin" : "customer",
  };

  users.push(newUser);
  try {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save registered user", e);
  }

  setSessionUser(newUser);
  return newUser;
}

/**
 * Login existing demo user (or auto-register for demo convenience)
 */
export function loginUser(email: string): User {
  const users = getRegisteredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  let user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    const namePart = normalizedEmail.split("@")[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    user = {
      id: generateUserId(),
      fullName: formattedName,
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
      role: normalizedEmail.startsWith("admin@") ? "admin" : "customer",
    };
    users.push(user);
    try {
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error("Failed to update registered users list", e);
    }
  }

  setSessionUser(user);
  return user;
}

/**
 * Convenience helper to log in directly as Demo Admin
 */
export function loginAsDemoAdmin(): User {
  const adminUser: User = {
    id: "USR-100",
    fullName: "Admin Manager (Demo)",
    email: DEMO_ADMIN_EMAIL,
    createdAt: new Date().toISOString(),
    role: "admin",
  };
  setSessionUser(adminUser);
  return adminUser;
}

/**
 * Log out active session user
 */
export function logoutUser(): void {
  setSessionUser(null);
}
