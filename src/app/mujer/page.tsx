import type { Metadata } from "next";
import GenderListing from "@/components/GenderListing";

export const metadata: Metadata = {
  title: "Mujer — Bora Sports",
};

export default function MujerPage() {
  return <GenderListing gender="mujer" title="Mujer" />;
}
