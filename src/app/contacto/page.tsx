import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { EMAIL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contacto — Bora Sports",
};

export default function ContactoPage() {
  return (
    <>
      <Header />

      <section className="grid w-full grid-cols-1 gap-12 px-5 py-16 md:grid-cols-[1fr_auto_1fr] md:items-start md:gap-8 md:px-10 md:py-24">
        <div>
          <h1 className="mb-8 text-3xl leading-[1.1] font-extrabold tracking-tight text-bora-text-dark md:text-[38px]">
            Contacto
          </h1>
          <div className="flex flex-col gap-3 text-base text-bora-text-dark">
            <span>011 3899 0252</span>
            <span>{EMAIL}</span>
            <span>Ubicación: Próximamente</span>
          </div>
        </div>

        <div className="w-full md:w-[543px]">
          <ContactForm />
        </div>

        <div className="hidden md:block" />
      </section>

      <Footer />
    </>
  );
}
