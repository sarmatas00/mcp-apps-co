# Research Report: Supabase Auth Best Practices for Next.js 15

## Date: 2026-02-16

## Version: v1.1.0

## Topic: Comprehensive Auth System with Email, Google, GitHub OAuth + User Profiles

---

## 1. Key Findings Summary

### Recommended Stack

- **Package**: `@supabase/ssr` for Next.js 15 (replaces older auth-helpers)
- **Session**: Cookie-based with automatic refresh
- **Security**: Server-side validation prioritized (post-CVE-2025-29927)
- **Storage**: Private bucket for avatars with RLS policies

---

## 2. Authentication Methods

### Email/Password

- Enable in Supabase Dashboard → Authentication → Providers
- Use `supabase.auth.signUp()` and `signInWithPassword()`
- Email confirmation required for production

### OAuth Providers (Google, GitHub)

- Configure in Supabase Dashboard with callback URLs
- Implement via `signInWithOAuth({ provider: 'google' | 'github' })`
- Set up OAuth apps in Google Cloud Console and GitHub Developer Settings

**Callback URLs:**

- Local: `http://localhost:3000/auth/callback`
- Production: `https://mcp-apps.co/auth/callback`

---

## 3. Database Schema

### Profiles Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  github_username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS Policies for Profiles

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view own profile
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT TO authenticated USING (auth.uid() = id);

-- Users can update own profile
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Users can insert own profile
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
```

---

## 4. Storage Configuration

### Avatars Bucket

- Create private bucket named `avatars`
- Folder structure: `{user-uuid}/avatar.png`
- Store only path in profiles table, not full URL

### RLS Policies for Storage

```sql
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- INSERT: Allow upload to own folder
CREATE POLICY "Allow users to insert their avatar" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
);

-- SELECT: Allow view of own avatar
CREATE POLICY "Allow users to select their own avatar" ON storage.objects
FOR SELECT TO authenticated USING (
  bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
);

-- DELETE: Allow delete of own avatar
CREATE POLICY "Allow users to delete their own avatar" ON storage.objects
FOR DELETE TO authenticated USING (
  bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 5. Next.js 15 Implementation Pattern

### Server Client (createClient.ts)

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.delete({ name, ...options });
        },
      },
    },
  );
}
```

### Middleware Pattern

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          request.cookies.delete({ name, ...options });
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect routes
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}
```

---

## 6. Security Best Practices

1. **Never use `supabase.auth.getSession()` on server without @supabase/ssr**
2. **Always validate sessions in Server Components AND middleware**
3. **Use short-lived cookies from @supabase/ssr**
4. **Enable RLS on all tables with user data**
5. **Use private storage buckets for avatars**
6. **Generate signed URLs for avatar display**

---

## 7. Avatar Handling

### Upload Flow

1. User selects image
2. Upload to `avatars/{user-id}/avatar.png`
3. Update `profiles.avatar_url` with path
4. Generate signed URL for display

### Display

```typescript
const {
  data: { signedUrl },
} = await supabase.storage
  .from("avatars")
  .createSignedUrl(profile.avatar_url, 3600, {
    transform: { width: 100, height: 100 },
  });
```

---

## 8. Auth Flow Design

### Public Routes (No Auth Required)

- `/` - Homepage
- `/app/[slug]` - App details
- `/category/[slug]` - Categories
- `/blog/*` - Blog posts
- `/auth/login` - Login page
- `/auth/signup` - Signup page
- `/auth/callback` - OAuth callback

### Protected Routes (Auth Required)

- `/dashboard` - User dashboard
- `/dashboard/settings` - Profile settings
- `/submit` - Submit app (already protected)
- `/dashboard/apps` - My apps
- `/dashboard/analytics` - Analytics

---

## Recommendation for Architect

Implement a complete auth system with:

1. **Supabase SSR client** with proper cookie handling
2. **Middleware** for route protection
3. **Database migrations** for profiles table and RLS
4. **Storage bucket** with RLS for avatars
5. **UI Components**: Login, Signup, Settings pages
6. **OAuth integrations**: Google and GitHub
7. **Avatar upload** with image preview
8. **Profile management** (name, bio, website)

Sources:

- https://github.com/orgs/supabase/discussions/18877
- https://docs.zeroqode.com/plugins/supabase-pro-kit/quickstart/
- https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
