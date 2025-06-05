"use client";

import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Button } from "../ui/button";
import { toast } from "sonner";

export default function SocialAuthForm() {
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}`,
      },
    });

    if (error) {
      console.error("Error during Google sign-in:", error);
      toast.error("Error al iniciar sesión con Google.");
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Button
        className="w-full"
        variant="secondary"
        size="lg"
        onClick={handleGoogleSignIn}
      >
        <span>Entrar con Google</span>
        <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
      </Button>
    </div>
  );
}
