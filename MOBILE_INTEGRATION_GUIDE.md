# Mobile Integration Guide

Everything a mobile client (React Native, Flutter, native iOS/Android) needs to wire up against the Social Coffee API. This is the file to hand to Claude Code in your mobile app repo — paste it in, or point Claude Code at this path if the mobile repo can read this one.

For narrative walkthroughs, see [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md), [CHAT_WEBSOCKET_GUIDE.md](./CHAT_WEBSOCKET_GUIDE.md), and [PRESENCE_WEBSOCKET_GUIDE.md](./PRESENCE_WEBSOCKET_GUIDE.md). This doc is the flat reference: every REST endpoint, every WS event, every enum, and the mobile-specific gotchas those other docs don't cover.

---

## 1. Critical: the refresh-token cookie problem

**Read this before wiring anything.** The API issues the refresh token as an **httpOnly cookie** (`Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict`), never in the JSON response body (see `src/common/utils/cookie-utils.ts` and `src/common/constants/auth.constants.ts`). This works transparently in a browser. On a mobile app it does **not** work transparently:

- `fetch` / `axios` on iOS and Android do not reliably persist and replay cookies across requests the way a browser does.
- `SameSite=Strict` is a browser concept; some native stacks still honor it inconsistently or drop the cookie.
- React Native's networking layer in particular is known to be unreliable with `httpOnly` cookies.

**You have three ways to handle this — pick one before writing any auth code:**

| Option | What to do | Tradeoff |
|---|---|---|
| **A. Cookie jar library (recommended, no backend change)** | RN: use `@react-native-cookies/cookies` (or axios + a cookie-jar interceptor) to manually capture `Set-Cookie` on login/register/refresh responses and re-attach it as a `Cookie` header on `POST /api/v1/auth/refresh`. Flutter: use `dio` + `dio_cookie_manager` + `cookie_jar` (persisted with `PersistCookieJar`). | No backend changes, but requires real cookie-jar plumbing — a plain `fetch`/`http.post` will silently fail to refresh. |
| **B. Backend change: also return refreshToken in body for mobile clients** | Ask a backend change so `register`/`login`/`refresh` optionally return `refreshToken` in the JSON body (e.g. gated by a custom header like `X-Client: mobile`), and mobile stores it in Keychain/Keystore (`expo-secure-store`, `react-native-keychain`, or `flutter_secure_storage`) and sends it explicitly in the request body of `POST /api/v1/auth/refresh`. | Requires a backend PR, but is the most reliable and idiomatic mobile pattern. |
| **C. Skip refresh, force re-login on 401** | Just use the access token, and re-prompt login when it expires (every `JWT_ACCESS_EXPIRATION`, default 15 min). | Simplest, but bad UX — the user re-logs-in every 15 minutes. Not recommended beyond a quick prototype. |

If you're not sure which to pick: **Option A** if you want zero backend changes and are comfortable adding a cookie-jar dependency; **Option B** if you're willing to touch the backend once and want the cleanest long-term mobile auth. Tell Claude Code explicitly which option you're using — it changes how the auth module is written.

Everything else below (access token usage, WS auth) works identically for browser and mobile — this cookie issue is the one place mobile needs special handling.

---

## 2. Base URLs & environment

- Dev server default: `http://localhost:8000` (`PORT` in `.env`, default `8000`)
- Global REST prefix: `/api`, plus URI versioning → **all REST routes are under `/api/v1/...`**
- Health checks are the one exception — **not** prefixed with `/api`, but still versioned: `/v1/health`, `/v1/health/live`, `/v1/health/ready`
- WebSocket namespaces (no `/api` or version prefix): `ws://<host>/presence` and `ws://<host>/chat`
- Swagger UI (dev only, `NODE_ENV=development`): `http://localhost:8000/docs` — live, always-accurate source of truth for schemas if this doc and the code ever drift
- On a real device / emulator, `localhost` means the device itself — use your machine's LAN IP or `10.0.2.2` (Android emulator) instead of `localhost`.
- CORS: origins are read from `CORS_ORIGIN` (comma-separated). Native mobile HTTP requests aren't subject to CORS, but if you test via a web wrapper (Expo web, etc.) you'll need your dev origin added there.

---

## 3. Response envelope (every REST response follows this shape)

**Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile retrieved successfully",
  "data": { /* payload, or null */ },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Paginated success** (adds a `pagination` block; used by `GET /venues`):
```json
{
  "success": true,
  "statusCode": 200,
  "data": [ /* items */ ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Error:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "data": null,
  "errors": [
    { "field": "email", "messages": ["Email is invalid"] }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

Build your API client to always unwrap `.data` on success and surface `.message` / `.errors` on failure — every endpoint is consistent, so this can be one shared response parser, not per-endpoint handling.

**Auth header for protected routes:** `Authorization: Bearer <accessToken>`.

---

## 4. Enums (mirror these as TypeScript/Dart types in the mobile app)

```typescript
type Gender = 'MALE' | 'FEMALE' | 'OTHER';
type Role = 'USER' | 'ADMIN' | 'CAFE_MANAGER';
type ChatSessionStatus = 'PENDING' | 'ACTIVE' | 'ENDED' | 'EXPIRED';
type VenueStatus = 'ACTIVE' | 'TEMPORARILY_CLOSED' | 'PERMANENTLY_CLOSED';
type LookingFor =
  | 'ROMANTIC_RELATIONSHIP' | 'CASUAL_DATING' | 'FRIENDSHIP' | 'NETWORKING'
  | 'ACTIVITY_PARTNER' | 'STUDY_BUDDY' | 'LANGUAGE_EXCHANGE'
  | 'COFFEE_CHAT' | 'EVENTS_COMPANION';
```

Regular end users always have `role: 'USER'`. `ADMIN` and `CAFE_MANAGER` are for venue-management endpoints — irrelevant unless you're also building an admin/manager mode into the app.

---

## 5. REST endpoint reference

All paths below are relative to `/api/v1` unless noted. 🔒 = requires `Authorization: Bearer <accessToken>`. 👑 = requires ADMIN role on top of auth.

### Auth (`/auth`)

| Method & path | Auth | Body | Notes |
|---|---|---|---|
| `POST /auth/register` | — | `{ firstName, lastName, email, password, birthDate, gender, bio }` | Password needs upper+lower+number+special char. `birthDate` must be 18+. Returns `{ accessToken, user }`; sets refresh cookie. 201. |
| `POST /auth/login` | — | `{ email, password }` | Same response shape as register. Rate-limited: 5/min. |
| `POST /auth/refresh` | 🔒 refresh cookie | — | Rotates refresh token, returns new `{ accessToken }`. **Not** `/refresh-token` — mind the exact path. |
| `POST /auth/forgot-password` | 🔒 | `{ email }` | Always responds success (no email enumeration). Rate-limited: 3/min. |
| `POST /auth/reset-password/:token` | — | `{ newPassword }` | Token comes from the reset email. Signs out all sessions on success. Rate-limited: 5/min. |
| `POST /auth/logout` | 🔒 refresh cookie | — | Invalidates current refresh token, clears cookie. |
| `POST /auth/logout-all` | 🔒 refresh cookie | — | Invalidates **all** refresh tokens for the user (all devices). |

`user` object shape (`UserResponseDto`): `{ id, email, firstName, lastName, gender, role, profileImageUrl, bio, birthDate, createdAt }`.

### Profile (`/profiles`) — all 🔒

| Method & path | Body / Query | Response |
|---|---|---|
| `GET /profiles/me` | — | Full `ProfileResponseDto`: id, firstName, lastName, email, birthDate, gender, profileImageUrl, bio, `interests: [{id,name}]`, `preference` (nullable), createdAt, updatedAt |
| `GET /profiles/feed?limit=20&cursor=<id>` | `limit` 1–50 (default 20), `cursor` = last profile id | `{ profiles: ProfileForFeedDto[], total, nextCursor, hasMore }`. **Requires an active venue check-in** — 400 if not checked in. |
| `PATCH /profiles/me` | Any subset of `{ firstName, lastName, birthDate, gender, bio, interestIds: string[] }` | Updated profile. `interestIds` **replaces** the whole interest list. |
| `POST /profiles/me/image` | `multipart/form-data`, field name **`profileImage`**, ≤5MB, JPEG/PNG/WebP | `{ profileImageUrl }` |
| `DELETE /profiles/me/image` | — | 200, no data |

### Preferences (`/preferences`) — all 🔒

| Method & path | Body | Response |
|---|---|---|
| `GET /preferences/me/exists` | — | `{ exists: boolean }` |
| `GET /preferences/me` | — | `PreferenceResponseDto` (404 if not set) |
| `PUT /preferences/me` | `{ minAge, maxAge, preferredGender, lookingFor: LookingFor[] }` (all required; age 18–100) | Upserted `PreferenceResponseDto` |
| `DELETE /preferences/me` | — | 200 |

### Venues (`/venues`)

| Method & path | Auth | Body / Query | Response |
|---|---|---|---|
| `GET /venues?page=&limit=&search=&status=&sortBy=&sortOrder=` | 🔒👑 | query filters | Paginated `VenueResponseDto[]` |
| `GET /venues/:id` | 🔒 | — | `VenueWithQrCodeDto` (adds `qrCode` base64 image) |
| `GET /venues/:id/qrcode` | 🔒👑 | — | `{ venueId, qrCode }` |
| `POST /venues` | 🔒👑 | `{ name, mapUrl, status, geofenceMeters? }` | Created venue with QR, 201 |
| `PATCH /venues/:id` | 🔒👑 | Partial venue fields | Updated venue |
| `PATCH /venues/:id/status` | 🔒👑 | `{ status? }` | Updated venue (toggles ACTIVE↔TEMPORARILY_CLOSED if omitted) |
| `DELETE /venues/:id` | 🔒👑 | — | Soft-delete (sets PERMANENTLY_CLOSED) |
| `POST /venues/:id/checkin` | 🔒 | `{ latitude, longitude }` | 400 if outside `geofenceMeters` of venue. **Required before connecting to `/presence`.** |
| `POST /venues/:id/checkout` | 🔒 | — | Removes the user from venue presence |

`VenueResponseDto`: `{ id, name, mapUrl, latitude, longitude, geofenceMeters, status, createdAt, updatedAt }`.

### Interactions (`/interactions`) — all 🔒, USER role

| Method & path | Body | Response |
|---|---|---|
| `POST /interactions/like` | `{ targetUserId, venueId }` | `{ matched, chatSession? }` — `chatSession` present only when mutual. 201. See match flow below. |
| `DELETE /interactions/unlike/:targetUserId` | — | 200 |
| `GET /interactions/my-likes` | — | `InteractionResponseDto[]` (users you've liked, current venue) |
| `GET /interactions/liked-me` | — | `InteractionResponseDto[]` (users who liked you) |

`InteractionResponseDto`: `{ id, venueId, user: { id, firstName, lastName, profileImageUrl }, createdAt }`.

`MatchResultResponseDto` (from `like`): `{ matched: boolean, chatSession?: { id, expiresAt, partner: { id, firstName, lastName } } }`.

### Chat (`/chat`) — 🔒, USER role

| Method & path | Query | Response |
|---|---|---|
| `GET /chat/sessions?venueId=` | `venueId` optional filter | `ChatSessionResponseDto[]` — active sessions: `{ id, status, startedAt, expiresAt, partner: {id,firstName,lastName}, venue: {id,name} }` |

Real-time messaging itself is WebSocket-only — see §6.

### Health (no `/api` prefix, no auth)

| Method & path | Purpose |
|---|---|
| `GET /v1/health` | Basic liveness + uptime |
| `GET /v1/health/live` | Kubernetes liveness probe |
| `GET /v1/health/ready` | Checks Postgres + Redis, 503 if down |

---

## 6. WebSocket reference (summary — full detail in the dedicated guides)

Two Socket.IO namespaces, both authenticated the same way:

```typescript
import { io } from 'socket.io-client';
const socket = io('http://<host>/presence', { // or /chat
  auth: { token: accessToken },
  transports: ['websocket'],
});
```

### `/presence` — see [PRESENCE_WEBSOCKET_GUIDE.md](./PRESENCE_WEBSOCKET_GUIDE.md)

- **Precondition:** user must have called `POST /venues/:id/checkin` first, or the connection is rejected.
- Emits on connect: `feed_initial` (`{ users: UserProfile[] }`).
- Server → client: `user_joined`, `user_left`, `heartbeat_ack`, `error`.
- Client → server: `heartbeat` (`{ latitude?, longitude? }`, every ~30s) — also re-validates geofence if coords included; auto-disconnects+checks-out if the user wandered outside the venue.

### `/chat` — see [CHAT_WEBSOCKET_GUIDE.md](./CHAT_WEBSOCKET_GUIDE.md)

- Auto-joins any active session on connect (from a prior match).
- Client → server: `join_chat({chatSessionId})`, `send_message({chatSessionId, content})` (1–500 chars), `typing({chatSessionId, isTyping})`, `end_chat({chatSessionId})`.
- Server → client: `chat_joined`, `message`, `partner_typing`, `chat_ended`, `session_ending_soon`, `partner_left`, `error`.
- A matched chat session **expires 10 minutes** after creation — plan the UI around `session_ending_soon` and `chat_ended`/`SESSION_EXPIRED`.

---

## 7. End-to-end flow (state machine)

```
register/login ──► checkin (REST) ──► connect /presence ──► browse feed
                                                                  │
                                                     POST /interactions/like
                                                                  │
                                                     matched: true? ──► connect /chat, join_chat
                                                                  │           │
                                                                  │      10-min session, then chat_ended
                                                                  ▼
                                                          checkout (REST) or disconnect /presence
```

---

## 8. Mobile client checklist

- **Token storage:** access token in memory + secure storage (`expo-secure-store` / `react-native-keychain` / `flutter_secure_storage`), never `AsyncStorage`/plain prefs for the refresh token if you go with Option B above.
- **Auto-refresh interceptor:** on any `401` from a REST call, attempt `POST /auth/refresh` once, retry the original request with the new access token, and only force logout if the refresh itself fails.
- **Socket reconnection:** on `connect_error` where the message mentions "expired"/"invalid", refresh the access token, update `socket.auth = { token }`, and call `socket.connect()` again (both namespaces).
- **Background/foreground:** stop the `heartbeat` interval on `/presence` when the app backgrounds; on foreground, checkin status may be stale — worth re-verifying or re-checking-in if the app was backgrounded a long time.
- **Image upload:** use `multipart/form-data` with the exact field name `profileImage`, ≤5MB, and let the OS image picker downscale/compress — the server does not resize.
- **Device location:** `checkin` and `heartbeat` both need `latitude`/`longitude` — request location permission before check-in, not at app launch.
- **Error surface:** every failed request has `.message` (human-readable) and optionally `.errors[]` (field-level) — map both into your form validation and toast/snackbar layer generically, don't hand-write per-endpoint error copy.

---

## 9. Suggested prompt for Claude Code (mobile repo)

Paste this doc's content (or its file path, if in a shared/monorepo) into the mobile project along with:

> Wire up API calls to the Social Coffee backend using `docs/MOBILE_INTEGRATION_GUIDE.md` as the source of truth for endpoints, auth flow, and WebSocket events. I'm using [React Native / Flutter / etc — state your stack]. For the refresh-token cookie issue described in §1, use Option [A/B/C]. Base URL for local dev: `http://<your-LAN-IP>:8000`.

Being explicit about your stack and which refresh-token option you're using up front will save a round-trip — it's the one architectural decision this doc can't make for you.
