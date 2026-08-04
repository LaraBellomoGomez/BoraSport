"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const { data, error: fnError } = await supabase.functions.invoke("send-contact-email", {
      body: { name, email, phone, message },
    });

    if (fnError || data?.error) {
      setStatus("error");
      setError(data?.error ?? "No se pudo enviar el mensaje. Probá de nuevo.");
      return;
    }

    setStatus("done");
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  }

  if (status === "done") {
    return (
      <p className="rounded border border-bora-border bg-bora-card-bg px-5 py-8 text-center text-sm font-semibold text-bora-text-dark">
        ¡Gracias! Recibimos tu mensaje y te vamos a responder a la brevedad.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5 text-xs font-bold tracking-wider text-bora-text-dark uppercase">
        Nombre
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          className="rounded border border-bora-border px-4 py-3 text-sm font-normal normal-case outline-none focus:border-bora-dark"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-xs font-bold tracking-wider text-bora-text-dark uppercase">
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="rounded border border-bora-border px-4 py-3 text-sm font-normal normal-case outline-none focus:border-bora-dark"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-xs font-bold tracking-wider text-bora-text-dark uppercase">
        Teléfono
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Tu teléfono"
          className="rounded border border-bora-border px-4 py-3 text-sm font-normal normal-case outline-none focus:border-bora-dark"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-xs font-bold tracking-wider text-bora-text-dark uppercase">
        Mensaje
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribí tu mensaje"
          className="resize-y rounded border border-bora-border px-4 py-3 text-sm font-normal normal-case outline-none focus:border-bora-dark"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-2 w-full rounded bg-bora-dark py-4 text-[13px] font-bold tracking-wider text-white uppercase disabled:opacity-60 md:w-auto md:px-10"
      >
        {status === "loading" ? "Enviando…" : "Enviar"}
      </button>
    </form>
  );
}
