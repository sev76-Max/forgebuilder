"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type AuthStatus = "checking" | "authenticated" | "anonymous";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("checking");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setStatus(session?.user ? "authenticated" : "anonymous");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setStatus(session?.user ? "authenticated" : "anonymous");
      if (event === "SIGNED_IN") {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email?: string) => {
    const target = email ?? window.prompt("Entrez votre email :");
    if (!target) return false;
    const { error } = await supabase.auth.signInWithOtp({
      email: target,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) {
      alert("Erreur : " + error.message);
      return false;
    }
    alert("Lien envoyé ! Vérifiez votre boîte mail.");
    return true;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return {
    user,
    status,
    checkingAuth: status === "checking",
    isAuthenticated: status === "authenticated",
    login,
    logout,
  };
}

export type UseAuthReturn = ReturnType<typeof useAuth>;