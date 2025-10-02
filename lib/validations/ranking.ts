import { z } from "zod";

export const driverRankingSchema = z.object({
  position: z.number().int().min(1).max(20),
  driverId: z.string().min(1),
});

export const rankingSubmissionSchema = z.object({
  raceId: z.string().uuid(),
  rankings: z.object({
    drivers: z
      .array(driverRankingSchema)
      .length(20, "Must rank all 20 drivers")
      .refine(
        (drivers) => {
          // Check all positions 1-20 are present
          const positions = drivers.map((d) => d.position).sort((a, b) => a - b);
          return positions.every((pos, idx) => pos === idx + 1);
        },
        { message: "All positions from 1 to 20 must be present with no duplicates" }
      )
      .refine(
        (drivers) => {
          // Check no duplicate driver IDs
          const driverIds = drivers.map((d) => d.driverId);
          return driverIds.length === new Set(driverIds).size;
        },
        { message: "Each driver can only appear once in the ranking" }
      ),
  }),
});

export const raceResultSchema = z.object({
  raceId: z.string().uuid(),
  results: z.object({
    finalPositions: z.array(
      z.object({
        position: z.number().int().min(1),
        driverId: z.string(),
        points: z.number().int().min(0),
      })
    ),
    fastestLap: z.string().optional(),
    dnfs: z.array(z.string()).optional(),
    sprintResults: z
      .array(
        z.object({
          position: z.number().int().min(1),
          driverId: z.string(),
          points: z.number().int().min(0),
        })
      )
      .optional(),
  }),
});

export type DriverRanking = z.infer<typeof driverRankingSchema>;
export type RankingSubmission = z.infer<typeof rankingSubmissionSchema>;
export type RaceResult = z.infer<typeof raceResultSchema>;

