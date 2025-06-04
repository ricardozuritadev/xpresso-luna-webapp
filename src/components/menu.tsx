"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { ROUTES } from "@/constants/routes.constants";

export default function Menu() {
  return (
    <div>
      <Button
        className="w-full"
        variant="secondary"
        size="lg"
        onClick={() => signOut({ callbackUrl: ROUTES.SIGN_IN })}
      >
        Cerrar sesión
      </Button>
    </div>
  );
}
