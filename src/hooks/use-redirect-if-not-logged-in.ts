"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function useRedirectIfNotLoggedIn(redirectTo = "/sign-in") {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace(redirectTo);
      }
    };

    checkUser();
  }, [redirectTo, router]);
}
