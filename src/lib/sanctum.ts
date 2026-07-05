// Sanctum (Exalted skin gacha) odds and pricing.
// Source: Riot-published Sanctum drop rates as of mid-2026 - 0.5% Exalted
// chance per pull with a guarantee at 80 pulls, 1 Ancient Spark ~= 400 RP.
// Riot can change these at any time; update the constants below if they do.
export const EXALTED_RATE = 0.005;
export const HARD_PITY = 80;
export const RP_PER_PULL = 400;

export const COST_TO_PITY_RP = HARD_PITY * RP_PER_PULL;

// Chance of having pulled the Exalted skin within the first n pulls.
export function probWithinN(n: number): number {
    if (n <= 0) return 0;
    if (n >= HARD_PITY) return 1;
    return 1 - Math.pow(1 - EXALTED_RATE, n);
}

// P(first success happens exactly on pull k), including the pity mass at 80.
export function pullDistribution(): number[] {
    const pmf: number[] = [];
    for (let k = 1; k < HARD_PITY; k++) {
        pmf.push(Math.pow(1 - EXALTED_RATE, k - 1) * EXALTED_RATE);
    }
    pmf.push(Math.pow(1 - EXALTED_RATE, HARD_PITY - 1));
    return pmf;
}

// Expected number of pulls to hit the Exalted skin, starting fresh.
export function expectedPulls(): number {
    return pullDistribution().reduce(
        (sum, p, index) => sum + p * (index + 1),
        0,
    );
}

// Expected additional pulls given `done` pulls already made without success.
// Pulls are independent, but the pity counter at 80 - done makes deeper
// counters cheaper in expectation.
export function expectedRemainingPulls(done: number): number {
    const remaining = HARD_PITY - Math.min(Math.max(done, 0), HARD_PITY);
    if (remaining <= 0) return 0;

    let expected = 0;
    for (let j = 1; j < remaining; j++) {
        expected += j * Math.pow(1 - EXALTED_RATE, j - 1) * EXALTED_RATE;
    }
    expected += remaining * Math.pow(1 - EXALTED_RATE, remaining - 1);
    return expected;
}

export function costForPulls(pulls: number): number {
    return Math.ceil(pulls) * RP_PER_PULL;
}
