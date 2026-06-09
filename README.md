# Hotel Pipeline OS

An approval-based outreach CRM for hospitality creative services — built with Next.js, Tailwind CSS v4, and Supabase.

---

## Features

- **Dashboard** — pipeline stats, recent activity, follow-ups due today
- **Companies** — CRUD for hotel groups and management companies
- **Contacts** — scored contacts with filter, detail drawer, and full CRUD
- **Outreach** — daily queue generator with editable email/LinkedIn drafts, approve / mark sent / skip workflow
- **Partners** — referral and agency partner management with commission tracking
- **Templates** — email and LinkedIn message library with copy-to-clipboard
- **Follow-ups** — due-date sorted follow-up list with overdue highlighting
- **Settings** — sender info and CAN-SPAM compliance fields

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL + RLS) |
| Icons | lucide-react |
| Language | TypeScript |

---

## Local Development

### 1. Clone & install

```bash
git clone <your-repo-url>
cd hotel-pipeline-os
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. In the **SQL Editor**, run `supabase/schema.sql`
3. Then run `supabase/seed.sql` to populate sample data

### 3. Environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these values in your Supabase project under **Settings → API**.

> **Note:** The app runs fully on mock data without Supabase configured. Pages use local state seeded from `lib/mock-data.ts`. Wire each page to Supabase by replacing the `useState(MOCK_*)` initializers with Supabase queries.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app redirects to `/dashboard`.

---

## Project Structure

```
app/
  dashboard/      # Pipeline overview
  companies/      # Hotel company CRUD
  contacts/       # Contact CRUD + scoring
  outreach/       # Daily queue + approval workflow
  partners/       # Partner CRUD
  templates/      # Message template library
  followups/      # Follow-up management
  settings/       # App configuration
components/
  Sidebar.tsx     # Fixed left nav
  PageHeader.tsx  # Consistent page titles
  StatCard.tsx    # Metric card
  SlideOver.tsx   # Slide-in panel + form primitives
  StatusBadge.tsx # Status pill badges
  FilterBar.tsx   # Pill filter tabs
  EmptyState.tsx  # Empty list placeholder
lib/
  types.ts        # All TypeScript interfaces
  scoring.ts      # Contact scoring algorithm
  queue.ts        # Daily queue generator
  mock-data.ts    # Local state seed data
  supabase.ts     # Supabase client
supabase/
  schema.sql      # Full database schema (DDL + RLS)
  seed.sql        # Sample data inserts
```

---

## Scoring Logic

Contacts are scored 0–10 by `lib/scoring.ts`:

| Signal | Points |
|--------|--------|
| Decision-maker or buyer title keywords | +3 |
| Target company types (boutique, resort, mgmt co.) | +3 |
| Contact type is buyer or partner | +2 |
| Notes contain buying-intent keywords | +2 |
| Opted out | −3 |
| Not fit status | −2 |
| Suppressed | −∞ (excluded) |

---

## Wiring to Supabase

Each page currently uses `useState` seeded with mock data. To connect live data:

1. Import `supabase` from `@/lib/supabase`
2. Replace the `useState(MOCK_*)` initializer with a `useEffect` + Supabase query
3. Wire save/delete actions to `supabase.from('table').insert/update/update/delete`

Example:

```ts
useEffect(() => {
  supabase
    .from('contacts')
    .select('*, company:companies(name)')
    .order('score', { ascending: false })
    .then(({ data }) => { if (data) setContacts(data); });
}, []);
```

---

## License

MIT

## Owner-only authentication (private CRM)

The CRM is gated to a single owner account. The public marketing site at `/`
(and `/contact`, `/unsubscribe/*`) stays public; everything else requires login.

- **Owner email:** `devonavich0@gmail.com` (set in `lib/owner.ts`). Only this
  address can access the CRM; any other account is signed out with
  "This CRM is private."
- **Login:** `/login` supports a magic link and password sign-in (Supabase Auth).
- **Callback:** magic links return to `http://localhost:3000/auth/callback`.
- **Logout:** "Sign out" button at the bottom of the CRM sidebar (redirects to `/login`).
- **Footer Admin link** on the marketing site points to `/dashboard` when the
  owner is signed in, otherwise `/login`.

### Supabase dashboard settings to configure
1. **Authentication → Providers → Email:** enable Email. For magic links keep
   "Email OTP / magic link" on. For password login, enable "Email + Password".
2. **Authentication → URL Configuration:**
   - **Site URL:** `http://localhost:3000` (local) — change to your production URL when deployed.
   - **Redirect URLs (allow list):** add
     - `http://localhost:3000/auth/callback`
     - `https://YOUR_PROD_DOMAIN/auth/callback` (placeholder for later)
3. **Disable public signups** (Authentication → Providers → Email → "Allow new
   users to sign up" OFF), then create the single owner user manually under
   Authentication → Users (`devonavich0@gmail.com`). This is the real
   enforcement of "no public signup".
4. Uses `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` only on the
   client. The service-role key is never used in client components.

### Notes / limitations
- The route guard is **client-side** (`components/OwnerAuthGuard.tsx` via
  `AppChrome`), which is appropriate for a local/private single-user CRM. For a
  public deployment, add `@supabase/ssr` + Next middleware and tighten RLS
  (the local setup currently uses permissive anon policies).
- Login uses Supabase Auth email — it does **not** go through Resend.
