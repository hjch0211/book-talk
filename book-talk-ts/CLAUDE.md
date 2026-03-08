# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from `packages/web/`:

```bash
# Dev server
npm run dev

# Build
npm run build

# Lint (Biome)
npm run lint

# Lint + auto-fix
npm run lint:fix

# Format
npm run format
```

No test suite is configured in this project.

## Architecture Overview

This is a monorepo (`packages/web`) for the BookTalk web frontend — a real-time book debate platform.

### Path Alias

`@src` maps to `packages/web/src/`. All internal imports use this alias.

### Externals (`@src/externals/`)

Each domain (auth, debate, account, book, survey, presentation, ice, websocket) has its own directory with:
- `schema.ts` — Zod v4 schemas + inferred TypeScript types
- `api.ts` — axios API calls using `apiClient` or `authApiClient`
- `queryOptions.ts` — TanStack Query `queryOptions()`
- `index.ts` — re-exports everything

**Two axios clients** are defined in `@src/externals/client.ts`:
- `apiClient` — no auth, used for public endpoints (auth, OTP)
- `authApiClient` — attaches `Authorization: Bearer <accessToken>` header, handles 401→token refresh→retry flow automatically

Tokens are stored in `localStorage` (`accessToken`, `refreshToken`). On 401, the client attempts a silent refresh; on failure it redirects to `/sign-in`.

All env vars must go through `@src/configs/env.ts` (never `import.meta.env` directly).

### Hooks (`@src/hooks/`)

Split into two layers:
- `domain/` — business hooks that use externals and React Query (`useDebate`, `useDebateRound`, `useDebateRealtimeConnection`, `useDebateChat`, `useDebateVoiceChat`, `usePresentation`)
- `infra/` — generic reusable hooks (`useModal`, `useToast`, `useCountdown`, `useWebRTC`, `useJsonPatch`, `useDebounce`)

All hooks are re-exported from `@src/hooks/index.ts`.

`useDebate` is the root hook for the debate page. It composes `useDebateRound`, `useDebateRealtimeConnection`, `useDebateChat`, and `useDebateVoiceChat`.

### Routes (`@src/routes/`)

Flat route structure matching URL paths:
- `Landing/`, `Home/`, `Debate/`, `MyPage/`
- `_Sign/` — SignIn, SignUp, ForgotPassword, GoogleCallback
- `_Error/` — NotFound, DebateFull, DebateExpired
- `_Policy/` — Privacy, TermsOfUse

Each route folder follows this pattern:
```
RouteName/
├── index.tsx          # Page component (thin, delegates to hook)
├── useRouteName.ts    # Business logic hook
├── style.ts           # Route-specific styled components (Emotion)
└── _components/       # Sub-components used only by this route
    └── Component/
        ├── index.tsx
        └── style.ts (if needed)
```

Shared sign-page styled components live in `_Sign/style.ts` and are imported across all sign pages.

### Styling

- **Emotion** (`@emotion/styled`) for styled components — one `style.ts` per route or component dir
- **MUI** for UI primitives (TextField, Button, Typography, etc.) wrapped in custom `AppTextField`, `AppButton`, `AppFieldMessage` components
- Global styles in `@src/GlobalStyle.tsx`

### Real-time Architecture (Debate page)

The debate page uses two real-time channels managed by `useDebateRealtimeConnection`:
1. **WebSocket** (`DebateWebSocketClient`) — joins debate room, receives round/speaker/chat/hand-raise events, sends heartbeat every 5s
2. **WebRTC** (`WebRTCManager` via `useWebRTC`) — P2P voice chat; ICE candidates exchanged via WebSocket signaling

The WebSocket URL is derived from `VITE_API_BASE_URL` by replacing `http` → `ws`.

### Forms

All forms use `react-hook-form` + `zodResolver` + schemas from the relevant `@src/externals/*/schema.ts`. Multi-step forms (e.g. ForgotPassword) use separate `useForm` instances per step, with a discriminator state variable to switch between steps.

### Zod v4 Rules

- Use `z.email()` (not `z.string().email()`)
- Pass messages as objects: `.min(1, { message: '...' })`, `.regex(/.../, { message: '...' })`

### Toast & Mutations

Every `useMutation` must include `onError` with `toast.error(error instanceof Error ? error.message : '...')`. Success mutations that affect UX include `onSuccess` with `toast.success(...)`.
