/**
 * ELO Calculation Engine for Fantasy Formula F1
 * 
 * Calculates ELO rating changes based on ranking accuracy vs actual race results.
 * Uses Spearman's rank correlation coefficient to measure accuracy.
 */

export interface DriverRanking {
  position: number;
  driverId: string;
}

export interface RankingAccuracy {
  correlation: number; // Spearman's correlation coefficient (-1 to 1)
  accuracy: number; // Percentage accuracy (0-100)
  exactPodium: boolean; // Top 3 all correct
  correctWinner: boolean; // Winner correct
  topFiveCorrect: number; // How many of top 5 correct
}

export interface EloCalculation {
  eloChange: number;
  accuracy: RankingAccuracy;
  breakdown: {
    basePoints: number;
    winnerBonus: number;
    podiumBonus: number;
    topFiveBonus: number;
  };
}

/**
 * Calculate Spearman's rank correlation coefficient
 * Measures the monotonic relationship between two rankings
 */
function calculateSpearmanCorrelation(
  userRankings: DriverRanking[],
  actualResults: DriverRanking[]
): number {
  const n = userRankings.length;
  
  // Create a map of actual positions
  const actualPositions = new Map(
    actualResults.map(r => [r.driverId, r.position])
  );
  
  // Calculate sum of squared differences
  let sumSquaredDiff = 0;
  
  for (const userRank of userRankings) {
    const actualPos = actualPositions.get(userRank.driverId);
    if (actualPos !== undefined) {
      const diff = userRank.position - actualPos;
      sumSquaredDiff += diff * diff;
    }
  }
  
  // Spearman's formula: 1 - (6 * Σd²) / (n * (n² - 1))
  const correlation = 1 - (6 * sumSquaredDiff) / (n * (n * n - 1));
  
  return correlation;
}

/**
 * Check if podium (top 3) is exactly correct
 */
function checkExactPodium(
  userRankings: DriverRanking[],
  actualResults: DriverRanking[]
): boolean {
  const userTop3 = userRankings
    .filter(r => r.position <= 3)
    .sort((a, b) => a.position - b.position);
  
  const actualTop3 = actualResults
    .filter(r => r.position <= 3)
    .sort((a, b) => a.position - b.position);
  
  return userTop3.every((rank, idx) => 
    rank.driverId === actualTop3[idx].driverId &&
    rank.position === actualTop3[idx].position
  );
}

/**
 * Check if winner is correctly predicted
 */
function checkCorrectWinner(
  userRankings: DriverRanking[],
  actualResults: DriverRanking[]
): boolean {
  const userWinner = userRankings.find(r => r.position === 1);
  const actualWinner = actualResults.find(r => r.position === 1);
  
  return userWinner?.driverId === actualWinner?.driverId;
}

/**
 * Count how many of top 5 are correctly predicted (position-agnostic)
 */
function countTopFiveCorrect(
  userRankings: DriverRanking[],
  actualResults: DriverRanking[]
): number {
  const userTop5 = new Set(
    userRankings
      .filter(r => r.position <= 5)
      .map(r => r.driverId)
  );
  
  const actualTop5 = actualResults
    .filter(r => r.position <= 5)
    .map(r => r.driverId);
  
  return actualTop5.filter(driverId => userTop5.has(driverId)).length;
}

/**
 * Calculate accuracy metrics
 */
function calculateAccuracy(
  userRankings: DriverRanking[],
  actualResults: DriverRanking[]
): RankingAccuracy {
  const correlation = calculateSpearmanCorrelation(userRankings, actualResults);
  
  // Convert correlation to percentage accuracy (0-100)
  // Correlation ranges from -1 to 1, we map it to 0-100
  const accuracy = ((correlation + 1) / 2) * 100;
  
  return {
    correlation,
    accuracy,
    exactPodium: checkExactPodium(userRankings, actualResults),
    correctWinner: checkCorrectWinner(userRankings, actualResults),
    topFiveCorrect: countTopFiveCorrect(userRankings, actualResults),
  };
}

/**
 * Get K-factor based on user's ranking count
 * New users: 32, Intermediate: 24, Veterans: 16
 */
export function getKFactor(rankingsCount: number): number {
  if (rankingsCount < 10) return 32; // New users
  if (rankingsCount < 50) return 24; // Intermediate
  return 16; // Veterans
}

/**
 * Calculate ELO change based on ranking accuracy
 */
export function calculateEloChange(
  userRankings: DriverRanking[],
  actualResults: DriverRanking[],
  currentElo: number,
  rankingsCount: number
): EloCalculation {
  const accuracy = calculateAccuracy(userRankings, actualResults);
  const kFactor = getKFactor(rankingsCount);
  
  // Base ELO points based on accuracy
  let basePoints = 0;
  
  if (accuracy.accuracy >= 99) {
    basePoints = 50; // Perfect or near-perfect
  } else if (accuracy.accuracy >= 80) {
    // High accuracy: 30-45 points
    basePoints = 30 + Math.floor((accuracy.accuracy - 80) / 19 * 15);
  } else if (accuracy.accuracy >= 60) {
    // Medium accuracy: 15-25 points
    basePoints = 15 + Math.floor((accuracy.accuracy - 60) / 20 * 10);
  } else if (accuracy.accuracy >= 40) {
    // Low accuracy: 5-10 points
    basePoints = 5 + Math.floor((accuracy.accuracy - 40) / 20 * 5);
  } else {
    // Poor accuracy: -5 to -20 points
    basePoints = -20 + Math.floor(accuracy.accuracy / 40 * 15);
  }
  
  // Bonus points
  let winnerBonus = 0;
  let podiumBonus = 0;
  let topFiveBonus = 0;
  
  if (accuracy.correctWinner) {
    winnerBonus = 15;
  }
  
  if (accuracy.exactPodium) {
    podiumBonus = 10;
  }
  
  if (accuracy.topFiveCorrect >= 4) {
    topFiveBonus = 5;
  }
  
  // Total ELO change (scaled by K-factor)
  const totalPoints = basePoints + winnerBonus + podiumBonus + topFiveBonus;
  const eloChange = Math.round(totalPoints * (kFactor / 32));
  
  return {
    eloChange,
    accuracy,
    breakdown: {
      basePoints,
      winnerBonus,
      podiumBonus,
      topFiveBonus,
    },
  };
}

/**
 * Calculate new ELO rating
 */
export function calculateNewElo(
  currentElo: number,
  eloChange: number
): number {
  // Minimum ELO is 100, maximum is 3000
  const newElo = Math.max(100, Math.min(3000, currentElo + eloChange));
  return Math.round(newElo);
}

