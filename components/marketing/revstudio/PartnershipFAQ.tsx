export type FaqItem = { q: string; a: string };

/** Accordion FAQ block — same <details>/<summary> pattern used on the
 *  Archer Studio homepage (app/page.tsx), restyled for the revstudio theme. */
export function PartnershipFAQ({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-[var(--rv-line)] border-y border-[var(--rv-line)]">
      {items.map((f, i) => (
        <details key={f.q} open={i === 0} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-[18px] text-[var(--rv-ink)] [&::-webkit-details-marker]:hidden">
            {f.q}
            <span aria-hidden="true" className="shrink-0 text-2xl text-[var(--rv-gold)] transition group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--rv-ink-soft)]">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
