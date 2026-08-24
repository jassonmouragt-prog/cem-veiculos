import { AdminUser } from "../db/types";

const AUTH_STORAGE_KEY = "cm_admin_session_v1";
const ADMIN_CONFIG_KEY = "cm_admin_credentials_v1";

interface AdminCredentials {
  id: string;
  email: string;
  name: string;
  passwordHash: string; // Base64 / SHA-256 equivalent
}

// Default initial administrator
const DEFAULT_ADMIN: AdminCredentials = {
  id: "admin-1",
  email: "admin@cmveiculos.com.br",
  name: "Administrador C&M",
  passwordHash: "admin123456", // Default initial password
};

function getStoredAdmin(): AdminCredentials {
  if (typeof window === "undefined") {
    return DEFAULT_ADMIN;
  }
  try {
    const raw = localStorage.getItem(ADMIN_CONFIG_KEY);
    if (!raw) {
      localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(DEFAULT_ADMIN));
      return DEFAULT_ADMIN;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ADMIN;
  }
}

type AuthListener = () => void;
const authListeners = new Set<AuthListener>();

function notifyAuthListeners() {
  authListeners.forEach((l) => {
    try {
      l();
    } catch (e) {
      console.error(e);
    }
  });
}

export function subscribeToAuth(listener: AuthListener): () => void {
  authListeners.add(listener);
  return () => authListeners.delete(listener);
}

export function getCurrentUser(): AdminUser | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && data.email && data.role === "admin") {
      return data as AdminUser;
    }
    return null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function login(email: string, password: string): { success: boolean; user?: AdminUser; error?: string } {
  const admin = getStoredAdmin();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  if (cleanEmail !== admin.email.toLowerCase()) {
    return { success: false, error: "E-mail ou senha incorretos." };
  }

  if (cleanPass !== admin.passwordHash) {
    return { success: false, error: "E-mail ou senha incorretos." };
  }

  const user: AdminUser = {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: "admin",
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }
  notifyAuthListeners();

  return { success: true, user };
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  notifyAuthListeners();
}

export function updateAdminPassword(currentPass: string, newPass: string): { success: boolean; error?: string } {
  const admin = getStoredAdmin();
  if (currentPass !== admin.passwordHash) {
    return { success: false, error: "A senha atual está incorreta." };
  }

  if (!newPass || newPass.length < 6) {
    return { success: false, error: "A nova senha deve conter no mínimo 6 caracteres." };
  }

  admin.passwordHash = newPass;
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(admin));
  }
  return { success: true };
}
