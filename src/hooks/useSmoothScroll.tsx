/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

type LenisScrollEvent = { scroll: number; limit: number };

type LenisInstance = {
  on: (event: string, callback: (e: LenisScrollEvent) => void) => void;
  off: (event: string, callback: (e: LenisScrollEvent) => void) => void;
  raf: (time: number) => void;
  destroy: () => void;
};

const SmoothScrollContext = createContext<LenisInstance | null>(null);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<LenisInstance | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    import('lenis').then((mod) => {
      const LenisClass = mod.default as new (options: object) => LenisInstance;

      const instance = new LenisClass({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      function raf(time: number) {
        instance.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      }
      rafRef.current = requestAnimationFrame(raf);
      setLenis(instance);
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={lenis}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}
