# Wepl - Wedding Expense Planner

## Project Overview
결혼 준비 비용을 관리하는 모바일 웹앱 (PWA). 커플이 함께 예산을 설정하고, 지출을 기록하고, 다른 커플의 평균 비용과 비교할 수 있다.
- **URL**: https://wepl.vercel.app
- **Deployment**: Vercel (자동 배포)
- **Database**: Supabase (별도 마이그레이션 필요)

## Tech Stack
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4 (design system: "Soft Romance" - Rose Pink primary, Teal Blue secondary)
- **State**: TanStack React Query v5 (server state), Zustand (UI state)
- **Forms**: React Hook Form + Zod v4
- **Backend**: Supabase (Auth, Database, RLS, RPC)
- **Auth**: Kakao OAuth → Supabase Auth
- **Charts**: Recharts
- **Testing**: Vitest + React Testing Library + MSW
- **Package Manager**: npm

## Project Structure
```
src/
├── app/
│   ├── (auth)/          # login, onboarding pages
│   ├── (main)/          # tab-based pages with TabBar layout
│   │   ├── home/        # D-day, budget overview, category progress, guide checklist
│   │   ├── manage/      # expense management, category detail ([categoryId])
│   │   ├── explore/     # anonymous statistics dashboard (layout.tsx has SEO metadata)
│   │   ├── schedule/    # schedule management
│   │   └── settings/    # profile, budget, partner, wedding-info, terms, privacy, about
│   ├── auth/callback/   # OAuth callback route
│   ├── robots.ts        # SEO robots.txt
│   ├── sitemap.ts       # SEO sitemap.xml
│   ├── providers.tsx    # QueryClientProvider
│   └── globals.css      # Tailwind + design tokens
├── features/
│   ├── auth/            # useAuth, useProfile, useSignIn, useSignOut, useIsAuthenticated, useDeleteAccount
│   ├── expense/         # useExpenses, useCategories, useCreateExpense, ExpenseForm
│   ├── explore/         # useCategoryAverages (uses category_averages DB view)
│   ├── schedule/        # useSchedules, useCreateSchedule
│   └── onboarding/      # useOnboarding, GuideChecklist, WeddingPrepGuide
├── shared/
│   ├── ui/              # Button, Card, Chip, BottomSheet, FAB, ProgressBar, TabBar, TopBar, InstallBanner, KakaoShareButton
│   ├── types/           # database.ts (Supabase types + RPC types), index.ts (constants)
│   ├── lib/             # supabase.ts, supabase-server.ts, cn.ts, format.ts (includes safeAvatarUrl), query-client.ts
│   └── mocks/           # trial-data.ts (mock data for trial mode)
├── store/
│   └── ui-store.ts      # Zustand: bottomSheet, toast
supabase/
├── migrations/
│   ├── 001_initial_schema.sql    # Tables, RLS, triggers, views
│   └── 002_security_hardening.sql # RPC functions, RLS fixes
└── seed/
    └── 001_anonymous_stats.sql
```

## Database Schema (Supabase)
- **couples**: id, wedding_date, wedding_time, wedding_hall, region, total_budget
- **profiles**: id (= auth.user.id), couple_id (FK → couples), nickname, avatar_url, role (bride/groom)
- **categories**: id, couple_id (FK), name, icon, budget_amount, sort_order, is_default
- **expenses**: id, couple_id (FK), category_id (FK), title, amount, memo, date, tags[], is_paid, vendor_name, vendor_rating, price_feeling, created_by
- **schedules**: id, couple_id (FK), title, date, time, location, category_id, memo, is_completed, is_recommended
- **anonymous_stats**: id, region, category_name, amount, vendor_type, tags[], wedding_year/month, price_feeling (k-anonymity ≥ 10)
- **Views**: `category_averages` (aggregated stats with k-anonymity built-in)

### RPC Functions (002_security_hardening.sql)
- `find_couple_by_code(p_code)` → server-side couple code lookup (prevents enumeration)
- `join_partner_couple(p_target_couple_id)` → atomic partner join with data migration
- `delete_user_account()` → cascade delete: expenses → profile → orphaned couple cleanup

## Key Patterns

### Architecture
- **Feature-based structure**: `features/{domain}/api/`, `hooks/`, `components/`, `index.ts`
- **Layer boundary**: API → Hook → Component
- **Barrel exports**: each feature has `index.ts`

### Auth Flow
1. Kakao OAuth → `/auth/callback` → Supabase session
2. Profile auto-created by DB trigger (fallback: upsert in callback)
3. New users without couple → redirect to `/onboarding`
4. Onboarding creates: couple → links profile → creates default categories
5. **Trial mode**: `/home`, `/explore` accessible without login (mock data shown)

### Partner System
- Profile includes partner info via `getProfile()` (fetched with `Promise.all`)
- `ProfileWithCouple = Profile & { couples: Couple | null; partner: PartnerProfile | null }`
- Partner join: couple code (UUID first 8 chars) → `find_couple_by_code` RPC → `join_partner_couple` RPC
- Home D-day shows both names when partner exists
- Guide checklist tracks partner invitation completion

### Data Fetching
- React Query with `queryKey` conventions: `["auth", "profile"]`, `["categories", coupleId]`, `["expenses", coupleId]`
- `useIsAuthenticated()` returns `{ isAuthenticated, isLoading, hasCouple, profile }`
- Explore stats use `category_averages` DB view (server-side k-anonymity)

### Security
- CSP + security headers in `next.config.ts` (X-Frame-Options, Referrer-Policy, Permissions-Policy)
- `safeAvatarUrl()` validates avatar URLs (https/http only, blocks javascript:/data:)
- `createExpense` enforces `created_by` from auth session
- RLS: NULL couple_id guard on couples SELECT, anonymous_stats INSERT blocked for clients
- Partner join via RPC (prevents couple ID enumeration + atomic transaction)

### SEO
- `metadataBase`: https://wepl.vercel.app
- Page-level metadata via layout.tsx (home, explore)
- `robots.ts`: allow /, disallow /auth, /settings, /onboarding
- `sitemap.ts`: landing, home, explore, login
- JSON-LD: WebApplication schema
- Keywords: 결혼 비용, 웨딩 예산, 신혼부부, 스드메 가격, etc.

### Middleware
- Public routes: `/login`, `/auth/callback`
- Trial routes (no auth needed): `/home`, `/explore`
- All other routes require authentication

### Styling Conventions
- Tailwind utility classes, no CSS modules
- Design tokens defined in `globals.css` `@theme inline` block
- `cn()` utility (clsx + tailwind-merge)
- Mobile-first, `px-5 pt-6 pb-4` page padding pattern
- `hide-scrollbar overflow-y-auto` on page containers

### Default Categories
웨딩홀, 스튜디오, 드레스/정장, 예물/예단, 혼수, 신혼여행, 기타

### Regions
서울, 경기/인천, 부산/경남, 대구/경북, 대전/충청, 광주/전라, 강원, 제주

## Known Issues & Tech Debt

### Critical
- **No Error Boundary**: error.tsx, loading.tsx, not-found.tsx 전무. 런타임 에러 시 빈 화면
- **Container-Presenter 미분리**: page.tsx에 데이터 로직 + UI 혼재 (home, manage)

### High
- **타입 수동 관리**: database.ts 수동 작성. `supabase gen types typescript` 미사용
- **테스트 부재**: format.test.ts 1개만 존재. 훅/API/컴포넌트 테스트 0개
- **Mutation 에러 미처리**: 일부 mutation에 onError 없음
- **queryKey 불일치**: EXPENSE_KEYS 정의해놓고 invalidation에서 하드코딩 문자열 사용
- **Chevron SVG 하드코딩**: home, manage, settings에서 동일 SVG 반복

### Medium
- **UIStore 미활용**: Zustand toast/bottomSheet 상태 있지만 로컬 useState 사용
- **인증 미들웨어 약점**: 로그인 사용자가 /login 접근 시 리다이렉트 없음

## Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run tests (vitest)
npm run test:watch   # Watch mode
npm run lint         # ESLint
```

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_KAKAO_CLIENT_ID`
