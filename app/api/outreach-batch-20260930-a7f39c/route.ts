import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { sendMessageById } from "@/lib/send-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const KEY = "f0d8e4b1-9d76-4c76-a77a-b819d0a7c341";
const MAILING_ADDRESS = "4125 N 3250 W, Apt 4H, Lehi, UT 84043";
const OPT_OUT_LINE = "If you'd rather not hear from me, you can unsubscribe below.";

type Prospect = {
  first: string;
  last: string;
  title: string;
  email: string;
  linkedin: string;
  company: string;
  website: string;
  subject: string;
  body: string;
};

const prospects: Prospect[] = [
  {
    first: "Jill",
    last: "Rokusek",
    title: "Senior Marketing Manager",
    email: "jill.rokusek@bunkhousegroup.com",
    linkedin: "https://www.linkedin.com/in/jillcrokusek/",
    company: "Bunkhouse",
    website: "https://www.bunkhousehotels.com/",
    subject: "Overflow creative support for Bunkhouse",
    body: [
      "Hi Jill,",
      "",
      "I've been following Bunkhouse's design-led hotel work and saw you still have new projects in the pipeline. I run Archer Design and support hospitality teams with social creative, short-form motion, F&B and event promos, launch assets, and fast campaign adaptations.",
      "",
      "I've done ongoing hotel and restaurant creative for brands including Hampton Inn and Hotel Indigo, and I'm especially useful when an internal team needs extra production capacity without adding another full-time hire.",
      "",
      "Would it be useful if I sent a small hospitality-focused sample set?",
      "",
      "Best,",
      "Devon",
      "Archer Design",
      "https://www.archerdesign.shop/devon",
    ].join("\n"),
  },
  {
    first: "Kelly",
    last: "McGuire",
    title: "Chief Commercial Officer",
    email: "kelly.mcguire@kasa.com",
    linkedin: "https://www.linkedin.com/in/mcguirekelly/",
    company: "Kasa",
    website: "https://kasa.com/",
    subject: "Creative support as Kasa expands",
    body: [
      "Hi Kelly,",
      "",
      "I saw Kasa's combination with Mint House and the added portfolio scale this year. I run Archer Design and help hospitality teams turn launches, property stories, and offers into social, motion, web, and campaign creative without loading more production onto the internal team.",
      "",
      "My background is hands-on hotel and restaurant marketing, including ongoing work for Hampton Inn and Hotel Indigo.",
      "",
      "If Kasa ever needs flexible creative support across property launches or commercial campaigns, I'd be glad to send a few relevant examples.",
      "",
      "Best,",
      "Devon",
      "Archer Design",
      "https://www.archerdesign.shop/devon",
    ].join("\n"),
  },
  {
    first: "Polly",
    last: "Watts",
    title: "Co-Founder/Owner",
    email: "polly@dwellist.com",
    linkedin: "https://www.linkedin.com/in/polly-watts-a8565b4/",
    company: "Dwellist",
    website: "https://www.dwellist.com/",
    subject: "Motelier launch creative",
    body: [
      "Hi Polly,",
      "",
      "I saw Dwellist's first Motelier project is underway and that the platform is expanding in 2026. I run Archer Design and work across hospitality creative, project websites, social and motion, launch assets, and investor-facing visuals.",
      "",
      "Motelier feels like the kind of concept where the brand story, property presentation, and rollout materials all need to feel connected from the start.",
      "",
      "If useful, I can send a compact sample showing how I'd approach launch creative for a value-add hospitality project.",
      "",
      "Best,",
      "Devon",
      "Archer Design",
      "https://www.archerdesign.shop/devon",
    ].join("\n"),
  },
  {
    first: "Tamar",
    last: "Rothenberg",
    title: "Senior Vice President Marketing",
    email: "trothenberg@extell.com",
    linkedin: "https://www.linkedin.com/in/trothenberg/",
    company: "Extell",
    website: "https://www.extell.com/",
    subject: "Creative support for Extell hospitality projects",
    body: [
      "Hi Tamar,",
      "",
      "I saw Extell's new financing for the 740 Eighth Avenue mixed-use hotel project, alongside the active Deer Valley hospitality pipeline. I run Archer Design and help real estate and hospitality teams with project sites, launch creative, investor and deal materials, motion, and polished campaign assets.",
      "",
      "My background combines hospitality marketing with design and creative technology, so I can plug in when a major project needs extra visual production without adding another internal hire.",
      "",
      "Would it be useful if I sent a few relevant examples?",
      "",
      "Best,",
      "Devon",
      "Archer Design",
      "https://www.archerdesign.shop/devon",
    ].join("\n"),
  },
  {
    first: "Sagar",
    last: "Rathie",
    title: "Managing Director, Commercial Office and Mixed-Use",
    email: "srathie@crescentcommunities.com",
    linkedin: "https://www.linkedin.com/in/srathie/",
    company: "Crescent Communities",
    website: "https://www.crescentcommunities.com/",
    subject: "Carson & Tryon project creative",
    body: [
      "Hi Sagar,",
      "",
      "I came across Carson & Tryon and the mix of office, hotel, residential, retail, and amenity space you're bringing together. I run Archer Design and support mixed-use and hospitality teams with investor decks, project sites, leasing and sales visuals, motion, and launch creative.",
      "",
      "I'm especially useful when a project needs strong visual consistency across stakeholder materials and public-facing marketing without creating more production work for the core team.",
      "",
      "If that's relevant at Crescent, I'd be happy to send a few examples tailored to mixed-use development.",
      "",
      "Best,",
      "Devon",
      "Archer Design",
      "https://www.archerdesign.shop/devon",
    ].join("\n"),
  },
  {
    first: "MAL",
    last: "Faust",
    title: "Vice President of Sales & Marketing",
    email: "mfaust@pmhotelgroup.com",
    linkedin: "https://www.linkedin.com/in/mal-faust-b4161a48/",
    company: "PM Hotel Group",
    website: "https://pmhotelgroup.com/",
    subject: "Overflow creative for PM Hotel Group",
    body: [
      "Hi MAL,",
      "",
      "I saw PM Hotel Group has been expanding this year, including the 12-hotel Nashville portfolio and The Quoin. I run Archer Design and help hospitality teams with social creative, motion, F&B and event promos, launch assets, and campaign adaptations when internal teams need extra production capacity.",
      "",
      "My background includes ongoing hotel and restaurant marketing work, including Hampton Inn and Hotel Indigo.",
      "",
      "If PM ever needs a flexible creative partner across property launches or portfolio campaigns, I'd be glad to send over a small hospitality sample set.",
      "",
      "Best,",
      "Devon",
      "Archer Design",
      "https://www.archerdesign.shop/devon",
    ].join("\n"),
  },
  {
    first: "Tyler",
    last: "Hardy",
    title: "Co-Founder and Head of Capital Markets",
    email: "th@blueflagcap.com",
    linkedin: "https://www.linkedin.com/in/tyler-hardy-b626b213/",
    company: "Blue Flag Capital",
    website: "https://www.blueflagcapital.com/",
    subject: "Creative support for Blue Flag's 2026 openings",
    body: [
      "Hi Tyler,",
      "",
      "I saw Blue Flag is doubling its hotel footprint with four 2026 openings across Montauk, Sag Harbor, Greenport, and Jackson Hole. I run Archer Design and support hospitality investors and developers with project sites, investor materials, launch creative, motion, and polished visual storytelling around new properties.",
      "",
      "That mix of capital, development, and design-forward hospitality is exactly where my work tends to fit best.",
      "",
      "If useful, I can send a few examples focused on investor-facing and launch materials for hospitality projects.",
      "",
      "Best,",
      "Devon",
      "Archer Design",
      "https://www.archerdesign.shop/devon",
    ].join("\n"),
  },
  {
    first: "Michael",
    last: "Fragoso",
    title: "Head of Brand",
    email: "mfragoso@lhw.com",
    linkedin: "https://www.linkedin.com/in/mfragoso/",
    company: "The Leading Hotels of the World",
    website: "https://www.lhw.com/",
    subject: "Flexible brand creative support for LHW",
    body: [
      "Hi Michael,",
      "",
      "I saw Leading Hotels has continued adding new independent luxury properties this year, including another ten members in August. I run Archer Design and support hospitality teams with social creative, motion, launch assets, campaign adaptations, and AI-assisted visual production.",
      "",
      "With a portfolio where every property needs to retain its own identity, I imagine production can get especially varied. I'm useful as flexible overflow support when the brand team needs more capacity without expanding headcount.",
      "",
      "Would it be useful if I sent a few hospitality-focused examples?",
      "",
      "Best,",
      "Devon",
      "Archer Design",
      "https://www.archerdesign.shop/devon",
    ].join("\n"),
  },
];

async function findOrCreateCompany(admin: ReturnType<typeof getAdminClient>, p: Prospect): Promise<string> {
  const { data: existing, error: lookupError } = await admin
    .from("companies")
    .select("id")
    .eq("name", p.company)
    .limit(1)
    .maybeSingle();
  if (lookupError) throw new Error(`Company lookup failed for ${p.company}: ${lookupError.message}`);
  if (existing?.id) return existing.id;

  const currentShape = await admin
    .from("companies")
    .insert({ name: p.company, website: p.website })
    .select("id")
    .single();
  if (!currentShape.error && currentShape.data?.id) return currentShape.data.id;

  const legacyShape = await admin
    .from("companies")
    .insert({ name: p.company, website: p.website, type: "other" })
    .select("id")
    .single();
  if (legacyShape.error || !legacyShape.data?.id) {
    throw new Error(`Company insert failed for ${p.company}: ${legacyShape.error?.message || currentShape.error?.message || "unknown error"}`);
  }
  return legacyShape.data.id;
}

async function findOrCreateContact(admin: ReturnType<typeof getAdminClient>, p: Prospect, companyId: string): Promise<string> {
  const { data: existing, error: lookupError } = await admin
    .from("contacts")
    .select("id")
    .ilike("email", p.email)
    .limit(1)
    .maybeSingle();
  if (lookupError) throw new Error(`Contact lookup failed for ${p.email}: ${lookupError.message}`);
  if (existing?.id) return existing.id;

  const currentShape = await admin
    .from("contacts")
    .insert({
      company_id: companyId,
      first_name: p.first,
      last_name: p.last,
      title: p.title,
      email: p.email,
      linkedin_url: p.linkedin,
      status: "new",
    })
    .select("id")
    .single();
  if (!currentShape.error && currentShape.data?.id) return currentShape.data.id;

  const legacyShape = await admin
    .from("contacts")
    .insert({
      company_id: companyId,
      company_name: p.company,
      company_type: "other",
      first_name: p.first,
      last_name: p.last,
      title: p.title,
      email: p.email,
      linkedin_url: p.linkedin,
      status: "new",
      type: "decision_maker",
      source: "manual",
    })
    .select("id")
    .single();
  if (legacyShape.error || !legacyShape.data?.id) {
    throw new Error(`Contact insert failed for ${p.email}: ${legacyShape.error?.message || currentShape.error?.message || "unknown error"}`);
  }
  return legacyShape.data.id;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("key") !== KEY) {
    return Response.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Server not configured." }, { status: 500 });
  }

  const admin = getAdminClient();
  const { data: settings, error: settingsError } = await admin.from("app_settings").select("*").limit(1).maybeSingle();
  if (settingsError || !settings) {
    return Response.json({ ok: false, error: `Settings unavailable: ${settingsError?.message || "missing row"}` }, { status: 500 });
  }

  const settingsOverride = {
    ...settings,
    mailing_address: MAILING_ADDRESS,
    opt_out_line: OPT_OUT_LINE,
    test_mode: false,
  };

  if (settings.id) {
    await admin
      .from("app_settings")
      .update({ mailing_address: MAILING_ADDRESS, opt_out_line: OPT_OUT_LINE })
      .eq("id", settings.id);
  }

  const results: Array<Record<string, unknown>> = [];

  for (const p of prospects) {
    try {
      const companyId = await findOrCreateCompany(admin, p);
      const contactId = await findOrCreateContact(admin, p, companyId);

      const { data: existingMessage, error: existingError } = await admin
        .from("messages")
        .select("id,status,sent_at")
        .eq("contact_id", contactId)
        .in("status", ["draft", "needs_review", "approved", "approved_for_today", "scheduled", "sending", "sent"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (existingError) throw new Error(`Message lookup failed: ${existingError.message}`);

      if (existingMessage) {
        results.push({
          company: p.company,
          name: `${p.first} ${p.last}`,
          email: p.email,
          ok: existingMessage.status === "sent",
          skipped: true,
          reason: `Existing message status: ${existingMessage.status}`,
          message_id: existingMessage.id,
        });
        continue;
      }

      const { data: message, error: insertError } = await admin
        .from("messages")
        .insert({
          contact_id: contactId,
          company_id: companyId,
          channel: "email",
          subject: p.subject,
          body: p.body,
          status: "approved",
        })
        .select("id")
        .single();
      if (insertError || !message?.id) {
        throw new Error(`Message insert failed: ${insertError?.message || "missing id"}`);
      }

      const sent = await sendMessageById(admin, message.id, {
        allowedStatuses: ["approved"],
        settings: settingsOverride,
      });

      results.push({
        company: p.company,
        name: `${p.first} ${p.last}`,
        email: p.email,
        ...sent,
      });
    } catch (error) {
      results.push({
        company: p.company,
        name: `${p.first} ${p.last}`,
        email: p.email,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const sentCount = results.filter((r) => r.ok === true && r.skipped !== true).length;
  const alreadySentCount = results.filter((r) => r.ok === true && r.skipped === true).length;
  return Response.json({ ok: sentCount + alreadySentCount === prospects.length, sentCount, alreadySentCount, results });
}
