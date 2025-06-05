"use client";

import Navigation from "@/components/navigation";
import { useRedirectIfNotLoggedIn } from "@/hooks/use-redirect-if-not-logged-in";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  useRedirectIfNotLoggedIn();

  return (
    <main>
      {children}
      <Navigation />
    </main>
  );
}
