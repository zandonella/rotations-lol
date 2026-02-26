type Umami = {
    track?: (event: string, data?: Record<string, any>) => void;
};

declare global {
    interface Window {
        umami?: Umami;
    }
}

export function track(event: string, data?: Record<string, any>) {
    window.umami?.track?.(event, data);
}
