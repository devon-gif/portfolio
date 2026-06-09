-- Hotel Opportunity OS — outreach templates by lead_type
-- Idempotent: fixed UUIDs + ON CONFLICT DO NOTHING. Loads the same templates the
-- app ships as mock fallbacks. Short, human, value-led; never lead with price;
-- emphasize saving the overhead of a full-time creative hire.
-- Variables: {{first_name}} {{company_name}} {{hiring_role_title}} {{opportunity_trigger}}
--            {{specific_use_cases}} {{personalization_angle}} {{portfolio_url}} {{stats_block}}

insert into templates (id, name, channel, template_type, subject, body, tags) values
('66666666-0000-0000-0000-000000000001', 'Hiring Signal Contract Alternative', 'email', 'hiring_signal',
 $s$Saw you're hiring a {{hiring_role_title}}$s$,
 $b$Hi {{first_name}},

Noticed {{company_name}} is hiring a {{hiring_role_title}} — usually a sign you need {{specific_use_cases}} handled well, and soon.

Before you carry a full-time salary, benefits, and software for it: we plug in as an embedded creative team and cover the same work on contract — no overhead, no onboarding lag.

{{stats_block}}

Worth a quick look? Happy to share examples: {{portfolio_url}}

Best,
{{sender_name}}

{{opt_out_line}}$b$,
 array['hiring_signal','contract-alternative']),

('66666666-0000-0000-0000-000000000002', 'Hotel Marketing Overflow', 'email', 'marketing_overflow',
 $s$Extra creative hands for {{company_name}}$s$,
 $b$Hi {{first_name}},

Marketing teams at places like {{company_name}} usually have more ideas than capacity. When {{personalization_angle}} is in motion, {{specific_use_cases}} tends to pile up.

We act as overflow — an on-demand creative team that absorbs the extra without you adding headcount or carrying the overhead of a full-time hire.

{{stats_block}}

Open to a quick look? {{portfolio_url}}

Best,
{{sender_name}}

{{opt_out_line}}$b$,
 array['marketing_overflow','overflow']),

('66666666-0000-0000-0000-000000000003', 'Hospitality Partner Referral', 'email', 'partner_referral',
 $s$Creative support for your hotel clients$s$,
 $b$Hi {{first_name}},

You work closely with hospitality brands, and {{personalization_angle}} keeps coming up. A lot of them need {{specific_use_cases}} but can't justify a full-time creative hire.

That's exactly where we fit — embedded creative on contract, no overhead for them. Could be a clean add for your network (happy to make it worth your while).

{{stats_block}}

Worth comparing notes? {{portfolio_url}}

Best,
{{sender_name}}

{{opt_out_line}}$b$,
 array['partner','referral']),

('66666666-0000-0000-0000-000000000004', 'Spa / Wellness Creative Support', 'email', 'spa_wellness',
 $s$Creative for the {{company_name}} spa & wellness story$s$,
 $b$Hi {{first_name}},

The spa and wellness side of {{company_name}} is exactly the kind of experience that deserves strong creative — {{specific_use_cases}} that actually fill treatment calendars.

We handle that as a contract creative team, so you get the output without the overhead of a full-time hire.

{{stats_block}}

A few relevant examples: {{portfolio_url}}

Best,
{{sender_name}}

{{opt_out_line}}$b$,
 array['spa','wellness']),

('66666666-0000-0000-0000-000000000005', 'F&B / Restaurant Event Promo Support', 'email', 'restaurant_fnb',
 $s$Filling seats at {{company_name}}'s restaurant & events$s$,
 $b$Hi {{first_name}},

Restaurants and event spaces live or die on promotion. For {{company_name}}, {{specific_use_cases}} is usually what drives covers and bookings.

We run that as an embedded creative team on contract — same output as a full-time hire, none of the payroll or overhead.

{{stats_block}}

Want to see a few examples? {{portfolio_url}}

Best,
{{sender_name}}

{{opt_out_line}}$b$,
 array['restaurant_fnb','fnb','events']),

('66666666-0000-0000-0000-000000000006', 'Wedding / Events Venue Creative Support', 'email', 'wedding_events',
 $s$Booking more weddings & events at {{company_name}}$s$,
 $b$Hi {{first_name}},

Wedding and event inquiries come down to how the venue is shown. For {{company_name}}, {{specific_use_cases}} is what turns browsers into booked dates.

We cover that as a contract creative team — premium output without the overhead of a full-time hire.

{{stats_block}}

A few venue examples: {{portfolio_url}}

Best,
{{sender_name}}

{{opt_out_line}}$b$,
 array['wedding_events','weddings','events']),

('66666666-0000-0000-0000-000000000007', 'Multi-Property Hotel Group Pilot', 'email', 'multi_property_pilot',
 $s$A creative pilot across {{company_name}}'s properties$s$,
 $b$Hi {{first_name}},

Across a group like {{company_name}}, creative consistency is hard — every property needs {{specific_use_cases}}, and full-time hires per property don't scale.

We'd suggest a small pilot: embed as your creative team for one or two properties, prove it out, then roll wider. Contract model, so no per-property overhead.

{{stats_block}}

Open to scoping a pilot? {{portfolio_url}}

Best,
{{sender_name}}

{{opt_out_line}}$b$,
 array['enterprise_router','multi-property','pilot']),

('66666666-0000-0000-0000-000000000008', 'Job Application + Contract Option', 'email', 'job_application',
 $s$Re: your {{hiring_role_title}} role — a flexible option$s$,
 $b$Hi {{first_name}},

I'm interested in the {{hiring_role_title}} role at {{company_name}}. One thing worth flagging: if you need the work covered now (or before a full-time hire is approved), I also offer the same on contract.

That means {{specific_use_cases}} handled immediately — no payroll, benefits, or onboarding overhead while you decide.

{{stats_block}}

Portfolio here: {{portfolio_url}}. Happy either way.

Best,
{{sender_name}}

{{opt_out_line}}$b$,
 array['job_application','contract-option'])
on conflict (id) do nothing;
