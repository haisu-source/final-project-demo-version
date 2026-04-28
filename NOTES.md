# PressHub Development Notes

## v1 Scope (Week 6)

### Core Features Built
1. **Article pages with TikTok-style comments** - Flat, conversational comments with real-time updates via Supabase Realtime. Reply threading, like animations, mobile-first design.
2. **QR code generation** - Each article gets a unique QR code (modal view + PNG download). Ready to print in newspaper editions.
3. **Community hub feed** - Trending/recent sort, category filtering (politics, culture, education, health, tech). Discussion-first layout showing engagement metrics.
4. **User authentication** - Clerk integration with sign-in modal, user avatars in comments, auth-gated actions.
5. **Engagement metrics** - View counts (tracked per unique viewer), comment counts, like counts on every article.

### AI Features (Stretch, Implemented)
- **AI Explore page** - Users can ask natural language questions about community news. Claude analyzes the article corpus and returns contextual analysis + links to relevant articles. Turns news into explorable context so readers can understand trends beyond surface level.
- **Discussion summaries** - "Catch me up" button on each article page uses Claude to summarize the discussion so far, so latecomers can quickly understand what's being talked about.

### Technical Decisions
- **No dark mode** - Intentional. The warm, clean light theme matches the brand identity of community and accessibility. Can add later if needed.
- **Client-side comment tree** - Comments stored flat in Supabase for simplicity. Tree structure built client-side. This is fine for the expected scale (tens of comments per article, not thousands).
- **Supabase Realtime** - Used postgres_changes to subscribe to new comments. No custom WebSocket infrastructure needed.
- **Atomic counters via RPC** - View/like/comment counts use Supabase RPC functions to avoid race conditions.

### TA Feedback Integration
- AI features that help users find relevant articles and explore trends over time, turning news into context for deeper understanding. Implemented via the Explore page and discussion summaries.

## What's Next (v2-v4)
- Publisher dashboard with analytics
- Newspaper browser (by city/publication)
- Topic filtering across newspapers
- Push notifications for replies
- Embed widget for publisher websites
- Mobile app (React Native)

## Setup Instructions
1. Create a Supabase project
2. Run `supabase/migrations/001_initial.sql` then `002_functions.sql` in the SQL editor
3. Create a Clerk application
4. Copy `.env.local.example` to `.env.local`, fill in keys
5. `npm install && npm run dev`
