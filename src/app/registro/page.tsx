"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { assetPath } from "@/lib/basePath";

export default function RegistroPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        data: { full_name: name.trim() },
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
            <Link href="/login" className="font-bold text-bora-text-dark hover:underline">
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
            Nombre
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-bora-bronze"
            />
          </label>
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-neutral-300 px-4 py-3.5 pr-11 text-2xl font-bold tracking-wider outline-none focus:border-bora-bronze"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-500 hover:text-bora-text-dark"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-bora-text-dark">
            Confirmar contraseña
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-neutral-300 px-4 py-3.5 pr-11 text-2xl font-bold tracking-wider outline-none focus:border-bora-bronze"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-500 hover:text-bora-text-dark"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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
          <Link href="/login" className="font-bold text-bora-text-dark hover:underline">
            Ingresá
          </Link>
        </p>
      </section>
      <Footer />
    </>
  );
}
