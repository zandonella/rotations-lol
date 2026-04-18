import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

type FAQ = {
    title: string;
    content: string;
};

export default function FAQAccordion({ FAQs }: { FAQs: FAQ[] }) {
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
