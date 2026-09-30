import { sendEmail } from "@/lib/sending";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const KEY = "f0d8e4b1-9d76-4c76-a77a-b819d0a7c341";
const FOOTER = [
  "",
  "---",
  "You received this as a one-to-one business outreach from Archer Design.",
  "If you'd rather not hear from me, reply \"unsubscribe\" and I won't contact you again.",
  "Archer Design LLC",
  "4125 N 3250 W, Apt 4H",
  "Lehi, UT 84043",
].join("\n");

type Prospect = { name: string; company: string; email: string; subject: string; body: string };

const prospects: Prospect[] = [
  {
    name: "Jill Rokusek",
    company: "Bunkhouse",
    email: "jill.rokusek@bunkhousegroup.com",
    subject: "Overflow creative support for Bunkhouse",
    body: `Hi Jill,

I've been following Bunkhouse's design-led hotel work and saw you still have new projects in the pipeline. I run Archer Design and support hospitality teams with social creative, short-form motion, F&B and event promos, launch assets, and fast campaign adaptations.

I've done ongoing hotel and restaurant creative for brands including Hampton Inn and Hotel Indigo, and I'm especially useful when an internal team needs extra production capacity without adding another full-time hire.

Would it be useful if I sent a small hospitality-focused sample set?

Best,
Devon
Archer Design
https://www.archerdesign.shop/devon`,
  },
  {
    name: "Kelly McGuire",
    company: "Kasa",
    email: "kelly.mcguire@kasa.com",
    subject: "Creative support as Kasa expands",
    body: `Hi Kelly,

I saw Kasa's combination with Mint House and the added portfolio scale this year. I run Archer Design and help hospitality teams turn launches, property stories, and offers into social, motion, web, and campaign creative without loading more production onto the internal team.

My background is hands-on hotel and restaurant marketing, including ongoing work for Hampton Inn and Hotel Indigo.

If Kasa ever needs flexible creative support across property launches or commercial campaigns, I'd be glad to send a few relevant examples.

Best,
Devon
Archer Design
https://www.archerdesign.shop/devon`,
  },
  {
    name: "Polly Watts",
    company: "Dwellist",
    email: "polly@dwellist.com",
    subject: "Motelier launch creative",
    body: `Hi Polly,

I saw Dwellist's first Motelier project is underway and that the platform is expanding in 2026. I run Archer Design and work across hospitality creative, project websites, social and motion, launch assets, and investor-facing visuals.

Motelier feels like the kind of concept where the brand story, property presentation, and rollout materials all need to feel connected from the start.

If useful, I can send a compact sample showing how I'd approach launch creative for a value-add hospitality project.

Best,
Devon
Archer Design
https://www.archerdesign.shop/devon`,
  },
  {
    name: "Tamar Rothenberg",
    company: "Extell",
    email: "trothenberg@extell.com",
    subject: "Creative support for Extell hospitality projects",
    body: `Hi Tamar,

I saw Extell's new financing for the 740 Eighth Avenue mixed-use hotel project, alongside the active Deer Valley hospitality pipeline. I run Archer Design and help real estate and hospitality teams with project sites, launch creative, investor and deal materials, motion, and polished campaign assets.

My background combines hospitality marketing with design and creative technology, so I can plug in when a major project needs extra visual production without adding another internal hire.

Would it be useful if I sent a few relevant examples?

Best,
Devon
Archer Design
https://www.archerdesign.shop/devon`,
  },
  {
    name: "Sagar Rathie",
    company: "Crescent Communities",
    email: "srathie@crescentcommunities.com",
    subject: "Carson & Tryon project creative",
    body: `Hi Sagar,

I came across Carson & Tryon and the mix of office, hotel, residential, retail, and amenity space you're bringing together. I run Archer Design and support mixed-use and hospitality teams with investor decks, project sites, leasing and sales visuals, motion, and launch creative.

I'm especially useful when a project needs strong visual consistency across stakeholder materials and public-facing marketing without creating more production work for the core team.

If that's relevant at Crescent, I'd be happy to send a few examples tailored to mixed-use development.

Best,
Devon
Archer Design
https://www.archerdesign.shop/devon`,
  },
  {
    name: "MAL Faust",
    company: "PM Hotel Group",
    email: "mfaust@pmhotelgroup.com",
    subject: "Overflow creative for PM Hotel Group",
    body: `Hi MAL,

I saw PM Hotel Group has been expanding this year, including the 12-hotel Nashville portfolio and The Quoin. I run Archer Design and help hospitality teams with social creative, motion, F&B and event promos, launch assets, and campaign adaptations when internal teams need extra production capacity.

My background includes ongoing hotel and restaurant marketing work, including Hampton Inn and Hotel Indigo.

If PM ever needs a flexible creative partner across property launches or portfolio campaigns, I'd be glad to send over a small hospitality sample set.

Best,
Devon
Archer Design
https://www.archerdesign.shop/devon`,
  },
  {
    name: "Tyler Hardy",
    company: "Blue Flag Capital",
    email: "th@blueflagcap.com",
    subject: "Creative support for Blue Flag's 2026 openings",
    body: `Hi Tyler,

I saw Blue Flag is doubling its hotel footprint with four 2026 openings across Montauk, Sag Harbor, Greenport, and Jackson Hole. I run Archer Design and support hospitality investors and developers with project sites, investor materials, launch creative, motion, and polished visual storytelling around new properties.

That mix of capital, development, and design-forward hospitality is exactly where my work tends to fit best.

If useful, I can send a few examples focused on investor-facing and launch materials for hospitality projects.

Best,
Devon
Archer Design
https://www.archerdesign.shop/devon`,
  },
  {
    name: "Michael Fragoso",
    company: "The Leading Hotels of the World",
    email: "mfragoso@lhw.com",
    subject: "Flexible brand creative support for LHW",
    body: `Hi Michael,

I saw Leading Hotels has continued adding new independent luxury properties this year, including another ten members in August. I run Archer Design and support hospitality teams with social creative, motion, launch assets, campaign adaptations, and AI-assisted visual production.

With a portfolio where every property needs to retain its own identity, I imagine production can get especially varied. I'm useful as flexible overflow support when the brand team needs more capacity without expanding headcount.

Would it be useful if I sent a few hospitality-focused examples?

Best,
Devon
Archer Design
https://www.archerdesign.shop/devon`,
  },
];

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("key") !== KEY || url.searchParams.get("confirm") !== "send") {
    return Response.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const results: Array<Record<string, unknown>> = [];
  for (const p of prospects) {
    try {
      const smtpId = await sendEmail({
        to: p.email,
        subject: p.subject,
        text: `${p.body}${FOOTER}`,
      });
      results.push({ name: p.name, company: p.company, email: p.email, ok: true, smtp_id: smtpId });
    } catch (error) {
      results.push({
        name: p.name,
        company: p.company,
        email: p.email,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const sentCount = results.filter((r) => r.ok === true).length;
  return Response.json({ ok: sentCount === prospects.length, sentCount, total: prospects.length, results });
}
