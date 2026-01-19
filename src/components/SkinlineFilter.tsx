import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue,
} from '@/components/ui/multi-select';
import supabase from '@/lib/supabase';
import type { SkinlineRecord } from '@/lib/types';
import { useEffect, useState } from 'react';

interface SkinlineFilterProps {
    selectedSkinlines: number[];
    setSelectedSkinlines: (skinlineIDs: number[]) => void;
}

export default function SkinlineFilter({
    selectedSkinlines,
    setSelectedSkinlines,
}: SkinlineFilterProps) {
    const [skinlines, setSkinlines] = useState<SkinlineRecord[]>([]);
    useEffect(() => {
        async function fetchSkinlines() {
            const { data, error } = await supabase
                .from('Skinline')
                .select('*')
                .order('Name', { ascending: true });

            console.log(data, error);

            if (error) {
                console.error('Failed to fetch skinlines', error);
                return;
            }

            setSkinlines(data ?? []);
        }
        fetchSkinlines();
    }, []);

    return (
        <MultiSelect
            values={selectedSkinlines.map(String)}
            onValuesChange={(values) =>
                setSelectedSkinlines(values.map(Number))
            }
        >
            <MultiSelectTrigger className="min-w-[200px] flex-1 shrink">
                <MultiSelectValue
                    placeholder="Select skinlines..."
                    overflowBehavior="cutoff"
                />
            </MultiSelectTrigger>
            <MultiSelectContent>
                <MultiSelectGroup>
                    {skinlines.map((skinline) => (
                        <MultiSelectItem
                            key={skinline.id}
                            value={skinline.id.toString()}
                            className="cursor-pointer"
                        >
                            {skinline.Name}
                        </MultiSelectItem>
                    ))}
                </MultiSelectGroup>
            </MultiSelectContent>
        </MultiSelect>
    );
}
