# Archer Design — Hospitality Outreach & CRM System

A reusable Claude Skills system for signing hotels, restaurants, spas, resorts, wedding/event venues, and hospitality groups. Built around one principle: **context engineering beats clever one-off prompts.** The Skills compound because they all read the same persistent context.

## How it works (the pipeline)
```
Lead in → Context Loader → Lead Researcher → Lead Classifier
  → Outreach Writer → (reply) → Follow-Up Generator
  → Trial Builder / Proposal Generator / Partner Builder
  → CRM Update Assistant (logs every step)
```
Supporting Skills: LinkedIn Comment Assistant, Job Signal Hijack Assistant, Socratic Task Interviewer, Fresh Session Handoff Writer.

## Folder map
```
ABOUT ME/
  about-me.md                    ← identity + settled decisions (read first, always)
  voice-profile.md               ← how Devon sounds (read before any message)
  anti-ai-writing-style.md       ← banned/avoid list (read before anything public-facing)
  Brand Context/
    ARCHER-DESIGN-BRAND-CONTEXT.md   ← source of truth

Skills/
  Lead Research/   hospitality-lead-researcher, lead-classifier
  Outreach/        hospitality-outreach-message-writer, linkedin-comment-assistant, job-signal-hijack-assistant
  Follow-Up/       hospitality-follow-up-generator
  Proposal/        trial-builder, partner-referral-offer-builder, proposal-package-generator
  CRM/             crm-update-assistant
  System/          context-loader, socratic-task-interviewer, fresh-session-handoff-writer

PROJECTS/hotel-outreach-crm/   ← working files: lead-research-notes, best-performing-messages,
                                  objection-responses, partner-offer, free-trial-offer,
                                  package-pricing-notes, proposal-templates, crm-schema, daily-workflow

Templates/                     ← reusable message skeletons (direct-buyer, partner, hiring-signal,
                                  pass-to-marketing, already-have-team, seven-day-trial, proposal-outline,
                                  LinkedIn-comment) + Messages/

Examples/Portfolio Proof/      ← proof points + how to match them to leads
crm/CRM-SCHEMA.md              ← canonical CRM schema
CLAUDE OUTPUTS/                ← final deliverables (archer_hospitality_[type]_[company]_v1.md)

ARCHER-IMPLEMENTATION-PLAN.md · ARCHER-USAGE-EXAMPLES.md · ARCHER-QUALITY-CHECKLIST.md
```

## Global rules (also in AGENTS.md)
1. Read `ABOUT ME/about-me.md` before starting.
2. Read `ABOUT ME/voice-profile.md` before writing any message.
3. Read `ABOUT ME/anti-ai-writing-style.md` before anything public-facing.
4. Read relevant `PROJECTS/hotel-outreach-crm/` files before outreach/CRM/proposals/follow-ups.
5. Ask clarifying questions on ambiguous tasks; use Socratic prompting for big builds.
6. Keep project contexts separate; write a handoff when switching sessions.

## 12 Skills
1. Hospitality Lead Researcher
2. Lead Classifier
3. Hospitality Outreach Message Writer
4. Hospitality Follow-Up Generator
5. 7-Day / 5-Asset Trial Builder
6. Partner / Referral Offer Builder
7. Proposal & Package Generator
8. CRM Update Assistant
9. LinkedIn Comment / Visibility Assistant
10. Job Signal Hijack Assistant
11. Context Loader *(system)*
12. Socratic Task Interviewer *(system)*
13. Fresh Session Handoff Writer *(system)*

## Start here
Read `ARCHER-IMPLEMENTATION-PLAN.md`, then run the Day 1 steps.
```
