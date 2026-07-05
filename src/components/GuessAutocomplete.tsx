import { useMemo, useState } from 'react';
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import type { GameSkin } from '@/lib/dailyGame';

interface GuessAutocompleteProps {
    skins: GameSkin[];
    guessedNames: string[];
    disabled: boolean;
    onGuess: (skin: GameSkin) => void;
}

export default function GuessAutocomplete({
    skins,
    guessedNames,
    disabled,
    onGuess,
}: GuessAutocompleteProps) {
    const [search, setSearch] = useState('');

    const matches = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (query.length < 2) return [];
        return skins
            .filter(
                (skin) =>
                    skin.Name.toLowerCase().includes(query) ||
                    skin.Champion?.Name.toLowerCase().includes(query),
            )
            .slice(0, 15);
    }, [skins, search]);

    return (
        <Command
            shouldFilter={false}
            className="border-border bg-popover w-full max-w-md rounded-lg border"
        >
            <CommandInput
                placeholder="Type a skin or champion name..."
                value={search}
                onValueChange={setSearch}
                disabled={disabled}
            />
            {search.trim().length >= 2 && (
                <CommandList>
                    <CommandEmpty>No matching skins.</CommandEmpty>
                    {matches.map((skin) => {
                        const alreadyGuessed = guessedNames.includes(
                            skin.Name,
                        );
                        return (
                            <CommandItem
                                key={skin.ItemID}
                                value={skin.Name}
                                disabled={alreadyGuessed}
                                onSelect={() => {
                                    setSearch('');
                                    onGuess(skin);
                                }}
                                className="cursor-pointer"
                            >
                                <img
                                    src={skin.ImageURL + '&w=32'}
                                    alt=""
                                    className="h-8 w-8 rounded object-cover"
                                    loading="lazy"
                                />
                                <span>{skin.Name}</span>
                                {alreadyGuessed && (
                                    <span className="text-muted-foreground ml-auto text-xs">
                                        guessed
                                    </span>
                                )}
                            </CommandItem>
                        );
                    })}
                </CommandList>
            )}
        </Command>
    );
}
