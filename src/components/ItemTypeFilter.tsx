import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue,
} from '@/components/ui/multi-select';

interface ItemTypeFilterProps {
    setItemTypes: (types: string[]) => void;
    itemTypes: string[];
}

const ITEM_TYPES = [
    { value: 'skins', label: 'Skins' },
    { value: 'chromas', label: 'Chromas' },
    { value: 'icons', label: 'Icons' },
    { value: 'emotes', label: 'Emotes' },
];

export default function ItemTypeFilter({
    setItemTypes,
    itemTypes,
}: ItemTypeFilterProps) {
    return (
        <MultiSelect values={itemTypes} onValuesChange={setItemTypes}>
            <MultiSelectTrigger className="w-full max-w-[250px] shrink cursor-pointer">
                <MultiSelectValue
                    placeholder="Select item types..."
                    overflowBehavior="cutoff"
                />
            </MultiSelectTrigger>
            <MultiSelectContent>
                <MultiSelectGroup>
                    {ITEM_TYPES.map((type) => (
                        <MultiSelectItem
                            key={type.value}
                            value={type.value}
                            className="cursor-pointer"
                        >
                            {type.label}
                        </MultiSelectItem>
                    ))}
                </MultiSelectGroup>
            </MultiSelectContent>
        </MultiSelect>
    );
}
