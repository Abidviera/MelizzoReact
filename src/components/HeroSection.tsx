import { useEffect, useRef, useState, useMemo } from 'react';
import './HeroSection.css';

const SLIDES = [
  {
    src: '/herosection/hero1video.MOV',
    eyebrow: 'Dubai Chocolate',
    headline: ['PISTACHIO', 'KUNAFA'],
    sub: 'Crunchy. Syrupy. Unapologetically Bold.',
    cta: 'Shop Kunafa',
    ctaSub: 'See our collection',
  },
  {
    src: '/herosection/hero2video.MOV',
    eyebrow: 'Dubai Chocolate',
    headline: ['ANGEL HAIR', 'White'],
    sub: 'Silky. Luxurious. Tastes Like Heaven.',
    cta: 'Shop Angel Hair',
    ctaSub: 'Explore flavors',
  },
];

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
const SCRAMBLE_FRAMES = 20;
const SCRAMBLE_INTERVAL = 40;

function scrambleWord(word: string, progress: number): string {
  return word
    .split('')
    .map((char, i) => {
      if (char === ' ') return ' ';
      if (i / word.length < progress) return char;
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    })
    .join('');
}

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [charProgress, setCharProgress] = useState(0);
  const [scrambleKey, setScrambleKey] = useState(0);
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const mouseRafRef = useRef<number | undefined>(undefined);
  const pendingMouseRef = useRef<{ x: number; y: number } | null>(null);

  // Play hero video immediately on mount — it's already preloaded
  useEffect(() => {
    const v = videoRefs.current[0];
    if (v) {
      v.play().catch(() => {
        v.muted = true;
        v.play().catch(() => {});
      });
    }
  }, []);

  // Start entrance animation right away
  useEffect(() => {
    const t1 = setTimeout(() => setIsReady(true), 100);
    const t2 = setTimeout(() => setScrambleKey((k) => k + 1), 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Scramble effect
  useEffect(() => {
    if (!isReady) return;
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      setCharProgress(frame / SCRAMBLE_FRAMES);
      if (frame >= SCRAMBLE_FRAMES) {
        clearInterval(id);
        setCharProgress(1);
      }
    }, SCRAMBLE_INTERVAL);
    return () => clearInterval(id);
  }, [isReady, scrambleKey]);

  // Auto-advance slides
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 8000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Play active video when slide changes
  useEffect(() => {
    const v = videoRefs.current[active];
    if (v) {
      v.play().catch(() => {
        v.muted = true;
        v.play().catch(() => {});
      });
    }
  }, [active]);

  // Throttled mouse parallax via rAF
  useEffect(() => {
    const el = headlineRef.current?.closest('.kh');
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      pendingMouseRef.current = {
        x: ((e.clientX - window.innerWidth / 2) / window.innerWidth) * 2,
        y: ((e.clientY - window.innerHeight / 2) / window.innerHeight) * 2,
      };

      if (mouseRafRef.current === undefined) {
        mouseRafRef.current = requestAnimationFrame(() => {
          if (pendingMouseRef.current) {
            setMx(pendingMouseRef.current.x);
            setMy(pendingMouseRef.current.y);
          }
          mouseRafRef.current = undefined;
        });
      }
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      el.removeEventListener('mousemove', onMove);
      if (mouseRafRef.current !== undefined) cancelAnimationFrame(mouseRafRef.current);
    };
  }, []);

  const headlineChars = useMemo(() => {
    return SLIDES[active].headline.map((line, lineIdx) =>
      line.split('').map((char, charIdx) => {
        const isRevealed = charIdx / line.length < charProgress;
        const displayChar = isReady ? scrambleWord(char, charProgress) : char;
        return { char: displayChar, isRevealed, charIdx, lineIdx };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, charProgress, isReady]);

  const s = SLIDES[active];
  const showScramble = isReady && charProgress < 1;
  const isPink = active === 1;

  return (
    <section className={`kh${isPink ? ' kh--slide-2' : ''}`}>
      {/* ===== VIDEO LAYER ===== */}
      <div className="kh__media">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={[
              'kh__slide',
              i === active ? 'kh__slide--active' : '',
            ].filter(Boolean).join(' ')}
          >
            <video
              src={slide.src}
              className="kh__video"
              muted
              loop
              playsInline
              preload="auto"
              ref={(el) => { videoRefs.current[i] = el; }}
            />
            <div className="kh__video-overlay" />
          </div>
        ))}
      </div>

      {/* ===== COLOR BLOCK ACCENTS ===== */}
      <div className="kh__color-blocks" aria-hidden="true">
        <div
          className={`kh__block kh__block--${isPink ? 'pink-1' : '1'}`}
          style={{ transform: `translate(${mx * 25}px, ${my * 15}px)` }}
        />
        <div
          className={`kh__block kh__block--${isPink ? 'pink-2' : '2'}`}
          style={{ transform: `translate(${-mx * 20}px, ${-my * 20}px)` }}
        />
        <div className={`kh__block kh__block--${isPink ? 'pink-3' : '3'}`} />
      </div>

      {/* ===== HEADER BAR ===== */}
      <div className={`kh__header ${isReady ? 'kh__header--in' : ''}`}>
        <div className="kh__logo">
          <span className="kh__logo-script">melizzo</span>
        </div>
        <nav className="kh__nav">
          {['Shop', 'Our Story', 'Flavors', 'Gifting'].map((item) => (
            <a key={item} href="#" className="kh__nav-link">{item}</a>
          ))}
        </nav>
        <a href="#" className="kh__header-cta">
          Let's Talk
          <span className="kh__header-cta-arrow" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </a>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="kh__main" style={{ '--mx': mx, '--my': my } as React.CSSProperties}>
        {/* Eyebrow */}
        <div className={`kh__eyebrow ${isReady ? 'kh__eyebrow--in' : ''}`}>
          <span className="kh__eyebrow-dot" />
          <span>{s.eyebrow}</span>
          <span className="kh__eyebrow-dot" />
        </div>

        {/* KINETIC HEADLINE */}
        <h1
          ref={headlineRef}
          className={`kh__headline ${isReady ? 'kh__headline--in' : ''}`}
        >
          {headlineChars.map((lineChars, lineIdx) => (
            <span
              key={lineIdx}
              className="kh__headline-line"
              style={{ '--line-delay': `${lineIdx * 0.15}s` } as React.CSSProperties}
            >
              {lineChars.map(({ char, isRevealed, charIdx }) => (
                <span
                  key={charIdx}
                  className="kh__headline-char kh__headline-char--in"
                  style={{
                    '--char-delay': `${lineIdx * 0.15 + charIdx * 0.04}s`,
                    '--revealed': showScramble ? (isRevealed ? 1 : 0) : 1,
                  } as React.CSSProperties}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        {/* TAGLINE BLOCK */}
        <div className={`kh__tagline-block ${isReady ? 'kh__tagline-block--in' : ''}`}>
          <div className="kh__tagline-bar" />
          <p className="kh__tagline">{s.sub}</p>
        </div>

        {/* CTA ROW */}
        <div className={`kh__cta-row ${isReady ? 'kh__cta-row--in' : ''}`}>
          <a href="#" className="kh__btn kh__btn--primary">
            <span className="kh__btn-text">{s.cta}</span>
            <span className="kh__btn-fill" aria-hidden="true" />
          </a>
          <a href="#" className="kh__btn kh__btn--outline">
            <span className="kh__btn-text">{s.ctaSub}</span>
          </a>
        </div>

        {/* STAT / SOCIAL STRIP */}
        <div className={`kh__strip ${isReady ? 'kh__strip--in' : ''}`}>
          <div className="kh__strip-stat">
            <span className="kh__strip-num">{s === SLIDES[0] ? '100%' : '100%'}</span>
            <span className="kh__strip-label">{s === SLIDES[0] ? 'Authentic Kunafa' : 'Fresh Daily'}</span>
          </div>
          <div className="kh__strip-divider" aria-hidden="true" />
          <div className="kh__strip-stat">
            <span className="kh__strip-num">{s === SLIDES[0] ? '50K+' : '5K+'}</span>
            <span className="kh__strip-label">{s === SLIDES[0] ? 'Happy Customers' : 'Boxes Sold'}</span>
          </div>
          <div className="kh__strip-divider" aria-hidden="true" />
          <div className="kh__strip-stat">
            <span className="kh__strip-num">{s === SLIDES[0] ? 'Dubai' : 'Made in UAE'}</span>
            <span className="kh__strip-label">{s === SLIDES[0] ? 'Original Recipe' : 'Premium Cocoa'}</span>
          </div>
          <div className="kh__strip-socials">
            {['IG', 'TT', 'WA'].map((s) => (
              <a key={s} href="#" className="kh__strip-social">{s}</a>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MARQUEE TICKER ===== */}
      <div className={`kh__ticker ${isReady ? 'kh__ticker--in' : ''}`} aria-hidden="true">
        <div className="kh__ticker-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="kh__ticker-item">
              <span>Dubai Chocolate</span>
              <span className="kh__ticker-star">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              </span>
              <span>Premium Cocoa</span>
              <span className="kh__ticker-star">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              </span>
              <span>Kunafa Pistachio</span>
              <span className="kh__ticker-star">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              </span>
              <span>Angel Hair Choc</span>
              <span className="kh__ticker-star">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              </span>
              <span>Made in UAE</span>
              <span className="kh__ticker-star">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ===== SLIDE NAV ===== */}
      <div className={`kh__slide-nav ${isReady ? 'kh__slide-nav--in' : ''}`}>
        <div className="kh__slide-progress">
          <div className="kh__slide-progress-track">
            <div key={`prog-${active}`} className="kh__slide-progress-fill" />
          </div>
        </div>
        <div className="kh__slide-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`kh__slide-dot ${i === active ? 'kh__slide-dot--active' : ''}`}
              onClick={() => {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setActive(i);
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ===== SCROLL HINT ===== */}
      <div className={`kh__scroll ${isReady ? 'kh__scroll--in' : ''}`}>
        <div className="kh__scroll-icon">
          <div className="kh__scroll-icon-inner" />
        </div>
        <span className="kh__scroll-text">Scroll</span>
      </div>

      {/* ===== GEOMETRIC ACCENTS ===== */}
      <div className="kh__geo kh__geo--tl" aria-hidden="true">
        <div className="kh__geo-line kh__geo-line--h" />
        <div className="kh__geo-line kh__geo-line--v" />
      </div>
      <div className="kh__geo kh__geo--br" aria-hidden="true">
        <div className="kh__geo-line kh__geo-line--h" />
        <div className="kh__geo-line kh__geo-line--v" />
      </div>
      <div
        className="kh__geo-ring"
        aria-hidden="true"
        style={{ transform: `translate(${mx * -30}px, ${my * -30}px) rotate(${mx * 15}deg)` }}
      />
    </section>
  );
}
