import { useState } from 'react';
import { SmoothScrollProvider } from './hooks/useSmoothScroll.tsx';
import LoadingScreen from './components/LoadingScreen';
import HeroSection from './components/HeroSection';
import KunafaScroll from './components/KunafaScroll';
import AngelHairScroll from './components/AngelHairScroll';
import ComingSoonScroll from './components/ComingSoonScroll';

function App() {
  const [showHero, setShowHero] = useState(false);

  return (
    <SmoothScrollProvider>
      {!showHero && <LoadingScreen onVideoEnd={() => setShowHero(true)} />}
      {showHero && (
        <>
          <HeroSection />
          <KunafaScroll />
          <AngelHairScroll />
          <ComingSoonScroll />
        </>
      )}
    </SmoothScrollProvider>
  );
}

export default App;
