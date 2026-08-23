import { ArrowRight } from "lucide-react";

type DnsReciprocityDiagramProps = {
  dnsLabel: string;
  dnsItems: readonly string[];
  archerLabel: string;
  archerItems: readonly string[];
  centerLabel?: string;
};

/**
 * Two-way "DNS → Archer" / "Archer → DNS" diagram, each side illustrated
 * with concrete potential situations rather than abstract language — making
 * explicit that no referral flow currently exists in either direction, and
 * that referral income is only one possible outcome of the relationship.
 *
 * Content now lives inline in the "Two-way referrals" panel of THREE_WAYS
 * (dns-content.ts) rather than a standalone RECIP_* export, so this
 * component takes its copy as props instead of importing it directly.
 */
export function DnsReciprocityDiagram({ dnsLabel, dnsItems, archerLabel, archerItems, centerLabel }: DnsReciprocityDiagramProps) {
  return (
    <div className="dns-recip">
      <div className="dns-recip-side">
        <span className="dns-recip-side-label">{dnsLabel}</span>
        <ul className="dns-recip-list">
          {dnsItems.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="dns-recip-center">
        <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" className="dns-recip-arrow dns-recip-arrow--right" />
        {centerLabel && <span className="dns-recip-center-label">{centerLabel}</span>}
        <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" className="dns-recip-arrow dns-recip-arrow--left" />
      </div>

      <div className="dns-recip-side dns-recip-side--archer">
        <span className="dns-recip-side-label">{archerLabel}</span>
        <ul className="dns-recip-list">
          {archerItems.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
