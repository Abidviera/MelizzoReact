import { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import HeroSection from './components/HeroSection';
import KunafaScroll from './components/KunafaScroll';

function App() {
  const [showHero, setShowHero] = useState(false);

  return (
    <>
      {!showHero && <LoadingScreen onVideoEnd={() => setShowHero(true)} />}
      {showHero && (
        <>
          <HeroSection />
          <KunafaScroll />
        </>
      )}
    </>
  );
}

export default App;
