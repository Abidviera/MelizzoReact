import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SmoothScrollProvider } from './hooks/useSmoothScroll.tsx';
import LoadingScreen from './components/LoadingScreen';
import HeroSection from './components/HeroSection';
import KunafaScroll from './components/KunafaScroll';
import AngelHairScroll from './components/AngelHairScroll';
import ComingSoonScroll from './components/ComingSoonScroll';
import AboutMelizzo from './components/AboutMelizzo/AboutMelizzo';
import ProductCatalog from './components/ProductCatalog/ProductCatalog';
import FeaturedProducts from './components/FeaturedProducts/FeaturedProducts';
import OurJourney from './components/OurJourney/OurJourney';
import OurBlog from './components/OurBlog/OurBlog';
import Newsletter from './components/Newsletter/Newsletter';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import Shop from './pages/Shop/Shop';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import OrderConfirmation from './pages/OrderConfirmation/OrderConfirmation';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Account from './pages/Account/Account';
import Wishlist from './pages/Wishlist/Wishlist';
import ComingSoonPage from './pages/ComingSoon/ComingSoon';
import './App.css';

const HERO_VIDEOS = [
  '/herosection/hero1video.MOV',
  '/herosection/hero2video.MOV',
];

function preloadVideo(src: string) {
  const video = document.createElement('video');
  video.src = src;
  video.preload = 'auto';
  video.muted = true;
  video.load();
  return video;
}

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isFullscreen = pathname === '/' ||
    ['/shop', '/about', '/contact', '/account', '/wishlist', '/cart', '/coming-soon'].includes(pathname);

  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!isFullscreen && <Footer />}
      <WhatsAppButton />
    </>
  );
}

function LandingPage() {
  const [showHero, setShowHero] = useState(false);
  const preloadedVideosRef = useRef<HTMLVideoElement[]>([]);

  // Preload hero videos during the loading screen
  useEffect(() => {
    HERO_VIDEOS.forEach((src) => {
      preloadVideo(src);
    });
    return () => {
      preloadedVideosRef.current.forEach((v) => {
        v.src = '';
        v.load();
      });
      preloadedVideosRef.current = [];
    };
  }, []);

  return (
    <>
      {!showHero && <LoadingScreen onVideoEnd={() => setShowHero(true)} />}
      {showHero && (
        <>
          <HeroSection />
          <KunafaScroll />
          <AngelHairScroll />
          <AboutMelizzo />
          <ProductCatalog />
          <FeaturedProducts />
          <OurJourney />
          <OurBlog />
          <Newsletter />
          <ComingSoonScroll />
          <Footer />
          <WhatsAppButton />
        </>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SmoothScrollProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/account" element={<Account />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/coming-soon" element={<ComingSoonPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </Layout>
      </SmoothScrollProvider>
    </BrowserRouter>
  );
}

export default App;
