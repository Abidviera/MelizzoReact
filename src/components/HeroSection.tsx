import { useEffect, useRef, useState, useCallback } from 'react';
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

function scrambleWord(word: string, progress: number, isVisible: boolean): string {
  if (isVisible) return word;
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
  const [phase, setPhase] = useState<'idle' | 'exiting' | 'entering' | 'done'>('idle');
  const [contentIdx, setContentIdx] = useState(0);
  const [scramble, setScramble] = useState(false);
  const [scrambleFrame, setScrambleFrame] = useState(0);
  const [charProgress, setCharProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [, forceUpdate] = useState(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const goTo = useCallback((index: number) => {
    if (phase !== 'done') return;
    setPhase('exiting');
    setScramble(false);
    setCharProgress(0);
    setTimeout(() => {
      setActive(index);
      setContentIdx(index);
      setPhase('entering');
      setTimeout(() => {
        setPhase('done');
        setScramble(true);
      }, 100);
    }, 600);
  }, [phase]);

  // Scramble effect
  useEffect(() => {
    if (!scramble) return;
    let frame = 0;
    const totalFrames = 20;
    const id = setInterval(() => {
      frame++;
      setCharProgress(frame / totalFrames);
      setScrambleFrame(frame);
      if (frame >= totalFrames) {
        clearInterval(id);
        setCharProgress(1);
        setScramble(false);
      }
    }, 40);
    return () => clearInterval(id);
  }, [scramble]);

  // Play video immediately on mount (no delay)
  useEffect(() => {
    videoRefs.current.forEach((v) => {
      if (v) v.play().catch(() => {});
    });
    const t = setTimeout(() => {
      setPhase('entering');
      setTimeout(() => {
        setPhase('done');
        setScramble(true);
      }, 400);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      goTo((active + 1) % SLIDES.length);
    }, 8000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active, goTo]);

  // Mouse parallax
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      };
      forceUpdate(n => n + 1);
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  const mx = mouseRef.current.x;
  const my = mouseRef.current.y;
  const s = SLIDES[contentIdx];
  const isDone = phase === 'done';

  return (
    <section className={`kh${active === 1 ? ' kh--slide-2' : ''}`} ref={sectionRef}>
      {/* ===== VIDEO LAYER ===== */}
      <div className="kh__media">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={[
              'kh__slide',
              i === active ? 'kh__slide--active' : '',
              phase === 'exiting' && i === active ? 'kh__slide--exit' : '',
            ].filter(Boolean).join(' ')}
          >
            <video
              src={slide.src}
              className="kh__video"
              autoPlay
              muted
              loop
              playsInline
              ref={(el) => { videoRefs.current[i] = el; }}
            />
            <div className="kh__video-overlay" />
          </div>
        ))}
      </div>

      {/* ===== COLOR BLOCK ACCENTS ===== */}
      <div className="kh__color-blocks" aria-hidden="true">
        <div
          className={`kh__block kh__block--${active === 1 ? 'pink-1' : '1'}`}
          style={{ transform: `translate(${mx * 25}px, ${my * 15}px)` }}
        />
        <div
          className={`kh__block kh__block--${active === 1 ? 'pink-2' : '2'}`}
          style={{ transform: `translate(${mx * -20}px, ${my * -20}px)` }}
        />
        <div
          className={`kh__block kh__block--${active === 1 ? 'pink-3' : '3'}`}
        />
      </div>

      {/* ===== HEADER BAR ===== */}
      <div className={`kh__header ${isDone ? 'kh__header--in' : ''}`}>
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
      <div
        className="kh__main"
        style={{ '--mx': mx, '--my': my } as React.CSSProperties}
      >
        {/* Eyebrow */}
        <div className={`kh__eyebrow ${isDone ? 'kh__eyebrow--in' : ''}`}>
          <span className="kh__eyebrow-dot" />
          <span>{s.eyebrow}</span>
          <span className="kh__eyebrow-dot" />
        </div>

        {/* KINETIC HEADLINE */}
        <h1
          ref={headlineRef}
          className={`kh__headline ${isDone ? 'kh__headline--in' : ''}`}
        >
          {s.headline.map((line, lineIdx) => (
            <span
              key={lineIdx}
              className="kh__headline-line"
              style={{ '--line-delay': `${lineIdx * 0.15}s` } as React.CSSProperties}
            >
              {line.split('').map((char, charIdx) => (
                <span
                  key={charIdx}
                  className="kh__headline-char"
                  style={{
                    '--char-delay': `${lineIdx * 0.15 + charIdx * 0.04}s`,
                    '--char-scramble': isDone ? scramble ? `${charProgress > charIdx / line.length ? 1 : 0}` : '1' : '0',
                  } as React.CSSProperties}
                >
                  {char === ' ' ? '\u00A0' : scramble && isDone
                    ? scrambleWord(char, charProgress, charIdx / line.length < charProgress)
                    : char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        {/* TAGLINE BLOCK */}
        <div
          className={`kh__tagline-block ${isDone ? 'kh__tagline-block--in' : ''}`}
        >
          <div className="kh__tagline-bar" />
          <p className="kh__tagline">{s.sub}</p>
        </div>

        {/* CTA ROW */}
        <div className={`kh__cta-row ${isDone ? 'kh__cta-row--in' : ''}`}>
          <a href="#" className="kh__btn kh__btn--primary">
            <span className="kh__btn-text">{s.cta}</span>
            <span className="kh__btn-fill" aria-hidden="true" />
          </a>
          <a href="#" className="kh__btn kh__btn--outline">
            <span className="kh__btn-text">{s.ctaSub}</span>
          </a>
        </div>

        {/* STAT / SOCIAL STRIP */}
        <div className={`kh__strip ${isDone ? 'kh__strip--in' : ''}`}>
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
      <div className={`kh__ticker ${isDone ? 'kh__ticker--in' : ''}`} aria-hidden="true">
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
      <div className={`kh__slide-nav ${isDone ? 'kh__slide-nav--in' : ''}`}>
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
                goTo(i);
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ===== SCROLL HINT ===== */}
      <div className={`kh__scroll ${isDone ? 'kh__scroll--in' : ''}`}>
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
