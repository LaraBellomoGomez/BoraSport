import type { Metadata } from "next";
import { Jost, Space_Grotesk } from "next/font/google";
import AddedToCartModal from "@/components/AddedToCartModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";
import { FavoritesProvider } from "@/lib/FavoritesContext";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Bora Sports — Indumentaria de Ciclismo",
  description:
    "Indumentaria técnica de ciclismo, diseñada para quienes pedalean con actitud. Colección Verano 2026 ya disponible.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${jost.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              {children}
              <WhatsAppButton />
              <AddedToCartModal />
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
