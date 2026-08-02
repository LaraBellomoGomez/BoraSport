"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);

    const { error } = await supabase.from("newsletter_subscribers").insert({ email });

    if (error) {
      setStatus("error");
      setMessage(
        error.code === "23505"
          ? "Ese email ya está suscripto."
          : "No se pudo suscribir. Probá de nuevo."
      );
      return;
    }
    setStatus("done");
    setEmail("");
  }

  if (status === "done") {
    return (
      <p className="mx-auto max-w-[420px] text-sm font-semibold text-bora-bronze">
        ¡Gracias por suscribirte!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-[420px]">
      <div className="flex overflow-hidden rounded-sm bg-white">
        <input
          type="email"
          required
          placeholder="Tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3.5 text-sm text-neutral-700 outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-bora-bronze px-6 py-3.5 text-[13px] font-bold whitespace-nowrap text-black disabled:opacity-60"
        >
          {status === "loading" ? "Enviando…" : "Enviar →"}
        </button>
      </div>
      {message && <p className="mt-2 text-xs text-red-400">{message}</p>}
    </form>
  );
}
