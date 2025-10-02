import { PrismaClient } from "@prisma/client";
import driversData from "../lib/data/drivers.json";
import racesData from "../lib/data/races.json";
import { subHours } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  console.log("🧹 Clearing existing data...");
  await prisma.raceResult.deleteMany();
  await prisma.ranking.deleteMany();
  await prisma.race.deleteMany();
  await prisma.driver.deleteMany();
  
  // Seed drivers
  console.log("🏎️  Seeding drivers...");
  for (const driver of driversData.drivers) {
    await prisma.driver.create({
      data: {
        driverId: driver.driverId,
        name: driver.name,
        abbreviation: driver.abbreviation,
        number: driver.number,
        team: driver.team,
        nationality: driver.nationality,
        country: driver.country,
        currentPoints: driver.points,
        currentPosition: driver.position,
        active: true,
        teamColors: driver.teamColors,
      },
    });
  }
  console.log(`✅ Created ${driversData.drivers.length} drivers`);

  // Seed races (2025 season - remaining races)
  console.log("🏁 Seeding races...");
  for (const race of racesData.races) {
    const raceDate = new Date(race.date);
    // Lock time is 1 hour before race start
    const lockTime = subHours(raceDate, 1);

    await prisma.race.create({
      data: {
        name: race.name,
        location: race.location,
        circuit: race.circuit,
        country: race.country,
        date: raceDate,
        season: 2025,
        round: race.round,
        status: race.status as "UPCOMING" | "IN_PROGRESS" | "COMPLETED",
        hasSprint: race.hasSprint,
        circuitLength: race.circuitLength,
        laps: race.laps,
        lockTime,
      },
    });
  }
  console.log(`✅ Created ${racesData.races.length} races for 2025 season`);

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

