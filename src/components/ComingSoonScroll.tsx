import { useEffect, useRef } from 'react';
import { useSmoothScroll } from '../hooks/useSmoothScroll.tsx';
import './ComingSoonScroll.css';

const TOTAL_FRAMES = 240;
const FRAME_DIR = '/ComminSoon';

const FRAME_PATHS = Array.from({ length: TOTAL_FRAMES }, (_, idx) => {
  const frameNum = String(idx + 1).padStart(3, '0');
  return `${FRAME_DIR}/ezgif-frame-${frameNum}.png`;
});

const LERP_FACTOR = 0.25;

const HEADLINE_LINE1 = 'Something';
const HEADLINE_LINE2 = 'Extraordinary';
const HEADLINE_LINE3 = 'is Baking…';


export default function ComingSoonScroll() {
  const lenis = useSmoothScroll();
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textSectionRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const image = imageRef.current;
    const textSection = textSectionRef.current;

    const line1Chars = textSection
      ? Array.from(textSection.querySelectorAll<HTMLElement>('.cs__line-1 .cs__char'))
      : [];
    const line2Chars = textSection
      ? Array.from(textSection.querySelectorAll<HTMLElement>('.cs__line-2 .cs__char'))
      : [];
    const line3Chars = textSection
      ? Array.from(textSection.querySelectorAll<HTMLElement>('.cs__line-3 .cs__char'))
      : [];
    const allChars = [line1Chars, line2Chars, line3Chars];

    const featureEls = textSection
      ? Array.from(textSection.querySelectorAll<HTMLElement>('.cs__feature'))
      : [];

    const subtextEl = textSection
      ? textSection.querySelector<HTMLElement>('.cs__subtext')
      : null;

    const headlineEl = textSection
      ? textSection.querySelector<HTMLElement>('.cs__headline')
      : null;

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
        const imgOp = inView ? Math.min(1, cp * 3) : 0;
        const imgScale = 1 + cp * 0.06;
        image.style.opacity = String(imgOp);
        image.style.transform = `scale3d(${imgScale}, ${imgScale}, 1)`;
      }

      // Ring transforms
      const rings = stickyRef.current?.querySelectorAll<HTMLElement>('.cs__ring');
      rings?.forEach((ring, i) => {
        const dir = i === 0 ? 1 : -1;
        const maxDeg = i === 0 ? 600 : 480;
        const maxScale = i === 0 ? 1.15 : 0.85;
        const rot = cp * maxDeg * dir;
        const sc = 0.5 + cp * (maxScale - 0.5);
        ring.style.transform = `translate3d(-50%, -50%, 0) rotate(${rot}deg) scale3d(${sc}, ${sc}, 1)`;
      });

      // --- HEADLINE CHARACTER REVEAL ---
      // Overall text starts revealing at progress 0.05, fully done at 0.7
      const lines = [HEADLINE_LINE1, HEADLINE_LINE2, HEADLINE_LINE3];
      allChars.forEach((chars, li) => {
        const totalDuration = 0.65;
        const lineSpacing = totalDuration / lines.length;
        const start = 0.05 + li * lineSpacing;
        const end = start + lineSpacing * 0.8;
        const lp2 = Math.max(0, Math.min(1, (cp - start) / (end - start)));

        if (headlineEl) {
          const yShift = (1 - lp2) * 15;
          headlineEl.style.transform = `translateY(${yShift}px)`;
        }

        chars.forEach((char, ci) => {
          const charSpacing = 1 / Math.max(chars.length - 1, 1);
          const threshold = ci * charSpacing * 0.85;
          const charProgress = Math.max(0, Math.min(1, (lp2 - threshold) / (1 - threshold + 0.001)));
          const blur = (1 - charProgress) * 10;
          const scale = 1.3 - charProgress * 0.3;
          const opacity = Math.min(1, charProgress * 1.2);
          const yOffset = (1 - charProgress) * 20;
          char.style.filter = `blur(${blur}px)`;
          char.style.opacity = String(opacity);
          char.style.transform = `scale3d(${scale}, ${scale}, 1) translateY(${yOffset}px)`;
        });
      });

      // --- SUBTEXT ---
      const subtextProgress = Math.max(0, Math.min(1, (cp - 0.35) / 0.25));
      if (subtextEl) {
        subtextEl.style.opacity = String(subtextProgress);
        subtextEl.style.transform = `translateY(${(1 - subtextProgress) * 16}px)`;
      }

      // --- FEATURES ---
      featureEls.forEach((el, fi) => {
        const featureProgress = Math.max(0, Math.min(1, (cp - (0.4 + fi * 0.07)) / 0.2));
        el.style.opacity = String(featureProgress);
        el.style.transform = `translateX(${(1 - featureProgress) * -40}px)`;
      });

      // --- PROGRESS BAR ---
      const fill = stickyRef.current?.querySelector<HTMLElement>('.cs__progress-fill');
      const label = stickyRef.current?.querySelector<HTMLElement>('.cs__progress-label');
      if (fill) fill.style.width = `${cp * 100}%`;
      if (label) label.textContent = `${Math.round(cp * 100)}%`;

      // Sticky opacity
      if (stickyRef.current) {
        stickyRef.current.style.opacity = inView ? '1' : '0';
      }
      const wrapper = stickyRef.current?.querySelector<HTMLElement>('.cs__image-wrapper');
      if (wrapper) wrapper.style.opacity = inView ? '1' : '0';

      rafRef.current = requestAnimationFrame(updateFrame);
    };

    rafRef.current = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(rafRef.current);
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

  const renderChars = (line: string, lineClass: string) => (
    <span className={`cs__headline-line ${lineClass}`} aria-hidden="true">
      {line.split('').map((char, ci) => (
        <span key={ci} className="cs__char">
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );

  return (
    <section ref={sectionRef} className="cs" id="coming-soon-scroll">
      <div ref={stickyRef} className="cs__sticky">

        {/* Ambient Background */}
        <div className="cs__bg">
          <div className="cs__bg-gradient" />
          <div className="cs__bg-gradient--warm" />
          <div className="cs__bg-glow" />
          <div className="cs__bg-grid" />
        </div>

        {/* Corner Accents */}
        <div className="cs__corner cs__corner--tl" aria-hidden="true">
          <div className="cs__corner-line cs__corner-line--h" />
          <div className="cs__corner-line cs__corner-line--v" />
        </div>
        <div className="cs__corner cs__corner--tr" aria-hidden="true">
          <div className="cs__corner-line cs__corner-line--h" />
          <div className="cs__corner-line cs__corner-line--v" />
        </div>
        <div className="cs__corner cs__corner--bl" aria-hidden="true">
          <div className="cs__corner-line cs__corner-line--h" />
          <div className="cs__corner-line cs__corner-line--v" />
        </div>
        <div className="cs__corner cs__corner--br" aria-hidden="true">
          <div className="cs__corner-line cs__corner-line--h" />
          <div className="cs__corner-line cs__corner-line--v" />
        </div>

        {/* Decorative Rings */}
        <div className="cs__ring" aria-hidden="true" />
        <div className="cs__ring cs__ring--inner" aria-hidden="true" />

        {/* Product Image */}
        <div className="cs__image-wrapper">
          <img
            ref={imageRef}
            src={FRAME_PATHS[0]}
            alt="Something Extraordinary is Baking"
            className="cs__image"
          />
        </div>

        {/* Text Content */}
        <div ref={textSectionRef} className="cs__text-section">

          {/* Eyebrow */}
          <div className="cs__eyebrow">
            <span className="cs__eyebrow-dot" />
            <span>Coming Soon</span>
            <span className="cs__eyebrow-dot" />
          </div>

          {/* Main Headline */}
          <div className="cs__headline-wrapper">
            <div className="cs__headline-mask">
              <h2 className="cs__headline" aria-label="Something Extraordinary is Baking">
                {renderChars(HEADLINE_LINE1, 'cs__line-1')}
                {renderChars(HEADLINE_LINE2, 'cs__line-2')}
                {renderChars(HEADLINE_LINE3, 'cs__line-3')}
              </h2>
            </div>
          </div>

          {/* Subtext */}
          <p className="cs__subtext">
            A Sweet Surprise is on Its Way
          </p>

        
        </div>

        
        {/* Bottom Fade */}
        <div className="cs__fade-line" aria-hidden="true" />
      </div>
    </section>
  );
}
