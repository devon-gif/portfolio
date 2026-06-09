<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:archer-design-global-instructions -->
# Archer Design — Global Instructions for Claude / Cowork

This repo also contains the **Archer Design hospitality outreach & CRM system** (folders: `ABOUT ME/`, `Skills/`, `PROJECTS/`, `Templates/`, `Examples/`, `crm/`, `CLAUDE OUTPUTS/`). When working on any Archer Design outreach, CRM, lead, proposal, partner, or content task, follow these rules:

1. **Always read `ABOUT ME/about-me.md` before starting** any Archer Design task.
2. **Always read `ABOUT ME/voice-profile.md` before writing any message.**
3. **Always read `ABOUT ME/anti-ai-writing-style.md` before writing anything public-facing.**
4. **Always read the relevant `PROJECTS/hotel-outreach-crm/` files** before creating outreach, CRM fields, proposals, or follow-ups (e.g. `objection-responses.md`, `free-trial-offer.md`, `partner-offer.md`, `package-pricing-notes.md`, `crm-schema.md`).
5. Also read `ABOUT ME/Brand Context/ARCHER-DESIGN-BRAND-CONTEXT.md` (source of truth) and `crm/CRM-SCHEMA.md` when relevant.
6. **For ambiguous tasks, ask clarifying questions first** before producing final output.
7. **Use Socratic prompting for larger tasks:** ask what information is needed, propose a plan, then execute after approval. (See the `socratic-task-interviewer` Skill.)
8. **Keep each project context separate** to avoid context bleeding — don't mix the hospitality system with the Next.js app code.
9. **When switching sessions, create a handoff document** (use the `fresh-session-handoff-writer` Skill): what's done, decisions made, what worked, what failed, next step.
10. Save final deliverables to `CLAUDE OUTPUTS/` using `archer_hospitality_[output-type]_[lead/company]_v1.md`.

**Principle:** context engineering > clever one-off prompts. The goal is consistent, reusable, human-sounding outreach and CRM workflows that compound over time.
<!-- END:archer-design-global-instructions -->

