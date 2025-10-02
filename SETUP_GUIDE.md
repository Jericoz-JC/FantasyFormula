# Fantasy Formula - Complete Setup Guide

Step-by-step guide to get your Fantasy Formula F1 Ranking App running locally and deploying to production.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **PostgreSQL database** (local, Supabase, or Neon)
- **Git** for version control
- Code editor (VS Code recommended)

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Jericoz-JC/FantasyFormula.git
cd FantasyFormula
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Next.js 14
- TypeScript
- Prisma
- NextAuth.js v5
- Tailwind CSS
- Zod
- bcryptjs
- date-fns

### 3. Setup PostgreSQL Database

#### Option A: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database:
   ```sql
   CREATE DATABASE fantasy_formula;
   ```
3. Note your connection string:
   ```
   postgresql://username:password@localhost:5432/fantasy_formula
   ```

#### Option B: Supabase (Free Tier)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Navigate to Project Settings → Database
4. Copy the connection string (use "Connection Pooling" for production)

#### Option C: Neon (Serverless PostgreSQL)

1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy the connection string

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the example file
cp env.example .env
```

Edit `.env` with your values:

```env
# Database - Replace with your actual connection string
DATABASE_URL="postgresql://user:password@localhost:5432/fantasy_formula?schema=public"

# NextAuth - Generate a secure secret
NEXTAUTH_SECRET="your-secret-here"  # Generate: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Admin Key - For submitting race results
ADMIN_SECRET_KEY="your-admin-key-here"  # Make this strong and secure

# Environment
NODE_ENV="development"
```

**Generate NEXTAUTH_SECRET:**
```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 5. Setup Database Schema

Push the Prisma schema to your database:

```bash
npm run db:push
```

This creates all tables (User, Driver, Race, Ranking, RaceResult).

### 6. Seed the Database

Populate the database with F1 2025 drivers and races:

```bash
npm run db:seed
```

This will:
- Create all 20 F1 2025 drivers with team colors
- Create remaining 2025 races (Singapore → Abu Dhabi)

### 7. Generate Prisma Client

```bash
npm run prisma:generate
```

### 8. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the Fantasy Formula homepage!

---

## Testing the API

### Using Prisma Studio

View and edit database records:

```bash
npm run prisma:studio
```

Opens at [http://localhost:5555](http://localhost:5555)

### Using cURL

#### 1. Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "racer123",
    "password": "Password123"
  }'
```

#### 2. Get Upcoming Race

```bash
curl http://localhost:3000/api/races/upcoming
```

#### 3. Get All Drivers

You'll need to query the database directly or create a drivers API route.

Using Prisma Studio:
1. Open Prisma Studio
2. Navigate to "Driver" table
3. View all drivers

### Using Postman/Insomnia

1. Import the API endpoints
2. Set up environment variables
3. Test authentication flow
4. Submit rankings

---

## Production Deployment

### Deploy to Vercel

#### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

#### 2. Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure settings:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### 3. Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
DATABASE_URL=your-production-database-url
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.vercel.app
ADMIN_SECRET_KEY=your-admin-key
NODE_ENV=production
```

#### 4. Deploy

Vercel will automatically deploy. Every push to `main` triggers a new deployment.

### Setup Production Database

#### Using Supabase

1. Create production project
2. Enable connection pooling (for serverless)
3. Use pooled connection string in `DATABASE_URL`
4. Run migrations:
   ```bash
   # From local machine with production DATABASE_URL
   npm run db:push
   npm run db:seed
   ```

#### Using Neon

1. Create production project
2. Copy connection string
3. Run migrations (same as above)

### Post-Deployment

1. Test all API endpoints
2. Register test user
3. Submit test ranking
4. Verify ELO calculations

---

## Database Migrations

### Development

When you change the Prisma schema:

```bash
# Push changes to database
npm run db:push

# Or create migration
npm run prisma:migrate
```

### Production

For production databases, use migrations:

```bash
# Create migration
npx prisma migrate dev --name your_migration_name

# Apply to production
npx prisma migrate deploy
```

---

## Troubleshooting

### Database Connection Errors

**Error**: `Can't reach database server`

**Solution**:
- Check DATABASE_URL is correct
- Verify database is running
- Check firewall settings
- For Supabase: Use connection pooling URL

### Prisma Client Errors

**Error**: `@prisma/client did not initialize yet`

**Solution**:
```bash
npm run prisma:generate
```

### NextAuth Errors

**Error**: `NEXTAUTH_URL or NEXTAUTH_SECRET missing`

**Solution**:
- Verify `.env` file exists
- Check environment variables are set
- Restart dev server

### Build Errors

**Error**: Type errors during build

**Solution**:
- Run `npm run prisma:generate`
- Check TypeScript strict mode compatibility
- Verify all imports are correct

### Seed Script Errors

**Error**: `Foreign key constraint failed`

**Solution**:
- Clear database: `npx prisma db push --force-reset`
- Run seed again: `npm run db:seed`

---

## Development Workflow

### Adding New Features

1. Create feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make changes

3. Test locally

4. Commit and push:
   ```bash
   git add .
   git commit -m "Add: your feature description"
   git push origin feature/your-feature-name
   ```

5. Create pull request

6. Merge to main

### Database Schema Changes

1. Edit `prisma/schema.prisma`
2. Push changes: `npm run db:push`
3. Update seed script if needed
4. Test thoroughly
5. Commit schema changes

### Adding New API Routes

1. Create route file in `app/api/[route]/route.ts`
2. Implement GET/POST/PATCH/DELETE handlers
3. Add Zod validation
4. Add error handling
5. Update API documentation
6. Test endpoints

---

## Maintenance

### Regular Tasks

- **Update dependencies**: `npm update`
- **Security audits**: `npm audit`
- **Backup database**: Regular automated backups
- **Monitor errors**: Use Vercel analytics or Sentry
- **Update F1 data**: Add new races/drivers as needed

### Updating F1 Data

To add new races:

1. Edit `lib/data/races.json`
2. Run seed script: `npm run db:seed`

To update driver standings:

1. Edit `lib/data/drivers.json`
2. Run seed script (or update manually in Prisma Studio)

---

## Additional Tools

### Recommended VS Code Extensions

- Prisma
- ESLint
- Tailwind CSS IntelliSense
- GitLens
- Thunder Client (API testing)

### Useful Commands

```bash
# View logs in production
vercel logs

# Open Prisma Studio
npm run prisma:studio

# Format code
npx prettier --write .

# Type check
npx tsc --noEmit

# Build for production locally
npm run build
```

---

## Next Steps

After setup:

1. ✅ Test all API endpoints
2. ✅ Create frontend components (not included in MVP)
3. ✅ Implement user dashboard
4. ✅ Add real-time race updates
5. ✅ Implement friend system
6. ✅ Add notifications

---

## Support

- **Documentation**: See `README.md` and `API_DOCUMENTATION.md`
- **Issues**: [GitHub Issues](https://github.com/Jericoz-JC/FantasyFormula/issues)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Ready to race! 🏎️**

