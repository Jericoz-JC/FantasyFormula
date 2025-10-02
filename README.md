# Fantasy Formula - F1 Ranking App

ELO-powered F1 race prediction platform with mobile-first design. Users rank all 20 drivers before each race and earn ELO points based on ranking accuracy.

> **📚 New here?** See the [Documentation Index](DOCUMENTATION_INDEX.md) for a complete guide to all docs.

## 🏎️ Features

- **ELO-Based Ranking System**: Rank all 20 F1 drivers before each race
- **Intelligent Scoring**: ELO calculations based on Spearman's rank correlation
- **Real-time Leaderboards**: Overall and season-specific rankings
- **Complete F1 2025 Database**: All drivers and remaining races (Singapore onwards)
- **Secure Authentication**: NextAuth.js with JWT strategy
- **Production Ready**: Full backend MVP with TypeScript, Prisma, and PostgreSQL

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (Auth.js)
- **Validation**: Zod
- **Styling**: Tailwind CSS
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
/app
  /api
    /auth          # Authentication endpoints (register, login)
    /races         # Race data endpoints
    /rankings      # User ranking submissions
    /results       # Race results & ELO processing
    /leaderboard   # Overall & season leaderboards
  /(auth)          # Auth pages (future)
  /(dashboard)     # Dashboard pages (future)
/components
  /ui              # shadcn/ui components
  /features        # Feature-specific components
  /layout          # Layout components
/lib
  /db              # Prisma client
  /auth            # Auth configuration
  /validations     # Zod schemas
  /elo             # ELO calculation engine
  /data            # F1 2025 data (drivers, races)
/prisma
  schema.prisma    # Database schema
  seed.ts          # Seeding script
/types             # TypeScript type definitions
```

## 🚀 Quick Start

**Want to get running in 5 minutes?** → See [QUICK_START.md](QUICK_START.md)

**Comprehensive setup guide** → See [SETUP_GUIDE.md](SETUP_GUIDE.md)

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or Supabase/Neon)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jericoz-JC/FantasyFormula.git
   cd FantasyFormula
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/fantasy_formula"
   NEXTAUTH_SECRET="your-secret-key"  # Generate: openssl rand -base64 32
   NEXTAUTH_URL="http://localhost:3000"
   ADMIN_SECRET_KEY="your-admin-key"
   NODE_ENV="development"
   ```

4. **Setup database**
   ```bash
   # Push schema to database
   npm run db:push
   
   # Seed database with F1 2025 data
   npm run db:seed
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### Models

- **User**: Authentication, ELO rating, stats
- **Driver**: F1 2025 driver roster with team colors
- **Race**: 2025 race calendar with lock times
- **Ranking**: User's driver rankings (1-20) for each race
- **RaceResult**: Official race results for ELO calculation

### Key Features

- ELO rating starts at 1200
- K-factor: 32 (new), 24 (intermediate), 16 (veteran)
- Rankings lock 1 hour before race start
- Atomic transactions for ELO updates

## 🎯 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (NextAuth)
- `GET /api/auth/[...nextauth]` - NextAuth handler

### Races

- `GET /api/races` - List all races (filter by season, status)
- `GET /api/races/[id]` - Get single race with user's ranking
- `GET /api/races/upcoming` - Get next upcoming race

### Rankings

- `POST /api/rankings` - Submit driver ranking (all 20 drivers)
- `GET /api/rankings?raceId=[id]` - Get user's rankings
- `PATCH /api/rankings/[id]` - Update ranking (before lock time)
- `GET /api/rankings/[id]` - Get single ranking

### Results (Admin Only)

- `POST /api/results/[raceId]` - Submit race results + calculate ELO
  - Header: `x-admin-key: YOUR_ADMIN_SECRET_KEY`
- `GET /api/results/[raceId]` - Get race results

### Leaderboard

- `GET /api/leaderboard/overall` - Overall ELO leaderboard
- `GET /api/leaderboard/season/[year]` - Season-specific leaderboard

## 🧮 ELO Calculation

The ELO system uses **Spearman's rank correlation** to measure ranking accuracy:

### Scoring Tiers

- **99-100% accuracy**: +50 ELO (perfect ranking)
- **80-99% accuracy**: +30 to +45 ELO
- **60-79% accuracy**: +15 to +25 ELO
- **40-59% accuracy**: +5 to +10 ELO
- **<40% accuracy**: -5 to -20 ELO

### Bonus Points

- **Correct winner**: +15 ELO
- **Exact podium (top 3)**: +10 ELO
- **Top 5 correct** (4+/5): +5 ELO

### K-Factor

Scales ELO changes based on experience:
- New users (<10 races): K=32
- Intermediate (10-49 races): K=24
- Veterans (50+ races): K=16

## 🗄️ F1 2025 Data

### Drivers (20)

All 2025 drivers with current points, team colors, and positions after Round 17 (Azerbaijan GP).

**Top 5**:
1. Oscar Piastri (McLaren) - 266 pts
2. Lando Norris (McLaren) - 250 pts
3. Max Verstappen (Red Bull) - 185 pts
4. George Russell (Mercedes) - 157 pts
5. Charles Leclerc (Ferrari) - 139 pts

### Races (Remaining 2025 Season)

- Round 18: Singapore GP (Oct 5)
- Round 19: USA GP (Oct 19) - **Sprint**
- Round 20: Mexico GP (Oct 26)
- Round 21: São Paulo GP (Nov 9) - **Sprint**
- Round 22: Las Vegas GP (Nov 22) - **Sprint**
- Round 23: Qatar GP (Nov 30) - **Sprint**
- Round 24: Abu Dhabi GP (Dec 7)

## 🔐 Security

- Passwords hashed with bcryptjs (12 rounds)
- JWT-based sessions (NextAuth.js)
- Admin endpoints protected with secret key
- Input validation with Zod
- SQL injection prevention (Prisma)

## 📝 Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run db:push          # Push schema to database
npm run db:seed          # Seed database with F1 data
npm run prisma:studio    # Open Prisma Studio
npm run prisma:generate  # Generate Prisma Client
```

## 🚢 Deployment

### Vercel

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Database

Recommended providers:
- **Supabase** (PostgreSQL, free tier)
- **Neon** (Serverless PostgreSQL)
- **Railway** (PostgreSQL)

## 🧪 Testing the API

### Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "racer123",
    "password": "Password123"
  }'
```

### Submit Ranking

```bash
curl -X POST http://localhost:3000/api/rankings \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "raceId": "RACE_ID",
    "rankings": {
      "drivers": [
        {"position": 1, "driverId": "piastri"},
        {"position": 2, "driverId": "norris"},
        ...
      ]
    }
  }'
```

### Submit Race Results (Admin)

```bash
curl -X POST http://localhost:3000/api/results/RACE_ID \
  -H "Content-Type: application/json" \
  -H "x-admin-key: YOUR_ADMIN_SECRET_KEY" \
  -d '{
    "results": {
      "finalPositions": [
        {"position": 1, "driverId": "piastri", "points": 25},
        ...
      ]
    }
  }'
```

## 📄 License

ISC

## 🤝 Contributing

This is a personal project. Contributions welcome via pull requests.

## 📧 Contact

GitHub: [@Jericoz-JC](https://github.com/Jericoz-JC)

---

**Built with ❤️ for F1 fans**
