// Shown in production (a real deployment, never local `next dev`) whenever
// Supabase isn't configured for the review portal. The portal must never
// silently fall back to the local-only localStorage/IndexedDB demo once
// it's actually deployed — that fallback exists only so /review, /emma, and
// /review/admin keep rendering during local development with no Supabase
// project connected. This intentionally has no client-side interactivity
// and no hooks, so it can be rendered from either a Server Component
// (app/review/page.tsx) or a Client Component (EmmaPortalGate,
// ReviewAdminGate) without a "use client" directive.
const PAGE_BLOOM = {
  background:
    "radial-gradient(circle at 76% 6%, rgba(169,129,47,0.14), transparent 34%), " +
    "radial-gradient(circle at 10% 90%, rgba(216,189,184,0.16), transparent 40%), " +
    "#fdfbf6",
};

const GLASS = {
  background: "rgba(255, 252, 247, 0.68)",
  backdropFilter: "blur(28px) saturate(135%)",
  WebkitBackdropFilter: "blur(28px) saturate(135%)",
  border: "1px solid rgba(255, 255, 255, 0.7)",
  boxShadow: "0 24px 70px rgba(79, 60, 47, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.88)",
};

export function ReviewConfigurationError({ title }: { title?: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6" style={PAGE_BLOOM}>
      <section className="w-full max-w-sm rounded-2xl p-8 text-center" style={GLASS}>
        <h1 className="text-[17px] font-medium text-[#2b241f]">
          {title || "This review portal isn't configured yet"}
        </h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[#6d6155]">
          Supabase isn&apos;t configured in this environment, so no accounts can sign in here yet. This is a
          server configuration issue, not something you can fix from this page — please contact Devon at Archer
          Design.
        </p>
      </section>
    </main>
  );
}
