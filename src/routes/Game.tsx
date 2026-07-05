import { useEffect, useMemo, useState } from 'react';
import supabase from '../lib/supabase.ts';
import { toast } from 'sonner';
import { IoCheckmark, IoClose, IoShareOutline } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import PageTitle from '@/components/PageTitle.tsx';
import FAQAccordion from '@/components/FAQAccordion.tsx';
import GuessAutocomplete from '@/components/GuessAutocomplete';
import ItemCard from '@/components/itemCard';
import { useWishlist } from '@/providers/WishlistContext.tsx';
import { track } from '@/lib/umami.ts';
import { cn } from '@/lib/utils';
import {
    MAX_GUESSES,
    REVEAL_WIDTHS,
    type GameSkin,
    type GameState,
    getDayKey,
    getPuzzleNumber,
    pickDailySkin,
    splashUrl,
    pixelatedUrl,
    loadGameState,
    saveGameState,
    isPreviousDay,
    buildShareText,
} from '@/lib/dailyGame';

const gameFAQs = [
    {
        title: 'How does Guess the Skin work?',
        content:
            'Every day at midnight UTC a new League of Legends skin is picked. You get six guesses to identify it from a pixelated splash art - the image gets clearer with every wrong guess, and hints tell you when you match the right champion or skinline.',
    },
    {
        title: 'Is it the same skin for everyone?',
        content:
            'Yes. Everyone in the world gets the same skin each day, so you can compare results with friends using the share button.',
    },
    {
        title: 'Do I need an account to play?',
        content:
            'No. Streaks and stats are stored in your browser. An account is only needed if you want to wishlist skins and get emailed when they go on sale.',
    },
];

export default function Game() {
    const { isWishlisted, toggleWishlist } = useWishlist();
    const [skins, setSkins] = useState<GameSkin[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [splashFailed, setSplashFailed] = useState(false);

    const dayKey = getDayKey();
    const puzzleNumber = getPuzzleNumber(dayKey);
    const [state, setState] = useState<GameState>(() =>
        loadGameState(dayKey),
    );

    useEffect(() => {
        async function fetchSkins() {
            setLoading(true);
            const { data, error } = await supabase
                .from('CatalogItem')
                .select(
                    'ItemID, RiotItemID, Name, ImageURL, ItemType, Champion(Name), Skinline(Name)',
                )
                .eq('ItemType', 1);
            if (error || !data) {
                setErrorMsg('Failed to load the daily puzzle.');
                setSkins([]);
            } else {
                setSkins(data as unknown as GameSkin[]);
            }
            setLoading(false);
        }
        fetchSkins();
    }, []);

    const answer = useMemo(
        () => pickDailySkin(skins, dayKey),
        [skins, dayKey],
    );

    const guessedSkins = useMemo(
        () =>
            state.guesses
                .map((name) => skins.find((skin) => skin.Name === name))
                .filter((skin): skin is GameSkin => !!skin),
        [state.guesses, skins],
    );

    const gameOver = state.solved || state.guesses.length >= MAX_GUESSES;

    function updateState(next: GameState) {
        setState(next);
        saveGameState(next);
    }

    function handleGuess(skin: GameSkin) {
        if (!answer || gameOver || state.guesses.includes(skin.Name)) return;

        const guesses = [...state.guesses, skin.Name];
        const solved = skin.Name === answer.Name;
        const ended = solved || guesses.length >= MAX_GUESSES;

        let next: GameState = { ...state, guesses, solved };

        if (ended) {
            next.totalPlayed = state.totalPlayed + 1;
            if (solved) {
                const streak =
                    state.lastWonDay && isPreviousDay(state.lastWonDay, dayKey)
                        ? state.streak + 1
                        : 1;
                const distribution = [...state.distribution];
                distribution[guesses.length - 1] += 1;
                next = {
                    ...next,
                    totalWon: state.totalWon + 1,
                    lastWonDay: dayKey,
                    streak,
                    maxStreak: Math.max(state.maxStreak, streak),
                    distribution,
                };
                track('game_solved', { guesses: guesses.length });
            } else {
                next.streak = 0;
                track('game_failed');
            }
        }

        updateState(next);
    }

    async function handleShare() {
        const text = buildShareText(
            puzzleNumber,
            state.guesses.length,
            state.solved,
        );
        track('game_share');
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Result copied to clipboard!');
        } catch {
            toast.error('Could not copy - your browser blocked it.');
        }
    }

    const revealWidth =
        REVEAL_WIDTHS[Math.min(state.guesses.length, REVEAL_WIDTHS.length - 1)];

    let board: React.ReactNode;

    if (loading) {
        board = (
            <div className="bg-muted aspect-square w-full max-w-md animate-pulse rounded-lg" />
        );
    } else if (errorMsg || !answer) {
        board = (
            <p className="text-foreground bg-destructive/30 border-destructive rounded border-2 p-2 text-sm">
                {errorMsg ?? 'No puzzle available today.'}
            </p>
        );
    } else {
        board = (
            <div className="flex w-full max-w-md flex-col items-center gap-4">
                <div className="border-border w-full overflow-hidden rounded-lg border-2">
                    {gameOver ? (
                        <img
                            src={
                                splashFailed
                                    ? answer.ImageURL
                                    : splashUrl(answer.ImageURL)
                            }
                            onError={() => setSplashFailed(true)}
                            alt={answer.Name}
                            className="w-full object-cover"
                        />
                    ) : (
                        <img
                            src={pixelatedUrl(answer.ImageURL, revealWidth)}
                            alt="Pixelated mystery skin"
                            className="aspect-square w-full object-cover [image-rendering:pixelated]"
                        />
                    )}
                </div>

                <p className="text-muted-foreground text-sm">
                    {gameOver
                        ? state.solved
                            ? `Solved in ${state.guesses.length}/${MAX_GUESSES}!`
                            : `Out of guesses - it was ${answer.Name}.`
                        : `Guess ${state.guesses.length + 1} of ${MAX_GUESSES} - the image sharpens with every miss.`}
                </p>

                {!gameOver && (
                    <GuessAutocomplete
                        skins={skins}
                        guessedNames={state.guesses}
                        disabled={gameOver}
                        onGuess={handleGuess}
                    />
                )}

                {guessedSkins.length > 0 && (
                    <div className="flex w-full flex-col gap-2">
                        {[...guessedSkins].reverse().map((skin) => (
                            <GuessRow
                                key={skin.ItemID}
                                guess={skin}
                                answer={answer}
                            />
                        ))}
                    </div>
                )}

                {gameOver && (
                    <GameResult
                        answer={answer}
                        state={state}
                        onShare={handleShare}
                        wishlisted={isWishlisted(answer.ItemID)}
                        onToggleWishlist={() =>
                            toggleWishlist(answer.ItemID, answer.Name, true)
                        }
                    />
                )}
            </div>
        );
    }

    return (
        <>
            <title>
                Guess the LoL Skin - Free Daily League Skin Puzzle |
                Rotations.lol
            </title>

            <meta
                name="description"
                content="A free daily League of Legends puzzle: guess the skin from its pixelated splash art in six tries. New skin every day - keep your streak alive and share your score."
            />

            <link rel="canonical" href="https://rotations.lol/game" />

            <meta
                property="og:title"
                content="Guess the LoL Skin - Free Daily League Skin Puzzle"
            />
            <meta
                property="og:description"
                content="Guess the League of Legends skin from its pixelated splash art. New puzzle every day."
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://rotations.lol/game" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta
                name="twitter:title"
                content="Guess the LoL Skin - Free Daily League Skin Puzzle"
            />
            <meta
                name="twitter:description"
                content="Guess the League of Legends skin from its pixelated splash art. New puzzle every day."
            />

            <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-2 py-4">
                <PageTitle
                    title={`Guess the Skin #${puzzleNumber}`}
                    description="One League of Legends skin per day, six guesses
                    to name it from the pixelated splash art. Everyone gets the
                    same skin - share your score and keep your streak going."
                />
                {board}

                <div className="mt-2 w-full max-w-3xl rounded-lg">
                    <FAQAccordion FAQs={gameFAQs} />
                </div>
            </div>
        </>
    );
}

function GuessRow({ guess, answer }: { guess: GameSkin; answer: GameSkin }) {
    const correct = guess.Name === answer.Name;
    const championMatch =
        !!guess.Champion?.Name &&
        guess.Champion.Name === answer.Champion?.Name;
    const skinlineMatch =
        !!guess.Skinline?.Name &&
        guess.Skinline.Name === answer.Skinline?.Name;

    return (
        <div
            className={cn(
                'border-border bg-card flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2',
                correct && 'border-primary',
            )}
        >
            {correct ? (
                <IoCheckmark className="text-primary shrink-0" size={20} />
            ) : (
                <IoClose
                    className="text-destructive shrink-0"
                    size={20}
                />
            )}
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {guess.Name}
            </span>
            {!correct && (
                <span className="flex gap-1">
                    <HintChip
                        label="Champion"
                        match={championMatch}
                    />
                    <HintChip label="Skinline" match={skinlineMatch} />
                </span>
            )}
        </div>
    );
}

function HintChip({ label, match }: { label: string; match: boolean }) {
    return (
        <span
            className={cn(
                'rounded-full px-2 py-0.5 text-xs font-semibold',
                match
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground',
            )}
        >
            {label} {match ? '✓' : '✗'}
        </span>
    );
}

function GameResult({
    answer,
    state,
    onShare,
    wishlisted,
    onToggleWishlist,
}: {
    answer: GameSkin;
    state: GameState;
    onShare: () => void;
    wishlisted: boolean;
    onToggleWishlist: () => void;
}) {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 30_000);
        return () => clearInterval(interval);
    }, []);

    const nextPuzzle = new Date(now);
    nextPuzzle.setUTCHours(24, 0, 0, 0);
    const msLeft = nextPuzzle.getTime() - now.getTime();
    const hoursLeft = Math.floor(msLeft / (1000 * 60 * 60));
    const minutesLeft = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));

    return (
        <div className="flex w-full flex-col items-center gap-4">
            <div className="grid w-full grid-cols-3 gap-3">
                <StatBox label="Streak" value={state.streak} />
                <StatBox label="Max streak" value={state.maxStreak} />
                <StatBox
                    label="Win rate"
                    value={
                        state.totalPlayed > 0
                            ? `${Math.round((state.totalWon / state.totalPlayed) * 100)}%`
                            : '-'
                    }
                />
            </div>

            <Button onClick={onShare} className="w-full max-w-xs">
                <IoShareOutline /> Copy result to share
            </Button>

            <p className="text-muted-foreground text-sm">
                Next skin in {hoursLeft}h {minutesLeft}m
            </p>

            <div className="border-border w-full rounded-lg border p-4">
                <p className="mb-3 text-sm font-semibold">
                    Like this skin? Wishlist it and get an email when it goes
                    on sale.
                </p>
                <div className="flex justify-center">
                    <ItemCard
                        className="max-w-[250px]"
                        name={answer.Name}
                        itemType={answer.ItemType}
                        imageUrl={answer.ImageURL}
                        skinline={answer.Skinline?.Name}
                        wishlisted={wishlisted}
                        onToggleWishlist={onToggleWishlist}
                    />
                </div>
            </div>
        </div>
    );
}

function StatBox({ label, value }: { label: string; value: number | string }) {
    return (
        <div className="border-border bg-card rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-muted-foreground text-xs">{label}</p>
        </div>
    );
}
