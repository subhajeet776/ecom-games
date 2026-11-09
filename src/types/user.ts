export interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  role?: "admin" | "customer";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoaded: boolean;
}

