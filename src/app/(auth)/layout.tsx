import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="bg-card min-w-full space-y-8 rounded-[10px] border px-4 py-10 shadow-md sm:min-w-[520px] sm:px-8">
        <h1 className="text-center text-2xl">Xpresso Luna</h1>

        {children}
      </section>
    </main>
  );
}
