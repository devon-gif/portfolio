# Social Media Work Page Setup

Internal build notes for the reporting, proof, workflow, business-case, and
pricing sections added to `app/social-media-work/page.tsx`. Not linked from
the public site.

## Analytics screenshot

- Original, untouched file (lives in the other worktree, not this repo):
  `/Users/devonarcher/Developer/hotel-pipeline-os/public/Screenshot 2026-07-14 at 10.25.04 AM.png`
- Sanitized public path used on the page:
  `public/social-media-work/analytics/weekly-social-performance-report.png`
  (3036 x 1998px, PNG)
- What was redacted: the analytics tool's workspace branding/logo and the
  specific client account name shown in the account selector. Both regions
  are blurred. Every visible metric, chart, and number on the dashboard is
  real and unaltered.
- Alt text used on the page notes it is a representative example, since the
  client identity was intentionally redacted, and does not attribute it to
  any specific named client.

## Hotel Indigo quote (exact, verbatim)

> "During Archer Design's support, Hotel Indigo Pittsburgh
> University-Oakland reported becoming the top-performing Hotel Indigo on
> the East Coast."

Supporting copy directly below it:

> "The approach connected events, F&B, meetings, local demand drivers,
> seasonal priorities, and property storytelling to a consistent creative
> and social-media calendar."

**DO NOT REMOVE THIS QUALIFICATION** (must always appear directly below the
quote, same or smaller visual weight, never deleted or reworded):

> "Performance statement reflects reporting shared by the property during
> the engagement and should not be interpreted as an independently audited
> brand-wide claim."

These three strings live as constants in `app/social-media-work/page.tsx`:
`HOTEL_INDIGO_QUOTE`, `HOTEL_INDIGO_SUPPORTING_COPY`,
`HOTEL_INDIGO_QUALIFICATION`.

## Weekly analytics process list

Reach and impressions; Engagement; Content performance; Follower and
audience movement; Clicks or inquiries where available; Strongest posts and
formats; Emerging patterns or issues.

## Monthly performance review process list

Review what generated the strongest response; Identify content that
underperformed; Compare creative formats and subject matter; Adjust timing
and publishing cadence; Refine upcoming property priorities; Decide what
should continue, change, or stop; Update the next month's calendar
accordingly.

## 6-step workflow

01. Priorities: the hotel shares upcoming events, offers, need periods,
    restaurant priorities, meetings, packages, and property updates.
02. Calendar: a shared content calendar organizes what is planned, in
    production, awaiting approval, and scheduled.
03. Creative: Archer Design produces the graphics, social assets, motion,
    captions, campaign materials, and supporting formats.
04. Slack review: the team uploads property assets, requests changes,
    leaves feedback, and communicates approvals in one shared Slack channel.
05. Publishing (flagged "Full-management package only", does not apply to
    the Creative Production package): for full-management clients, approved
    work is scheduled and published across the agreed platforms.
06. Reporting: weekly analytics provide visibility, and the monthly review
    determines what should continue, change, or stop.

## Pricing constants

### Option one, Creative Production

- Price: "$1,000 per property / month" (starting at)
- Description: "For hotel and hospitality teams that manage their own
  publishing but need consistent, finished creative."
- Includes: Shared monthly content and campaign calendar; Social graphics
  and story assets; Short-form motion and Reels; F&B, event, package,
  meeting, and seasonal campaigns; Property and destination storytelling;
  Captions and campaign messaging where included in scope; Correctly sized
  publishing files; Two revision rounds per monthly batch.
- Explicit statement: "The client retains responsibility for scheduling,
  publishing, community engagement, and platform reporting."

### Option two, Creative + Social Management

- Price: "$1,700 per property / month" (starting at)
- Description: "For teams that want both ongoing creative production and
  management of the agreed social channels."
- Includes: Everything in Creative Production; Instagram and Facebook
  scheduling and publishing; Caption preparation; Content-calendar
  management; Weekly analytics updates; Monthly performance and strategy
  review; Ongoing content optimization; Shared Slack channel; Priority and
  campaign coordination; and the exact revision-language string below.

### Exact revision-language string (use verbatim everywhere revisions are described for the managed package)

> "Unlimited reasonable revisions within the agreed monthly scope and
> approval window."

Never use an unqualified "unlimited revisions." This lives as the
`UNLIMITED_REVISIONS_LANGUAGE` constant in `page.tsx` and is reused for both
the Business Case "flat rate may cover" copy and the Option Two includes
list.

## Exclusions list

Paid advertising and media spend; Daily comment or direct-message
community management; On-site photography; On-site filming; Influencer
management; Travel; Major website development; Full brand redesigns;
Crisis communications.

## Portfolio pricing note

"Multi-property portfolios are quoted through a custom portfolio structure
based on the number of unique property calendars, channels, monthly
deliverables, approval process, and level of centralized or property-level
coordination." No specific property count is estimated anywhere near this
note.

## 90-day pilot

Heading: "90-day pilot". Copy: "Begin with one or two properties to
establish the calendar, approval workflow, reporting rhythm, and creative
cadence before considering a wider portfolio rollout." No price is listed
for the pilot.

## Illustrative cost model

New client component: `components/marketing/CostComparisonCalculator.tsx`.
Uses the `CostComparisonAssumptions` type (annualSalary,
employerPayrollRate, benefitsRate, softwareAndEquipmentAnnual,
recruitingAndOnboardingAnnualized, additionalFreelancerMonthly,
internalManagementHoursMonthly, internalManagerHourlyCost,
archerMonthlyRate), all editable via number inputs. The persistent caption
below the results (always visible, not a tooltip) reads:

> "Illustrative comparison only. Example based on transparent, editable
> assumptions you can adjust above. Actual costs vary by organization,
> role, location, and benefits structure. This is not legal, tax,
> accounting, or HR advice, and it does not guarantee that engaging an
> independent contractor avoids every employer obligation in every
> jurisdiction."

## Items requiring client/Devon approval before this goes live publicly

1. The Hotel Indigo "top-performing Hotel Indigo on the East Coast" claim
   wording, exactly as it appears above, needs sign-off from Devon and/or
   the Hotel Indigo Pittsburgh University-Oakland property before this page
   is published or linked publicly.
2. The two specific prices ($1,000 per property / month for Creative
   Production, $1,700 per property / month for Creative + Social
   Management) need business sign-off before publishing.
3. Confirmation that the analytics screenshot's redaction (blurred
   workspace branding and blurred client account name) is sufficient and
   approved for public use, since every metric on the dashboard itself is
   left visible and unaltered.
