export type CohortAnalysis = {
  cohortDate: string;
  cohortSize: number;
  retention: Record<string, number>;
  revenue: Record<string, number>;
  averageLifetimeValue: number;
  churnRate: number;
};

export async function calculateCohortAnalysis(): Promise<CohortAnalysis[]> {
  // Mock 6 cohorts monthly
  const now = new Date();
  const cohorts: CohortAnalysis[] = [];
  for (let m = 0; m < 6; m++) {
    const date = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const cohortDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const size = 200 + (5 - m) * 50;
    const retention: Record<string, number> = { week0: 100 };
    const revenue: Record<string, number> = { week0: 0 };
    let cumulativeRevenue = 0;
    for (let w = 1; w <= 12; w++) {
      const val = Math.max(5, 100 - w * (8 + m)); // decreasing retention
      retention[`week${w}`] = val;
      cumulativeRevenue += Math.max(0, (size * (0.5 - w * 0.02)));
      revenue[`week${w}`] = Math.max(0, cumulativeRevenue);
    }
    const averageLifetimeValue = cumulativeRevenue / size;
    const churnRate = Math.max(0, 100 - retention["week4"]);
    cohorts.push({ cohortDate, cohortSize: size, retention, revenue, averageLifetimeValue, churnRate });
  }
  return cohorts.reverse();
}


