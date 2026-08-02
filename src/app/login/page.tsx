"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      const translations: Record<string, string> = {
        "Invalid login credentials": "Email o contraseña incorrectos.",
        "Email not confirmed":
          "Todavía no confirmaste tu email. Revisá tu bandeja de entrada (y spam).",
      };
      setError(translations[error.message] ?? error.message);
      return;
    }
    router.push("/");
  }

  return (
    <>
      <Header />
      <section className="mx-auto max-w-[420px] px-5 py-16 md:py-24">
        <h1 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-bora-text-dark">
          Ingresá
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-bora-text-dark">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-bora-bronze"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-bora-text-dark">
            Contraseña
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-bora-bronze"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-bora-dark px-6 py-3.5 text-[13px] font-bold tracking-wider text-white uppercase disabled:opacity-60"
          >
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-bora-text-body">
          ¿No tenés cuenta?{" "}
          <Link href="/registro" className="font-semibold text-bora-bronze hover:underline">
            Registrate
          </Link>
        </p>
      </section>
      <Footer />
    </>
  );
}
