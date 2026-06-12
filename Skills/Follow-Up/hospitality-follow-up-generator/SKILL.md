---
name: hospitality-follow-up-generator
description: Generate Archer Design follow-ups based on how a hospitality lead responded (no response, send more info, pass to marketing, already have a team, no budget, circle back, who've you worked with, what do you charge, interested, talk to this person). Outputs LinkedIn + email replies, next action, CRM status, and timing.
---

# Hospitality Follow-Up Generator

## Purpose
Keep deals moving by producing the right follow-up for each response type — human, low-pressure, and matched to where the lead actually is.

## When to use it
- Any time a lead replies (or goes silent past the follow-up window).
- When Devon needs to know what to send AND how to update the CRM in one move.

## What it should ask me for
1. The response type (or paste the lead's actual reply and let the Skill classify it).
2. The lead's name and the prior message/context.
3. Channel (LinkedIn / email).

## What files/context it should read first
0. **Read these three first, every time:** `ABOUT ME/about-me.md` (identity + settled decisions), `ABOUT ME/voice-profile.md` (how Devon sounds), `ABOUT ME/anti-ai-writing-style.md` (banned/avoid list).
1. `ABOUT ME/Brand Context/ARCHER-DESIGN-BRAND-CONTEXT.md` — tone, offers, trial, partner structure.
2. `crm/CRM-SCHEMA.md` — status values + follow-up date fields.
3. `Templates/Messages/MESSAGE-TEMPLATES.md` — reply skeletons.

## Exact instructions for the Skill
1. Read the Brand Context File.
2. Identify the response type from the list below (classify from the raw reply if needed).
3. Produce a short LinkedIn reply and an email reply, plus the best next action, CRM status update, and follow-up timing.
4. Keep every reply specific, warm, and free of pressure. Use objections as openings, not endings.

### Response types → handling
- **No response** → soft bump with a new angle or a concrete offer (5 free pieces). Don't guilt-trip. Timing: 4–6 days after first touch, max 2 bumps.
- **"Send me more info"** → send a tight summary + portfolio + offer the free trial as the real "info." Timing: same day.
- **"I'll pass this to marketing"** → thank + right-person ask + offer to send free samples so the handoff has substance. Timing: same day.
- **"We already have a team"** → position as overflow/bandwidth backup, not a replacement; offer to be on file + 5 free pieces. Timing: same day, then park 30–60 days.
- **"No budget"** → free trial costs nothing; plant the retainer-vs-headcount savings seed for later. Timing: same day, revisit next budget cycle.
- **"Circle back later"** → agree, pin a specific date, leave the door open with no pressure. Timing: set the exact date they implied.
- **"Who have you worked with?"** → name the relevant proof (Indigo Pittsburgh, Hampton, restaurant/spa) + portfolio. Timing: same day.
- **"What do you charge?"** → give range framing tied to cost-savings vs a hire, then pivot to the free trial before quoting hard numbers. Timing: same day. (Hand to Proposal Generator if they want specifics.)
- **"Interested"** → move fast: propose the free trial or a quick call; hand off to Trial Builder / Proposal Generator. Timing: immediately.
- **"Talk to this person"** → warm-intro reply to the new contact referencing the referrer; restart pipeline on them. Timing: same day.

## Output format
```
RESPONSE TYPE: [type]
Short LinkedIn response: [text]
Email response: [subject + text]
Best next action: [one step]
CRM status update: [status value from schema]
Follow-up timing: [when]
```

## Quality rules
- Treat every objection as a soft door, never a hard close.
- Specific to the lead and the prior thread; no canned-feeling replies.
- Cost-savings / bandwidth framing where relevant.
- Cap follow-ups so I never look desperate (max 2 no-response bumps).
- Banned-phrase check every time.

## What it must never do
- Never guilt, nag, or fake urgency.
- Never quote hard prices on a "what do you charge" without pivoting to value/trial first.
- Never drop a lead without setting a CRM status and date.
- Never use banned phrases.

## Usage example
> **Devon:** Lead replied "I'll pass this along to our marketing team." Follow-up?
>
> **Skill:** [thank-you + "could you point me to who runs creative for [Property]? I'll send them 5 free sample pieces so they've got something real to look at" → next action: get name → CRM status: Routed → follow-up in 3 days.]
