"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { isOwnerEmail } from "@/lib/owner";

/**
 * Subtle footer admin link on the public marketing site.
 * Points to /dashboard when the owner is signed in, otherwise /login.
 */
export function AdminLink({ className = "" }: { className?: string }) {
  const [href, setHref] = useState("/login");

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session && isOwnerEmail(data.session.user?.email)) setHref("/dashboard");
      else setHref("/login");
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <a href={href} className={className}>
      Admin
    </a>
  );
}
