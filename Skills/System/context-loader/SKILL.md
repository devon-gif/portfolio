---
name: context-loader
description: Before any Archer Design hospitality outreach task, load the correct context and decide lead type, message style, offer, proof points, and whether to mention cost savings, the 7-day/5-asset trial, a right-person referral, and the portfolio link. Run this first, before the Outreach Writer.
---

# Context Loader

## Purpose
The pre-flight check for every outreach task. Loads the persistent context and returns a tight decision packet so the Outreach Writer (or Devon) sends the right message, with the right offer, to the right person.

## When to use it
- Immediately before writing any outreach for a lead.
- Whenever Devon is unsure which angle/offer/proof to use.

## What it should ask me for
1. The lead (brief, or name + context).
2. Any reply/signal so far.
(If a lead brief exists, that's enough.)

## What files/context it should read first
1. `ABOUT ME/about-me.md`
2. `ABOUT ME/voice-profile.md`
3. `ABOUT ME/anti-ai-writing-style.md`
4. `ABOUT ME/Brand Context/ARCHER-DESIGN-BRAND-CONTEXT.md`
5. `Examples/Portfolio Proof/PORTFOLIO-PROOF.md`
6. `crm/CRM-SCHEMA.md`

## Exact instructions for the Skill
Read the context, then resolve each checkpoint:
1. **Lead type?** direct buyer / partner / hiring signal / property champion / enterprise router / low priority.
2. **Message style?** (match `voice-profile.md` register to the lead type).
3. **Which offer applies?** free trial / pilot / retainer / partner deal / contract alternative / right-person ask.
4. **Which proof points?** pick 1–2 matched to category (from Portfolio Proof).
5. **Mention cost savings?** yes/no + how.
6. **Mention the 7-day / 5-asset trial?** yes/no.
7. **Ask for a referral to the right person?** yes/no.
8. **Include the portfolio link?** yes/no.

## Output format
```
CONTEXT LOAD — [Lead]
Context summary: [2–3 sentences, who they are + situation]
Lead type: [one]
Best angle: [one line]
Best offer: [one]
Recommended tone: [from voice-profile, e.g. casual/peer or slightly polished]
Checkpoints: cost-savings [Y/N] · trial [Y/N] · right-person ask [Y/N] · portfolio link [Y/N] · proof points [which]
Recommended next action: [one step — usually "run Outreach Message Writer with these settings"]
```

## Quality rules
- Every checkpoint gets an explicit yes/no — no blanks.
- Offer and lead type must be consistent (no trial to a partner).
- Proof points must match the lead's category.

## What it must never do
- Never produce the actual outreach message (that's the Outreach Writer).
- Never skip reading the three ABOUT ME files.
- Never leave a checkpoint unanswered.

## Usage example
> **Devon:** Load context for a Hampton property GM I want to message.
>
> **Skill:** Lead type: direct buyer. Angle: consistent content without a hire. Offer: free trial. Tone: casual peer. Checkpoints: cost-savings Y · trial Y · right-person N · portfolio Y · proof = Hampton + engagement growth. Next: run Outreach Message Writer with these settings.
