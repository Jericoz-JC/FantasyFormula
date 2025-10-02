# Fantasy Formula - Project Overview

## 🏎️ What Is This?

**Fantasy Formula** is an ELO-powered F1 ranking application where users predict driver finishing positions before each race and earn/lose ELO points based on their ranking accuracy.

Think **Chess.com** meets **Formula 1**.

---

## 🎯 Core Concept

### Before Each Race
Users rank all 20 F1 drivers from position 1-20

### After Each Race
- Compare user's ranking vs actual race results
- Calculate accuracy using Spearman's correlation
- Award ELO points based on accuracy
- Update global leaderboard

---

## 📊 How ELO Works

```
User Ranking: [Piastri, Norris, Verstappen, ...]
Actual Result: [Norris, Piastri, Russell, ...]

Correlation: 0.85 (85% accuracy)

ELO Calculation:
✅ Base points: +40 (high accuracy)
✅ Correct winner: +0 (predicted Piastri, was Norris)
✅ Exact podium: +0 (didn't match exactly)
✅ Top 5 correct: +5 (4 of 5 correct)

Total: +45 ELO
New Rating: 1200 → 1245
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                  Next.js App                     │
├─────────────────────────────────────────────────┤
│                                                  │
│  Frontend (Not Built Yet)                       │
│  ├─ Login/Register Pages                        │
│  ├─ Dashboard                                    │
│  ├─ Ranking Submission Form                     │
│  ├─ Leaderboard Display                         │
│  └─ Profile Page                                 │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  Backend API (✅ COMPLETE)                      │
│  ├─ Authentication (NextAuth.js)                │
│  ├─ Races API (list, upcoming, details)         │
│  ├─ Rankings API (submit, update, view)         │
│  ├─ Results API (admin, calculate ELO)          │
│  ├─ Leaderboard API (overall, season)           │
│  └─ ELO Calculation Engine                      │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  Database (PostgreSQL + Prisma)                 │
│  ├─ Users (auth + ELO)                          │
│  ├─ Drivers (F1 2025 roster)                    │
│  ├─ Races (2025 calendar)                       │
│  ├─ Rankings (user submissions)                 │
│  └─ RaceResults (official results)              │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 🔄 User Flow

### 1. Registration
```
User → POST /api/auth/register
  ↓
Create account with starting ELO: 1200
  ↓
Return user data
```

### 2. View Upcoming Race
```
User → GET /api/races/upcoming
  ↓
Return next race details
  ↓
Check if lock time has passed
```

### 3. Submit Ranking
```
User → POST /api/rankings
  ↓
Validate: All 20 drivers, before lock time
  ↓
Save to database
  ↓
Increment user's rankings count
```

### 4. Race Happens (Real Life)
```
Admin watches F1 race
  ↓
Note final positions
```

### 5. Submit Results (Admin)
```
Admin → POST /api/results/[raceId]
  ↓
Process all user rankings
  ↓
Calculate ELO for each user
  ↓
Update user ELO ratings (transaction)
  ↓
Mark race as COMPLETED
```

### 6. View Leaderboard
```
User → GET /api/leaderboard/overall
  ↓
Return users sorted by ELO
  ↓
Display rank, username, ELO, stats
```

---

## 📈 Data Models

### User
```typescript
{
  id: "uuid",
  email: "user@example.com",
  username: "racer123",
  eloRating: 1245,        // Current ELO
  totalPoints: 2340,      // Cumulative score
  rankingsCount: 15       // Number of races participated
}
```

### Race
```typescript
{
  id: "uuid",
  name: "Singapore Grand Prix",
  date: "2025-10-05T13:00:00Z",
  status: "UPCOMING",
  lockTime: "2025-10-05T12:00:00Z",  // 1 hour before
  hasSprint: false
}
```

### Ranking
```typescript
{
  id: "uuid",
  userId: "uuid",
  raceId: "uuid",
  rankings: {
    drivers: [
      { position: 1, driverId: "piastri" },
      { position: 2, driverId: "norris" },
      ...
    ]
  },
  eloChange: 45,          // Calculated after race
  score: 87,              // Accuracy percentage
  submittedAt: "2025-10-01T10:00:00Z"
}
```

---

## 🎮 API Endpoints Summary

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/auth/register` | POST | Create account | No |
| `/api/auth/[...nextauth]` | GET/POST | Login | No |
| `/api/races` | GET | List races | Optional |
| `/api/races/[id]` | GET | Race details | Optional |
| `/api/races/upcoming` | GET | Next race | Optional |
| `/api/rankings` | POST | Submit ranking | Yes |
| `/api/rankings` | GET | User's rankings | Yes |
| `/api/rankings/[id]` | PATCH | Update ranking | Yes |
| `/api/rankings/[id]` | GET | View ranking | Yes |
| `/api/results/[raceId]` | POST | Submit results | Admin |
| `/api/results/[raceId]` | GET | View results | No |
| `/api/leaderboard/overall` | GET | Overall ranks | No |
| `/api/leaderboard/season/[year]` | GET | Season ranks | No |

---

## 🧮 ELO Calculation Example

### Scenario
- User has 15 previous rankings (K-factor = 24)
- Current ELO: 1200
- Submitted ranking for Singapore GP
- Actual race results come in

### Accuracy Analysis
```
Spearman Correlation: 0.92
Accuracy: 92%

Bonuses:
✅ Correct winner (Piastri)
✅ Exact podium (Piastri, Norris, Verstappen)
✅ Top 5: 5/5 correct
```

### ELO Calculation
```
Base (92% accuracy): +45
Winner bonus: +15
Podium bonus: +10
Top 5 bonus: +5
─────────────────
Subtotal: +75

K-factor adjustment (24/32):
+75 * 0.75 = +56 ELO

New Rating: 1200 + 56 = 1256
```

---

## 🏆 Leaderboard System

### Overall Leaderboard
Sorted by: **ELO Rating** (descending)

Shows:
- Rank
- Username
- ELO Rating
- Total Points
- Rankings Count

### Season Leaderboard
Sorted by: **Season Points** (sum of accuracy scores)

Shows:
- Rank
- Username
- Season Points
- Season ELO Gain
- Number of Races
- Average Accuracy

---

## 🔒 Security Measures

| Threat | Protection |
|--------|-----------|
| Password Theft | bcryptjs hashing (12 rounds) |
| Session Hijacking | JWT with NEXTAUTH_SECRET |
| SQL Injection | Prisma parameterized queries |
| Unauthorized Access | NextAuth middleware |
| Admin Abuse | Secret key verification |
| Input Malformation | Zod validation schemas |

---

## 📊 F1 2025 Data

### Drivers (20)
All current F1 drivers with:
- Driver ID (e.g., "piastri")
- Full name
- Team
- Number
- Team colors (for UI)
- Current championship position

### Races (7 Remaining)
- Round 18: Singapore 🇸🇬
- Round 19: USA (Austin) 🇺🇸 + Sprint
- Round 20: Mexico 🇲🇽
- Round 21: Brazil 🇧🇷 + Sprint
- Round 22: Las Vegas 🇺🇸 + Sprint
- Round 23: Qatar 🇶🇦 + Sprint
- Round 24: Abu Dhabi 🇦🇪

---

## 🎨 Future Enhancements

### Phase 1: Frontend (Next)
- [ ] User authentication UI
- [ ] Dashboard with stats
- [ ] Ranking submission form
- [ ] Leaderboard display
- [ ] Profile page

### Phase 2: Social Features
- [ ] Friend system
- [ ] Friend leaderboards
- [ ] Share rankings
- [ ] Notifications

### Phase 3: Advanced Features
- [ ] ELO history charts
- [ ] Head-to-head comparisons
- [ ] Achievement system
- [ ] Live race updates
- [ ] Push notifications

### Phase 4: Gamification
- [ ] Badges/achievements
- [ ] Streak tracking
- [ ] Seasonal rewards
- [ ] Prediction insights

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main overview & quick start |
| `QUICK_START.md` | 5-minute setup guide |
| `SETUP_GUIDE.md` | Comprehensive setup |
| `API_DOCUMENTATION.md` | Complete API reference |
| `DRIVERS_REFERENCE.md` | All driver IDs |
| `PROJECT_CHECKLIST.md` | Implementation status |
| `IMPLEMENTATION_SUMMARY.md` | Technical summary |
| `PROJECT_OVERVIEW.md` | This file |

---

## 🔧 Tech Decisions Explained

### Why Next.js?
- Full-stack framework
- API routes built-in
- Great TypeScript support
- Vercel deployment
- Future SSR for leaderboards

### Why Prisma?
- Type-safe database queries
- Auto-generated types
- Migration system
- Great DX with Prisma Studio
- PostgreSQL optimization

### Why PostgreSQL?
- ACID compliance (important for ELO updates)
- JSON support (for rankings/results)
- Excellent Prisma integration
- Free tier available (Supabase/Neon)
- Scalable

### Why Spearman's Correlation?
- Measures rank similarity
- Handles ties gracefully
- Intuitive interpretation (-1 to 1)
- Fast to compute
- Well-researched algorithm

### Why ELO over Points?
- Self-balancing (can't just rank more to win)
- Skill-based (rewards accuracy)
- Dynamic (changes based on performance)
- Familiar (chess, gaming)
- Prevents inflation

---

## 💡 Key Insights

### User Behavior
- Users will rank favorites higher (bias)
- Lock time prevents last-minute changes
- ELO incentivizes thoughtful rankings
- Season leaderboard adds variety

### Technical Challenges
- Atomic ELO updates (solved with transactions)
- Ranking validation (all 20 drivers)
- Lock time enforcement
- Admin security

### Design Choices
- 1 hour lock time (balance between flexibility and fairness)
- 20 driver ranking (comprehensive)
- ELO over points (skill-based)
- Spearman correlation (fair accuracy measure)

---

## 🎯 Success Criteria

### MVP (✅ Complete)
- [x] User registration/login
- [x] Submit rankings
- [x] Calculate ELO
- [x] Display leaderboard
- [x] Admin submit results

### Beta Launch (Future)
- [ ] Frontend UI complete
- [ ] 100+ users
- [ ] Complete season data
- [ ] Mobile responsive

### Version 1.0 (Future)
- [ ] Friend system
- [ ] Push notifications
- [ ] 1,000+ users
- [ ] <500ms API response time

---

## 📞 Resources

- **Repository**: https://github.com/Jericoz-JC/FantasyFormula
- **Tech Stack Docs**:
  - Next.js: https://nextjs.org/docs
  - Prisma: https://prisma.io/docs
  - NextAuth: https://authjs.dev
  - Zod: https://zod.dev
- **F1 Data**: https://www.formula1.com
- **Deployment**: https://vercel.com

---

**Built for F1 fans who love data and competition! 🏁**

