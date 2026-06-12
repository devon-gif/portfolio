// ─────────────────────────────────────────────────────────────────────────────
// Agreement generator — MSA + Statement of Work model. Pure functions, no I/O.
// IMPORTANT: AI-generated templates. Must be reviewed by an attorney before
// client use (the UI repeats this warning).
// ─────────────────────────────────────────────────────────────────────────────

export const AGREEMENT_TYPES = [
  { key: "pilot", label: "Pilot SOW (30/60/90-day)" },
  { key: "6_month", label: "6-Month Retainer SOW" },
  { key: "12_month", label: "12-Month Retainer SOW" },
  { key: "custom", label: "Custom (start from pilot SOW)" },
  { key: "renewal", label: "Renewal / Expansion Addendum" },
  { key: "referral_partner", label: "Referral Partner Agreement" },
] as const;

export interface AgreementInputs {
  clientLegalName: string;
  contactName: string;
  contactTitle: string;
  billingEmail: string;
  companyAddress: string;
  packageName: string;
  agreementType: string; // pilot | 6_month | 12_month | custom | renewal | referral_partner
  propertyCount: string;
  propertyNames: string;
  servicesIncluded: string;
  monthlyFee: string;
  setupFee: string;
  startDate: string;
  termLength: string; // e.g. "30 days", "6 months"
  paymentTerms: string;
  revisionTerms: string;
  approvalContact: string;
  latePaymentTerms: string;
  cancellationTerms: string;
  publicityPermission: boolean;
  specialNotes: string;
}

export const AGREEMENT_DEFAULTS: Partial<AgreementInputs> = {
  paymentTerms: "First month due upon signing, before work begins. Subsequent months billed monthly in advance via Stripe.",
  revisionTerms: "One (1) round of revisions per asset is included. Additional revision rounds may be billed at an agreed rate or addressed in the monthly plan.",
  latePaymentTerms: "Invoices unpaid 10 days after the due date may pause deliverable production until resolved. A late fee of 1.5% per month may apply to overdue balances.",
  cancellationTerms: "Either party may terminate for material breach with 15 days written notice and opportunity to cure. Otherwise, cancellation takes effect at the end of the then-current term.",
};

const SERVICE_FALLBACK =
  "monthly creative plan; social graphics; short-form motion; F&B/event promos; meeting/wedding/seasonal campaign visuals; photo polishing; new branded creative; captions";

const today = () => new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

function signatureBlock(i: AgreementInputs): string {
  return `SIGNATURES

Agreed and accepted:

ARCHER DESIGN
By: ____________________________
Name: Devon Archer
Title: Founder
Date: __________________________

${(i.clientLegalName || "[CLIENT LEGAL NAME]").toUpperCase()}
By: ____________________________
Name: ${i.contactName || "[Name]"}
Title: ${i.contactTitle || "[Title]"}
Date: __________________________`;
}

// ── Master Services Agreement ────────────────────────────────────────────────
export function generateMSA(i: AgreementInputs): string {
  const client = i.clientLegalName || "[CLIENT LEGAL NAME]";
  return `MASTER SERVICES AGREEMENT

This Master Services Agreement ("Agreement") is entered into as of ${i.startDate || today()} between Archer Design ("Provider"), and ${client}, with offices at ${i.companyAddress || "[Company address]"} ("Client"). Billing contact: ${i.billingEmail || "[Billing email]"}.

1. SERVICES. Provider will perform creative services described in one or more Statements of Work ("SOW") executed under this Agreement. Each SOW becomes part of this Agreement upon signature. In any conflict, the SOW controls for its scope.

2. TERM. This Agreement begins on the date above and continues until terminated as provided here or in an active SOW. Termination of this Agreement does not terminate active SOWs unless stated.

3. FEES & PAYMENT. Fees are stated in each SOW. ${i.paymentTerms || AGREEMENT_DEFAULTS.paymentTerms} ${i.latePaymentTerms || AGREEMENT_DEFAULTS.latePaymentTerms}

4. CLIENT RESPONSIBILITIES. Client will provide timely access to brand assets, property photography, calendars, approvals, and a designated approval contact (${i.approvalContact || "[Approval contact]"}). Provider's delivery timelines depend on Client's timely cooperation.

5. APPROVALS & REVISIONS. Deliverables are submitted for Client review. ${i.revisionTerms || AGREEMENT_DEFAULTS.revisionTerms} Deliverables not rejected in writing within ten (10) business days are deemed accepted.

6. INTELLECTUAL PROPERTY. Upon full payment, Client owns final approved deliverables. Provider retains ownership of pre-existing materials, working files, processes, and templates, and grants Client a license to use deliverables as intended. Client warrants it has rights to all materials it supplies.

7. PORTFOLIO USE. ${i.publicityPermission
    ? "Client grants Provider permission to display final deliverables and identify Client by name in Provider's portfolio and marketing."
    : "Provider will not display Client deliverables or identify Client publicly without prior written consent."}

8. CONFIDENTIALITY. Each party will protect the other's non-public business information with reasonable care and use it only to perform under this Agreement.

9. NO PERFORMANCE GUARANTEE. Provider does not guarantee specific impressions, engagement, bookings, revenue, search rankings, or any platform-dependent outcome. Social platforms and search engines change without notice; results vary.

10. INDEPENDENT CONTRACTOR. Provider is an independent contractor. Nothing here creates employment, partnership, or agency.

11. LIMITATION OF LIABILITY. Neither party is liable for indirect, incidental, or consequential damages. Each party's total liability under this Agreement is capped at the fees paid by Client in the three (3) months preceding the claim.

12. TERMINATION. ${i.cancellationTerms || AGREEMENT_DEFAULTS.cancellationTerms} Upon termination, Client pays for all work performed through the effective date.

13. GENERAL. This Agreement is governed by the laws of the Commonwealth of Pennsylvania. It is the entire agreement regarding its subject and may be amended only in writing signed by both parties.

${i.specialNotes ? `14. SPECIAL TERMS. ${i.specialNotes}\n\n` : ""}${signatureBlock(i)}`;
}

// ── SOW bodies ───────────────────────────────────────────────────────────────
function sowHeader(i: AgreementInputs, sowName: string): string {
  return `${sowName.toUpperCase()}
Statement of Work under the Master Services Agreement between Archer Design and ${i.clientLegalName || "[CLIENT LEGAL NAME]"}
Effective date: ${i.startDate || "[Start date]"} · Package: ${i.packageName || "[Package]"}

PROPERTIES IN SCOPE (${i.propertyCount || "[N]"}): ${i.propertyNames || "[Property names]"}

SERVICES INCLUDED: ${i.servicesIncluded || SERVICE_FALLBACK}.`;
}

function sowMoney(i: AgreementInputs): string {
  return `FEES: $${i.monthlyFee || "[monthly fee]"}/month${i.setupFee ? ` plus a one-time setup fee of $${i.setupFee}` : ""}. ${i.paymentTerms || AGREEMENT_DEFAULTS.paymentTerms}`;
}

function sowCommon(i: AgreementInputs): string {
  return `APPROVAL WORKFLOW: Provider delivers finished, labeled, approval-ready assets to ${i.approvalContact || "[Approval contact]"}. ${i.revisionTerms || AGREEMENT_DEFAULTS.revisionTerms}

CLIENT RESPONSIBILITIES: brand files and guidelines; access to existing photo/video assets per property; event, F&B, and seasonal priorities; timely review and approvals; one approval contact.

NO PERFORMANCE GUARANTEE: Provider does not guarantee specific impressions, engagement, bookings, revenue, or platform performance.`;
}

export function generatePilotSOW(i: AgreementInputs): string {
  return `${sowHeader(i, `Pilot Statement of Work — ${i.termLength || "30-Day"} Creative Pilot`)}

TERM: ${i.termLength || "30 days"} from the effective date.

SCOPE: A focused creative pilot across the properties above (3–5 recommended). Each property receives a monthly creative plan and a steady cadence of finished assets: social graphics, short-form motion support, F&B/event promos, meeting/wedding/seasonal campaign visuals, photo polishing, and new branded creative${/seo/i.test(i.servicesIncluded) ? ", plus local SEO support as listed above" : ""}.

${sowMoney(i)} Payment for the pilot is due before work begins.

${sowCommon(i)}

PILOT REVIEW & EXPANSION: At the end of the pilot term, the parties will review output, workflow, and results, and may expand to additional properties or convert to a 6- or 12-month SOW. Neither party is obligated to expand.

${i.specialNotes ? `SPECIAL NOTES: ${i.specialNotes}\n\n` : ""}${signatureBlock(i)}`;
}

export function generateSixMonthSOW(i: AgreementInputs): string {
  return `${sowHeader(i, "6-Month Retainer Statement of Work")}

TERM: Six (6) months minimum from the effective date, billed monthly in advance.

SCOPE & DELIVERABLES: Each property receives a monthly creative plan and a monthly deliverable range confirmed at kickoff based on property mix (typically a coordinated set of graphics, motion pieces, promos, and campaign visuals per property).

${sowMoney(i)}

${sowCommon(i)}

RENEWAL: The parties will discuss renewal or expansion in month five (5).

CANCELLATION: This SOW may not be canceled before the end of the initial 6-month term except for material breach or nonpayment. After the initial term it continues month-to-month unless either party gives 30 days notice.

EXPANSION: Additional properties may be added by written addendum at agreed per-property pricing.

${i.specialNotes ? `SPECIAL NOTES: ${i.specialNotes}\n\n` : ""}${signatureBlock(i)}`;
}

export function generateTwelveMonthSOW(i: AgreementInputs): string {
  return `${sowHeader(i, "12-Month Retainer Statement of Work")}

TERM: Twelve (12) months from the effective date.

PAYMENT: ${sowMoney(i)} Client may elect annual prepayment${i.specialNotes && /prepay|discount/i.test(i.specialNotes) ? ` (${i.specialNotes})` : " at an agreed discount [confirm % if offered]"}.

SCOPE & DELIVERABLES: Each property receives a monthly creative plan and a monthly deliverable range confirmed at kickoff. The engagement includes portfolio-level brand consistency support across all in-scope properties.

QUARTERLY REVIEWS: Provider and Client will hold quarterly strategy reviews covering output, upcoming seasons/campaigns, and priorities.

${sowCommon(i)}

EXPANSION: Additional properties may be added by written addendum at agreed per-property pricing.

RENEWAL: The parties will begin renewal/expansion discussion sixty (60) days before the end of the term.

${i.specialNotes ? `SPECIAL NOTES: ${i.specialNotes}\n\n` : ""}${signatureBlock(i)}`;
}

export function generateRenewalAddendum(i: AgreementInputs): string {
  return `RENEWAL / EXPANSION ADDENDUM

This Addendum modifies the Statement of Work between Archer Design and ${i.clientLegalName || "[CLIENT LEGAL NAME]"} dated [original SOW date].

1. RENEWED/NEW TERM: ${i.termLength || "[term]"} beginning ${i.startDate || "[start date]"}.
2. PROPERTIES IN SCOPE (${i.propertyCount || "[N]"}): ${i.propertyNames || "[updated property list]"}.
3. UPDATED FEES: $${i.monthlyFee || "[monthly fee]"}/month${i.setupFee ? ` plus one-time onboarding fee of $${i.setupFee} for newly added properties` : ""}.
4. SERVICES: ${i.servicesIncluded || SERVICE_FALLBACK}.
5. ALL OTHER TERMS of the Master Services Agreement and original SOW remain in effect.
${i.specialNotes ? `6. SPECIAL NOTES: ${i.specialNotes}\n` : ""}
${signatureBlock(i)}`;
}

export function generateReferralPartnerAgreement(i: AgreementInputs): string {
  return `REFERRAL PARTNER AGREEMENT

Between Archer Design ("Provider") and ${i.clientLegalName || i.contactName || "[PARTNER NAME]"} ("Partner"), effective ${i.startDate || today()}.

1. PURPOSE. Partner may introduce Provider to hospitality decision-makers. Provider provides all creative services and client support; Partner's only role is the introduction.

2. QUALIFIED INTRODUCTION. A warm, named introduction to a property/company decision-maker that Provider did not already have an active conversation with. The first genuine introduction to a given company receives credit.

3. COMMISSION. If a Qualified Introduction becomes a paying client, Provider pays Partner [confirm %]% of net fees actually received from that client, for the life of that client's contract including renewals attributable to the original introduction.

4. PAYMENT. Commissions are paid [monthly/quarterly] following Provider's receipt of client payment. Provider will provide a simple statement with each payment.

5. NO AUTHORITY. Partner may not negotiate terms, make commitments, or bind Provider. Partner will not make performance claims beyond Provider's published materials.

6. TERM & EXIT. Either party may stop making or accepting new introductions at any time with notice. Commissions on existing clients continue per Section 3.

7. INDEPENDENT PARTIES. Nothing here creates employment, agency, or partnership.

${i.specialNotes ? `8. SPECIAL NOTES: ${i.specialNotes}\n\n` : ""}${signatureBlock(i)}`;
}

export function generateAgreementBundle(i: AgreementInputs): { name: string; body: string }[] {
  const out: { name: string; body: string }[] = [];
  if (i.agreementType === "referral_partner") {
    out.push({ name: "Referral Partner Agreement", body: generateReferralPartnerAgreement(i) });
    return out;
  }
  if (i.agreementType === "renewal") {
    out.push({ name: "Renewal / Expansion Addendum", body: generateRenewalAddendum(i) });
    return out;
  }
  out.push({ name: "Master Services Agreement", body: generateMSA(i) });
  if (i.agreementType === "6_month") out.push({ name: "6-Month Retainer SOW", body: generateSixMonthSOW(i) });
  else if (i.agreementType === "12_month") out.push({ name: "12-Month Retainer SOW", body: generateTwelveMonthSOW(i) });
  else out.push({ name: `Pilot SOW (${i.termLength || "30-day"})`, body: generatePilotSOW(i) });
  return out;
}
