"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/contact";

export default function WhatsAppButton() {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactános por WhatsApp"
      className="fixed right-6 bottom-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-lg"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <MessageCircle size={26} color="#fff" fill="#fff" strokeWidth={0} />
    </motion.a>
  );
}
