// Sanctum odds and pricing.
// Riot lists a 0.5% base S-tier rate, an 80-pull Exalted guarantee, a
// 40-pull Mythic Variant guarantee, and a price of 400 RP per Ancient Spark.
// Riot can change these at any time; update the constants below if they do.
export const SANCTUM_REWARD_RATE = 0.005;
export const HARD_PITY = 80;
export const RP_PER_PULL = 400;

// Expected additional pulls given `done` pulls already made without the
// featured reward. Pulls are independent, but the pity counter at
// hardPity - done makes deeper counters cheaper in expectation.
export function expectedRemainingPulls(
    done: number,
    hardPity = HARD_PITY,
): number {
    const remaining = hardPity - Math.min(Math.max(done, 0), hardPity);
    if (remaining <= 0) return 0;

    return (
        (1 - Math.pow(1 - SANCTUM_REWARD_RATE, remaining)) / SANCTUM_REWARD_RATE
    );
}

export function costForPulls(pulls: number, hardPity = HARD_PITY): number {
    return Math.ceil(Math.min(Math.max(pulls, 0), hardPity)) * RP_PER_PULL;
}

export function expectedCostForPulls(
    pulls: number,
    hardPity = HARD_PITY,
): number {
    const boundedPulls = Math.min(Math.max(pulls, 0), hardPity);
    return Math.round(boundedPulls * RP_PER_PULL);
}
