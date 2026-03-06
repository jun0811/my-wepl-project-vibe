# Wepl - Wedding Expense Planner

## Project Overview
결혼 준비 비용을 관리하는 모바일 웹앱 (PWA). 커플이 함께 예산을 설정하고, 지출을 기록하고, 다른 커플의 평균 비용과 비교할 수 있다.

## Tech Stack
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4 (design system: "Soft Romance" - Rose Pink primary, Teal Blue secondary)
- **State**: TanStack React Query v5 (server state), Zustand (UI state)
- **Forms**: React Hook Form + Zod v4
- **Backend**: Supabase (Auth, Database, RLS)
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
│   │   ├── home/        # D-day, budget overview, category progress
│   │   ├── manage/      # expense management, category detail ([categoryId])
│   │   ├── explore/     # anonymous statistics dashboard
│   │   └── settings/    # profile, budget, partner, terms, privacy subpages
│   ├── auth/callback/   # OAuth callback route
│   ├── providers.tsx    # QueryClientProvider
│   └── globals.css      # Tailwind + design tokens
├── features/
│   ├── auth/            # useAuth, useProfile, useSignIn, useSignOut, useIsAuthenticated
│   ├── expense/         # useExpenses, useCategories, useCreateExpense, ExpenseForm
│   ├── explore/         # useCategoryAverages, CostBarChart, PriceRangeCard
│   └── onboarding/      # useOnboarding (5-step: role → wedding-date → region → budget → confirm)
├── shared/
│   ├── ui/              # Button, Card, Chip, BottomSheet, FAB, ProgressBar, TabBar
│   ├── types/           # database.ts (Supabase types), index.ts (constants: DEFAULT_CATEGORIES, REGIONS, SUGGESTED_TAGS)
│   └── lib/             # supabase.ts (browser client), supabase-server.ts (server client), cn.ts, format.ts, query-client.ts
├── store/
│   └── ui-store.ts      # Zustand: bottomSheet, toast
supabase/
├── migrations/          # 001_initial_schema.sql
└── seed/                # 001_anonymous_stats.sql
```

## Database Schema (Supabase)
- **couples**: id, wedding_date, wedding_time, wedding_hall, region, total_budget
- **profiles**: id (= auth.user.id), couple_id (FK → couples), nickname, avatar_url, role (bride/groom)
- **categories**: id, couple_id (FK), name, icon, budget_amount, sort_order, is_default
- **expenses**: id, couple_id (FK), category_id (FK), title, amount, memo, date, tags[], is_paid, vendor_name, vendor_rating, price_feeling, created_by
- **schedules**: id, couple_id (FK), title, date, time, location, category_id, memo, is_completed, is_recommended
- **anonymous_stats**: id, region, category_name, amount, vendor_type, tags[], wedding_year/month, price_feeling (k-anonymity ≥ 10)

## Key Patterns

### Architecture
- **Feature-based structure**: `features/{domain}/api/`, `hooks/`, `components/`, `index.ts`
- **Layer boundary**: API → Hook → Component
- **Barrel exports**: each feature has `index.ts`

### Auth Flow
1. Kakao OAuth → `/auth/callback` → Supabase session
2. Profile auto-created if DB trigger doesn't fire (`getProfile` in auth API)
3. New users without couple → redirect to `/onboarding`
4. Onboarding creates: couple → links profile → creates default categories
5. **Trial mode**: `/home`, `/explore` accessible without login (mock data shown)

### Data Fetching
- React Query with `queryKey` conventions: `["auth", "profile"]`, `["categories", coupleId]`, `["expenses", coupleId]`
- `useIsAuthenticated()` returns `{ isAuthenticated, isLoading, hasCouple, profile }`
- Profile includes joined couple data: `ProfileWithCouple = Profile & { couples: Couple | null }`

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
웨딩홀, 스튜디오, 드레스/턱시도, 예물/예단, 혼수, 신혼여행, 기타

### Regions
서울, 경기/인천, 부산/경남, 대구/경북, 대전/충청, 광주/전라, 강원, 제주

## Known Issues & Tech Debt

### Critical
- **No Error Boundary**: error.tsx, loading.tsx, not-found.tsx 전무. 런타임 에러 시 빈 화면
- **Container-Presenter 미분리**: page.tsx에 데이터 로직 + UI 혼재 (home 197줄, manage 182줄)
- **Mock 데이터 중복**: home/page.tsx와 manage/page.tsx에 동일 목업 분산 → `shared/mocks/trial-data.ts`로 추출 필요

### High
- **타입 수동 관리**: database.ts 수동 작성 (TODO 주석). `supabase gen types typescript` 미사용
- **테스트 부재**: format.test.ts 1개만 존재. 훅/API/컴포넌트 테스트 0개
- **Mutation 에러 미처리**: useCreateExpense 등 onError 없음. 실패 시 사용자 무반응
- **queryKey 불일치**: EXPENSE_KEYS 정의해놓고 invalidation에서 하드코딩 문자열 사용
- **공유 UI 누락**: Input, TopBar, Icon, Toast, Skeleton, EmptyState, Badge, AmountInput 컴포넌트 없음
- **Chevron SVG 3곳 하드코딩**: home, manage, settings에서 동일 SVG 반복

### Medium
- **UIStore 미활용**: Zustand toast/bottomSheet 상태 있지만 실사용 없음 (로컬 useState 사용)
- **클라이언트 집계**: explore/api/stats.ts에서 전체 데이터 가져와 JS로 집계. 서버 사이드 뷰/RPC 필요
- **expense-form.tsx 오타**: `priceFelling` → `priceFeeling` (17, 54, 83, 207-209행)
- **인증 미들웨어 약점**: 로그인 사용자가 /login 접근 시 리다이렉트 없음

## Improvement Roadmap

### Phase 1: 기반 정비 (1-2주)
> 목표: 앱 안정성 + 모바일 기본 UX 확보

| 작업 | 파일 | 크기 |
|------|------|------|
| error.tsx / loading.tsx / not-found.tsx 추가 | `app/`, `app/(main)/` | S |
| TopBar 공유 컴포넌트 | `shared/ui/top-bar.tsx` | S |
| EmptyState 컴포넌트 | `shared/ui/empty-state.tsx` | S |
| Toast UI 컴포넌트 + UIStore 연동 | `shared/ui/toast.tsx` | S |
| Input / AmountInput 컴포넌트 | `shared/ui/input.tsx` | S |
| Safe area + dvh + overscroll CSS | `globals.css` | S |
| Mock 데이터 추출 | `shared/mocks/trial-data.ts` | S |
| Chevron → Icon 컴포넌트 추출 | `shared/ui/icon.tsx` | S |
| expense-form.tsx 오타 수정 | `features/expense/components/` | S |

### Phase 2: 핵심 기능 보강 (3-4주)
> 목표: 기획 대비 핵심 누락 기능 구현

| 작업 | 파일 | 크기 |
|------|------|------|
| Container-Presenter 분리 (home, manage) | `app/(main)/*/` | M |
| 온보딩: 카테고리별 예산 분배 UI | `features/onboarding/` | M |
| 일정 관리 기본 (CRUD + 리스트 뷰) | `features/schedule/`, `app/(main)/schedule/` | L |
| 지출 상태 시각화 (완료/대기/미등록) | `features/expense/components/` | M |
| 태그 활용 UX (추천 태그 표시) | `features/expense/components/expense-form.tsx` | M |
| Mutation 에러 처리 + Toast 연동 | `features/*/hooks/` | S |
| queryKey 일관성 수정 | `features/expense/hooks/` | S |
| Skeleton 로딩 컴포넌트 | `shared/ui/skeleton.tsx` | S |

### Phase 3: UX 고도화 + 차별화 (5-8주)
> 목표: 기획 수준의 UX 달성 + 경쟁 차별화

| 작업 | 파일 | 크기 |
|------|------|------|
| 아코디언 카테고리 탐색 | manage 페이지 리팩토링 | L |
| 캘린더 뷰 + 추천 일정 타임라인 | `features/schedule/` | L |
| 가이드 체크리스트 (홈) | `features/onboarding/components/` | M |
| 데이터 수집 팝업 (지출 후) | `features/expense/components/` | M |
| 월별 지출 추이 차트 | `features/expense/components/` | M |
| 내 예산 vs 평균 비교 | `app/(main)/explore/` | M |
| 스와이프 제스처 (ListItem) | `shared/ui/list-item.tsx` | L |
| 예산 초과 경고 UI | `features/expense/` | S |
| CI/CD (GitHub Actions) | `.github/workflows/ci.yml` | M |
| 서버 사이드 통계 집계 (RPC/View) | `supabase/`, `features/explore/api/` | M |
| Serwist PWA 오프라인 | `next.config.ts`, `src/sw.ts` | L |

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
