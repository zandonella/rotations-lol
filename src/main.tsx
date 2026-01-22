import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthContextProvider } from './providers/AuthContext.tsx';
import { AuthModalProvider } from './providers/AuthModalContext.tsx';
import Home from './routes/home.tsx';
import SkinSales from './routes/skinSales.tsx';
import MythicShop from './routes/mythicShop.tsx';
import Catalog from './routes/catalog.tsx';
import Wishlist from './routes/wishlist.tsx';
import About from './routes/about.tsx';
import NavLayout from './layouts/NavLayout.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthContextProvider>
                <AuthModalProvider>
                    <Routes>
                        <Route element={<NavLayout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/skin-sales" element={<SkinSales />} />
                            <Route
                                path="/mythic-shop"
                                element={<MythicShop />}
                            />
                            <Route path="/catalog" element={<Catalog />} />
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/about" element={<About />} />
                        </Route>
                    </Routes>
                </AuthModalProvider>
            </AuthContextProvider>
        </BrowserRouter>
    </StrictMode>,
);
