import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue,
} from '@/components/ui/multi-select';

const CHAMPIONS = [];

export default function ChampionFilter() {
    return (
        <MultiSelect>
            <MultiSelectTrigger className="">
                <MultiSelectValue placeholder="Select champions..." />
            </MultiSelectTrigger>
            <MultiSelectContent>
                <MultiSelectGroup>
                    {CHAMPIONS.map((champion) => (
                        <MultiSelectItem key={champion} value={champion}>
                            {champion}
                        </MultiSelectItem>
                    ))}
                </MultiSelectGroup>
            </MultiSelectContent>
        </MultiSelect>
    );
}
