"use client";

import { useState } from "react";
import type { Announcement } from "@/lib/types";

function Icon({ type }: { type: Announcement["icon"] }) {
  const common = "h-5 w-5 stroke-current";
  if (type === "gift") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <path
          d="M12 8v13M4 12h16M5 8h14v13H5V8Zm3.5-3.5A2.5 2.5 0 0 1 11 7h1V5.5A2.5 2.5 0 1 0 8.5 4.5Zm7 0A2.5 2.5 0 0 0 13 7h-1V5.5A2.5 2.5 0 1 1 15.5 4.5Z"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "doc") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <path
          d="M8 4h7l3 3v13H8V4Zm7 0v3h3M10 11h6M10 15h6"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "calendar") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <path
          d="M7 4v2M17 4v2M4 9h16M6 6h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "info") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <circle cx="12" cy="12" r="9" strokeWidth="1.6" />
        <path d="M12 10v7M12 7.5h.01" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
      <circle cx="12" cy="12" r="9" strokeWidth="1.6" />
      <path d="M12 16v-5M12 8h.01" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function AnnouncementList({
  items,
  emptyText,
}: {
  items: Announcement[];
  emptyText: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (items.length === 0) {
    return <p className="text-sm text-steel">{emptyText}</p>;
  }

  return (
    <div className="border-y border-line">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id} className="border-b border-line last:border-b-0">
            <button
              type="button"
              className="flex w-full items-center gap-3 py-4 text-left transition hover:bg-paper/50 md:gap-4 md:py-5"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : item.id)}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center text-ink">
                <Icon type={item.icon} />
              </span>
              <span className="min-w-0 flex-1 text-sm font-medium text-ink md:text-base">
                {item.title}
              </span>
              <span
                className={`shrink-0 text-steel transition ${open ? "rotate-180" : ""}`}
                aria-hidden
              >
                ⌄
              </span>
            </button>
            {open && item.body ? (
              <div className="pb-5 pl-12 pr-2 text-sm leading-7 text-steel md:pl-14">
                {item.body}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
