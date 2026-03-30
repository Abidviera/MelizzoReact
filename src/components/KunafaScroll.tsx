import { useEffect, useRef, type CSSProperties } from 'react';
import './KunafaScroll.css';

const TEXT_LINES = ['PISTACHIO', 'KUNAFA', 'DUBAI', 'CHOCOLATE'];
const TOTAL_FRAMES = 205;
const SAMPLE_STEP = 2;
const FRAME_DIR = '/KUNAFAPISTACHIO';
const NUM_FRAMES = Math.ceil(TOTAL_FRAMES / SAMPLE_STEP);

const FRAME_PATHS = Array.from({ length: NUM_FRAMES }, (_, idx) => {
  const frameNum = String(idx * SAMPLE_STEP + 1).padStart(3, '0');
  return `${FRAME_DIR}/ezgif-frame-${frameNum}.png`;
});

const LERP_FACTOR = 0.08; // how fast it catches up (lower = smoother/slower)

export default function KunafaScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // DOM element refs — updated directly via RAF, no React state
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Target & current values — RAF lerps current toward target
  const targetRef = useRef({ progress: 0, frameIdx: 0 });
  const currentRef = useRef({ progress: 0, frameIdx: 0 });

  // Scroll position cached on scroll event
  const scrollRef = useRef({ inView: false, progress: 0 });
  const rafRef = useRef<number>(0);

  // Preload all frames
  useEffect(() => {
    FRAME_PATHS.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  // Precomputed char visibility thresholds for 4 lines
  const CHAR_THRESHOLDS = TEXT_LINES.map((line) =>
    Array.from({ length: line.length }, (_, i) => i / line.length)
  );

  // RAF-driven update loop — decoupled from scroll events
  useEffect(() => {
    const image = imageRef.current;
    const container = containerRef.current;

    // Cache text element refs (no React state — just DOM refs)
    const lineRevealEls = container
      ? Array.from(container.querySelectorAll<HTMLElement>('.ks__line-reveal'))
      : [];
    const charEls: HTMLElement[][] = [];
    if (container) {
      container.querySelectorAll<HTMLElement>('.ks__line-wrapper').forEach((lw) => {
        const chars = Array.from(lw.querySelectorAll<HTMLElement>('.ks__char'));
        charEls.push(chars);
      });
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const updateFrame = () => {
      const { inView, progress } = scrollRef.current;
      const { frameIdx: prevFrame } = currentRef.current;

      // Update target
      targetRef.current.progress = progress;

      if (inView) {
        targetRef.current.frameIdx = Math.min(
          FRAME_PATHS.length - 1,
          Math.floor(progress * FRAME_PATHS.length)
        );
      } else {
        targetRef.current.frameIdx = 0;
      }

      // Lerp current values
      const lp = lerp(currentRef.current.progress, targetRef.current.progress, LERP_FACTOR);
      const lf = lerp(currentRef.current.frameIdx, targetRef.current.frameIdx, LERP_FACTOR * 1.5);
      currentRef.current.progress = lp;
      currentRef.current.frameIdx = lf;

      const cp = currentRef.current.progress;
      const cf = Math.round(currentRef.current.frameIdx);

      // --- Update DOM directly (no React re-render) ---

      // Image src swap only when frame actually changes
      if (image && cf !== prevFrame && cf >= 0 && cf < FRAME_PATHS.length) {
        image.src = FRAME_PATHS[cf];
      }

      // Image opacity & scale
      if (image) {
        const imgOp = inView ? Math.min(1, cp * 4) : 0;
        const imgScale = 1 + cp * 0.08;
        image.style.opacity = `${imgOp}`;
        image.style.transform = `scale3d(${imgScale}, ${imgScale}, 1)`;
      }

      // Ring transforms
      const rings = stickyRef.current?.querySelectorAll<HTMLElement>('.ks__ring');
      rings?.forEach((ring, i) => {
        const dir = i === 0 ? 1 : -1;
        const maxDeg = i === 0 ? 720 : 540;
        const maxScale = i === 0 ? 1.2 : 0.8;
        const rot = cp * maxDeg * dir;
        const sc = 0.5 + cp * (maxScale - 0.5);
        ring.style.transform = `translate3d(-50%, -50%, 0) rotate(${rot}deg) scale3d(${sc}, ${sc}, 1)`;
      });

      // ---- TEXT LINE REVEALS ----
      TEXT_LINES.forEach((_, li) => {
        const start = li * 0.16;
        const end = start + 0.35;
        const lp2 = Math.max(0, Math.min(1, (cp - start) / (end - start)));

        // Line reveal width via transform (GPU composited, no layout)
        const lrEl = lineRevealEls[li];
        if (lrEl) {
          lrEl.style.transform = `scaleX(${lp2})`;
        }

        // Character staggered reveal
        const chars = charEls[li];
        if (chars) {
          chars.forEach((char, ci) => {
            const threshold = CHAR_THRESHOLDS[li][ci];
            const charVisible = lp2 > threshold;
            if (charVisible) {
              char.style.opacity = '1';
              char.style.transform = 'translate3d(0, 0, 0)';
            } else {
              char.style.opacity = '0';
              char.style.transform = 'translate3d(0, 30px, 0)';
            }
          });
        }

      });

      // ---- TAGLINE & FEATURES ----
      const taglineVisible = cp > 0.65;
      const featuresVisible = cp > 0.8;
      const taglineEl = container?.querySelector<HTMLElement>('.ks__tagline-block');
      const featuresEl = container?.querySelector<HTMLElement>('.ks__features');
      if (taglineEl) {
        taglineEl.style.opacity = taglineVisible ? '1' : '0';
        taglineEl.style.transform = taglineVisible ? 'translate3d(0,0,0)' : 'translate3d(0,20px,0)';
      }
      if (featuresEl) {
        featuresEl.style.opacity = featuresVisible ? '1' : '0';
        featuresEl.style.transform = featuresVisible
          ? 'translate3d(-50%,0,0)'
          : 'translate3d(-50%,40px,0)';
      }

      // Progress bar
      const fill = stickyRef.current?.querySelector<HTMLElement>('.ks__progress-fill');
      const label = stickyRef.current?.querySelector<HTMLElement>('.ks__progress-label');
      if (fill) fill.style.width = `${cp * 100}%`;
      if (label) label.textContent = `${Math.round(cp * 100)}%`;

      // Sticky & wrapper opacity
      const sticky = stickyRef.current;
      if (sticky) sticky.style.opacity = inView ? '1' : '0';
      const wrapper2 = stickyRef.current?.querySelector<HTMLElement>('.ks__image-wrapper');
      if (wrapper2) wrapper2.style.opacity = inView ? '1' : '0';

      rafRef.current = requestAnimationFrame(updateFrame);
    };

    rafRef.current = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Scroll event handler — only updates refs, RAF loop reads them
  useEffect(() => {
    const section = sectionRef.current;

    const handleScroll = () => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalHeight = rect.height - windowHeight;

      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        const scrolled = Math.abs(rect.top);
        const progress = Math.min(1, scrolled / Math.max(totalHeight, 1));
        scrollRef.current = { inView: true, progress };
      } else if (rect.top > 0) {
        scrollRef.current = { inView: false, progress: 0 };
      } else {
        scrollRef.current = { inView: true, progress: 1 };
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="ks" id="kunafa-scroll-reveal">
      <div ref={stickyRef} className="ks__sticky">

        {/* Ambient Background */}
        <div className="ks__bg">
          <div className="ks__bg-blob ks__bg-blob--1" />
          <div className="ks__bg-blob ks__bg-blob--2" />
          <div className="ks__bg-blob ks__bg-blob--3" />
          <div className="ks__bg-grid" />
        </div>

        {/* Corner Accents */}
        <div className="ks__corner ks__corner--tl" aria-hidden="true">
          <div className="ks__corner-line ks__corner-line--h" />
          <div className="ks__corner-line ks__corner-line--v" />
        </div>
        <div className="ks__corner ks__corner--tr" aria-hidden="true">
          <div className="ks__corner-line ks__corner-line--h" />
          <div className="ks__corner-line ks__corner-line--v" />
        </div>
        <div className="ks__corner ks__corner--bl" aria-hidden="true">
          <div className="ks__corner-line ks__corner-line--h" />
          <div className="ks__corner-line ks__corner-line--v" />
        </div>
        <div className="ks__corner ks__corner--br" aria-hidden="true">
          <div className="ks__corner-line ks__corner-line--h" />
          <div className="ks__corner-line ks__corner-line--v" />
        </div>

        {/* Decorative Rings */}
        <div className="ks__ring" aria-hidden="true" />
        <div className="ks__ring ks__ring--inner" aria-hidden="true" />

        {/* Product Image — src updated directly via RAF ref, NO key prop */}
        <div className="ks__image-wrapper">
          {/* Vignette removed */}          <img
            ref={imageRef}
            src={FRAME_PATHS[0]}
            alt="Pistachio Kunafa Dubai Chocolate"
            className="ks__image"
          />
          {/* Gradient overlays removed */}
        </div>

        {/* Central Content */}
        <div ref={containerRef} className="ks__container">

          {/* Eyebrow */}
          <div className="ks__eyebrow">
            <span className="ks__eyebrow-dot" />
            <span>Scroll to Reveal</span>
            <span className="ks__eyebrow-dot" />
          </div>

          {/* Main Text — CSS-driven reveals via custom properties */}
          <div className="ks__text-block">
            {TEXT_LINES.map((line, lineIdx) => (
              <div key={lineIdx} className="ks__line-wrapper">
                {/* Reveal mask — transform-based width, not clip-path */}
                <div
                  className="ks__line-reveal"
                  style={{ ['--line-progress-' + lineIdx]: 1 } as CSSProperties}
                >
                  <h2 className="ks__line" aria-label={line}>
                    {line.split('').map((char, charIdx) => {
                      const threshold = CHAR_THRESHOLDS[lineIdx][charIdx];
                      return (
                        <span
                          key={charIdx}
                          className="ks__char"
                          style={{ ['--char-threshold-' + lineIdx + '-' + charIdx]: threshold } as CSSProperties}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      );
                    })}
                  </h2>
                </div>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <div className="ks__tagline-block">
            <div className="ks__tagline-bar" />
            <p className="ks__tagline">Crunchy. Syrupy. Unapologetically Bold.</p>
            <div className="ks__tagline-bar" />
          </div>

          {/* Progress Bar */}
          <div className="ks__progress">
            <div className="ks__progress-track">
              <div className="ks__progress-fill" />
            </div>
            <span className="ks__progress-label">0%</span>
          </div>

        
        </div>

        {/* Bottom Fade */}
        <div className="ks__fade-line" aria-hidden="true" />
      </div>
    </section>
  );
}
