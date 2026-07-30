import type { Metadata } from "next";
import { Inter } from "next/font/google";
import WhatsAppButton from "@/components/WhatsAppButton";
import { AuthProvider } from "@/lib/AuthContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <AuthProvider>
          {children}
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
