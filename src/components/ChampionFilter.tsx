import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue,
} from '@/components/ui/multi-select';
import supabase from '@/lib/supabase';
import type { ChampionRecord } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function ChampionFilter() {
    const [champs, setChamps] = useState<ChampionRecord[]>([]);
    useEffect(() => {
        async function fetchTypes() {
            const { data, error } = await supabase
                .from('Champion')
                .select('*')
                .order('Name', { ascending: true });

            if (error) {
                console.error('Failed to fetch item types', error);
                return;
            }

            setChamps(data ?? []);
        }
        fetchTypes();
    }, []);

    return (
        <MultiSelect>
            <MultiSelectTrigger className="max-w-[250px] shrink">
                <MultiSelectValue
                    placeholder="Select champions..."
                    className=""
                />
            </MultiSelectTrigger>
            <MultiSelectContent>
                <MultiSelectGroup>
                    {champs.map((champ) => (
                        <MultiSelectItem
                            key={champ.Slug}
                            value={champ.Slug}
                            badgeLabel={champ.Name}
                        >
                            {/* Dropdown content */}
                            <div className="flex items-center gap-2">
                                <img
                                    src={champ.ImageURL}
                                    alt={champ.Name}
                                    className="h-12 w-12 rounded object-cover"
                                />
                                <p className="text-">{champ.Name}</p>
                            </div>
                        </MultiSelectItem>
                    ))}
                </MultiSelectGroup>
            </MultiSelectContent>
        </MultiSelect>
    );
}
