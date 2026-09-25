// Scroll engine. The story is scroll-driven cinema: we take over the wheel/touch
// and feed `journey.raw` instead of native scrolling (no jank, full control).
// At the end of the journey, native DOM sections (score, worlds, waitlist) scroll
// normally below the canvas.
import { journey } from './journey.js';
import { clamp } from './util.js';

const STORY_END = 0.985; // journey.p at which the DOM acts take over

export function initScroll() {
  let target = 0;

  const setFromRatio = (r) => { target = clamp(r, 0, 1); journey.raw = target * STORY_END; };

  // restore progress across reloads (nice for a long cinematic site)
  const saved = Number(sessionStorage.getItem('sl-progress') || 0);
  if (saved > 0 && saved < 1) {
    journey.raw = saved * STORY_END;
    journey.p = journey.raw;
  }

  const onWheel = (e) => {
    if (!document.body.classList.contains('in-dom')) {
      e.preventDefault();
      // ~100 deltaY per notch → ≈0.7% of the journey per notch (~150 notches total)
      setFromRatio(target + e.deltaY * 0.000072);
    }
  };

  let touchY = 0;
  const onTouchStart = (e) => { touchY = e.touches[0].clientY; };
  const onTouchMove = (e) => {
    if (!document.body.classList.contains('in-dom')) {
      e.preventDefault();
      const dy = touchY - e.touches[0].clientY;
      touchY = e.touches[0].clientY;
      setFromRatio(target + dy * 0.00034);
    }
  };

  const onKey = (e) => {
    if (document.body.classList.contains('in-dom')) return;
    if (['ArrowDown', 'PageDown', ' ', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      setFromRatio(target + 0.012);
    } else if (['ArrowUp', 'PageUp', 'ArrowLeft'].includes(e.key) ) {
      e.preventDefault();
      setFromRatio(target - 0.012);
    }
  };

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: false });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('keydown', onKey);

  // expose a way for the UI to jump the camera to a chapter (nav dots)
  journey.jumpTo = (r) => setFromRatio(r);

  return {
    get ratio() { return target; },
  };
}
