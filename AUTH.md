# Auth setup (Google + profiles + friends)

## What you have now

- Real auth via **Auth.js** (NextAuth v5)
- Local user DB in `data/store.json` (works on Windows ARM — no native SQLite build)
- Private profiles (friends only see full profile)
- Friend search / request / accept
- **Username login** works immediately for local testing
- **Google login** turns on once you add OAuth keys

## Test friends locally (no Google yet)

1. `npm run dev`
2. Open http://localhost:3000/radar — pick username `ameya`
3. Open an **Incognito** window — pick username `jason`
4. As ameya → **Friends** → search `jason` → Add
5. As jason → accept request
6. Visit `/u/jason` from ameya’s browser — full profile unlocks

## Turn on Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or use existing)
3. **APIs & Services → OAuth consent screen** → External → add yourself as test user
4. **Credentials → Create credentials → OAuth client ID**
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID + Client Secret into `.env`:

```env
AUTH_GOOGLE_ID="your-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-client-secret"
AUTH_SECRET="already-generated-keep-this"
AUTH_URL="http://localhost:3000"
```

6. Restart `npm run dev` — “Continue with Google” appears on login

## Routes

| Path | Purpose |
|------|---------|
| `/login` | Sign in |
| `/radar` | Map (requires auth) |
| `/profile` | Edit your private profile |
| `/friends` | Search + requests |
| `/u/[username]` | View profile (private until friends) |

## Later (production)

Swap `data/store.json` for Postgres/Supabase when you deploy — same auth + friends APIs.
