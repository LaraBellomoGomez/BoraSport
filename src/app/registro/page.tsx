"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { assetPath } from "@/lib/basePath";

export default function RegistroPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${assetPath("/")}`,
      },
    });
    setLoading(false);

    if (error) {
      setError(
        error.message === "User already registered"
          ? "Ese email ya tiene una cuenta. Probá iniciar sesión."
          : error.message
      );
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <>
        <Header />
        <section className="mx-auto max-w-[420px] px-5 py-16 text-center md:py-24">
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-bora-text-dark">
            ¡Listo!
          </h1>
          <p className="mb-6 text-bora-text-body">
            Te enviamos un email a <strong>{email}</strong> para confirmar tu cuenta.
            Revisá tu bandeja de entrada (y spam) y después volvé a{" "}
            <Link href="/login" className="font-semibold text-bora-bronze hover:underline">
              iniciar sesión
            </Link>
            .
          </p>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="mx-auto max-w-[420px] px-5 py-16 md:py-24">
        <h1 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-bora-text-dark">
          Creá tu cuenta
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
          <label className="flex flex-col gap-1.5 text-sm font-medium text-bora-text-dark">
            Confirmar contraseña
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-bora-bronze"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-bora-dark px-6 py-3.5 text-[13px] font-bold tracking-wider text-white uppercase disabled:opacity-60"
          >
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-bora-text-body">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="font-semibold text-bora-bronze hover:underline">
            Ingresá
          </Link>
        </p>
      </section>
      <Footer />
    </>
  );
}
