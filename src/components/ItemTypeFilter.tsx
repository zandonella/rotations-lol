import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue,
} from '@/components/ui/multi-select';
import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase.ts';
import type { ItemTypeRecord } from '@/lib/types.ts';

interface ItemTypeFilterProps {
    setItemTypes: (types: number[]) => void;
    itemTypes: number[];
}

export default function ItemTypeFilter({
    setItemTypes,
    itemTypes,
}: ItemTypeFilterProps) {
    const [types, setTypes] = useState<ItemTypeRecord[]>([]);

    useEffect(() => {
        async function fetchTypes() {
            const { data, error } = await supabase.from('ItemType').select('*');

            if (error) {
                console.error('Failed to fetch item types', error);
                return;
            }

            setTypes(data ?? []);
        }
        fetchTypes();
    }, []);

    return (
        <MultiSelect
            values={itemTypes.map(String)}
            onValuesChange={(values) => setItemTypes(values.map(Number))}
        >
            <MultiSelectTrigger className="min-w-[200px] flex-1 shrink">
                <MultiSelectValue
                    placeholder="Select item types..."
                    overflowBehavior="cutoff"
                />
            </MultiSelectTrigger>
            <MultiSelectContent>
                <MultiSelectGroup>
                    {types.map((type) => (
                        <MultiSelectItem
                            key={type.id}
                            value={type.id.toString()}
                            className="cursor-pointer"
                        >
                            {type.Type}
                        </MultiSelectItem>
                    ))}
                </MultiSelectGroup>
            </MultiSelectContent>
        </MultiSelect>
    );
}
