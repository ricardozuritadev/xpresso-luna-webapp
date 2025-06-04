import Navigation from "@/components/navigation";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      {children}
      <Navigation />
    </main>
  );
}
