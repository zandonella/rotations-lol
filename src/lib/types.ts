export type Theme = 'light' | 'dark';
export type ModalMode = 'sign-in' | 'sign-up' | 'forgot-password';
export type SignUpValues = {
    email: string;
    password: string;
    confirmPassword: string;
};
export type SignInValues = {
    email: string;
    password: string;
};

export type CatalogFilters = {
    championIDs: number[];
    skinlineIDs: number[];
    itemTypeIDs: number[];
    search: string;
};

export type CatalogTypes = 'skins' | 'chromas' | 'icons' | 'emotes';

// database types
export type CatalogItemRecord = {
    ItemID: string;
    ItemType: number;
    RiotItemID: number;
    Name: string;
    ImageURL: string;

    Champion?: {
        Name: string;
    } | null;

    Skinline?: {
        Name: string;
        UniverseID: number;
        Universe?: {
            Name: string;
        };
    } | null;
};

export type ChampionRecord = {
    id: number;
    Slug: string;
    Name: string;
    ImageURL: string;
};

export type SkinlineRecord = {
    id: number;
    Name: string;
};

export type ItemTypeRecord = {
    id: number;
    Type: string;
};

export type CatalogSaleRecord = {
    RiotItemID: number;
    SaleStartAt: string;
    SaleEndAt: string;
    ItemType: number;
    NormalPrice: number;
    SalePrice: number;
    PercentOff: number;
    Currency: string;
    IsActive: boolean;
    SaleID: string;
    Limited: boolean;
};

export type sectionType = 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'FEATURED';

export type MythicSaleRecord = {
    OfferID: string;
    SaleStartAt: string;

    PrimaryItemID: string;
    SaleEndAt: string;
    Price: number;
    Currency: string;
    IsActive: boolean;
    Section: sectionType;

    IsBundle: boolean;
    IncludedItems: string[];
    BundleType: string | null;
};

export type SanctumSaleRecord = {
    RiotItemID: number;
    ItemType: number;
    SaleID: string;
    SaleStartAt: string;
    SaleEndAt: string;
    Rarity: 'EXALTED' | 'MYTHIC_VARIANT';
    ChasePityThreshold: number;
    BannerImageURL: string | null;
    IsActive: boolean;
};

export type YourShopSaleRecord = {
    ShopName: string;
    SaleStartAt: string;
    SaleEndAt: string;
    HubEnabled: boolean;
    IsActive: boolean;
};

export type CatalogSaleWithItemRecord = CatalogSaleRecord & {
    CatalogItem: CatalogItemRecord;
};

export type MythicSaleWithItemRecord = MythicSaleRecord & {
    CatalogItem: CatalogItemRecord;
};

export type SanctumSaleWithItemRecord = SanctumSaleRecord & {
    CatalogItem: CatalogItemRecord;
};

export type TopWishlistedRecord = {
    ItemID: string;
    WishlistCount: number;
};

export type WishlistItemRecord = {
    UserID: string;
    ItemID: string;
};

export type WishlistWithItemRecord = WishlistItemRecord & {
    CatalogItem: CatalogItemRecord;
};
