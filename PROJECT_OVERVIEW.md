# Social Coffee — Project Overview

Self-contained context about the product and backend. Hand this to Claude Code alongside [MOBILE_INTEGRATION_GUIDE.md](./MOBILE_INTEGRATION_GUIDE.md) when wiring up the mobile app — this file explains *what the product is and why it works the way it does*; the other file is the flat API reference.

---

## 1. What the product is

Social Coffee is a **location-based, real-time social/dating app**. The core idea: instead of endless swiping from anywhere, people only see and match with others who are **physically at the same venue right now** (a coffee shop, in practice). A match doesn't open an indefinite chat — it opens a **10-minute countdown chat window**, pushing the pair toward meeting in person instead of texting indefinitely.

The core loop:

1. User checks in at a venue (QR scan → geolocation validated against a geofence).
2. While checked in, they see a live feed of other checked-in, compatible users at that venue.
3. They like people; a mutual like is an instant match.
4. A match creates a 10-minute chat session between the two.
5. When the chat ends (manually or by timeout), they're back in the venue feed.
6. Checking out (or leaving the geofence) removes them from the feed.

Everything is scoped to venue + time — there's no persistent friend list, global swiping, or open-ended messaging. This constraint is intentional and shapes a lot of the API design (see §4).

---

## 2. Tech stack

- **Backend:** NestJS (Node/TypeScript), REST + WebSocket (Socket.IO) in one process
- **Database:** PostgreSQL via Prisma ORM
- **Cache / real-time state:** Redis (presence tracking, chat message cache, socket-ID mapping, rate limiting) — this is why the app needs Redis even though Postgres is the source of truth; presence/feed data is too ephemeral and latency-sensitive for Postgres round-trips on every heartbeat.
- **Image storage:** Cloudinary (profile images)
- **Auth:** JWT access tokens (short-lived, 15 min default) + JWT refresh tokens (30 days, httpOnly cookie)
- **Deployment (per `docs/ARCHITECTURE.md`):** API on Fly.io, Postgres on Neon, Redis on Upstash, images on Cloudinary
- **API docs:** Swagger/OpenAPI (auto-generated from decorators, dev-only at `/docs`)

The API is versioned (`/api/v1/...`) and wraps every REST response in a consistent envelope (`{ success, statusCode, message, data, timestamp }`) — see MOBILE_INTEGRATION_GUIDE.md §3 for the exact shape.

---

## 3. Module breakdown (`src/modules/`)

| Module | Responsibility |
|---|---|
| `auth` | Register, login, JWT issuance/refresh, password reset, logout (single/all devices) |
| `profile` | User profile CRUD, profile image upload, the venue discovery feed (`GET /profiles/feed`) |
| `preference` | Age range / gender / "looking for" preferences that filter who shows up in a user's feed |
| `venue` | Venue CRUD (admin), QR code generation, check-in/check-out with geofence validation |
| `interaction` | Likes, unlikes, mutual-match detection |
| `chat` | The 10-minute matched chat: WebSocket gateway (`/chat`) + REST endpoint to list active sessions |
| `presence` | The live venue feed: WebSocket gateway (`/presence`), join/leave broadcasts, heartbeat, geofence re-checks |
| `redis` | Shared Redis service used by presence/chat for ephemeral state |
| `file-upload` | Multer + Cloudinary wiring for profile image uploads |
| `health` | Liveness/readiness endpoints for orchestration (K8s-style probes) |

---

## 4. Data model (see `prisma/schema.prisma` for the full source of truth)

Core entities and how they relate to the product loop:

- **User** — account + profile fields (name, birthDate, gender, bio, profileImageUrl, role). Soft-deletable (`deletedAt`).
- **Preference** (1:1 with User) — feed filtering criteria: `minAge`, `maxAge`, `preferredGender`, `lookingFor[]`.
- **Interest** / **UserInterest** — many-to-many tags users pick for their profile, shown in the feed cards.
- **Venue** — a physical location: `mapUrl`, `latitude`/`longitude`, `geofenceMeters` (default 150m radius), `status` (ACTIVE / TEMPORARILY_CLOSED / PERMANENTLY_CLOSED).
- **Interaction** — a like, scoped to `(venue, actorUser, targetUser)`. Uniqueness is per-venue, so the same two people could interact again at a different venue later.
- **ChatSession** — created the instant a mutual like is detected. Has `status` (PENDING/ACTIVE/ENDED/EXPIRED), `startedAt`, `expiresAt` (10 min after start).
- **Message** — belongs to a ChatSession; persisted to Postgres and cached in Redis for fast history retrieval.
- **Token** — refresh + password-reset tokens, tracked server-side (so `logout-all` can invalidate them all, and rotation can detect reuse).

Roles: `USER` (normal app users), `ADMIN` (venue management), `CAFE_MANAGER` (defined in the enum, not yet wired into any endpoint's `@Roles()` guard as of this writing — don't build UI around it yet).

---

## 5. Business rules that affect how you build the client

These aren't obvious from endpoint signatures alone — they're the "why" behind the API:

- **You must be checked in to see anyone.** `GET /profiles/feed` (REST) and the `/presence` WebSocket both require an active check-in; there is no "browse without a venue" mode.
- **The feed is filtered by mutual preference, not just yours.** Age range and gender preference are applied server-side — don't re-filter client-side and don't expect to see people outside your own stated preferences either.
- **A like is silent to the other person until it's mutual.** There's no "someone liked you" push notification implied by the current API — `GET /interactions/liked-me` is a pull-based check, not a push event. If you want that as a live notification, it doesn't exist yet — flag it as a gap if the product needs it.
- **Chat sessions are hard-capped at 10 minutes** (`CHAT_DURATION` in `src/modules/interaction/constants/chat-duration.ts`) and cannot be extended. Design the chat UI to make the countdown visible and unmissable — this is a deliberate product mechanic, not a bug to work around.
- **Geofence violations auto-checkout mid-session.** If a user's heartbeat coordinates land outside `venue.geofenceMeters`, the server disconnects their `/presence` socket and removes them from the venue. The client should treat this gracefully (show "you left the venue" UI), not as an error.
- **Disconnects have a 30-second grace period** before other users see a "left" event — brief network drops (tunnel, elevator, etc.) shouldn't visibly flicker the feed for everyone else.
- **Venue check-in is normally QR-driven** (per `docs/ARCHITECTURE.md`'s user-journey diagram: scan a venue's QR code, which encodes the venue ID, then the app calls check-in with GPS coordinates for geofence validation) — so the mobile app needs camera/QR-scan capability, not just a venue picker list.

---

## 6. What to read next

- [MOBILE_INTEGRATION_GUIDE.md](./MOBILE_INTEGRATION_GUIDE.md) — every REST endpoint and WebSocket event, request/response shapes, and the mobile-specific refresh-token cookie issue (read that section before writing any auth code).
- [ARCHITECTURE.md](./ARCHITECTURE.md) — sequence diagrams for auth, chat, and presence flows, plus the full ERD.
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) — a narrated walkthrough of one full user journey, useful as a sanity check against the flat reference.
