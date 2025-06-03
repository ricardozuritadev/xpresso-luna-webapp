"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { ROUTES } from "@/constants/routes.constants";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export default function SocialAuthForm() {
  async function handleGoogleSignIn(provider = "google") {
    try {
      await signIn(provider, {
        callbackUrl: ROUTES.HOME,
      });
    } catch (error) {
      console.error("Error during Google sign-in:", error);

      toast("Event has been created.");
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Button
        className="w-full"
        variant="secondary"
        size="lg"
        onClick={() => handleGoogleSignIn()}
      >
        <span>Entrar con Google</span>
        <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
      </Button>
    </div>
  );
}
