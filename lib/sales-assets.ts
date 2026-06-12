// ─────────────────────────────────────────────────────────────────────────────
// Sales Assets — the copy/paste command center content, versioned in code.
// Used by /sales-assets. Everything is manual copy/paste; nothing sends.
// [brackets] = personalize before sending. Voice: direct, premium, no pitch theater.
// ─────────────────────────────────────────────────────────────────────────────

export interface SalesAsset {
  id: string;
  category: SalesCategory;
  title: string;
  whenToUse: string;
  body: string;
}

export type SalesCategory =
  | "positioning" | "first_messages" | "followups" | "island" | "pilot"
  | "proof" | "objections" | "proposal" | "partner_kit" | "captions";

export const CATEGORY_LABELS: Record<SalesCategory, string> = {
  positioning: "Core Positioning",
  first_messages: "First Messages",
  followups: "Follow-Ups",
  island: "Island-Style Thought Starter",
  pilot: "3–5 Property Pilot",
  proof: "Proof Blocks",
  objections: "Objection Responses",
  proposal: "Proposal Sections",
  partner_kit: "Referral Partner Kit",
  captions: "Before/After Captions",
};

const A = (category: SalesCategory, id: string, title: string, whenToUse: string, body: string): SalesAsset =>
  ({ id, category, title, whenToUse, body });

export const SALES_ASSETS: SalesAsset[] = [
  // ── 1. Core positioning ─────────────────────────────────────────────────────
  A("positioning", "pos-one-line", "One-line pitch", "Bios, intros, anywhere short.",
    "Archer Design makes every property look as strong online as it does in person — premium hospitality creative without adding headcount."),
  A("positioning", "pos-30sec", "30-second pitch", "Calls, voice notes, event intros.",
    "I run Archer Design — a creative system for hospitality groups. Hotels, restaurants, spas, and event-driven properties usually have plenty to promote and not enough creative bandwidth to keep it consistent. I cover that layer: social graphics, short-form motion, F&B and event promos, campaign visuals, photo polishing, new branded creative, optional local SEO. Fixed monthly fee, no hire, no agency retainer. Most groups start with a 3–5 property pilot."),
  A("positioning", "pos-long", "Long website-style pitch", "Email intros, proposals, about sections.",
    "Archer Design gives hotel groups, restaurants, spas, resorts, and hospitality teams ongoing creative support — social graphics, short-form motion, campaign visuals, F&B and event promotions, photo polishing, new branded creative, and optional local SEO — without adding another full-time creative hire or carrying a large agency retainer. Existing property assets are often the fastest starting point, but the system also produces new branded graphics, campaign concepts, and motion when that's what the property needs. The work arrives finished, approval-ready, and consistent — month after month, property after property."),
  A("positioning", "pos-buyer", "Direct buyer positioning", "Talking to DOSMs, marketing directors, GMs.",
    "Your properties have more to promote than your team has time to produce — rooms, F&B, weddings, meetings, seasonal pushes. I'm the outside creative system that keeps property-level output consistent so your team can run strategy instead of fighting design tools."),
  A("positioning", "pos-partner", "Referral partner positioning", "Consultants, recruiters, vendors.",
    "You already know which hotels have a creative bandwidth problem — you hear it in every engagement. I provide the monthly creative system that fixes it, and I pay a recurring referral percentage for the life of any contract that starts with your intro. You make the introduction; I do all the delivery."),
  A("positioning", "pos-cost", "Cost-savings positioning", "Budget conversations. Never say cheap.",
    "A single full-time creative hire can cost six figures once salary, benefits, software, payroll taxes, recruiting, and management time are included. Archer Design gives hospitality teams a fixed monthly creative system without adding another role — predictable cost, no vacancy gap, no replacement risk."),
  A("positioning", "pos-pilot", "Premium pilot positioning", "Any group conversation moving toward scope.",
    "For hotel groups, the cleanest starting point is not a full-portfolio rollout. We start with 3–5 properties, build the workflow, prove the creative quality, simplify approvals, and create a monthly cadence — then expand on evidence. 3-property pilots start at $4,500/month; 5-property portfolio pilots at $10,000/month."),

  // ── 2. First messages ───────────────────────────────────────────────────────
  A("first_messages", "fm-buyer", "Direct buyer", "After connecting with a marketing/sales leader at a group.",
    "Thanks for connecting, [First]. Quick question — is property-level creative handled centrally at [Company], or does each hotel mostly handle social, campaigns, and local promos on its own?"),
  A("first_messages", "fm-partner", "Referral partner", "Consultants, task-force, recruiters, photographers.",
    "Hi [First] — I wanted to ask directly. I'm looking for a few hospitality referral partners who already know hotel owners, GMs, DOSMs, or management companies. I provide ongoing creative support for hotel groups — social graphics, short-form motion, F&B/event creative, campaign visuals, photo polishing. If an intro becomes a monthly client, I pay a success-based referral percentage. Does that ever make sense with the people you know in hospitality?"),
  A("first_messages", "fm-hiring", "Hiring signal", "Company posted a marketing/social/content role.",
    "Hi [First], I saw [Company] is hiring for [Role]. That role usually covers a lot — social content, design, campaigns, video, local promos, sometimes SEO. Archer Design can cover that creative output as an outside hospitality partner while you hire or instead of adding another full-time role. Worth sending over a few examples?"),
  A("first_messages", "fm-vendor", "Hotel vendor", "Tech reps, suppliers, anyone selling into your targets.",
    "Hi [First] — you're in front of hotel decision-makers every week, so quick question: do you see properties struggling to keep creative consistent — social, promos, campaign visuals? I cover that as an outside system, and I pay recurring referral fees on intros that become clients. Worth comparing notes?"),
  A("first_messages", "fm-hsmai", "HSMAI / association contact", "Association leaders, chapter members, event organizers.",
    "Hi [First] — saw your work with [chapter/association]. I run creative for a few PA hospitality properties (Indigo Pittsburgh, Hampton flags, hotel F&B) and I'm trying to be more useful to the [region] hospitality community — happy to share a free creative-audit checklist for member properties, no strings. Would that be worth passing along?"),
  A("first_messages", "fm-routing", "Routing message", "Wrong person, but inside the right company.",
    "Appreciate that, [First] — could you point me to whoever owns property-level creative or social at [Company]? Happy to send them a couple of examples so they've got something concrete to look at rather than a pitch."),
  A("first_messages", "fm-exec", "Executive message", "VPs, owners, principals — short and structural.",
    "Hi [First] — one question about [Company]: who owns creative consistency across the portfolio? Most groups your size either centralize it thin or let each property improvise. I run a fixed-fee creative system that covers the property layer — would a short thought-starter on what that looks like for [Company] be useful?"),

  // ── 3. Follow-ups ───────────────────────────────────────────────────────────
  A("followups", "fu-2day", "2-day follow-up", "No reply to the first DM.",
    "One thing I see with hotel groups: there's usually plenty to promote — rooms, F&B, events, weddings, seasonal offers — but not enough creative bandwidth to keep it consistent. That's the gap I cover. Worth seeing what a small 3–5 property pilot could look like?"),
  A("followups", "fu-5day", "5-day follow-up", "Still quiet. Add value, then leave room.",
    "Last note from me, [First] — [one specific idea for their property: a season, event, or F&B push worth creative this quarter]. That's the kind of thing a pilot month covers. If timing's wrong, no worries at all."),
  A("followups", "fu-sendinfo", "“Send info” response", "They asked for information. Attach a question.",
    "Absolutely. Short version: Archer Design gives hospitality groups a fixed monthly creative system — social graphics, short-form motion, campaign visuals, F&B/event promos, photo polishing, branded creative, optional local SEO — without adding another full-time hire. The best starting point is usually a 3–5 property pilot. I'll send a few examples and the pilot breakdown — is the interest more rooms-level creative, F&B, or portfolio consistency?"),
  A("followups", "fu-team", "“We have a team” response", "Overflow framing, never replacement.",
    "Totally makes sense. Most groups I'd be a fit for already have someone internally. The gap is usually overflow — campaign visuals, F&B/event creative, short-form motion, seasonal pushes, property-level assets the internal team doesn't have time to produce. I'm not trying to replace the team; I'm usually more useful as an outside creative extension."),
  A("followups", "fu-wrongperson", "“Not the right person” response", "Thank + route + leave something useful.",
    "Appreciate you telling me straight — who would be the right person for property-level creative at [Company]? Happy to send them two examples so the handoff has substance instead of just a name."),
  A("followups", "fu-whoelse", "“Who else should see this?”", "After sending deck/examples with mild interest.",
    "Quick one — who else at [Company] should see this? If creative decisions sit with corporate marketing, digital, or commercial strategy, I'm happy to send them the short version directly."),
  A("followups", "fu-closeloop", "“Close the loop”", "Final touch before Nurture.",
    "Don't want to clutter your inbox, [First] — should I close the loop on this for now, or is it more a timing thing? Either answer is genuinely fine."),

  // ── 4. Island-style thought starter ────────────────────────────────────────
  A("island", "is-first", "First message", "Multi-property management company, permission-based.",
    "Hi [First] — question about how [Company] handles property-level creative across the portfolio. Most management companies I talk to either centralize it thin or let each property improvise. I run a fixed-fee creative system for hotel groups (Indigo Pittsburgh, Hampton properties, hotel F&B) — curious which camp [Company] is in? Happy to send a short thought-starter on what I noticed across a few of your properties' feeds."),
  A("island", "is-deck", "Send-deck response", "They said yes to the thought-starter.",
    "Great — sending a short 6-slide overview: what I noticed across [3–4 properties]' feeds, and what a 3–5 property creative pilot would look like inside [Company]'s portfolio. No meeting required to read it. If it lands, I'd suggest 25 minutes on Google Meet to walk the property-specific version."),
  A("island", "is-meet", "Google Meet ask", "After the deck got a reaction.",
    "Want to do 25 minutes on Google Meet this week? I'll walk through the portfolio observations and the pilot scoped to actual [Company] properties — and if it's not a fit, we'll know fast. [Calendly link]"),
  A("island", "is-3day", "3-day follow-up", "Deck sent, no reply yet.",
    "One thought since sending the deck — slide 5 (the pilot scope) is the part most groups react to. If you ran it, which 3–5 properties would you pick? That answer usually tells both of us whether it's worth a call."),
  A("island", "is-meetopen", "Google Meet opening script", "First 30 seconds of the call.",
    "Thanks for the time — I'll keep this tight. I run Archer Design: property-level creative for hospitality groups as an outside system instead of another hire. I pulled a few observations on [Company]'s portfolio. Want me to walk through them, or would you rather tell me where creative actually hurts first?"),
  A("island", "is-talktrack", "Deck talk track summary", "Slide-by-slide, 60 seconds each.",
    "1: their portfolio, something genuinely good first, then the consistency gap — ask 'central or per-property?' and stop talking. 2: the problem (bandwidth, not talent). 3: the opportunity in THEIR metric (rate, direct bookings, covers). 4: proof — show before/afters, don't read stats aloud. 5: the pilot, price plainly ($4,500 for 3 / $10,000 for 5). 6: 'If you ran this, which properties would you pick?' Then scope the proposal."),

  // ── 5. Pilot ────────────────────────────────────────────────────────────────
  A("pilot", "pl-overview", "Pilot overview", "Anywhere the pilot needs explaining in one block.",
    "The 3–5 Property Creative Pilot: one month, 3–5 of your properties, full creative system — monthly plan per property, social graphics, short-form motion, F&B/event/wedding promos, photo polishing, new branded creative, captions — delivered approval-ready through one workflow, on one invoice."),
  A("pilot", "pl-included", "What's included", "Scope questions.",
    "Per property, per month: a creative plan tied to the property's calendar · social graphics and carousels · short-form motion · F&B, event, wedding, and seasonal promos · photo polishing and new branded graphics as scoped · captions with every asset · one feedback round per asset · group-level brand consistency."),
  A("pilot", "pl-whysmall", "Why start small", "Pushback on 'why not the whole portfolio?'",
    "Big creative rollouts fail when they start too big. A 3–5 property pilot proves the workflow on real properties, with real approvals, in one month — then expansion is a decision based on output, not a leap of faith. It's how I'd buy this if I were on your side of the table."),
  A("pilot", "pl-whofor", "Who it's for", "Qualification.",
    "Hotel groups with 3+ properties · properties with F&B, weddings, meetings, events, spas, or seasonal campaigns · teams with marketing leadership but limited creative bandwidth · management companies that want one fixed monthly creative partner across the set."),
  A("pilot", "pl-expand", "How it expands", "After-pilot conversation.",
    "After the pilot month we review the output together. Three paths: keep the pilot set, add properties in waves of 3–5, or scope a portfolio partnership. Per-property pricing improves with scale, and expansion is evidence-based — we'll show the numbers."),
  A("pilot", "pl-pricing", "Pricing language", "Say it plainly. No apology.",
    "Single property: $2,500/month. 3-property pilot: from $4,500/month. 3-property creative + local SEO: from $7,500/month. 5-property portfolio pilot: from $10,000/month. 5-property creative + SEO: $12,500/month. Larger groups: custom, from $15,000/month. Fixed monthly fee — no employment overhead, no vacancy gap."),
  A("pilot", "pl-cta", "Next-step CTA", "Closing any pilot conversation.",
    "Next step is simple: pick the 3–5 properties and grab 30 minutes for kickoff — brand files, approval contact, what's coming on the calendar. First assets land within the first week."),

  // ── 6. Proof blocks ─────────────────────────────────────────────────────────
  A("proof", "pr-short", "Short proof line", "Signatures, bios, quick credibility.",
    "13.9M+ impressions · 543K+ direct engagements · 3.6M+ reach · 2.4K+ creative assets delivered."),
  A("proof", "pr-medium", "Medium proof paragraph", "Emails, DMs when asked.",
    "Across hospitality clients — Hotel Indigo Pittsburgh, Hampton Inn properties, Eliza Hot Metal Bistro, spa and wellness brands — Archer Design creative has delivered 13.9M+ impressions, 543K+ direct engagements, 3.6M+ reach, and 2.4K+ finished assets, most of it built without a single new photo shoot."),
  A("proof", "pr-full", "Full proof section", "Proposals, decks, long-form pages.",
    "Archer Design is built for hospitality and measured in the open. Current and past work includes Hotel Indigo Pittsburgh (boutique flag), Hampton Inn properties (select-service, brand-standard-aware), Eliza Hot Metal Bistro (hotel F&B), and spa/wellness brands. The numbers across that work: 13.9M+ impressions, 543K+ direct engagements, 3.6M+ unique reach, and 2.4K+ creative assets delivered — graphics, short-form motion, campaign visuals, and event promos, delivered approval-ready month after month. What creative can honestly claim is visibility and engagement; we'll also recommend simple tracking (links, codes, GBP) to connect creative to revenue."),
  A("proof", "pr-linkedin", "LinkedIn proof post version", "Proof post — lessons first, numbers second.",
    "13.9M+ impressions later, here's what I've learned about hospitality creative: consistency beats virality. F&B out-engages rooms. Motion beats stills. And the properties that win treat creative as a system, not a task. (The rest of the numbers: 543K+ engagements, 3.6M+ reach, 2.4K+ assets — all built from what the properties already had.)"),
  A("proof", "pr-website", "Website proof version", "Marketing site sections.",
    "Real properties, real workload taken off real teams: 13.9M+ impressions, 543K+ engagements, 3.6M+ reach, and 2.4K+ assets delivered across hotels, restaurants, spas, and event-driven brands."),
  A("proof", "pr-deck", "Pitch deck proof version", "Slide 4. Don't read it aloud.",
    "Built for hospitality, measured in the open. 13.9M+ impressions · 543K+ direct engagements · 3.6M+ reach · 2.4K+ assets delivered. Hotel Indigo Pittsburgh · Hampton Inn properties · Eliza Hot Metal Bistro · spa & wellness brands."),

  // ── 7. Objections ───────────────────────────────────────────────────────────
  A("objections", "ob-team", "“We already have a team”", "Most common. Extension, not replacement.",
    "Most groups I work with do. The internal team owns strategy and brand; I'm the overflow that keeps property-level output consistent when they're slammed — campaign visuals, F&B promos, motion, seasonal pushes. Extension, not replacement. What does your team wish it had time for?"),
  A("objections", "ob-templates", "“We use brand templates”", "Flag properties.",
    "Templates cover the flag layer well — logo use, room shots, brand campaigns. Where they're thin is the property layer: your F&B specials, local events, weddings, seasonal pushes. That's exactly the layer I cover, brand-standard-aware so it clears review. Want to see a Hampton example that passed brand review first try?"),
  A("objections", "ob-photos", "“We don't have enough photos”", "Kills itself with the phone-photo proof.",
    "You almost certainly have more than you think — and it doesn't all have to come from a shoot. Phone photos from your team plus professional finishing covers most of it, and we create new branded graphics, campaign concepts, and motion where photography is thin. Send me three photos and I'll show you what they become."),
  A("objections", "ob-budget", "“Budget is tight”", "The math IS the answer.",
    "That's actually the argument for this. The loaded cost of one creative hire is $90K+; a 3-property pilot is a fraction of that, monthly, with no recruiting or vacancy risk. And we can start at three properties instead of five. What line does creative spend currently live in?"),
  A("objections", "ob-sendinfo", "“Send info”", "Always attach a question to the send.",
    "Will do — I'll send the pilot one-pager plus two examples matched to your properties. So I send the right version: is the interest more rooms-level creative, F&B, or portfolio consistency?"),
  A("objections", "ob-internal", "“We need to discuss internally”", "Make yourself useful to the discussion.",
    "Makes sense. Two things that help those conversations: the one-page pilot summary and a 3-slide version for whoever hasn't seen this. Want both? And who ends up making the final call — so I know who the material has to work for?"),
  A("objections", "ob-agency", "“We already have an agency”", "Different layer, not competition.",
    "Keep them — agencies are good at strategy and campaigns. I sit at a different layer: weekly property-level production. Most agencies hate that work and price it badly. Several of my clients run both: agency on strategy, my system on output."),
  A("objections", "ob-approvals", "“How do approvals work?”", "Process anxiety.",
    "One approval contact per property or one corporate approver — your choice. Assets arrive finished, labeled, with captions; one feedback round is included per asset. Brand-standard review is handled before delivery for flagged properties. Most clients spend under an hour a month approving."),
  A("objections", "ob-whatget", "“What exactly do we get?”", "Be specific instantly.",
    "Per property each month: a creative plan tied to your calendar, social graphics and carousels, short-form motion, F&B/event/seasonal promos, photo polishing, new branded graphics as scoped, and captions with every asset. Exact counts get confirmed at kickoff based on the property mix."),
  A("objections", "ob-multi", "“Can you support multiple properties?”", "That's the core use case.",
    "It's the core of what I do: group-level brand consistency with property-level customization, one plan, one invoice. The system is built to hold 3–40 properties; groups of 5+ get custom scoping. That's exactly what the 3–5 property pilot proves."),

  // ── 8. Proposal sections ────────────────────────────────────────────────────
  A("proposal", "pp-situation", "Situation", "Open the proposal with THEIR reality.",
    "[Company] operates [N] properties across [markets/brands]. Creative currently happens [centrally / per property / ad hoc]. The practical result: [the specific gap observed — inconsistent cadence, unpromoted F&B, mismatched portfolio feeds]. The team is capable; the bandwidth isn't there."),
  A("proposal", "pp-opportunity", "Opportunity", "Tie creative to value, not aesthetics.",
    "The properties have more to promote than the current system can produce: rooms, F&B, weddings, meetings, spa, seasonal pushes, local events. Consistent premium creative at the property level supports perceived value, rate integrity, direct-booking interest, and local F&B/event revenue — without adding headcount."),
  A("proposal", "pp-why", "Why Archer Design", "Proof + positioning.",
    "A dedicated outside creative system built for hospitality: brand-standard-aware for flags, custom for independents. Current and past work includes Hotel Indigo Pittsburgh, Hampton Inn properties, Eliza Hot Metal Bistro, and spa/wellness brands. Track record: 13.9M+ impressions, 543K+ direct engagements, 3.6M+ reach, 2.4K+ assets delivered."),
  A("proposal", "pp-scope", "Pilot scope", "Name the properties.",
    "One month across [3–5] properties: [names]. Goal: prove the workflow, the approval process, the creative quality, and the monthly cadence — so expansion is a decision based on output."),
  A("proposal", "pp-deliverables", "Deliverables", "Per property per month.",
    "Monthly creative plan tied to the property's calendar · social graphics and carousels · short-form motion · F&B, event, wedding, and seasonal promos · photo polishing and new branded graphics as scoped · captions with every asset. Exact asset counts confirmed at kickoff."),
  A("proposal", "pp-workflow", "Workflow", "Show how light their lift is.",
    "You send what's happening (events, menus, offers, photos). We plan, design, and deliver finished, labeled, approval-ready assets on a steady cadence — not one end-of-month dump. One feedback round per asset included."),
  A("proposal", "pp-timeline", "Timeline", "Concrete weeks.",
    "Week 0: kickoff call, brand files, calendars. Week 1: first assets delivered. Weeks 2–4: full cadence. Day 30: review — output, results, what to expand."),
  A("proposal", "pp-investment", "Investment", "Plain numbers, no apology.",
    "3-property pilot: $4,500–$7,500/month depending on scope. 5-property portfolio pilot: $10,000–$12,500/month. Creative + local SEO: $7,500–$15,000/month. Larger groups: custom from $15,000. Fixed monthly fee — no employment overhead, no software stack, no recruiting, no vacancy risk."),
  A("proposal", "pp-expansion", "Expansion path", "Evidence-based growth.",
    "After the pilot month: keep the pilot set, add properties in waves of 3–5, or scope a portfolio partnership. Per-property pricing improves with scale. Expansion is evidence-based — we'll show the numbers."),
  A("proposal", "pp-next", "Next steps", "Close with motion.",
    "1. Confirm the property list and option. 2. Kickoff call this week — [Calendly link]. 3. First assets within 7 days of kickoff."),

  // ── 9. Referral partner kit ─────────────────────────────────────────────────
  A("partner_kit", "pk-pitch", "Partner pitch", "The full ask in one block.",
    "You work with hotels that have a creative bandwidth problem — you hear it in every engagement. I run the system that fixes it: monthly property-level creative for hospitality groups. When an intro you make becomes a paid monthly client, you earn a recurring percentage for the life of that contract. You make the introduction; I handle every bit of the delivery and client service."),
  A("partner_kit", "pk-paid", "Paid referral explanation", "When they ask how it works.",
    "Simple terms: a genuine warm introduction to a named decision-maker, credited to you. If it becomes a paying client, you receive [X]% of net payments from that client for as long as they pay — monthly or quarterly payout, your pick. No delivery work, no client management, nothing to support. First genuine intro to a property gets the credit."),
  A("partner_kit", "pk-introreq", "Intro request", "Asking a warm source for a specific intro.",
    "Quick specific ask: you know [Name] at [Company], right? They run [N] properties and the portfolio's creative looks exactly like the bandwidth problem I solve. Would you be open to a two-line intro? I'll make you look good — and if it turns into a client, the referral terms kick in."),
  A("partner_kit", "pk-forwardable", "Forwardable intro note", "Write it FOR them to forward.",
    "[Partner first name] — feel free to forward this: \"Devon runs Archer Design, a creative system for hotel groups — property-level social graphics, short-form motion, F&B/event promos, photo polish — fixed monthly fee instead of a hire. He works with Hotel Indigo Pittsburgh and a couple of Hampton properties. Worth 20 minutes if property creative is stretched on your side. His calendar: [link]\""),
  A("partner_kit", "pk-terms", "Referral terms draft", "Formalizing. Confirm % before sending.",
    "Referral arrangement — draft terms: (1) Intro = a warm introduction to a named property decision-maker. (2) Commission: [confirm %] of net payments from that client, for the life of the contract including renewals tied to the original intro. (3) Cadence: paid monthly/quarterly after Archer Design is paid. (4) Roles: Devon = all creative + client support; partner = intro only. (5) Attribution: first genuine intro gets credit. (6) Either side can stop making/accepting new intros anytime; existing commissions continue."),
  A("partner_kit", "pk-followup", "Follow-up to referral partner", "Partner went quiet after interest.",
    "Hey [First] — no pressure on the partner thing, but one nudge: if even one of your hotel relationships has the creative-bandwidth problem, it's worth a two-line intro. Recurring cut for you, zero work, and I make the intro look good. Anyone come to mind since we talked?"),

  // ── 10. Before/after captions ───────────────────────────────────────────────
  A("captions", "cap-hotel", "Hotel property → premium campaign", "Posting a property polish pair.",
    "Same property. Different perceived value. Most hotels don't need a new photo shoot — they need the assets they already own finished properly. One polish pass, one campaign frame, and the room finally looks like what it costs."),
  A("captions", "cap-fnb", "F&B / menu item → campaign asset", "Posting a food transformation.",
    "Hotel restaurants are often the most under-marketed asset on property. This started as a phone photo from the line — now it sells the special while it's still on the menu."),
  A("captions", "cap-event", "Local event → booking campaign", "Posting an event campaign.",
    "A local event is not just an event — it's a booking reason. Most hotels post about it after it sells out. The campaign belongs inside the booking window."),
  A("captions", "cap-spa", "Spa service → wellness campaign", "Posting wellness creative.",
    "Spas sell calm. The creative has to feel like the treatment room — soft light, quiet type, no noise. This is what that looks like."),
  A("captions", "cap-calendar", "Plain schedule → event calendar", "Posting a calendar transformation.",
    "Nobody screenshots a paragraph. Turned a text schedule into the most-saved asset this property posts — same information, finished format."),
  A("captions", "cap-phone", "Raw phone photo → polished visual", "Posting a phone-photo finish.",
    "Shot on a phone by the front desk team. Finished by the system. You don't have a photo problem — you have a finishing gap."),
];
