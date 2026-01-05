import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
    index('routes/home.tsx'),
    route('skin-sales', 'routes/skinSales.tsx'),
    route('mythic-shop', 'routes/mythicShop.tsx'),
    route('tft', 'routes/tft.tsx'),
    route('catalog', 'routes/catalog.tsx'),
    route('wishlist', 'routes/wishlist.tsx'),
    route('about', 'routes/about.tsx'),
] satisfies RouteConfig;
