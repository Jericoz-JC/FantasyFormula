// Common types for Fantasy Formula app

export interface Driver {
  id: string;
  driverId: string;
  name: string;
  abbreviation: string;
  number: number;
  team: string;
  nationality: string;
  country: string;
  currentPoints: number;
  currentPosition: number;
  active: boolean;
  teamColors: {
    primary: string;
    secondary: string;
    accent?: string;
    name: string;
  };
  imageUrl?: string;
}

export interface Race {
  id: string;
  name: string;
  location: string;
  circuit: string;
  country: string;
  date: Date;
  season: number;
  round: number;
  status: "UPCOMING" | "IN_PROGRESS" | "COMPLETED";
  hasSprint: boolean;
  circuitLength?: number;
  laps?: number;
  lockTime: Date;
}

export interface DriverRanking {
  position: number;
  driverId: string;
}

export interface Ranking {
  id: string;
  userId: string;
  raceId: string;
  rankings: {
    drivers: DriverRanking[];
  };
  eloChange?: number;
  score?: number;
  pointsBreakdown?: unknown;
  submittedAt: Date;
  updatedAt: Date;
}

export interface RaceResult {
  id: string;
  raceId: string;
  results: {
    finalPositions: Array<{
      position: number;
      driverId: string;
      points: number;
    }>;
    fastestLap?: string;
    dnfs?: string[];
    sprintResults?: Array<{
      position: number;
      driverId: string;
      points: number;
    }>;
  };
  publishedAt: Date;
}

export interface User {
  id: string;
  email: string;
  username: string;
  eloRating: number;
  totalPoints: number;
  rankingsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  eloRating: number;
  totalPoints: number;
  rankingsCount: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message: string;
}

export interface PaginationParams {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

