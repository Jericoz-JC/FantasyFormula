# Fantasy Formula - Quick Start Guide

Get your Fantasy Formula app running in 5 minutes! ⚡

## Prerequisites Installed?

- [ ] Node.js 18+
- [ ] PostgreSQL (or Supabase/Neon account)
- [ ] Git

## 🚀 5-Minute Setup

### 1. Clone & Install (1 min)

```bash
git clone https://github.com/Jericoz-JC/FantasyFormula.git
cd FantasyFormula
npm install
```

### 2. Setup Database (2 min)

**Option A: Supabase (Recommended)**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string from Settings → Database

**Option B: Local PostgreSQL**
```sql
CREATE DATABASE fantasy_formula;
```

### 3. Configure Environment (1 min)

Create `.env` file:

```env
DATABASE_URL="your-postgres-connection-string"
NEXTAUTH_SECRET="generate-with-command-below"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_SECRET_KEY="any-secure-random-string"
NODE_ENV="development"
```

**Generate NEXTAUTH_SECRET:**
```bash
# Mac/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32|%{Get-Random -Max 256}))
```

### 4. Setup & Seed Database (1 min)

```bash
npm run db:push
npm run db:seed
```

✅ Creates all tables and populates with F1 2025 data!

### 5. Start Server (<1 min)

```bash
npm run dev
```

🎉 **Done!** Open http://localhost:3000

---

## 🧪 Quick Test

### 1. Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "username": "racer",
    "password": "Test1234"
  }'
```

### 2. Get Upcoming Race

```bash
curl http://localhost:3000/api/races/upcoming
```

### 3. View Leaderboard

```bash
curl http://localhost:3000/api/leaderboard/overall
```

---

## 📊 View Database

```bash
npm run prisma:studio
```

Opens Prisma Studio at http://localhost:5555

---

## ❓ Troubleshooting

### Can't connect to database?
- Check `DATABASE_URL` is correct
- Verify database is running
- Try connection pooling URL (Supabase)

### Prisma errors?
```bash
npm run prisma:generate
```

### Port 3000 already in use?
```bash
# Use different port
PORT=3001 npm run dev
```

---

## 📚 Next Steps

- Read full docs: `README.md`
- API reference: `API_DOCUMENTATION.md`
- Setup guide: `SETUP_GUIDE.md`
- Drivers list: `DRIVERS_REFERENCE.md`

---

## 🚢 Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

**Time**: ~5 minutes

---

## 🎯 What You Have Now

✅ Complete backend API (10 endpoints)  
✅ ELO ranking system  
✅ 20 F1 2025 drivers  
✅ 7 remaining races  
✅ Authentication ready  
✅ Production-ready code  

**Ready to build the frontend!** 🏎️

---

## 💡 Pro Tips

- Use Prisma Studio to view/edit data
- Check API_DOCUMENTATION.md for all endpoints
- Test with cURL or Postman
- Use `npm run prisma:migrate` for schema changes

---

**Questions?** Check the full documentation or open an issue on GitHub.

