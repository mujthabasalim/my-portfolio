import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          // IMPORTANT: Do not await inside onAuthStateChange to prevent deadlock
          supabase.rpc("has_role", {
            _user_id: session.user.id,
            _role: "admin",
          }).then(({ data, error }) => {
            if (error) console.error("Error checking role:", error);
            setIsAdmin(!!data);
            setLoading(false);
          });
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) console.error("Error getting session:", error);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.rpc("has_role", {
          _user_id: session.user.id,
          _role: "admin",
        }).then(({ data, error }) => {
          if (error) console.error("Error checking role:", error);
          setIsAdmin(!!data);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string) => {
    return supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };

  return { user, session, isAdmin, loading, signIn, signUp, signOut };
}
