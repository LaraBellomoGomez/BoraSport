"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { formatARS } from "@/lib/format";
import { supabase } from "@/lib/supabase";

interface ShippingForm {
  name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

const EMPTY_SHIPPING: ShippingForm = {
  name: "",
  phone: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
};

const FIELD_LABELS: Record<keyof ShippingForm, string> = {
  name: "Nombre y apellido",
  phone: "Teléfono",
  address: "Dirección (calle y número)",
  city: "Localidad",
  province: "Provincia",
  postalCode: "Código postal",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { lines, rawSubtotal, promoActive, promoDiscount, subtotal, loading: cartLoading } =
    useCart();
  const [shipping, setShipping] = useState<ShippingForm>(EMPTY_SHIPPING);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  function updateField(field: keyof ShippingForm, value: string) {
    setShipping((s) => ({ ...s, [field]: value }));
  }

  async function handlePay() {
    setError(null);

    const missingField = (Object.keys(FIELD_LABELS) as Array<keyof ShippingForm>).find(
      (field) => !shipping[field].trim()
    );
    if (missingField) {
      setError(`Completá el campo "${FIELD_LABELS[missingField]}" para continuar.`);
      return;
    }

    setPaying(true);

    const { data, error: fnError } = await supabase.functions.invoke("create-preference", {
      body: { shipping },
    });

    if (fnError || !data?.init_point) {
      setPaying(false);
      let detail: string | null = null;
      const context = (fnError as { context?: Response })?.context;
      if (context) {
        try {
          const body = await context.clone().json();
          detail = body?.error ?? null;
        } catch {
          // response wasn't JSON — fall through to generic message
        }
      }
      setError(
        detail ?? data?.error ?? "No se pudo iniciar el pago. Probá de nuevo en un momento."
      );
      return;
    }

    window.location.href = data.init_point;
  }

  if (authLoading || !user) return null;

  return (
    <>
      <Header />
      <section className="mx-auto max-w-[600px] px-5 py-16 md:py-24">
        <h1 className="mb-4 text-center text-3xl font-extrabold tracking-tight text-bora-text-dark">
          Finalizar compra
        </h1>

        {cartLoading ? (
          <p className="text-center text-bora-text-body">Cargando…</p>
        ) : lines.length === 0 ? (
          <div className="text-center">
            <p className="mb-8 text-bora-text-body">Tu carrito está vacío.</p>
            <Link
              href="/verano-2026"
              className="inline-block bg-bora-dark px-7 py-3.5 text-[13px] font-bold tracking-wider text-white uppercase"
            >
              Ver colección
            </Link>
          </div>
        ) : (
          <>
            <p
              className={
                promoActive
                  ? "mb-2 text-center text-bora-text-body"
                  : "mb-8 text-center text-bora-text-body"
              }
            >
              {(() => {
                const totalUnits = lines.reduce((sum, l) => sum + l.quantity, 0);
                return `${totalUnits} ${totalUnits === 1 ? "unidad" : "unidades"}`;
              })()}{" "}
              por{" "}
              <strong className="text-bora-text-dark">
                {formatARS(promoActive ? rawSubtotal : subtotal)}
              </strong>
            </p>
            {promoActive && (
              <p className="mb-8 text-center text-sm font-bold text-[#25d366]">
                20% OFF por 3 o más prendas (-{formatARS(promoDiscount)}) — Total:{" "}
                {formatARS(subtotal)}
              </p>
            )}

            <div className="mb-8 rounded border border-bora-border p-5">
              <h2 className="mb-4 text-sm font-bold tracking-wide text-bora-text-dark uppercase">
                Dirección de envío
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-xs font-semibold text-bora-text-body sm:col-span-2">
                  {FIELD_LABELS.name}
                  <input
                    type="text"
                    value={shipping.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="rounded border border-bora-border px-3 py-2 text-sm text-bora-text-dark"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-bora-text-body">
                  {FIELD_LABELS.phone}
                  <input
                    type="tel"
                    value={shipping.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="rounded border border-bora-border px-3 py-2 text-sm text-bora-text-dark"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-bora-text-body">
                  {FIELD_LABELS.postalCode}
                  <input
                    type="text"
                    value={shipping.postalCode}
                    onChange={(e) => updateField("postalCode", e.target.value)}
                    className="rounded border border-bora-border px-3 py-2 text-sm text-bora-text-dark"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-bora-text-body sm:col-span-2">
                  {FIELD_LABELS.address}
                  <input
                    type="text"
                    value={shipping.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className="rounded border border-bora-border px-3 py-2 text-sm text-bora-text-dark"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-bora-text-body">
                  {FIELD_LABELS.city}
                  <input
                    type="text"
                    value={shipping.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="rounded border border-bora-border px-3 py-2 text-sm text-bora-text-dark"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-bora-text-body">
                  {FIELD_LABELS.province}
                  <input
                    type="text"
                    value={shipping.province}
                    onChange={(e) => updateField("province", e.target.value)}
                    className="rounded border border-bora-border px-3 py-2 text-sm text-bora-text-dark"
                  />
                </label>
              </div>
            </div>

            {error && <p className="mb-4 text-center text-sm text-red-600">{error}</p>}

            <button
              type="button"
              onClick={handlePay}
              disabled={paying}
              className="mb-4 block w-full bg-bora-dark py-4 text-[13px] font-bold tracking-wider text-white uppercase disabled:opacity-60"
            >
              {paying ? "Redirigiendo…" : "Pagar con Mercado Pago"}
            </button>

            <div className="text-center">
              <Link
                href="/carrito"
                className="inline-block text-sm text-bora-text-body hover:text-bora-bronze"
              >
                Volver al carrito
              </Link>
            </div>
          </>
        )}
      </section>
      <Footer />
    </>
  );
}
