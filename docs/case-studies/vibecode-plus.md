# VibeCode+ — Designing a Human-Controlled AI Repair System

> Sanitized architecture case study. The production repository is private.

## Overview

VibeCode+ is a GitHub-native prototype exploring a specific question:

**Can an AI system diagnose and propose software repairs while keeping the developer informed and in control?**

Rather than building another coding chatbot, I designed the experience around repository actions, observable system state, deterministic checks and bounded autonomy.

The user can connect a repository, run a health check, inspect failures, initiate a repair workflow, monitor progress and review a draft pull request. The system is explicitly designed **not** to silently merge its own changes.

---

## My role

I designed and built the product across:

- product concept and interaction model
- UX/UI and system-state design
- Next.js / React implementation
- GitHub App / Octokit integration
- automated health and repair workflows
- model orchestration
- policy and guardrail design
- Supabase-backed application state
- testing and failure-state hardening
- human-review and draft-PR flow

The project is a good example of how I approach Creative Technology: design the user experience and the technical behavior together, then test the real system rather than stopping at a visual prototype.

---

## The user experience

The primary experience is action-based rather than chat-based.

A user can:

1. Connect a GitHub repository
2. Run a repository health check
3. See installation, type-checking, linting, testing and build stages
4. Inspect evidence behind a detected problem
5. Initiate a bounded repair workflow
6. Watch the repair move through recorded states
7. See when the system is blocked or requires human review
8. Review a proposed draft pull request in GitHub

This changes the design problem from "How should the assistant respond?" to:

- What is the system doing right now?
- What evidence does it have?
- What is it allowed to change?
- When should automation stop?
- How does the user recover from failure?
- What still requires human judgment?

---

## Architecture

### Application layer

- Next.js
- React
- TypeScript
- Supabase
- GitHub App / Octokit
- Anthropic SDK
- Resend
- Stripe

### Repository execution layer

GitHub Actions executes the repository's own validation commands and records structured workflow state.

The system separates **health detection** from **model-assisted repair**.

A health check can run without an AI provider key or model call. This means the system can first establish whether a real technical failure exists using deterministic repository evidence before spending model tokens or allowing a repair attempt.

---

## Health-state model

The health workflow distinguishes between several materially different outcomes:

### CLEAN
Configured validation steps passed.

### ISSUES_FOUND
A real check failed and there is evidence of a potentially repairable issue.

### CHECK_FAILED
The health harness itself could not complete—for example because installation or the check environment failed.

### HUMAN_REVIEW_REQUIRED
The system cannot establish enough trustworthy evidence to continue autonomously.

This distinction matters because a failed *checker* should not be presented to the user as a failed *application*.

---

## Bounded repair

When a real issue is detected, the repair system gathers repository context and evaluates whether an automated proposal is safe.

The policy layer can produce outcomes such as:

- **BLOCKED**
- **INSUFFICIENT_CONTEXT**
- **HUMAN_REVIEW_REQUIRED**
- **ALLOW_DRAFT / PR_READY**

A model-generated patch is therefore not automatically equivalent to an accepted repair.

---

## Protected surfaces

VibeCode+ treats some code paths and capabilities as higher-risk than ordinary product code.

Examples include:

- authentication and authorization
- security / permissions
- billing and Stripe
- middleware
- service-role behavior
- database migrations
- GitHub workflow configuration
- infrastructure / deployment configuration
- generated files and sensitive capabilities

If the system encounters a change where safe intent cannot be established, the appropriate behavior is to stop or escalate—not to optimize for "making the tests green."

---

## Verification is necessary, not sufficient

A key design rule in the project is:

> Passing typecheck, lint, tests and build is evidence that a proposal is technically consistent, but it does not prove that the repair preserves product semantics, security or authorization.

That is why successful verification still results in a **draft pull request for human review**, rather than an autonomous merge.

This is one of the core product decisions behind VibeCode+.

---

## Transparency

The interface is designed to expose real backend state rather than simulate progress.

The product surfaces:

- current phase
- completed phases
- terminal states
- failure reasons
- whether a repair is actually active
- whether a proposal was published
- whether human review is required

During hardening, I specifically addressed cases where stale local state could conflict with the real GitHub workflow state. The application now treats recorded workflow phases and terminal results as authoritative and stops polling when a run is complete.

---

## Failure handling

An autonomous workflow needs to communicate several failure modes differently.

Examples:

- repository checkout failed
- dependencies could not install
- no repairable issue was established
- provider / model call failed
- a proposed repair touched a protected surface
- repository state changed after analysis
- verification failed
- a valid proposal could not safely be published

The UI should never collapse all of those into a generic red "error" state because each one implies a different next action for the user.

---

## Testing and validation

The system has been built with an expanding automated test suite around state transitions, repair eligibility, workflow metadata and UI behavior.

At the latest documented validation pass:

- **216 / 216 tests passed**
- type checking passed
- production build passed

A remaining area of deliberate validation has been live end-to-end GitHub behavior, including reload recovery during an active run, callback timing and real draft-PR publication.

I prefer documenting those limits explicitly rather than implying that a mocked workflow proves production behavior.

---

## What I learned

### Agent UX is state-machine UX
Once an AI system can take actions, interface design becomes inseparable from lifecycle and state design.

### Users need evidence, not theater
A progress indicator is only trustworthy when it maps to real system activity.

### Autonomy needs boundaries
The goal is not maximum automation. The goal is the maximum amount of **safe, inspectable and reversible** automation appropriate to the task.

### "Works" is not the same as "safe"
A patch can compile and still violate authorization, product behavior or intent.

### Human review is a feature
Stopping the system is sometimes the correct product outcome.

---

## Why this project matters to my work

VibeCode+ sits directly at the intersection of the work I want to continue doing:

**product design + AI systems + frontend implementation + developer experience + human-centered automation**

It reflects the role I see Creative Technologists increasingly playing: not simply designing screens around AI, but shaping the behavior, boundaries and understandable interface of systems that can take actions on a user's behalf.

---

**Devon Archer**  
Creative Technologist / Design Engineer  
[Portfolio](https://www.archerdesign.shop/devon) · [GitHub](https://github.com/devon-gif)
