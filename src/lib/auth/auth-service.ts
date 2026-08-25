import { supabase } from "@/integrations/supabase/client";
import { AdminUser } from "../db/types";
import { ensureFirstAdmin } from "./admin-bootstrap.functions";

let currentUser: AdminUser | null = null;
let sessionChecked = false;

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
  return () => {
    authListeners.delete(listener);
  };
}

export function getCurrentUser(): AdminUser | null {
  return currentUser;
}

export function isSessionChecked(): boolean {
  return sessionChecked;
}

/** Resolves the signed-in admin (or null) against Supabase. */
export async function refreshCurrentUser(): Promise<AdminUser | null> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    currentUser = null;
    sessionChecked = true;
    notifyAuthListeners();
    return null;
  }

  const { data: isAdmin, error } = await supabase.rpc("has_role", {
    _user_id: user.id,
    _role: "admin",
  });

  if (error) console.error("Erro ao verificar permissão de administrador:", error);

  currentUser = isAdmin
    ? {
        id: user.id,
        email: user.email ?? "",
        name: (user.user_metadata?.["name"] as string) ?? "Administrador C&M",
        role: "admin",
      }
    : null;

  sessionChecked = true;
  notifyAuthListeners();
  return currentUser;
}

export async function isAuthenticated(): Promise<boolean> {
  return (await refreshCurrentUser()) !== null;
}

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, error: "Informe e-mail e senha." };
  }

  // First access: create the initial administrator if none exists yet.
  try {
    await ensureFirstAdmin({ data: { email: cleanEmail, password: cleanPass } });
  } catch (e) {
    console.error("Bootstrap de administrador:", e);
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password: cleanPass,
  });

  if (error) {
    return { success: false, error: "E-mail ou senha incorretos." };
  }

  const user = await refreshCurrentUser();
  if (!user) {
    await supabase.auth.signOut();
    return { success: false, error: "Esta conta não possui acesso administrativo." };
  }

  return { success: true, user };
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
  currentUser = null;
  notifyAuthListeners();
}

export async function updateAdminPassword(
  currentPass: string,
  newPass: string
): Promise<{ success: boolean; error?: string }> {
  if (!newPass || newPass.length < 6) {
    return { success: false, error: "A nova senha deve conter no mínimo 6 caracteres." };
  }

  const email = currentUser?.email;
  if (!email) return { success: false, error: "Sessão expirada. Entre novamente." };

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPass,
  });
  if (signInError) return { success: false, error: "A senha atual está incorreta." };

  const { error } = await supabase.auth.updateUser({ password: newPass });
  if (error) return { success: false, error: error.message };

  return { success: true };
}
