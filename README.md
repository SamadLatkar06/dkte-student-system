# DKTE QR Student Access System

Full-stack-ready React + Supabase application for DKTE Textile and Engineering Institute (India).

## Features

- QR scan student lookup (camera-based using `html5-qrcode`)
- Manual PRN search
- Student details page (name, PRN, branch, year, CGPA, photo)
- Document listing with View/Download + Download All ZIP
- Admin login via Supabase Auth
- Admin dashboard:
  - Add/update student
  - Upload profile photo
  - Upload PDF/image documents
  - View/search students by PRN
- Row Level Security (RLS) policies for public read + admin write
- Mobile-first responsive UI, structured for future Capacitor conversion

## Tech Stack

- Frontend: React + Vite
- Backend: Supabase (Postgres, Auth, Storage)
- QR scanner: `html5-qrcode`
- Deployment: Vercel-compatible

## Folder Structure

```
src/
  components/
  contexts/
  lib/
  pages/
  services/
supabase/
  schema.sql
```

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. In Supabase Auth, create admin users.
4. Assign admin role in app metadata (example SQL):

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'admin@dkte.ac.in';
```

5. Copy `.env.example` to `.env` and set values:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_ADMIN_EMAILS=admin@dkte.ac.in
```

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Example Supabase Queries

Fetch student by PRN:

```sql
select * from students where prn = 'DKTE20240001';
```

Fetch documents:

```sql
select * from documents where prn = 'DKTE20240001' order by uploaded_at desc;
```

## Deploy on Vercel

1. Push project to GitHub.
2. Import repo in Vercel.
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_EMAILS`
6. Deploy.

## Convert to Android App (Capacitor)

1. Install Capacitor:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init dkte-qr com.dkte.qr
```

2. Build and copy web assets:

```bash
npm run build
npx cap add android
npx cap copy
```

3. Open Android Studio:

```bash
npx cap open android
```

4. For future updates:

```bash
npm run build
npx cap copy
```

## Security Notes

- Public users can only read student/document data.
- Only authenticated admins with `app_metadata.role = 'admin'` can write.
- PRN format validation is enforced in UI.
- Invalid QR and missing student cases are handled with clear errors.

## Production Recommendations

- Use custom domain + HTTPS.
- Rotate anon key if exposed in public repos.
- Add server-side edge functions for sensitive workflows if needed.
- Add audit logging for admin actions.
