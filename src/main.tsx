import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthContextProvider } from './providers/AuthContext.tsx';
import { AuthModalProvider } from './providers/AuthModalContext.tsx';
import { WishlistProvider } from './providers/WishlistContext.tsx';
import Home from './routes/home.tsx';
import SkinSales from './routes/skinSales.tsx';
import MythicShop from './routes/mythicShop.tsx';
import Catalog from './routes/catalog.tsx';
import Wishlist from './routes/wishlist.tsx';
import About from './routes/about.tsx';
import NavLayout from './layouts/NavLayout.tsx';
import Profile from './routes/profile.tsx';
import ProtectedRoute from './layouts/ProtectedRoute.tsx';
import NotFound from './routes/NotFound.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthContextProvider>
                <AuthModalProvider>
                    <WishlistProvider>
                        <Routes>
                            <Route element={<NavLayout />}>
                                <Route path="/" element={<Home />} />
                                <Route path="/sales" element={<SkinSales />} />
                                <Route
                                    path="/mythic"
                                    element={<MythicShop />}
                                />
                                <Route path="/catalog" element={<Catalog />} />
                                <Route
                                    path="/wishlist"
                                    element={<Wishlist />}
                                />
                                <Route path="/about" element={<About />} />
                                <Route element={<ProtectedRoute />}>
                                    <Route
                                        path="/profile"
                                        element={<Profile />}
                                    />
                                </Route>
                                <Route path="*" element={<NotFound />} />
                            </Route>
                        </Routes>
                    </WishlistProvider>
                </AuthModalProvider>
            </AuthContextProvider>
        </BrowserRouter>
    </StrictMode>,
);
