import { useEffect, useRef, type CSSProperties } from 'react';
import { useSmoothScroll } from '../hooks/useSmoothScroll.tsx';
import './AngelHairScroll.css';

const TEXT_LINES = ['ANGEL', 'HAIR', 'WHITE', 'DUBAI', 'CHOCOLATE'];
const TOTAL_FRAMES = 240;
const SAMPLE_STEP = 1;
const FRAME_DIR = '/ANGLE HAIR';
const NUM_FRAMES = Math.ceil(TOTAL_FRAMES / SAMPLE_STEP);

const FRAME_PATHS = Array.from({ length: NUM_FRAMES }, (_, idx) => {
  const frameNum = String(idx * SAMPLE_STEP + 1).padStart(3, '0');
  return `${FRAME_DIR}/ezgif-frame-${frameNum}.png`;
});

const LERP_FACTOR = 0.08;

export default function AngelHairScroll() {
  const lenis = useSmoothScroll();
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const targetRef = useRef({ progress: 0, frameIdx: 0 });
  const currentRef = useRef({ progress: 0, frameIdx: 0 });
  const scrollRef = useRef({ inView: false, progress: 0 });
  const rafRef = useRef<number>(0);

  // Preload all frames
  useEffect(() => {
    FRAME_PATHS.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  const CHAR_THRESHOLDS = TEXT_LINES.map((line) =>
    Array.from({ length: line.length }, (_, i) => (i / (line.length - 1)) * 0.85)
  );

  useEffect(() => {
    const image = imageRef.current;
    const container = containerRef.current;

    const lineRevealEls = container
      ? Array.from(container.querySelectorAll<HTMLElement>('.ahs__line-reveal'))
      : [];
    const charEls: HTMLElement[][] = [];
    if (container) {
      container.querySelectorAll<HTMLElement>('.ahs__line-wrapper').forEach((lw) => {
        charEls.push(Array.from(lw.querySelectorAll<HTMLElement>('.ahs__char')));
      });
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const updateFrame = () => {
      const { inView, progress } = scrollRef.current;
      const { frameIdx: prevFrame } = currentRef.current;

      targetRef.current.progress = progress;

      if (inView) {
        targetRef.current.frameIdx = Math.min(
          FRAME_PATHS.length - 1,
          Math.floor(progress * FRAME_PATHS.length)
        );
      } else {
        targetRef.current.frameIdx = 0;
      }

      const lp = lerp(currentRef.current.progress, targetRef.current.progress, LERP_FACTOR);
      const lf = lerp(
        currentRef.current.frameIdx,
        targetRef.current.frameIdx,
        LERP_FACTOR * 1.5
      );
      currentRef.current.progress = lp;
      currentRef.current.frameIdx = lf;

      const cp = currentRef.current.progress;
      const cf = Math.round(currentRef.current.frameIdx);

      if (image && cf !== prevFrame && cf >= 0 && cf < FRAME_PATHS.length) {
        image.src = FRAME_PATHS[cf];
      }

      if (image) {
        const imgOp = inView ? Math.min(1, cp * 4) : 0;
        const imgScale = 1 + cp * 0.08;
        image.style.opacity = String(imgOp);
        image.style.transform = `scale3d(${imgScale}, ${imgScale}, 1)`;
      }

      // Ring transforms
      const rings = stickyRef.current?.querySelectorAll<HTMLElement>('.ahs__ring');
      rings?.forEach((ring, i) => {
        const dir = i === 0 ? 1 : -1;
        const maxDeg = i === 0 ? 720 : 540;
        const maxScale = i === 0 ? 1.2 : 0.8;
        const rot = cp * maxDeg * dir;
        const sc = 0.5 + cp * (maxScale - 0.5);
        ring.style.transform = `translate3d(-50%, -50%, 0) rotate(${rot}deg) scale3d(${sc}, ${sc}, 1)`;
      });

      // --- TEXT LINE REVEALS ---
      // Angel Hair: blur-to-sharp + scale-up per character, line wipe left-to-right
      // Last line ends at progress=1 so all text is fully visible before scroll ends
      TEXT_LINES.forEach((_, li) => {
        const totalDuration = 1.0;
        const lineSpacing = totalDuration / TEXT_LINES.length;
        const start = li * lineSpacing;
        const end = start + lineSpacing * 0.85;
        const lp2 = Math.max(0, Math.min(1, (cp - start) / (end - start)));

        const lrEl = lineRevealEls[li];
        if (lrEl) {
          // Line wipe slides in from the left
          lrEl.style.transform = `translateX(${(1 - lp2) * -100}%)`;
        }

        const chars = charEls[li];
        if (chars) {
          chars.forEach((char, ci) => {
            const threshold = CHAR_THRESHOLDS[li][ci];
            const charProgress = Math.max(0, Math.min(1, (lp2 - threshold) / (1 - threshold + 0.001)));
            // Blur: starts at 12px, ends at 0
            const blur = (1 - charProgress) * 12;
            // Scale: starts at 1.4, ends at 1
            const scale = 1.4 - charProgress * 0.4;
            // Opacity: eased
            const opacity = Math.min(1, charProgress * 1.2);
            char.style.filter = `blur(${blur}px)`;
            char.style.opacity = String(opacity);
            char.style.transform = `scale3d(${scale}, ${scale}, 1)`;
          });
        }
      });

      // --- TAGLINE ---
      const taglineVisible = cp > 0.65;
      const taglineEl = container?.querySelector<HTMLElement>('.ahs__tagline-block');
      if (taglineEl) {
        taglineEl.style.opacity = taglineVisible ? '1' : '0';
        taglineEl.style.transform = taglineVisible
          ? 'translate3d(0,0,0)'
          : 'translate3d(0,20px,0)';
      }

      // --- FEATURE PILLS ---
      const featuresVisible = cp > 0.78;
      const featuresEl = container?.querySelector<HTMLElement>('.ahs__feature-pills');
      if (featuresEl) {
        featuresEl.style.opacity = featuresVisible ? '1' : '0';
        featuresEl.style.transform = featuresVisible
          ? 'translate3d(-50%,0,0)'
          : 'translate3d(-50%,30px,0)';
      }

      // --- PROGRESS BAR ---
      const fill = stickyRef.current?.querySelector<HTMLElement>('.ahs__progress-fill');
      const label = stickyRef.current?.querySelector<HTMLElement>('.ahs__progress-label');
      if (fill) fill.style.width = `${cp * 100}%`;
      if (label) label.textContent = `${Math.round(cp * 100)}%`;

      // Sticky opacity
      const sticky = stickyRef.current;
      if (sticky) sticky.style.opacity = inView ? '1' : '0';
      const wrapper2 = stickyRef.current?.querySelector<HTMLElement>('.ahs__image-wrapper');
      if (wrapper2) wrapper2.style.opacity = inView ? '1' : '0';

      rafRef.current = requestAnimationFrame(updateFrame);
    };

    rafRef.current = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    if (lenis) {
      lenis.on('scroll', handleScroll);
      handleScroll();
      return () => lenis.off('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [lenis]);

  return (
    <section ref={sectionRef} className="ahs" id="angel-hair-scroll">
      <div ref={stickyRef} className="ahs__sticky">

        {/* Ambient Background */}
        <div className="ahs__bg">
          <div className="ahs__bg-blob ahs__bg-blob--1" />
          <div className="ahs__bg-blob ahs__bg-blob--2" />
          <div className="ahs__bg-blob ahs__bg-blob--3" />
          <div className="ahs__bg-grid" />
        </div>

        {/* Corner Accents */}
        <div className="ahs__corner ahs__corner--tl" aria-hidden="true">
          <div className="ahs__corner-line ahs__corner-line--h" />
          <div className="ahs__corner-line ahs__corner-line--v" />
        </div>
        <div className="ahs__corner ahs__corner--tr" aria-hidden="true">
          <div className="ahs__corner-line ahs__corner-line--h" />
          <div className="ahs__corner-line ahs__corner-line--v" />
        </div>
        <div className="ahs__corner ahs__corner--bl" aria-hidden="true">
          <div className="ahs__corner-line ahs__corner-line--h" />
          <div className="ahs__corner-line ahs__corner-line--v" />
        </div>
        <div className="ahs__corner ahs__corner--br" aria-hidden="true">
          <div className="ahs__corner-line ahs__corner-line--h" />
          <div className="ahs__corner-line ahs__corner-line--v" />
        </div>

        {/* Decorative Rings */}
        <div className="ahs__ring" aria-hidden="true" />
        <div className="ahs__ring ahs__ring--inner" aria-hidden="true" />

        {/* Product Image */}
        <div className="ahs__image-wrapper">
          <img
            ref={imageRef}
            src={FRAME_PATHS[0]}
            alt="Angel Hair White Dubai Chocolate"
            className="ahs__image"
          />
        </div>

        {/* Central Content */}
        <div ref={containerRef} className="ahs__container">

          {/* Eyebrow */}
          <div className="ahs__eyebrow">
            <span className="ahs__eyebrow-dot" />
            <span>Angel Hair Series</span>
            <span className="ahs__eyebrow-dot" />
          </div>

          {/* Main Text */}
          <div className="ahs__text-block">
            {TEXT_LINES.map((line, lineIdx) => (
              <div key={lineIdx} className="ahs__line-wrapper">
                <div
                  className="ahs__line-reveal"
                  style={{ ['--line-progress-' + lineIdx]: 1 } as CSSProperties}
                >
                  <h2 className="ahs__line" aria-label={line}>
                    {line.split('').map((char, charIdx) => {
                      const threshold = CHAR_THRESHOLDS[lineIdx][charIdx];
                      return (
                        <span
                          key={charIdx}
                          className="ahs__char"
                          style={
                            {
                              ['--char-threshold-' + lineIdx + '-' + charIdx]:
                                threshold,
                            } as CSSProperties
                          }
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
          <div className="ahs__tagline-block">
            <div className="ahs__tagline-bar" />
            <p className="ahs__tagline">
              Silky Strands. White Chocolate Drizzle. Pure Decadence.
            </p>
            <div className="ahs__tagline-bar" />
          </div>

          
        </div>


        {/* Bottom Fade */}
        <div className="ahs__fade-line" aria-hidden="true" />
      </div>
    </section>
  );
}
