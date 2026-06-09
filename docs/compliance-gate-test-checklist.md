# Compliance Gate — Manual Test Checklist

The repo has no test runner (only `eslint`), so verify `lib/compliance-gate.ts` manually
against the dev DB. Call `runComplianceGate({ contactId, outreachQueueId, channel })`
from a temporary route or a `node` script using the service-role client.

Each scenario lists the setup and the expected result. After each run, confirm a
`compliance_checks` row was written and (when `outreachQueueId` is passed) the
`outreach_queue` item's `compliance_check_id` + `compliance_status` were updated.

| # | Scenario | Setup | Channel | Expected |
|---|---|---|---|---|
| 1 | Suppressed contact fails | contact.email in `suppression_list` | email | `fail`, risk `not_suppressed` |
| 2 | Opted-out contact fails | `contacts.opted_out = true` | email | `fail`, risk `not_suppressed` |
| 3 | Bounced contact fails | `contacts.bounced = true` | email | `fail`, risk `not_suppressed` |
| 4 | Recently contacted fails | `last_contacted_at = now()` (cooldown 14d) | email | `fail`, risk `not_recently_contacted` |
| 5 | Unverified email fails (email) | email present, no verification, confidence < 80 | email | `fail`, risk `email_verified_or_high_conf` |
| 6 | Verified email passes the email check | `email_verification_status='verified'` | email | that check true |
| 7 | High-confidence email passes | `email_confidence = 85` | email | that check true |
| 8 | LinkedIn passes without email if manual + not suppressed | no email; source allowed; ≥1 source_url; detail present; not suppressed | linkedin | `pass` (email checks are n/a) |
| 9 | Missing source URL fails | no `source_urls` rows for contact/company | email | `fail`, risk `has_source_urls` |
| 10 | Inference passes source check | `source_urls` row with `url=null, is_inference=true` | email | `no_invented_fields` true |
| 11 | Invented fact fails | `source_urls` row with `url=null, is_inference=false` | email | `fail`, risk `no_invented_fields` (note: DB constraint normally blocks this insert) |
| 12 | Missing opt-out/address fails email | `email_draft` without "unsubscribe"/address | email | `fail`, risk `email_has_optout_and_address` |
| 13 | Footer present passes | draft contains `{{compliance_block}}` or unsubscribe + address | email | that check true |
| 14 | No specific detail fails | no `personalization_angle`, no `best_angle` | email | `fail`, risk `has_specific_detail` |
| 15 | LinkedIn-sourced contact fails | `contacts.source='linkedin'` | email | `fail`, risk `allowed_contact_source` |
| 16 | Unknown source fails | `contacts.source=null` | email | `fail`, risk `allowed_contact_source` |
| 17 | Clean qualified lead passes | verified email, ≥1 source_url, angle set, draft has footer, source='website', not suppressed, not recently contacted | email | `pass`, empty `risk_flags` |

### Channel rules to confirm
- Email channel: `email_verified_or_high_conf` and `email_has_optout_and_address` are **required**.
- LinkedIn channel: those two are recorded as `null` (n/a) and do **not** block; `linkedin_manual_only` is always true; suppression + allowed-source + source URLs + specific detail still apply.
- Nothing in this module sends. It only writes `compliance_checks` and updates the queue item.

### Quick harness (temporary)
```ts
// app/api/_dev/gate/route.ts (delete after testing)
import { runComplianceGate } from "@/lib/compliance-gate";
export async function POST(req: Request) {
  const { contactId, outreachQueueId, channel } = await req.json();
  return Response.json(await runComplianceGate({ contactId, outreachQueueId, channel }));
}
```
