-- Hotel Pipeline OS — Seed Data
-- Run AFTER schema.sql

-- ─── Companies ───────────────────────────────────────────────────────────────
insert into companies (id, name, type, size, website, hq_city, hq_state, notes) values
  ('11111111-0000-0000-0000-000000000001', 'Meridian Hotel Group', 'hotel_management_company', 'large', 'https://meridianhotels.com', 'New York', 'NY', 'Top 10 US management company. Key decision makers in procurement.'),
  ('11111111-0000-0000-0000-000000000002', 'Pacific Boutique Hotels', 'boutique_hotel_group', 'medium', 'https://pacificboutiquehotels.com', 'Los Angeles', 'CA', 'Strong lifestyle brand presence. Open to creative partnerships.'),
  ('11111111-0000-0000-0000-000000000003', 'Summit Resorts & Spa', 'resort_group', 'large', 'https://summitresorts.com', 'Denver', 'CO', 'Expanding into mountain luxury segment.'),
  ('11111111-0000-0000-0000-000000000004', 'Urban Stay Hospitality', 'hospitality_group', 'medium', 'https://urbanstay.com', 'Chicago', 'IL', 'Urban extended-stay focus. Looking to refresh brand.'),
  ('11111111-0000-0000-0000-000000000005', 'The Luxe Collection', 'branded_hotel', 'enterprise', 'https://theluxecollection.com', 'Miami', 'FL', 'Luxury tier. Long sales cycles but high deal value.'),
  ('11111111-0000-0000-0000-000000000006', 'Harbour View Hotels', 'independent_lifestyle_hotel', 'small', 'https://harbourviewhotels.com', 'Seattle', 'WA', 'Independent operator with 3 properties. Warm referral from partner.'),
  ('11111111-0000-0000-0000-000000000007', 'Cascade Hospitality Partners', 'hotel_management_company', 'medium', 'https://cascadehospitality.com', 'Portland', 'OR', 'Regional player. Strong ROI focus.');

-- ─── Contacts ────────────────────────────────────────────────────────────────
insert into contacts (id, first_name, last_name, title, company_id, company_name, company_type, type, status, email, phone, linkedin_url, city, state, notes, score, opted_out, source) values
  ('22222222-0000-0000-0000-000000000001', 'Sarah', 'Chen', 'VP of Marketing', '11111111-0000-0000-0000-000000000001', 'Meridian Hotel Group', 'hotel_management_company', 'decision_maker', 'new', 'sarah.chen@meridianhotels.com', '(212) 555-0101', 'https://linkedin.com/in/sarahchen', 'New York', 'NY', 'Met at Hospitality Summit. Interested in brand refresh for 3 properties.', 9, false, 'manual'),
  ('22222222-0000-0000-0000-000000000002', 'Marcus', 'Thompson', 'Director of Brand Experience', '11111111-0000-0000-0000-000000000002', 'Pacific Boutique Hotels', 'boutique_hotel_group', 'buyer', 'contacted', 'marcus.t@pacificboutiquehotels.com', '(310) 555-0202', 'https://linkedin.com/in/marcusthompson', 'Los Angeles', 'CA', 'Looking for lifestyle photography content. Budget confirmed Q2.', 8, false, 'linkedin'),
  ('22222222-0000-0000-0000-000000000003', 'Jennifer', 'Park', 'Chief Marketing Officer', '11111111-0000-0000-0000-000000000005', 'The Luxe Collection', 'branded_hotel', 'decision_maker', 'replied', 'j.park@theluxecollection.com', '(305) 555-0303', 'https://linkedin.com/in/jenniferpark', 'Miami', 'FL', 'Replied to cold email. Wants to see portfolio. High potential.', 10, false, 'manual'),
  ('22222222-0000-0000-0000-000000000004', 'David', 'Rivera', 'Marketing Manager', '11111111-0000-0000-0000-000000000003', 'Summit Resorts & Spa', 'resort_group', 'buyer', 'new', 'david.r@summitresorts.com', null, 'https://linkedin.com/in/davidrivera', 'Denver', 'CO', 'Handles creative vendor relationships. New in role 6 months.', 7, false, 'import'),
  ('22222222-0000-0000-0000-000000000005', 'Amanda', 'Foster', 'Brand Director', '11111111-0000-0000-0000-000000000004', 'Urban Stay Hospitality', 'hospitality_group', 'decision_maker', 'meeting_set', 'amanda@urbanstay.com', '(312) 555-0505', null, 'Chicago', 'IL', 'Call scheduled for next Tuesday. Needs video production primarily.', 8, false, 'referral'),
  ('22222222-0000-0000-0000-000000000006', 'Robert', 'Kim', 'Owner / Operator', '11111111-0000-0000-0000-000000000006', 'Harbour View Hotels', 'independent_lifestyle_hotel', 'buyer', 'new', 'rob@harbourviewhotels.com', '(206) 555-0606', 'https://linkedin.com/in/robertkim', 'Seattle', 'WA', 'Warm referral from Jamie (partner). Small budget but motivated.', 6, false, 'referral'),
  ('22222222-0000-0000-0000-000000000007', 'Lisa', 'Martinez', 'VP Operations', '11111111-0000-0000-0000-000000000007', 'Cascade Hospitality Partners', 'hotel_management_company', 'influencer', 'contacted', 'l.martinez@cascadehospitality.com', '(503) 555-0707', 'https://linkedin.com/in/lisamartinez', 'Portland', 'OR', 'Not the budget owner but strong internal influence.', 5, false, 'linkedin'),
  ('22222222-0000-0000-0000-000000000008', 'Thomas', 'Wright', 'Creative Director', '11111111-0000-0000-0000-000000000001', 'Meridian Hotel Group', 'hotel_management_company', 'influencer', 'new', 't.wright@meridianhotels.com', null, 'https://linkedin.com/in/thomaswright', 'New York', 'NY', 'Collaborates with Sarah on creative decisions.', 6, false, 'manual'),
  ('22222222-0000-0000-0000-000000000009', 'Nicole', 'Adams', 'Digital Marketing Lead', '11111111-0000-0000-0000-000000000002', 'Pacific Boutique Hotels', 'boutique_hotel_group', 'buyer', 'replied', 'nicole@pacificboutiquehotels.com', '(310) 555-0909', null, 'Los Angeles', 'CA', 'Handles social and digital content budget. Works alongside Marcus.', 7, false, 'manual'),
  ('22222222-0000-0000-0000-000000000010', 'Kevin', 'Shah', 'Purchasing Manager', '11111111-0000-0000-0000-000000000003', 'Summit Resorts & Spa', 'resort_group', 'buyer', 'not_fit', null, null, null, 'Denver', 'CO', 'Procurement focus only — not the right contact for creative services.', 1, false, 'import'),
  ('22222222-0000-0000-0000-000000000011', 'Michelle', 'Torres', 'Senior Brand Manager', '11111111-0000-0000-0000-000000000005', 'The Luxe Collection', 'branded_hotel', 'buyer', 'new', 'm.torres@theluxecollection.com', '(305) 555-1111', 'https://linkedin.com/in/michelletorres', 'Miami', 'FL', 'Reports to Jennifer Park. Execute on brand campaigns.', 7, false, 'manual'),
  ('22222222-0000-0000-0000-000000000012', 'James', 'O''Brien', 'GM / Owner', '11111111-0000-0000-0000-000000000006', 'Harbour View Hotels', 'independent_lifestyle_hotel', 'decision_maker', 'won', 'james@harbourviewhotels.com', '(206) 555-1212', null, 'Seattle', 'WA', 'Signed a 3-property photography retainer. Great client.', 9, false, 'referral'),
  ('22222222-0000-0000-0000-000000000013', 'Patricia', 'Lee', 'Marketing Coordinator', '11111111-0000-0000-0000-000000000007', 'Cascade Hospitality Partners', 'hotel_management_company', 'unknown', 'opted_out', 'patricia@cascadehospitality.com', null, null, 'Portland', 'OR', 'Requested removal from list.', 0, true, 'import');

-- ─── Suppression List ────────────────────────────────────────────────────────
insert into suppression_list (email, reason, source) values
  ('patricia@cascadehospitality.com', 'Unsubscribe request', 'email_reply'),
  ('noreply@example.com', 'Generic no-reply address', 'manual');

-- ─── Templates ───────────────────────────────────────────────────────────────
insert into templates (id, name, type, subject, body, tags) values
  ('33333333-0000-0000-0000-000000000001', 'Cold Intro — Hotel Brand', 'email', 'Elevating [Hotel Name]''s visual story',
'Hi [First Name],

I came across [Hotel Name] and was genuinely impressed by [specific detail about their property/brand].

I''m a hospitality-focused creative director specializing in photography and brand content for boutique and luxury hotels. My work helps properties like yours attract the right guests, justify premium rates, and stand out on OTAs.

Would you be open to a 20-minute call to explore whether there''s a fit?

Best,
[Sender Name]', ARRAY['cold', 'intro', 'hotel', 'email']),

  ('33333333-0000-0000-0000-000000000002', 'LinkedIn Cold Connect', 'linkedin', null,
'Hi [First Name] — I specialize in visual branding for boutique hotels and came across [Hotel Name]. Would love to connect and share some relevant work. No pitch — just a quick hello.', ARRAY['linkedin', 'cold', 'connect']),

  ('33333333-0000-0000-0000-000000000003', 'Follow-up #1 (No Reply)', 'email', 'Re: Visual content for [Hotel Name]',
'Hi [First Name],

Just following up on my note from last week. I know things get busy.

I recently wrapped a project for a [similar property type] — happy to share a quick case study if helpful.

Worth a 15-minute chat?

[Sender Name]', ARRAY['followup', 'nurture', 'email']),

  ('33333333-0000-0000-0000-000000000004', 'Warm Referral Intro', 'email', 'Introduction via [Referrer Name]',
'Hi [First Name],

[Referrer Name] suggested I reach out — they thought our work might be a strong fit for what you''re building at [Hotel Name].

I''d love to share a few examples and learn more about your current brand direction. Any chance you have 20 minutes in the next couple of weeks?

[Sender Name]', ARRAY['warm', 'referral', 'intro']),

  ('33333333-0000-0000-0000-000000000005', 'Post-Meeting Follow-up', 'followup', 'Great connecting — next steps',
'Hi [First Name],

It was great speaking with you today. I''m excited about the potential to work together on [Project/Goal discussed].

I''ll put together a brief proposal and send it over by [Date]. In the meantime, feel free to reach out with any questions.

Looking forward to it!

[Sender Name]', ARRAY['post-meeting', 'proposal', 'followup']),

  -- Value-prop cold email using the {{variable}} syntax + performance proof points.
  -- Note: does NOT mention price (lead with value, not the $/month figure).
  ('33333333-0000-0000-0000-000000000006', 'Value-Prop Cold Email — Creative Partner', 'email', 'A creative partner for {{company_name}} — without the overhead',
'Hi {{first_name}},

I''ve been following {{personalization_angle}} at {{company_name}} — it''s exactly the kind of work great creative can amplify.

We act as an embedded creative team for {{specific_client_type}}, supporting {{specific_use_cases}}. The idea is simple: premium creative support at a fraction of the cost of hiring in-house — no payroll, benefits, software licenses, or onboarding overhead to carry.

A snapshot of what that''s produced for the brands we work with:
{{stats_block}}

Would you be open to a quick 20-minute call to see if there''s a fit?

Best,
{{sender_name}}

{{opt_out_line}}', ARRAY['cold', 'value-prop', 'email', 'creative']);

-- ─── Partners ────────────────────────────────────────────────────────────────
insert into partners (id, name, company, email, phone, linkedin_url, partnership_type, commission_type, commission_value, status, notes, referral_count) values
  ('44444444-0000-0000-0000-000000000001', 'Jamie Wilson', 'Hospitality Design Co.', 'jamie@hdesignco.com', '(415) 555-0001', 'https://linkedin.com/in/jamiewilson', 'referral', 'percentage', 10.00, 'active', 'Interior designer who refers hotel clients post-renovation. Has sent 2 referrals.', 2),
  ('44444444-0000-0000-0000-000000000002', 'Alex Nguyen', 'Hotel Tech Solutions', 'alex@hoteltechsol.com', '(646) 555-0002', 'https://linkedin.com/in/alexnguyen', 'tech', 'flat', 500.00, 'active', 'PMS vendor with access to hotel GMs. Mutual referral arrangement.', 1),
  ('44444444-0000-0000-0000-000000000003', 'Taylor Brooks', null, 'taylor.brooks@gmail.com', null, null, 'referral', 'percentage', 8.00, 'prospect', 'Freelance hotel consultant. Met at ALIS conference. Warming up.', 0);

-- ─── Follow-ups ──────────────────────────────────────────────────────────────
insert into followups (contact_id, due_date, notes, status) values
  ('22222222-0000-0000-0000-000000000003', current_date + interval '2 days', 'Send portfolio PDF and case study for luxury tier properties.', 'pending'),
  ('22222222-0000-0000-0000-000000000005', current_date, 'Confirm call time for Tuesday. Send calendar invite.', 'pending'),
  ('22222222-0000-0000-0000-000000000002', current_date + interval '5 days', 'Check in on Q2 budget approval. Offer to send proposal.', 'pending'),
  ('22222222-0000-0000-0000-000000000006', current_date - interval '1 day', 'Follow up on initial outreach. Rob mentioned tight timeline.', 'pending'),
  ('22222222-0000-0000-0000-000000000012', current_date - interval '7 days', 'Send retainer invoice and onboarding doc.', 'completed');

-- ─── App Settings ─────────────────────────────────────────────────────────────
update app_settings set
  portfolio_url   = 'https://yourportfolio.com',
  sender_name     = 'Your Name',
  email_signature = E'— Your Name\nCreative Director\nyourportfolio.com',
  mailing_address = E'123 Creative Studio Lane\nNew York, NY 10001',
  opt_out_line    = 'To unsubscribe from future emails, reply with UNSUBSCRIBE in the subject line.',
  daily_send_goal = 10;
