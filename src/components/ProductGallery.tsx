"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { assetPath } from "@/lib/basePath";

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollTo(index: number) {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(images.length - 1, index));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
    setActive(clamped);
  }

  function handleScroll() {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <div className="md:flex md:h-[540px] md:gap-3">
      {images.length > 1 && (
        <div className="hide-scrollbar order-1 mt-3 flex gap-2 overflow-x-auto md:order-none md:mt-0 md:h-full md:w-20 md:flex-none md:flex-col md:overflow-y-auto">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Ver foto ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={`relative aspect-square w-16 flex-none overflow-hidden rounded transition-opacity duration-150 ease-out-strong md:w-full ${
                active === i ? "opacity-100 ring-2 ring-bora-dark" : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={assetPath(src)} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1 md:h-full">
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="hide-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto rounded bg-bora-card-bg"
        >
          {images.map((src, i) => (
            <div
              key={src}
              className="relative aspect-square w-full flex-none snap-start md:aspect-auto md:h-full"
            >
              <Image
                src={assetPath(src)}
                alt={`${alt} — foto ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={() => scrollTo(active - 1)}
              disabled={active === 0}
              className="absolute top-1/2 left-2.5 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-bora-text-dark shadow transition-[transform,opacity] duration-150 ease-out-strong hover:scale-110 active:scale-90 disabled:opacity-0"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Foto siguiente"
              onClick={() => scrollTo(active + 1)}
              disabled={active === images.length - 1}
              className="absolute top-1/2 right-2.5 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-bora-text-dark shadow transition-[transform,opacity] duration-150 ease-out-strong hover:scale-110 active:scale-90 disabled:opacity-0"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5 md:hidden">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ver foto ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={`h-1.5 rounded-full transition-all duration-200 ease-out-strong ${
                  active === i ? "w-5 bg-bora-dark" : "w-1.5 bg-bora-border"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
