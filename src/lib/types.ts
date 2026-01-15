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

export type CatalogItemRecord = {
    ItemID: number;
    ItemType: string;
    RiotItemID: string;
    Name: string;
    Skinline: string | null;
    ImageURL: string;
};

export type CatalogFilters = {
    champions: string[]; // e.g. ["Ahri", "Yasuo"]
    types: {
        skins: boolean; // true => include, false => exclude
        chromas: boolean;
        icons: boolean;
        emotes: boolean;
    };
    skinline?: string; // optional exact match
    search?: string; // optional text search
};

export type CatalogTypes = 'skins' | 'chromas' | 'icons' | 'emotes';
