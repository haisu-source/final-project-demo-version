// Detects whether the app is running without real backend services.
// When the relevant env vars are missing, the app falls back to mock data
// and hand-written AI responses so it can still build, run, and deploy.

export const IS_DEMO_MODE_DB =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const IS_DEMO_MODE_AI = !process.env.ANTHROPIC_API_KEY;
