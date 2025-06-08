"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes.constants";
import { Clock, House, Music, User } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: ROUTES.HOME, icon: House, label: "Inicio" },
    { href: ROUTES.SCHEDULES, icon: Clock, label: "Horarios" },
    { href: ROUTES.SETLISTS, icon: Music, label: "Setlists" },
    { href: ROUTES.MY_PROFILE, icon: User, label: "Perfil" },
  ];

  return (
    <section className="bg-card fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between px-8 py-4 shadow-md">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-2"
          >
            <Icon
              className={`h-6 w-6 transition-colors ${
                isActive ? "text-chart-3" : "text-muted-foreground"
              }`}
            />
            <span
              className={`text-sm transition-colors ${
                isActive ? "text-chart-3 font-medium" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </section>
  );
}
