---
name: fresh-session-handoff-writer
description: When an Archer Design conversation or CRM build gets long, generate a clean handoff document so a new Claude session can continue without losing context. Use at end of day, when context is full, or when switching sessions/projects.
---

# Fresh Session Handoff Writer

## Purpose
Prevent context loss across sessions. Produce a self-contained handoff that lets a fresh Claude session pick up exactly where the last one left off — including what worked, what failed, and the exact next step.

## When to use it
- A session/conversation has gotten long.
- Switching projects or ending the day mid-build.
- Before a context reset.

## What it should ask me for
1. What project are we handing off?
2. What has been completed?
3. What decisions have been made?
4. What is currently broken or unresolved?
5. What should the next task be?
(If Devon doesn't have answers handy, infer from the session and confirm.)

## What files/context it should read first
1. `ABOUT ME/about-me.md`, `ABOUT ME/voice-profile.md`, `ABOUT ME/anti-ai-writing-style.md`.
2. The relevant `PROJECTS/hotel-outreach-crm/` files for the project.
3. `crm/CRM-SCHEMA.md`.

## Exact instructions for the Skill
1. Read the context files.
2. Collect the five answers (ask, then infer/confirm anything missing).
3. Assemble the handoff in the output format below.
4. Include a ready-to-paste prompt that re-establishes context in a new session.
5. Save to `CLAUDE OUTPUTS/archer_hospitality_handoff_[project]_v1.md`.

## Output format
```
HANDOFF — [Project] — [date]
Project summary: [what this is]
Current goal: [the objective]
Decisions made: [bulleted, do-not-relitigate]
Current files / schema / messages: [what exists + where]
Best-performing prompts/messages so far: [what's working]
Open questions: [unresolved]
Exact next steps: [numbered, concrete]

--- PASTE INTO A FRESH SESSION ---
[A complete prompt that loads the Archer Design context (read ABOUT ME + relevant PROJECTS files), states the goal, lists decisions made, and gives the next task.]
```

## Quality rules
- The "paste into a fresh session" block must work standalone with zero prior memory.
- Decisions section must capture anything that shouldn't be re-debated.
- Next steps are concrete and ordered, not vague.

## What it must never do
- Never lose or contradict decisions in `about-me.md`.
- Never produce a vague handoff ("continue the work").
- Never skip the paste-ready prompt.

## Usage example
> **Devon:** Session's getting long, write a handoff for the CRM build.
>
> **Skill:** [asks the 5 questions → outputs full handoff + a paste-ready prompt that tells the next session to read the context files, lists what's built and decided, and names the next task: "wire follow-up timing into CRM fields."]
