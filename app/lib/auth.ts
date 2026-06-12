// Simple session-based auth utility
// Uses localStorage for client-side session management

export interface User {
  id: string;
  email: string;
}

const SESSION_KEY = "jee-user-session";

export async function signin(email: string, password: string): Promise<User> {
  // Simple validation
  if (!email || !password) {
    throw new Error("Email and password required");
  }

  if (!email.includes("@")) {
    throw new Error("Invalid email");
  }

  // Generate a simple user ID (in production, this would be server-side)
  const user: User = {
    id: `user-${Date.now()}`,
    email,
  };

  // Store session in localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  return user;
}

export async function signout(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getSession(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const session = localStorage.getItem(SESSION_KEY);
  if (!session) {
    return null;
  }

  try {
    return JSON.parse(session);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}
