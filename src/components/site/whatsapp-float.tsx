"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { site, waLink } from "@/lib/site";

/** Floating WhatsApp CTA — appears after scrolling a bit. */
export function WhatsappFloat() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const show = visible && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2"
        >
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Konsultasi via WhatsApp ${site.whatsapp.display}`}
            className="group flex items-center gap-2.5 rounded-full bg-[#25D366] py-3 pl-4 pr-5 font-semibold text-white shadow-lg shadow-black/20 transition-transform hover:scale-[1.03] active:scale-95"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="hidden text-sm sm:inline">Konsultasi via WhatsApp</span>
          </a>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Tutup tombol WhatsApp"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
