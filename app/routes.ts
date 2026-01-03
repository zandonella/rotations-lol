import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
    index('routes/home.tsx'),
    route('test', 'routes/test.tsx'),
    route('test2', 'routes/test2.tsx'),
] satisfies RouteConfig;
