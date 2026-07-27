import type { Metadata } from "next";
import GenderListing from "@/components/GenderListing";

export const metadata: Metadata = {
  title: "Hombre — Bora Sports",
};

export default function HombrePage() {
  return <GenderListing gender="hombre" title="Hombre" />;
}
