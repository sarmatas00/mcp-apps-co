# Architecture Report: Complete Auth System v1.1.0

## Overview

Design for comprehensive authentication system with Email/Password, Google OAuth, GitHub OAuth, user profiles, and avatar management.

## Current State Analysis

### Existing Infrastructure

- ✅ Supabase client configured with SSR (@supabase/ssr)
- ✅ Basic email/password auth pages exist
- ✅ Middleware for session handling
- ✅ Developers table for app creators
- ❌ No user profiles table
- ❌ No avatar storage
- ❌ No OAuth integration
- ❌ No settings page

## Architecture Decisions

### 1. Database Schema

#### Profiles Table (New)

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

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

#### Trigger for Auto-Creating Profiles

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 2. Storage Configuration

#### Avatars Bucket

- **Name**: `avatars`
- **Privacy**: Private (signed URLs)
- **Structure**: `{user-id}/avatar.{ext}`
- **Max size**: 2MB
- **Allowed types**: jpg, jpeg, png, gif, webp

#### RLS Policies for Storage

```sql
-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Upload own avatar
CREATE POLICY "Allow avatar upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- View own avatar
CREATE POLICY "Allow avatar view"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Delete own avatar
CREATE POLICY "Allow avatar delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

### 3. Route Structure

#### Public Routes (No Auth)

- `/` - Homepage
- `/app/[slug]` - App details
- `/category/[slug]` - Categories
- `/blog/*` - Blog
- `/auth/login` - Login
- `/auth/signup` - Signup
- `/auth/callback` - OAuth callback
- `/auth/forgot-password` - Password reset

#### Protected Routes (Auth Required)

- `/dashboard` - User dashboard
- `/dashboard/settings` - Profile settings
- `/dashboard/apps` - My apps
- `/dashboard/analytics` - Analytics
- `/submit` - Submit app

### 4. Component Structure

```
app/
├── auth/
│   ├── login/page.tsx          # Update with OAuth
│   ├── signup/page.tsx         # Update with OAuth
│   ├── callback/route.ts       # OAuth callback handler
│   └── forgot-password/page.tsx # New
├── dashboard/
│   ├── layout.tsx              # Protected layout
│   ├── page.tsx                # Dashboard home
│   ├── settings/page.tsx       # Profile settings
│   ├── apps/page.tsx           # My apps
│   └── analytics/page.tsx      # Analytics
components/
├── auth/
│   ├── auth-form.tsx           # Email/password form
│   ├── oauth-buttons.tsx       # Google/GitHub buttons
│   ├── avatar-upload.tsx       # Avatar upload component
│   └── protected-route.tsx     # Route protection
├── dashboard/
│   ├── sidebar.tsx             # Dashboard navigation
│   ├── profile-form.tsx        # Profile edit form
│   └── settings-tabs.tsx       # Settings tabs
hooks/
├── use-auth.ts                 # Auth state hook
├── use-profile.ts              # Profile data hook
└── use-avatar.ts               # Avatar upload hook
```

### 5. TypeScript Interfaces

```typescript
// lib/supabase/types.ts additions

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  github_username: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserWithProfile {
  id: string;
  email: string;
  profile: Profile | null;
}

export interface AuthState {
  user: UserWithProfile | null;
  session: Session | null;
  isLoading: boolean;
}
```

### 6. Implementation Order (Priority)

#### Phase 1: Database & Storage (Critical)

1. Create profiles table migration
2. Create storage bucket for avatars
3. Add RLS policies
4. Create profile trigger function

#### Phase 2: OAuth Configuration (Critical)

1. Configure Google OAuth in Supabase Dashboard
2. Configure GitHub OAuth in Supabase Dashboard
3. Update environment variables
4. Create OAuth callback handler

#### Phase 3: UI Components (High)

1. Update login page with OAuth buttons
2. Update signup page with OAuth buttons
3. Create forgot password page
4. Create dashboard layout with sidebar

#### Phase 4: Settings & Profile (High)

1. Create profile settings page
2. Create avatar upload component
3. Create profile edit form
4. Add profile data hooks

#### Phase 5: Route Protection (Medium)

1. Update middleware for route protection
2. Create protected layout wrapper
3. Add auth checks to protected pages
4. Handle auth redirects

#### Phase 6: Testing & Polish (Medium)

1. Test all auth flows
2. Test OAuth providers
3. Test avatar upload
4. Verify RLS policies

## Supabase Configuration

### OAuth Providers Setup

#### Google OAuth

1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://<project>.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret to Supabase Dashboard

#### GitHub OAuth

1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Create new OAuth App
3. Authorization callback URL: `https://<project>.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret to Supabase Dashboard

### Environment Variables

```bash
# Existing
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# New (for OAuth - optional, can be configured in dashboard)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GITHUB_CLIENT_ID=
```

## Security Considerations

1. **RLS Policies**: All user data protected by RLS
2. **Storage**: Private bucket with signed URLs
3. **Session**: Cookie-based with automatic refresh
4. **OAuth**: State parameter validation
5. **Avatar**: File size and type validation
6. **CORS**: Properly configured for OAuth callbacks

## Performance Optimizations

1. **Avatar**: Use Supabase Image Transformations for resizing
2. **Session**: Cache session data in React Query/SWR
3. **Routes**: Use Next.js 15 streaming for dashboard
4. **Images**: Lazy load avatars with Next.js Image

## Next Steps

Ready for @builder to implement Phase 1-2 (Database, Storage, OAuth configuration).
