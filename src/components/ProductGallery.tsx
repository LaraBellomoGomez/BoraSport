"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/basePath";

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollTo(index: number) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
    setActive(index);
  }

  function handleScroll() {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <div>
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="hide-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto rounded bg-bora-card-bg"
      >
        {images.map((src, i) => (
          <div key={src} className="relative w-full flex-none snap-start pt-[125%]">
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

          <div className="mt-3 hidden grid-cols-5 gap-2 md:grid">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Ver foto ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={`relative overflow-hidden rounded pt-[125%] transition-opacity duration-150 ease-out-strong ${
                  active === i ? "opacity-100 ring-2 ring-bora-dark" : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={assetPath(src)} alt="" fill sizes="120px" className="object-cover" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
