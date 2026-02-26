import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const FAQs = [
    {
        title: 'Does the catalog include everything in League?',
        content:
            'The catalog is intended to include every skin, chroma, emote, icon, ward, and other cosmetic item in League of Legends, even if it cannot currently appear in a Sale Rotation or the Mythic Shop.',
    },
    {
        title: 'Can every item appear in a Sale Rotation or the Mythic Shop?',
        content:
            'No. Both the Sale Rotation and the Mythic Shop use limited item pools controlled by Riot. Some items may rotate in occasionally, some rarely, and some may never appear in either system.',
    },
    {
        title: 'Do I need an account to use Rotations.lol?',
        content:
            'No account is required to browse the Sale Rotation or the Mythic Shop. An account is only required if you want to create a wishlist and receive notification emails.',
    },
    {
        title: 'What happens if I wishlist something that never rotates?',
        content:
            "Nothing — it will simply remain on your wishlist. If the item ever appears in a tracked Sale Rotation or the Mythic Shop, you'll receive a notification.",
    },
    {
        title: 'Will my wishlist update automatically after I purchase an item?',
        content:
            'No. Rotations.lol is completely independent from Riot and does not have access to your account. Purchasing an item in the game will not modify your wishlist and you can remove items manually at any time.',
    },
];

export default function FAQAccordion() {
    return (
        <Accordion
            type="multiple"
            className="border-border bg-popover w-full rounded-lg border"
        >
            {FAQs.map((faq) => (
                <FAQAccordionItem
                    key={faq.title}
                    title={faq.title}
                    content={faq.content}
                />
            ))}
        </Accordion>
    );
}

function FAQAccordionItem({
    title,
    content,
}: {
    title: string;
    content: string;
}) {
    return (
        <AccordionItem
            value={title}
            className="border-border border-b px-4 last:border-b-0"
        >
            <AccordionTrigger className="cursor-pointer">
                {title}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
                {content}
            </AccordionContent>
        </AccordionItem>
    );
}
