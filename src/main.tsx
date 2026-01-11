import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthContextProvider } from './providers/AuthContext.tsx';
import Home from './routes/home.tsx';
import SkinSales from './routes/skinSales.tsx';
import MythicShop from './routes/mythicShop.tsx';
import TFT from './routes/tft.tsx';
import Catalog from './routes/catalog.tsx';
import Wishlist from './routes/wishlist.tsx';
import About from './routes/about.tsx';
import NavLayout from './layouts/NavLayout.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthContextProvider>
                <Routes>
                    <Route element={<NavLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/skin-sales" element={<SkinSales />} />
                        <Route path="/mythic-shop" element={<MythicShop />} />
                        <Route path="/tft" element={<TFT />} />
                        <Route path="/catalog" element={<Catalog />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/about" element={<About />} />
                    </Route>
                </Routes>
            </AuthContextProvider>
        </BrowserRouter>
    </StrictMode>,
);
