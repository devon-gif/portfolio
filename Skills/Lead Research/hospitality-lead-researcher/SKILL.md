---
name: hospitality-lead-researcher
description: Turn a company name, website, LinkedIn profile, contact, job post, or pasted notes into a structured Archer Design lead brief. Use whenever Devon drops in a new hospitality lead and wants it researched, scored, and prepped for outreach.
---

# Hospitality Lead Researcher

## Purpose
Take any raw lead input (company name, website URL, LinkedIn profile, a contact, a job post, or pasted notes) and produce a complete **lead brief** that every downstream Skill (classifier, outreach, proposal, CRM) can use. This is the first Skill in the pipeline.

## When to use it
- A new hotel / restaurant / spa / resort / event venue / hospitality group lead comes in.
- Before writing any outreach. Never message a lead that hasn't been run through this Skill.
- When re-qualifying an old lead that's gone cold.

## What it should ask me for
Ask only for what's missing. If Devon already pasted enough, proceed.
1. The lead input (name, URL, profile, job post, or notes) — required.
2. Where it came from (cold list, referral, inbound, LinkedIn, job board) — if not obvious.
3. Any prior contact or context with this lead.
If Devon gives a name only with no link, ask for a website or LinkedIn URL before guessing.

## What files/context it should read first
0. **Read these three first, every time:** `ABOUT ME/about-me.md` (identity + settled decisions), `ABOUT ME/voice-profile.md` (how Devon sounds), `ABOUT ME/anti-ai-writing-style.md` (banned/avoid list).
1. `ABOUT ME/Brand Context/ARCHER-DESIGN-BRAND-CONTEXT.md` — ICPs, best/bad fit, offers, tone. **Always read first.**
2. `Examples/Portfolio Proof/PORTFOLIO-PROOF.md` — to match proof points to the lead.
3. `crm/CRM-SCHEMA.md` — so tags and fields match the CRM exactly.

## Exact instructions for the Skill
1. Read the Brand Context File. Hold the ICP, best-fit, and bad-fit lists in mind as the scoring rubric.
2. Parse the input. Identify: company, category, who the contact is (if any), and the source.
3. If a URL/profile is provided and tools are available, fetch it and pull **real, quotable language** from their About page, social bios, job post, or recent posts. Quote it verbatim — this language is gold for outreach.
4. Identify the properties / restaurants / spas / venues they operate, and roughly how many.
5. Map them against best-fit vs bad-fit. Be honest. A bad-fit lead should be scored low, not forced.
6. Infer likely pain points from evidence (inconsistent posting, recycled images, a job post for a designer, thin content, lots of unused photos, multi-property inconsistency).
7. Pick the single best buyer/contact type and the single best outreach angle.
8. Recommend one offer to lead with (usually the free trial for direct buyers).
9. Score priority 1–10 using the rubric below.
10. Assign CRM tags from the schema and a clear next action.

### Priority scoring rubric (1–10)
- +3 strong ICP match (hotel/restaurant/spa/event/group with existing assets)
- +2 clear pain signal (inconsistent posting, hiring a creative role, lots of unused photos)
- +2 reachable decision-maker or property-level champion identified
- +1 multi-property / group (scale potential)
- +1 warm source (referral, inbound, mutual connection)
- +1 strong quotable language to personalize with
- −3 bad-fit signal (pre-opening/no assets, one-off need, wants shoots/ad-buying only)
Score: 8–10 = hot, 5–7 = warm, 1–4 = low priority.

## Output format
```
LEAD BRIEF — [Company Name]
Date: [date] | Source: [source]

Company summary: [2–3 sentences]
Company category: [hotel / select-service hotel / restaurant / F&B group / spa / resort / wedding-event venue / hospitality group]
Properties operated: [list + count]
Fit verdict: [Best fit / Borderline / Bad fit] — [1–2 sentence why]
Likely pain points: [bulleted, evidence-based]
Their own language (verbatim): "[quote]" — [where from]
Best buyer/contact type: [role]
Best outreach angle: [one angle]
Suggested offer: [offer]
Priority score: [n]/10 ([hot/warm/low]) — [scoring note]
CRM tags: [tag, tag, tag]
Next action: [one concrete next step]
```

## Quality rules
- Every claim about the lead must trace to real evidence or be labeled an inference.
- Always include at least one verbatim quote when a source is available; if none, say so explicitly.
- The angle must connect to a real pain point, not a generic value prop.
- Tags must come from the CRM schema, not invented.
- Keep the whole brief scannable in under 30 seconds.

## What it must never do
- Never invent properties, stats, names, or quotes that aren't supported.
- Never force a bad-fit lead into a high score.
- Never write the outreach message here (that's the Outreach Writer's job).
- Never recommend leading with price.
- Never use banned phrases from the Brand Context File.

## Usage example
> **Devon:** Run the lead researcher on this — https://www.examplehotelgroup.com, found them on a cold list.
>
> **Skill:** [reads Brand Context → fetches site → quotes their "boutique properties across the Midwest" line → identifies 4 hotels, inconsistent IG → scores 8/10 hot → tags `hotel-group`, `multi-property`, `inconsistent-posting` → next action: find marketing contact + run Outreach Writer.]
