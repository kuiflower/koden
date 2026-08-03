"use client";

import { useState } from "react";

export function ProductGallery({
  images,
  alt,
  brandFallback = "KODEN",
}: {
  images: string[];
  alt: string;
  brandFallback?: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] || images[0] || "";

  return (
    <div>
      <div className="aspect-[4/3] border border-line bg-panel">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center font-brand text-3xl text-steel/30">
            {brandFallback}
          </div>
        )}
      </div>
      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`aspect-square overflow-hidden border ${
                index === active ? "border-copper" : "border-line"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
