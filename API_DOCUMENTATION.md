# Fantasy Formula API Documentation

Complete API reference for the Fantasy Formula F1 Ranking App backend.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

Most endpoints require authentication via NextAuth.js session cookies. Include the session cookie in your requests after logging in.

### Session Cookie

After successful login, NextAuth sets a session cookie (`next-auth.session-token`) that's automatically included in subsequent requests.

---

## Endpoints

### Authentication

#### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "racer123",
  "password": "Password123"
}
```

**Validation:**
- Email must be valid format
- Username: 3-20 characters, alphanumeric + underscores only
- Password: min 8 chars, must include uppercase, lowercase, and number

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "racer123",
    "eloRating": 1200,
    "createdAt": "2025-10-02T12:00:00Z"
  },
  "message": "User registered successfully"
}
```

**Errors:**
- `400`: Validation error or user already exists
- `500`: Internal server error

---

#### Login

**POST** `/auth/signin`

Login with NextAuth.js credentials provider.

Use NextAuth's built-in signIn method on the client side or POST to the NextAuth endpoint.

---

### Races

#### List All Races

**GET** `/races`

Get all races with optional filters.

**Query Parameters:**
- `season` (optional): Filter by season year (e.g., 2025)
- `status` (optional): UPCOMING | IN_PROGRESS | COMPLETED

**Authentication:** Optional (returns user's rankings if authenticated)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Singapore Grand Prix",
      "location": "Marina Bay",
      "circuit": "Marina Bay Street Circuit",
      "country": "Singapore",
      "date": "2025-10-05T13:00:00Z",
      "season": 2025,
      "round": 18,
      "status": "UPCOMING",
      "hasSprint": false,
      "circuitLength": 4.94,
      "laps": 62,
      "lockTime": "2025-10-05T12:00:00Z",
      "_count": {
        "rankings": 42
      },
      "rankings": [
        {
          "id": "uuid",
          "submittedAt": "2025-10-01T10:00:00Z",
          "eloChange": null,
          "score": null
        }
      ]
    }
  ],
  "message": "Races fetched successfully"
}
```

---

#### Get Single Race

**GET** `/races/{raceId}`

Get detailed information about a specific race.

**Authentication:** Optional

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "name": "Singapore Grand Prix",
    "location": "Marina Bay",
    "circuit": "Marina Bay Street Circuit",
    "country": "Singapore",
    "date": "2025-10-05T13:00:00Z",
    "season": 2025,
    "round": 18,
    "status": "UPCOMING",
    "lockTime": "2025-10-05T12:00:00Z",
    "raceResult": null,
    "rankings": [],
    "_count": {
      "rankings": 42
    }
  },
  "message": "Race fetched successfully"
}
```

**Errors:**
- `404`: Race not found

---

#### Get Upcoming Race

**GET** `/races/upcoming`

Get the next upcoming race.

**Authentication:** Optional

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "name": "Singapore Grand Prix",
    "date": "2025-10-05T13:00:00Z",
    "lockTime": "2025-10-05T12:00:00Z",
    "status": "UPCOMING",
    "rankings": [],
    "_count": {
      "rankings": 42
    }
  },
  "message": "Next race fetched successfully"
}
```

**Errors:**
- `404`: No upcoming races found

---

### Rankings

#### Submit Ranking

**POST** `/rankings`

Submit driver rankings for a race. Must rank all 20 drivers before race lock time.

**Authentication:** Required

**Request Body:**
```json
{
  "raceId": "uuid",
  "rankings": {
    "drivers": [
      { "position": 1, "driverId": "piastri" },
      { "position": 2, "driverId": "norris" },
      { "position": 3, "driverId": "verstappen" },
      ...
      { "position": 20, "driverId": "colapinto" }
    ]
  }
}
```

**Validation:**
- Must include exactly 20 drivers
- Positions 1-20 must all be present
- No duplicate positions
- No duplicate driver IDs
- Race must exist and be UPCOMING
- Must be before lock time

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "raceId": "uuid",
    "rankings": { ... },
    "submittedAt": "2025-10-01T10:00:00Z",
    "race": {
      "name": "Singapore Grand Prix",
      "date": "2025-10-05T13:00:00Z",
      "lockTime": "2025-10-05T12:00:00Z"
    }
  },
  "message": "Ranking submitted successfully"
}
```

**Errors:**
- `400`: Validation error, race locked, or already submitted
- `401`: Unauthorized
- `404`: Race not found

---

#### Get User Rankings

**GET** `/rankings?raceId={raceId}`

Get all rankings for the authenticated user, optionally filtered by race.

**Authentication:** Required

**Query Parameters:**
- `raceId` (optional): Filter by specific race

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "raceId": "uuid",
      "rankings": { ... },
      "eloChange": 35,
      "score": 87,
      "pointsBreakdown": { ... },
      "submittedAt": "2025-10-01T10:00:00Z",
      "race": {
        "name": "Singapore Grand Prix",
        "date": "2025-10-05T13:00:00Z",
        "status": "COMPLETED"
      }
    }
  ],
  "message": "Rankings fetched successfully"
}
```

**Errors:**
- `401`: Unauthorized

---

#### Update Ranking

**PATCH** `/rankings/{rankingId}`

Update an existing ranking before the race lock time.

**Authentication:** Required

**Request Body:**
```json
{
  "rankings": {
    "drivers": [
      { "position": 1, "driverId": "norris" },
      ...
    ]
  }
}
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "rankings": { ... },
    "updatedAt": "2025-10-02T10:00:00Z",
    "race": { ... }
  },
  "message": "Ranking updated successfully"
}
```

**Errors:**
- `400`: Race locked or validation error
- `401`: Unauthorized
- `403`: Not your ranking
- `404`: Ranking not found

---

#### Get Single Ranking

**GET** `/rankings/{rankingId}`

Get details of a specific ranking.

**Authentication:** Required (before race completion), Optional (after completion)

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "rankings": { ... },
    "eloChange": 35,
    "score": 87,
    "pointsBreakdown": { ... },
    "race": { ... },
    "user": {
      "username": "racer123",
      "eloRating": 1235
    }
  },
  "message": "Ranking fetched successfully"
}
```

**Errors:**
- `403`: Cannot view others' rankings before race completion
- `404`: Ranking not found

---

### Results (Admin Only)

#### Submit Race Results

**POST** `/results/{raceId}`

Submit official race results and trigger ELO calculation for all rankings.

**Authentication:** Admin key required

**Headers:**
```
x-admin-key: YOUR_ADMIN_SECRET_KEY
```

**Request Body:**
```json
{
  "results": {
    "finalPositions": [
      { "position": 1, "driverId": "piastri", "points": 25 },
      { "position": 2, "driverId": "norris", "points": 18 },
      ...
      { "position": 20, "driverId": "colapinto", "points": 0 }
    ],
    "fastestLap": "norris",
    "dnfs": ["albon"],
    "sprintResults": [
      { "position": 1, "driverId": "verstappen", "points": 8 }
    ]
  }
}
```

**Response (201):**
```json
{
  "data": {
    "raceResult": { ... },
    "eloUpdates": [
      {
        "userId": "uuid",
        "username": "racer123",
        "oldElo": 1200,
        "newElo": 1235,
        "eloChange": 35,
        "score": 87
      }
    ]
  },
  "message": "Race results published. 42 rankings processed."
}
```

**Process:**
1. Creates/updates race result
2. Calculates ELO for all user rankings
3. Updates user ELO ratings and total points
4. Sets race status to COMPLETED

**Errors:**
- `401`: Unauthorized (invalid admin key)
- `404`: Race not found
- `400`: Validation error

---

#### Get Race Results

**GET** `/results/{raceId}`

Get official race results.

**Authentication:** Not required

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "raceId": "uuid",
    "results": { ... },
    "publishedAt": "2025-10-05T15:00:00Z",
    "race": {
      "name": "Singapore Grand Prix",
      "date": "2025-10-05T13:00:00Z",
      "status": "COMPLETED"
    }
  },
  "message": "Race results fetched successfully"
}
```

**Errors:**
- `404`: Results not found

---

### Leaderboard

#### Overall Leaderboard

**GET** `/leaderboard/overall`

Get global leaderboard sorted by ELO rating.

**Query Parameters:**
- `limit` (optional, default: 50): Number of results
- `offset` (optional, default: 0): Pagination offset

**Response (200):**
```json
{
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "id": "uuid",
        "username": "racer123",
        "eloRating": 1450,
        "totalPoints": 2340,
        "rankingsCount": 15,
        "createdAt": "2025-09-01T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 1523,
      "limit": 50,
      "offset": 0,
      "hasMore": true
    }
  },
  "message": "Overall leaderboard fetched successfully"
}
```

---

#### Season Leaderboard

**GET** `/leaderboard/season/{year}`

Get season-specific leaderboard sorted by season points.

**Query Parameters:**
- `limit` (optional, default: 50)
- `offset` (optional, default: 0)

**Response (200):**
```json
{
  "data": {
    "season": 2025,
    "leaderboard": [
      {
        "rank": 1,
        "id": "uuid",
        "username": "racer123",
        "eloRating": 1450,
        "seasonPoints": 1234,
        "seasonEloGain": 250,
        "seasonRankingsCount": 15,
        "averageAccuracy": 82
      }
    ],
    "pagination": { ... }
  },
  "message": "Season 2025 leaderboard fetched successfully"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": [] // Optional, for validation errors
}
```

### Common Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation, business logic)
- `401`: Unauthorized (not authenticated)
- `403`: Forbidden (authenticated but not allowed)
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error

---

## Rate Limiting

Not currently implemented. Consider implementing rate limiting for production using:
- `@upstash/ratelimit` (recommended for Vercel)
- Custom middleware

---

## CORS

API routes are accessible from the same origin. For cross-origin requests, configure CORS in `next.config.ts`.

---

## Webhooks

Not currently implemented. Future consideration for real-time updates.

---

## SDK / Client Libraries

Not provided. Use standard HTTP clients:
- **Browser**: `fetch` API
- **Node.js**: `axios`, `node-fetch`
- **TypeScript**: Type definitions available in `/types/index.ts`

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"test","password":"Test1234"}'
```

### Submit Ranking
```bash
curl -X POST http://localhost:3000/api/rankings \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{"raceId":"RACE_ID","rankings":{"drivers":[...]}}'
```

### Get Leaderboard
```bash
curl http://localhost:3000/api/leaderboard/overall?limit=10
```

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/Jericoz-JC/FantasyFormula/issues
- Email: Contact repository owner

---

**Last Updated**: October 2025

