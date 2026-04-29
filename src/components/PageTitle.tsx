interface PageTitleProps {
    title: string;
    description?: string;
}

export default function PageTitle({ title, description }: PageTitleProps) {
    return (
        <section className="border-border w-full border-b px-2 pb-4">
            <h1 className="mt-2 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
                {title}
            </h1>

            <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-7">
                {description}
            </p>
        </section>
    );
}
