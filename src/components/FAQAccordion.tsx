import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const FAQs = [
    {
        title: 'Does the catalog include everything?',
        content:
            "That's the goal — the catalog is intended to include every League item we track, even if it can't appear in rotations.",
    },
    {
        title: "Why can't some items appear in rotations?",
        content:
            'Rotating shops use limited item pools, and some items may never be offered through those rotations.',
    },
    {
        title: 'What happens if I wishlist something that never rotates?',
        content:
            "Nothing bad — it just may never trigger an alert. If it ever appears in a supported rotation, you'll be notified.",
    },
];

export default function FAQAccordion() {
    return (
        <Accordion type="single" collapsible className="w-full">
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
        <AccordionItem value={title}>
            <AccordionTrigger className="cursor-pointer">
                {title}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
                {content}
            </AccordionContent>
        </AccordionItem>
    );
}
