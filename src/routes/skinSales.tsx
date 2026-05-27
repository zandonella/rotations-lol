import { useCallback, useEffect, useMemo, useState } from 'react';
import supabase from '../lib/supabase.ts';
import type { CatalogSaleWithItemRecord } from '@/lib/types';
import ItemCard from '@/components/itemCard';
import {
    calculateTimeUntilEnd,
    getSalesPacificResetLabel,
} from '@/lib/utils.ts';
import { useWishlist } from '@/providers/WishlistContext.tsx';
import FAQAccordion from '@/components/FAQAccordion.tsx';
import PageTitle from '@/components/PageTitle.tsx';
import { Button } from '@/components/ui/button.tsx';

const PAGE_SIZE = 100;
const CATALOG_SALE_SELECT = '*, CatalogItem!inner(*, Skinline(*, Universe(*)))';

type SaleSectionId =
    | 'weekly'
    | 'limited'
    | 'chromas'
    | 'blueEssence'
    | 'otherItems';

type SaleSectionState = {
    sales: CatalogSaleWithItemRecord[];
    total: number;
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
};

type SaleSectionConfig = {
    id: SaleSectionId;
    title: string;
    subtitle?: string;
    sortSales?: (
        sales: CatalogSaleWithItemRecord[],
    ) => CatalogSaleWithItemRecord[];
};

const saleSectionIds: SaleSectionId[] = [
    'weekly',
    'limited',
    'chromas',
    'blueEssence',
    'otherItems',
];

const initialSectionState: SaleSectionState = {
    sales: [],
    total: 0,
    loading: true,
    loadingMore: false,
    error: null,
};

const initialSections = saleSectionIds.reduce(
    (sections, sectionId) => ({
        ...sections,
        [sectionId]: initialSectionState,
    }),
    {} as Record<SaleSectionId, SaleSectionState>,
);

const salesFAQs = [
    {
        title: 'What are the current League of Legends skin sales?',
        content:
            'This page shows the current League of Legends skin sales, including discounted skins and limited-time offers in the live LoL store rotation. It updates automatically so you can always see what is on sale right now.',
    },
    {
        title: 'How often do League of Legends skin sales update?',
        content:
            'League of Legends skin sales update on a regular weekly schedule. Rotations.lol tracks these updates automatically so you can follow the current sale rotation without checking the LoL client.',
    },
    {
        title: 'Does this page only show discounted skins?',
        content:
            'No. In addition to discounted skins, this page may include limited-time skins that are currently available in the League of Legends store but are not part of the permanent catalog.',
    },
    {
        title: 'What is the League of Legends skin sale rotation?',
        content:
            'The skin sale rotation is the set of skins that are currently discounted or featured in the League of Legends store. The rotation changes regularly as different skins go on sale.',
    },
    {
        title: 'Can I track when a skin goes on sale in LoL?',
        content:
            'Yes. You can wishlist skins and receive an email notification when they appear in a League of Legends skin sale. Rotations.lol tracks the sale rotation automatically so you do not have to check manually.',
    },
    {
        title: 'Do all skins go on sale in League of Legends?',
        content:
            'No. Not all skins are included in the League of Legends sale rotation. Riot selects specific skins for discounts, and some may appear rarely or never go on sale.',
    },
    {
        title: 'Does this include Mythic Shop skins?',
        content:
            'No. Mythic Shop skins are part of a separate rotation. You can view the current Mythic Shop in League of Legends on the Mythic page.',
    },
    {
        title: 'Do I need an account to track skin sales?',
        content:
            'No account is required to browse current League of Legends skin sales. An account is only needed if you want to create a wishlist and get notified when skins go on sale.',
    },
    {
        title: 'What skins are on sale in LoL right now?',
        content:
            'This page shows what skins are on sale in League of Legends right now, including current discounts and limited-time offers. It updates automatically with the latest LoL sale rotation.',
    },
];

export default function SkinSales() {
    const { isWishlisted, toggleWishlist } = useWishlist();
    const [sections, setSections] =
        useState<Record<SaleSectionId, SaleSectionState>>(initialSections);

    const fetchSalesPage = useCallback(
        async (sectionId: SaleSectionId, from: number) => {
            const to = from + PAGE_SIZE - 1;
            let query = supabase
                .from('CatalogSale')
                .select(CATALOG_SALE_SELECT, { count: 'exact' })
                .eq('IsActive', true);

            switch (sectionId) {
                case 'weekly':
                    query = query
                        .eq('Limited', false)
                        .neq('Currency', 'IP')
                        .eq('CatalogItem.ItemType', 1);
                    break;
                case 'limited':
                    query = query
                        .eq('Limited', true)
                        .neq('Currency', 'IP')
                        .eq('CatalogItem.ItemType', 1);
                    break;
                case 'chromas':
                    query = query
                        .neq('Currency', 'IP')
                        .eq('CatalogItem.ItemType', 2);
                    break;
                case 'blueEssence':
                    query = query.eq('Currency', 'IP');
                    break;
                case 'otherItems':
                    query = query
                        .neq('Currency', 'IP')
                        .gt('CatalogItem.ItemType', 2);
                    break;
            }

            if (sectionId === 'blueEssence') {
                query = query
                    .order('CatalogItem(ItemType)', { ascending: true })
                    .order('SalePrice', { ascending: false })
                    .order('CatalogItem(Name)', { ascending: true })
                    .order('SaleID', { ascending: true });
            } else {
                query = query
                    .order('SaleEndAt', { ascending: true })
                    .order('SaleID', { ascending: true });
            }

            const { data, error, count } = await query.range(from, to);

            if (error) throw error;

            return {
                data: (data || []) as CatalogSaleWithItemRecord[],
                total: count || 0,
            };
        },
        [],
    );

    const loadSectionPage = useCallback(
        async (sectionId: SaleSectionId, from: number) => {
            const append = from > 0;

            setSections((previous) => ({
                ...previous,
                [sectionId]: {
                    ...previous[sectionId],
                    loading: !append,
                    loadingMore: append,
                    error: null,
                },
            }));

            try {
                const { data, total } = await fetchSalesPage(sectionId, from);

                setSections((previous) => ({
                    ...previous,
                    [sectionId]: {
                        sales: append
                            ? [...previous[sectionId].sales, ...data]
                            : data,
                        total,
                        loading: false,
                        loadingMore: false,
                        error: null,
                    },
                }));
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'Failed to load this section.';

                setSections((previous) => ({
                    ...previous,
                    [sectionId]: {
                        ...previous[sectionId],
                        loading: false,
                        loadingMore: false,
                        error: message,
                    },
                }));
            }
        },
        [fetchSalesPage],
    );

    useEffect(() => {
        saleSectionIds.forEach((sectionId) => {
            loadSectionPage(sectionId, 0);
        });
    }, [loadSectionPage]);

    const sectionConfigs = useMemo<SaleSectionConfig[]>(
        () => [
            {
                id: 'weekly',
                title: 'Current Weekly Skin Sales',
                subtitle: `Resets every Monday at ${getSalesPacificResetLabel()}`,
                sortSales: sortSalesBySkinlineAndName,
            },
            {
                id: 'limited',
                title: 'Limited Skin Sales',
                sortSales: sortSalesBySkinlineAndName,
            },
            {
                id: 'chromas',
                title: 'Chroma Sales',
                sortSales: sortSalesByName,
            },
            {
                id: 'blueEssence',
                title: 'Blue Essence Sales',
                sortSales: sortBlueEssenceSales,
            },
            {
                id: 'otherItems',
                title: 'Other Items',
            },
        ],
        [],
    );

    function renderSection(config: SaleSectionConfig, state: SaleSectionState) {
        const sales = config.sortSales
            ? config.sortSales(state.sales)
            : state.sales;
        const remaining = Math.max(state.total - state.sales.length, 0);

        if (!state.loading && sales.length === 0 && !state.error) return null;

        return (
            <div
                className="flex w-full flex-col items-center gap-4"
                key={config.id}
            >
                <div className="mt-2 w-full text-center md:text-left">
                    <h2 className="text-3xl font-bold tracking-tight">
                        {config.title}
                    </h2>

                    {config.subtitle && (
                        <p className="text-muted-foreground mt-1 max-w-xl text-sm leading-6">
                            {config.subtitle}
                        </p>
                    )}
                </div>

                {state.loading ? (
                    <SalesSectionSkeleton />
                ) : (
                    <>
                        {sales.length > 0 && (
                            <div className="grid w-fit grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                                {sales.map((sale) => {
                                    const item = sale.CatalogItem;
                                    const showSalePrice =
                                        sale.SalePrice !== sale.NormalPrice;
                                    return (
                                        <ItemCard
                                            className="max-w-[250px]"
                                            key={sale.SaleID}
                                            name={item.Name}
                                            itemType={item.ItemType}
                                            imageUrl={item.ImageURL}
                                            wishlisted={isWishlisted(
                                                item.ItemID,
                                            )}
                                            onToggleWishlist={() =>
                                                toggleWishlist(
                                                    item.ItemID,
                                                    item.Name,
                                                    item.ItemType <= 6,
                                                )
                                            }
                                            sale={{
                                                SaleEndAt:
                                                    calculateTimeUntilEnd(
                                                        sale.SaleEndAt,
                                                    ),
                                                SalePrice: sale.SalePrice,
                                                NormalPrice: showSalePrice
                                                    ? sale.NormalPrice
                                                    : undefined,
                                                Currency: sale.Currency,
                                                PercentOff: sale.PercentOff,
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {state.error && (
                            <div className="border-destructive bg-destructive/10 text-foreground flex flex-col items-center gap-3 rounded-md border p-3 text-center text-sm">
                                <p>{state.error}</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        loadSectionPage(
                                            config.id,
                                            state.sales.length,
                                        )
                                    }
                                >
                                    Retry
                                </Button>
                            </div>
                        )}

                        {!state.error && remaining > 0 && (
                            <Button
                                variant="outline"
                                onClick={() =>
                                    loadSectionPage(
                                        config.id,
                                        state.sales.length,
                                    )
                                }
                                disabled={state.loadingMore}
                            >
                                {state.loadingMore
                                    ? 'Loading...'
                                    : `Load more, ${remaining.toLocaleString()} remaining`}
                            </Button>
                        )}
                    </>
                )}
            </div>
        );
    }

    const skinContent = (
        <>
            {sectionConfigs.map((config) =>
                renderSection(config, sections[config.id]),
            )}
        </>
    );

    return (
        <>
            <title>
                League of Legends Current Skin Sales and Limited-Time Skins |
                Rotations.lol
            </title>

            <meta
                name="description"
                content="View current League of Legends skin sales, discounted skins, and limited-time skins available today. Track the latest League of Legends skin rotation and wishlist skins you want to watch."
            />

            <link rel="canonical" href="https://rotations.lol/sales" />

            <meta
                property="og:title"
                content="League of Legends Current Skin Sales and Limited-Time Skins"
            />
            <meta
                property="og:description"
                content="Track current League of Legends skin sales, discounted skins, and limited-time skins."
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://rotations.lol/sales" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta
                name="twitter:title"
                content="League of Legends Current Skin Sales and Limited-Time Skins"
            />
            <meta
                name="twitter:description"
                content="Track current League of Legends skin sales, discounted skins, and limited-time skins."
            />

            <div className="mt-4 flex w-full max-w-7xl flex-col items-center gap-4">
                <PageTitle
                    title="Current League of Legends Skin Sales and Limited-Time Skins"
                    description="View current League of Legends skin sales, including discounted
                skins and limited-time skins available in the live rotation.
                This page updates automatically so you can track what is
                currently available and wishlist skins you want to watch."
                />
                {skinContent}
            </div>
            <div className="mx-auto mt-6 w-full max-w-3xl rounded-lg">
                <FAQAccordion FAQs={salesFAQs} />
            </div>
        </>
    );
}

function sortSalesBySkinlineAndName(sales: CatalogSaleWithItemRecord[]) {
    return [...sales].sort((a, b) => {
        const skinlineA = a.CatalogItem.Skinline?.Name || '';
        const skinlineB = b.CatalogItem.Skinline?.Name || '';
        const skinlineSort = skinlineA.localeCompare(skinlineB);

        if (skinlineSort !== 0) return skinlineSort;

        return a.CatalogItem.Name.localeCompare(b.CatalogItem.Name);
    });
}

function sortSalesByName(sales: CatalogSaleWithItemRecord[]) {
    return [...sales].sort((a, b) =>
        a.CatalogItem.Name.localeCompare(b.CatalogItem.Name),
    );
}

function sortBlueEssenceSales(sales: CatalogSaleWithItemRecord[]) {
    return [...sales].sort((a, b) => {
        const itemTypeSort = a.CatalogItem.ItemType - b.CatalogItem.ItemType;

        if (itemTypeSort !== 0) return itemTypeSort;

        const priceSort = b.SalePrice - a.SalePrice;

        if (priceSort !== 0) return priceSort;

        return a.CatalogItem.Name.localeCompare(b.CatalogItem.Name);
    });
}

function SalesSectionSkeleton() {
    return (
        <div className="grid w-fit grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 15 }).map((_, i) => (
                <div
                    key={i}
                    className="bg-muted h-[310px] w-[250px] animate-pulse rounded-lg"
                />
            ))}
        </div>
    );
}
