// ─────────────────────────────────────────────────────────────────────────────
// Client onboarding — stages, business rules, checklist, messages, intake,
// folder structure. Pure data + functions. Nothing here sends anything.
// ─────────────────────────────────────────────────────────────────────────────

export const STAGES = [
  { key: "proposal_accepted", label: "Proposal Accepted" },
  { key: "agreement_sent", label: "Agreement Sent" },
  { key: "agreement_signed", label: "Agreement Signed" },
  { key: "payment_link_sent", label: "Payment Link Sent" },
  { key: "first_payment_completed", label: "First Payment Completed" },
  { key: "intake_sent", label: "Intake Sent" },
  { key: "intake_completed", label: "Intake Completed" },
  { key: "kickoff_scheduled", label: "Kickoff Scheduled" },
  { key: "active_client", label: "Active Client" },
  { key: "renewal_expansion", label: "Renewal / Expansion" },
] as const;

export const BILLING_STATUSES = [
  "not_started", "payment_link_sent", "subscription_active", "invoice_sent",
  "paid", "past_due", "failed", "canceled", "manual",
] as const;

export const PACKAGES = [
  { name: "Single Property Creative System", fee: 2500, priceKey: "stripe_price_single_property" },
  { name: "3-Property Creative System", fee: 4500, priceKey: "stripe_price_three_property" },
  { name: "3-Property Creative + Local SEO", fee: 7500, priceKey: "stripe_price_three_property_seo" },
  { name: "5-Property Portfolio Pilot", fee: 10000, priceKey: "stripe_price_five_property_pilot" },
  { name: "5-Property Creative + SEO Pilot", fee: 12500, priceKey: "stripe_price_five_property_seo" },
  { name: "Hospitality Group Partnership (custom)", fee: 15000, priceKey: "stripe_price_custom_group" },
] as const;

export const KICKOFF_CHECKLIST = [
  "Agreement signed",
  "Stripe payment active",
  "Onboarding intake completed",
  "Kickoff scheduled",
  "Asset folder created",
  "Brand guidelines received",
  "Properties selected",
  "Approval contacts confirmed",
  "First month priorities confirmed",
  "First content calendar drafted",
  "Delivery dates confirmed",
  "Reporting expectations confirmed",
] as const;

export const FOLDER_STRUCTURE = (client: string) => `${client || "[Client Name]"}/
├── 00 Agreement & Billing
├── 01 Brand Assets
├── 02 Property Photos
├── 03 F&B / Menus
├── 04 Events / Weddings / Meetings
├── 05 Monthly Creative Plans
├── 06 Drafts for Review
├── 07 Approved Final Assets
└── 08 Reports / Recaps`;

// ── Business rules: what to do next ─────────────────────────────────────────
export interface RecordLike {
  stage: string;
  billing_status: string;
  agreement_signed_at: string | null;
  first_payment_completed_at: string | null;
  intake_completed_at: string | null;
  kickoff_scheduled_at: string | null;
  manual_override: boolean;
  agreement_type: string;
  start_date: string | null;
  term_months: number | null;
}

export function nextAction(r: RecordLike): { text: string; warn: boolean } {
  if (r.billing_status === "past_due" || r.billing_status === "failed")
    return { text: "Payment problem — follow up on billing before any new work ships.", warn: true };
  if (!r.agreement_signed_at && r.stage !== "proposal_accepted" && r.stage !== "agreement_sent")
    return { text: "Agreement not signed — send/chase the agreement first.", warn: true };

  switch (r.stage) {
    case "proposal_accepted": return { text: "Generate and send the agreement (MSA + SOW).", warn: false };
    case "agreement_sent": return { text: "Chase signature; mark signed when it comes back.", warn: false };
    case "agreement_signed":
      return { text: "Send the Stripe payment link. No work begins before first payment (unless manually overridden).", warn: false };
    case "payment_link_sent":
      return r.agreement_signed_at && !r.first_payment_completed_at
        ? { text: "Agreement signed but payment not completed — nudge billing contact.", warn: true }
        : { text: "Waiting on first payment.", warn: false };
    case "first_payment_completed": return { text: "Send the onboarding intake.", warn: false };
    case "intake_sent": return { text: "Remind the client to complete intake.", warn: false };
    case "intake_completed": return { text: "Schedule the kickoff call.", warn: false };
    case "kickoff_scheduled": return { text: "Run kickoff; complete the checklist; mark Active.", warn: false };
    case "active_client": {
      const renewal = renewalPrompt(r);
      return renewal ? { text: renewal, warn: true } : { text: "Deliver. Monthly plan → produce → approve → recap.", warn: false };
    }
    case "renewal_expansion": return { text: "Send the renewal/expansion addendum (Agreement Generator).", warn: false };
    default: return { text: "Review record.", warn: false };
  }
}

export function renewalPrompt(r: RecordLike): string | null {
  if (!r.start_date || !r.term_months) return null;
  const [y, m, d] = r.start_date.split("-").map(Number);
  const end = new Date(y, m - 1 + r.term_months, d);
  const daysLeft = Math.ceil((end.getTime() - Date.now()) / 86400000);
  if (r.agreement_type === "pilot" && daysLeft <= 14 && daysLeft > -30)
    return `Pilot ends in ${daysLeft} day(s) — prepare the 6-month expansion proposal.`;
  if (r.agreement_type === "6_month" && daysLeft <= 30 && daysLeft > -30)
    return `Term ends in ${daysLeft} day(s) — start the renewal conversation.`;
  if (r.agreement_type === "12_month" && daysLeft <= 60 && daysLeft > -30)
    return `Term ends in ${daysLeft} day(s) — start the annual renewal/expansion conversation.`;
  return null;
}

export function canActivate(r: RecordLike): boolean {
  return r.manual_override || (!!r.agreement_signed_at && !!r.first_payment_completed_at);
}

// ── Onboarding messages (manual copy/paste) ──────────────────────────────────
export const ONBOARDING_MESSAGES: { key: string; label: string; body: string }[] = [
  {
    key: "agreement_sent",
    label: "Agreement sent",
    body: "Hi [First] — the agreement for [Company] is attached/linked: the Master Services Agreement plus the [Pilot/6-month/12-month] Statement of Work covering [properties]. It reflects everything we discussed — [monthly fee]/month, starting [date]. Read it at your pace; happy to walk through any section on a quick call. Once it's signed, I'll send the payment link and we lock your start date.",
  },
  {
    key: "payment_link",
    label: "Payment link sent",
    body: "Hi [First] — signed agreement received, thank you. Here's the secure payment link for the first month: [Stripe link]. Once that's confirmed, you'll get the onboarding intake the same day and we schedule kickoff. You can manage billing, invoices, and payment method anytime through the client portal link I'll include in your welcome note.",
  },
  {
    key: "intake",
    label: "Intake form",
    body: "Hi [First] — next step is the onboarding intake. It's the one document that makes month one fast: properties, brand files, asset folders, approval contacts, and your first-30-days priorities. Here it is: [link or attached]. Fifteen focused minutes now saves us a week of back-and-forth later.",
  },
  {
    key: "intake_reminder",
    label: "Intake reminder",
    body: "Hi [First] — gentle nudge on the onboarding intake. Your start date is held for [date]; the intake is what lets us hit it. If it's easier, send me whatever you have (brand files, photo folders, event calendars) and I'll fill the form from that.",
  },
  {
    key: "payment_received",
    label: "First payment received",
    body: "Hi [First] — payment confirmed, and you're officially on the calendar. Two things coming your way today: the onboarding intake and a proposed kickoff time. From kickoff, first assets land within the first week.",
  },
  {
    key: "kickoff_scheduled",
    label: "Kickoff scheduled",
    body: "Hi [First] — kickoff is set for [date/time]. Agenda (30 min): properties and priorities, brand rules and approval flow, the first month's creative plan, and delivery cadence. Before the call, drop anything useful in the shared folder: [folder link]. Looking forward to it.",
  },
  {
    key: "welcome",
    label: "Welcome (onboarding complete)",
    body: "Hi [First] — welcome aboard. You're set up: agreement signed, billing active, intake complete, kickoff done. Here's how the month runs: creative plan at the start, steady delivery through the month to [approval contact] for review, one revision round per asset, and a recap at the close. Your folder: [link]. Billing portal: [link]. One ask — when something good happens on property (event, dish, season), send a photo. That's tomorrow's content.",
  },
  {
    key: "pilot_review",
    label: "Pilot review / expansion",
    body: "Hi [First] — the pilot wraps on [date], so let's book the review: what shipped, what performed, what the team thought of the workflow. If it earned it, I'll bring the expansion options — same system across more of the portfolio, with per-property pricing that improves at scale. 30 minutes: [Calendly link].",
  },
];

// ── Intake form (copyable content, v1) ───────────────────────────────────────
export const INTAKE_FORM_TEXT = `ARCHER DESIGN — CLIENT ONBOARDING INTAKE

COMPANY
- Company legal name:
- Brand / DBA names:
- Billing email:
- Main contact (name, title, email, phone):
- Approval contact (name, title, email):
- Emergency/backup contact:

PROPERTIES (repeat per property)
- Property name:
- Property URL:
- Property address:
- Brand/flag (if any):
- Property type (hotel / resort / restaurant / spa / venue):
- F&B on property: yes / no
- Events/weddings: yes / no
- Spa: yes / no
- Meeting space: yes / no
- Priority level (1 = highest):

ASSETS (links or attachments)
- Logo files:
- Brand guidelines:
- Photo/video folders:
- Menus:
- Event calendars:
- Seasonal campaign notes:
- Current social links:
- Google Business Profile links:
- Website URLs:
- Past campaign examples:
- Must-use / must-avoid language:

APPROVALS
- Approval owner:
- Backup approver:
- Preferred review method (email / shared folder / other):
- Review turnaround expectation:
- Revision process notes:
- Final approval method:

CREATIVE PRIORITIES (rank or check)
- Rooms · Amenities · F&B · Events · Weddings · Meetings · Spa · Local attractions · Seasonal offers · Recruiting/employer brand · Brand awareness

OPERATIONAL
- Kickoff call date preference:
- Preferred delivery cadence:
- Recurring monthly meeting: yes / no
- Reporting preferences:
- First 30 days priorities:`;
