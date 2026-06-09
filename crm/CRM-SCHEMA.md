# Archer Design — CRM Schema

> The authority for every field and allowed value used across all Skills. If a Skill outputs a CRM value, it must come from this file. Works in any CRM (Notion, Airtable, HubSpot, a spreadsheet) — these are the columns.

## Core fields

| Field | Type | Allowed values |
|---|---|---|
| Company | text | — |
| Contact name | text | — |
| Contact role | text | — |
| Company category | select | `hotel`, `select-service hotel`, `restaurant`, `F&B group`, `spa`, `resort`, `wedding-event venue`, `hospitality group` |
| Lead type | select | `direct buyer`, `partner/referral`, `hiring signal`, `property-level champion`, `enterprise router`, `low priority` |
| Lead status | select | `New`, `Researched`, `Contacted`, `Engaged`, `Routed`, `Trial Offered`, `Trial In Progress`, `Trial Delivered`, `Proposal Sent`, `Negotiating`, `Won`, `Lost`, `Nurture`, `Partner Active` |
| Priority score | number | 1–10 |
| Source | select | `cold list`, `LinkedIn`, `referral`, `inbound`, `job board`, `event`, `other` |
| Best angle | text | — |
| Suggested offer | select | `free trial`, `1-month pilot`, `6-month retainer`, `multi-property pilot`, `restaurant/F&B`, `event/wedding`, `spa/wellness`, `select-service`, `partner deal`, `right-person ask`, `none` |
| Next action | text | — |
| Follow-up date | date | YYYY-MM-DD |
| Last contacted | date | YYYY-MM-DD |
| Notes | long text | — |
| Message history | long text | running one-liners |
| Tags | multi-select | see tag library below |
| Examples attached? | checkbox | yes / no |
| Portfolio sent? | checkbox | yes / no |

## Partner/referral fields (when Lead type = partner/referral)

| Field | Type | Notes |
|---|---|---|
| Partner type | select | `hotel consultant`, `sales consultant`, `recruiter`, `task-force pro`, `advisor`, `photographer`, `PR`, `agency` |
| Intros made | number | count of property intros |
| Properties referred | text | linked companies |
| Commission % | text | placeholder until confirmed |
| Contracts active | number | resulting paid clients |
| Agreement status | select | `Discussing`, `Agreed`, `Signed`, `Inactive` |

## Tag library

`hotel-group`, `multi-property`, `independent`, `flag-brand`, `select-service`, `restaurant`, `f&b`, `spa`, `wellness`, `resort`, `wedding`, `event-venue`, `inconsistent-posting`, `unused-photos`, `hiring-signal`, `seasonal-campaign`, `referral-source`, `warm-intro`, `decision-maker`, `champion`, `router`, `best-fit`, `bad-fit`, `re-engage`, `budget-cycle`

## Status flow (typical)

`New → Researched → Contacted → Engaged → Trial Offered → Trial In Progress → Trial Delivered → Proposal Sent → Negotiating → Won`

Branches: `Routed` (router forwards), `Nurture` (not now), `Lost`, `Partner Active` (referral partners).

## Field-to-Skill map

- **Lead Researcher** writes: category, properties, priority, best angle, suggested offer, tags, next action.
- **Lead Classifier** writes: lead type.
- **Outreach Writer / Follow-Up** write: status, last contacted, message history, follow-up date.
- **Trial Builder / Proposal Generator** write: status, suggested offer.
- **Partner Builder** writes: partner fields.
- **CRM Update Assistant** can write any field — it's the reconciler.
