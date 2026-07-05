import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthContextProvider } from './providers/AuthContext.tsx';
import { AuthModalProvider } from './providers/AuthModalContext.tsx';
import { WishlistProvider } from './providers/WishlistContext.tsx';
import { TooltipProvider } from '@/components/ui/tooltip';
import Home from './routes/home.tsx';
import SkinSales from './routes/skinSales.tsx';
import MythicShop from './routes/mythicShop.tsx';
import Catalog from './routes/catalog.tsx';
import Wishlist from './routes/wishlist.tsx';
import About from './routes/about.tsx';
import NavLayout from './layouts/NavLayout.tsx';
import ProtectedRoute from './layouts/ProtectedRoute.tsx';
import NotFound from './routes/NotFound.tsx';
import Settings from './routes/settings.tsx';
import Privacy from './routes/privacy.tsx';
import Terms from './routes/terms.tsx';
import YourShop from './routes/YourShop.tsx';
import SanctumCalculator from './routes/SanctumCalculator.tsx';
import Leaderboard from './routes/Leaderboard.tsx';
import Game from './routes/Game.tsx';
import ScrollToTop from './lib/ScrollToTop.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <TooltipProvider>
                <AuthContextProvider>
                    <AuthModalProvider>
                        <WishlistProvider>
                            <ScrollToTop />
                            <Routes>
                                <Route element={<NavLayout />}>
                                    <Route path="/" element={<Home />} />
                                    <Route
                                        path="/sales"
                                        element={<SkinSales />}
                                    />
                                    <Route
                                        path="/mythic"
                                        element={<MythicShop />}
                                    />
                                    <Route
                                        path="/catalog"
                                        element={<Catalog />}
                                    />
                                    <Route
                                        path="/wishlist"
                                        element={<Wishlist />}
                                    />
                                    <Route
                                        path="/leaderboard"
                                        element={<Leaderboard />}
                                    />
                                    <Route path="/game" element={<Game />} />
                                    <Route
                                        path="/your-shop"
                                        element={<YourShop />}
                                    />
                                    <Route
                                        path="/sanctum-calculator"
                                        element={<SanctumCalculator />}
                                    />
                                    <Route path="/about" element={<About />} />
                                    <Route
                                        path="/privacy"
                                        element={<Privacy />}
                                    />
                                    <Route path="/terms" element={<Terms />} />
                                    <Route element={<ProtectedRoute />}>
                                        <Route
                                            path="/settings"
                                            element={<Settings />}
                                        />
                                    </Route>
                                    <Route path="*" element={<NotFound />} />
                                </Route>
                            </Routes>
                        </WishlistProvider>
                    </AuthModalProvider>
                </AuthContextProvider>
            </TooltipProvider>
        </BrowserRouter>
    </StrictMode>,
);
