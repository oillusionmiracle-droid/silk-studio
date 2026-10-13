"use client";
import { useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
export default function ReferenceFileLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const [error, setError] = useState("");
  if (!href.startsWith("/api/reference-files/"))
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  return (
    <>
      <button
        type="button"
        className={className}
        onClick={async () => {
          // Open immediately from the gesture so mobile popup blockers allow it.
          const tab = window.open("about:blank", "_blank");
          if (tab) tab.opener = null;
          try {
            const {
              data: { session },
            } = await supabase.auth.getSession();
            const response = await fetch(href, {
              headers: {
                Authorization: `Bearer ${session?.access_token || ""}`,
              },
            });
            const data = await response.json();
            if (!response.ok || !data.url)
              throw new Error(data.error || "Download unavailable.");
            if (tab) tab.location.href = data.url;
            else window.location.href = data.url;
            setError("");
          } catch (e) {
            tab?.close();
            setError(e instanceof Error ? e.message : "Download unavailable.");
          }
        }}
      >
        {children}
      </button>
      {error && (
        <span role="alert" className="text-xs text-red-500">
          {error}
        </span>
      )}
    </>
  );
}
