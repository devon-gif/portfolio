---
name: lead-classifier
description: Classify an Archer Design hospitality lead into a buyer type (direct buyer, partner/referral source, hiring signal, property-level champion, enterprise router, or low priority) and prescribe the angle, offer, CTA, and what not to say. Use after the Lead Researcher, before writing outreach.
---

# Lead Classifier

## Purpose
Sort each lead into exactly one of six types so the rest of the pipeline knows how to treat them. Classification drives the angle, the offer, and the CTA used by the Outreach Writer.

## When to use it
- Right after the Lead Researcher produces a brief.
- When a reply changes who I'm actually dealing with (e.g., a buyer turns out to be a router).

## What it should ask me for
1. The lead brief (or enough raw context to classify).
2. Any reply or signal that hints at their role or intent.

## What files/context it should read first
0. **Read these three first, every time:** `ABOUT ME/about-me.md` (identity + settled decisions), `ABOUT ME/voice-profile.md` (how Devon sounds), `ABOUT ME/anti-ai-writing-style.md` (banned/avoid list).
1. `ABOUT ME/Brand Context/ARCHER-DESIGN-BRAND-CONTEXT.md` — offers, ICPs, partner structure.
2. `crm/CRM-SCHEMA.md` — lead-type field values must match.

## Exact instructions for the Skill
1. Read the Brand Context File.
2. Pick the single best-fit class from the six below. If two seem to fit, choose by intent and decision power.
3. For the chosen class, output the full block: why it fits, what they care about, angle, offer to lead with, CTA, what not to say.
4. If genuinely ambiguous, state the top two and what reply would disambiguate.

### The six classes
- **Direct buyer** — owns or strongly influences the creative/marketing decision (GM, owner, marketing director, F&B director, spa director). → Lead with the free trial.
- **Partner / referral source** — consultant, recruiter, photographer, PR, advisor, agency. Doesn't buy, but can introduce. → Lead with the partner/referral offer.
- **Hiring signal** — company posting a job for a designer / social / content / marketing role. → Lead with the contract-vs-headcount alternative.
- **Property-level champion** — an on-property person (social coordinator, sales manager) who can't sign alone but wants help and can advocate up. → Lead with a free-trial-as-ammo angle.
- **Enterprise router** — works at a group/management co and will forward to the right team ("I'll pass to marketing"). → Lead with a right-person ask + free samples.
- **Low priority** — bad fit or no signal. → Park, minimal effort.

## Output format
```
CLASSIFICATION — [Company / Contact]
Lead type: [one of the six]
Why this fits: [1–2 sentences]
What they likely care about: [bulleted]
Angle to use: [one angle]
Offer to lead with: [offer]
CTA to use: [exact ask]
What NOT to say: [specific traps for this type]
(If ambiguous: Alt type + disambiguating reply)
```

## Quality rules
- Exactly one primary class. No hedging unless truly ambiguous.
- The angle, offer, and CTA must be internally consistent (a partner never gets the free-trial CTA).
- "What not to say" must be specific to the type, not generic.

## What it must never do
- Never pitch a partner/router as if they're the buyer.
- Never lead a hiring-signal lead with "want to hire me?" — lead with the flexible-contract alternative.
- Never assign a class the CRM schema doesn't support.
- Never use banned phrases.

## Usage example
> **Devon:** Classify this — recruiter posting a "Social Media Coordinator, hotel group" role.
>
> **Skill:** Lead type: Hiring signal. Cares about filling the gap fast and cheaply. Angle: contract creative support instead of (or alongside) a full-time hire. Offer: free trial + retainer. CTA: "Happy to apply formally, but also wanted to flag the contract option." What not to say: don't oversell the full-time application; don't sound desperate for the job.
