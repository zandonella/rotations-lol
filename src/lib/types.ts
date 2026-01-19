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
    skinlineID?: number;
    itemTypeIDs: number[];
    search: string;
};

export type CatalogTypes = 'skins' | 'chromas' | 'icons' | 'emotes';

// database types
export type CatalogItemRecord = {
    ItemID: number;
    ItemType: string;
    RiotItemID: string;
    Name: string;
    Skinline: string | null;
    ImageURL: string;
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
