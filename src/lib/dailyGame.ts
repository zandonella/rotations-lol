// Daily "Guess the Skin" puzzle logic. Everything here is pure so the
// selection can be reasoned about and spot-checked easily.
//
// The daily answer is computed client-side, so anyone reading the bundle or
// network traffic can derive it. That is an accepted tradeoff for a free
// daily game (same posture as LoLdle-style games); if it ever matters, the
// upgrade path is a server-side RPC that only returns a cropped image.

export const MAX_GUESSES = 6;
export const STORAGE_KEY = 'rotations.guessGame.v1';
// Puzzle #1 is the launch day. Used only for the share-text puzzle number.
export const GAME_EPOCH = '2026-07-06';

// wsrv.nl resize widths per guess index (index 0 = before any guess).
// Small widths upscaled with `image-rendering: pixelated` act as the blur.
export const REVEAL_WIDTHS = [12, 16, 24, 32, 48, 64];

export type GameSkin = {
    ItemID: number;
    RiotItemID: string;
    Name: string;
    ImageURL: string;
    ItemType: number;
    Champion?: { Name: string } | null;
    Skinline?: { Name: string } | null;
};

export function getDayKey(date: Date = new Date()): string {
    return date.toISOString().slice(0, 10);
}

export function getPuzzleNumber(dayKey: string): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    const epoch = new Date(`${GAME_EPOCH}T00:00:00Z`).getTime();
    const day = new Date(`${dayKey}T00:00:00Z`).getTime();
    return Math.floor((day - epoch) / msPerDay) + 1;
}

// 32-bit FNV-1a hash.
export function fnv1a(input: string): number {
    let hash = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }
    return hash >>> 0;
}

// The day's answer is the skin whose hash of `dayKey:RiotItemID` is
// smallest. Unlike `hash(day) % pool.length`, this stays stable when new
// skins are ingested mid-day: a new skin only changes the answer if it
// happens to produce a new minimum.
export function pickDailySkin<T extends { RiotItemID: string | number }>(
    skins: T[],
    dayKey: string,
): T | null {
    let best: T | null = null;
    let bestHash = Infinity;
    for (const skin of skins) {
        const hash = fnv1a(`${dayKey}:${skin.RiotItemID}`);
        if (hash < bestHash) {
            bestHash = hash;
            best = skin;
        }
    }
    return best;
}

// Stored ImageURLs are wsrv.nl proxy URLs of the splash *tile*. The
// uncentered full splash follows the CommunityDragon naming convention, so
// it can be derived by string replacement (callers should fall back to the
// tile via onError for old skins that lack uncentered art).
export function splashUrl(imageUrl: string): string {
    return imageUrl.replace('_tile_', '_uncentered_');
}

export function pixelatedUrl(imageUrl: string, width: number): string {
    return `${imageUrl}&w=${width}`;
}

export type GameState = {
    lastPlayedDay: string;
    guesses: string[]; // guessed skin names
    solved: boolean;
    lastWonDay: string | null;
    streak: number;
    maxStreak: number;
    totalPlayed: number;
    totalWon: number;
    // distribution[i] = wins that took i + 1 guesses
    distribution: number[];
};

export function emptyGameState(dayKey: string): GameState {
    return {
        lastPlayedDay: dayKey,
        guesses: [],
        solved: false,
        lastWonDay: null,
        streak: 0,
        maxStreak: 0,
        totalPlayed: 0,
        totalWon: 0,
        distribution: Array(MAX_GUESSES).fill(0),
    };
}

export function isPreviousDay(prevKey: string, dayKey: string): boolean {
    const msPerDay = 24 * 60 * 60 * 1000;
    const prev = new Date(`${prevKey}T00:00:00Z`).getTime();
    const current = new Date(`${dayKey}T00:00:00Z`).getTime();
    return current - prev === msPerDay;
}

export function loadGameState(dayKey: string): GameState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return emptyGameState(dayKey);
        const stored = JSON.parse(raw) as GameState;
        if (stored.lastPlayedDay === dayKey) return stored;
        // New day: keep lifetime stats, reset the board. A missed day (or an
        // unsolved previous day) breaks the streak.
        const keepStreak =
            stored.lastWonDay !== null &&
            (stored.lastWonDay === dayKey ||
                isPreviousDay(stored.lastWonDay, dayKey));
        return {
            ...stored,
            lastPlayedDay: dayKey,
            guesses: [],
            solved: false,
            streak: keepStreak ? stored.streak : 0,
        };
    } catch {
        return emptyGameState(dayKey);
    }
}

export function saveGameState(state: GameState): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // Storage full or unavailable - the game still works, just
        // without persistence.
    }
}

export function buildShareText(
    puzzleNumber: number,
    guesses: number,
    solved: boolean,
): string {
    const squares = Array.from({ length: MAX_GUESSES }, (_, i) => {
        if (solved && i === guesses - 1) return '🟩';
        if (i < guesses) return '🟥';
        return '⬛';
    }).join('');
    const score = solved ? `${guesses}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
    return `Guess the LoL Skin #${puzzleNumber} ${score}\n${squares}\nhttps://rotations.lol/game`;
}
