// Shared client-facing copy/proof constants for /tcrm, reused across
// TcrmClientHero and the credibility section so nothing is duplicated
// between components. Only real, already-verified figures live here --
// see the source note on PROOF_STATS below.

import type { LucideIcon } from "lucide-react";
import { ShieldCheck, Lock, CheckCircle2, Images, Eye, Users, Heart } from "lucide-react";

export const TRUST_BAR = ["White-label available", "TCRM retains the client", "Brand-safe creative"];
export const TRUST_ICONS: LucideIcon[] = [ShieldCheck, Lock, CheckCircle2];

// Real, already-approved aggregate results reused verbatim from the same
// figures shown elsewhere on this project's hospitality pages. Nothing
// here is TCRM-specific projection; it demonstrates Archer Design's
// existing, verifiable body of hospitality work.
export const PROOF_STATS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "2.7K+", label: "Creative pieces delivered", icon: Images },
  { value: "18.6M+", label: "Impressions delivered", icon: Eye },
  { value: "4.9M+", label: "People reached", icon: Users },
  { value: "612K+", label: "Engagements generated", icon: Heart },
];
export const PROOF_DISCLAIMER =
  "Tracked across supported hospitality campaigns. Shown to demonstrate the body of work, not to guarantee a future result.";

// Real, already-approved language reused verbatim from
// app/social-media-work/page.tsx (read-only reference, not edited here).
// Proof of Archer Design's own execution quality on an existing, unrelated
// client relationship -- framed accordingly, not as a TCRM endorsement.
export const CONFIDENCE_QUOTE =
  "During Archer Design's support, Hotel Indigo Pittsburgh University-Oakland reported becoming the top-performing Hotel Indigo on the East Coast.";
export const CONFIDENCE_QUALIFICATION =
  "Performance statement reflects reporting shared by the property during the engagement and should not be interpreted as an independently audited brand-wide claim.";
