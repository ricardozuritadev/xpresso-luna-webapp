import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-10">
            <section className="bg-neutral-900 min-w-full rounded-[10px] border px-4 py-10 shadow-md sm:min-w-[520px] sm:px-8">
                {children}
            </section>
        </main>
    );
}
