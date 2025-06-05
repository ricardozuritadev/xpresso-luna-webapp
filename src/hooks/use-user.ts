"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  full_name: string;
  avatar_url: string;
};

export function useUser() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        setUser(null);
        setError(authError?.message || "No user");
        setLoading(false);
        return;
      }

      const { id } = authUser;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (profileError) {
        setUser(null);
        setError(profileError.message);
      } else {
        setUser(profile);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  return { user, loading, error };
}
