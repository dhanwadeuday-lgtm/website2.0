// Scroll engine. The story is scroll-driven cinema: we take over the wheel/touch
// and feed `journey.raw` instead of native scrolling (no jank, full control).
// At the end of the journey, native DOM sections (score, worlds, waitlist) scroll
// normally below the canvas — and scrolling back up at their top walks the
// visitor back into the story (the journey is reversible, always).
import { journey } from './journey.js';
import { clamp } from './util.js';

const STORY_END = 0.985; // journey.p at which the DOM acts take over

// The acts live in normal flow, but the page's scroller can be either <html>
// (window.scrollY) or <body> (overflow-x: hidden turns body into a scroll
// container) depending on the browser. Reset both — a stale acts position
// would keep the sections covering the canvas after re-entering the story.
export function resetNativeScroll() {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo(0, 0);
}
export function nativeScrollTop() {
  return Math.max(window.scrollY, document.body.scrollTop, document.documentElement.scrollTop);
}

export function initScroll() {
  let target = 0;

  const setFromRatio = (r) => { target = clamp(r, 0, 1); journey.raw = target * STORY_END; };

  // Leave the DOM acts and re-enter the story. The acts live in normal
  // document flow — without resetting native scroll they keep covering the
  // fixed canvas, so this always scrolls back to the top, then resumes the
  // hijacked scroll from wherever the camera currently is (nudged one step
  // back so the frame loop never immediately re-takes DOM mode).
  const exitDom = (jumpRatio = null) => {
    const wasDom = document.body.classList.contains('in-dom');
    document.body.classList.remove('in-dom');
    document.documentElement.classList.remove('in-dom');
    if (wasDom || nativeScrollTop() > 0) resetNativeScroll();
    const cur = journey.p / STORY_END;
    setFromRatio(jumpRatio === null ? Math.max(0, cur - 0.012) : jumpRatio);
  };
  journey.exitDom = exitDom; // used by overlay: brand chip, rail dots, finale CTAs

  // restore progress across reloads (nice for a long cinematic site)
  const saved = Number(sessionStorage.getItem('sl-progress') || 0);
  if (saved > 0 && saved < 1) {
    journey.raw = saved * STORY_END;
    journey.p = journey.raw;
  }

  const inDom = () => document.body.classList.contains('in-dom');
  // Typing in the waitlist/pairing inputs must never move the camera — the
  // space/arrow keys belong to the text field on phones and desktop alike.
  const typing = () => {
    const el = document.activeElement;
    return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');
  };

  const onWheel = (e) => {
    if (inDom()) {
      // at the very top of the acts, scrolling up returns to the story
      if (e.deltaY < 0 && nativeScrollTop() <= 2) { e.preventDefault(); exitDom(); }
      return; // otherwise the acts scroll natively
    }
    e.preventDefault();
    // ~100 deltaY per notch → ≈1.5% of the journey per notch (~66 notches total)
    setFromRatio(target + e.deltaY * 0.00015);
  };

  let touchY = 0;
  const onTouchStart = (e) => { touchY = e.touches[0].clientY; };
  const onTouchMove = (e) => {
    const dy = touchY - e.touches[0].clientY;
    touchY = e.touches[0].clientY;
    if (inDom()) {
      if (dy < 0 && nativeScrollTop() <= 2) { e.preventDefault(); exitDom(); }
      return;
    }
    e.preventDefault();
    setFromRatio(target + dy * 0.00045);
  };

  const onKey = (e) => {
    if (typing()) return;
    if (inDom()) {
      if (['ArrowUp', 'PageUp', 'ArrowLeft'].includes(e.key) && nativeScrollTop() <= 2) {
        e.preventDefault(); exitDom();
      }
      return;
    }
    if (['ArrowDown', 'PageDown', ' ', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      setFromRatio(target + 0.018);
    } else if (['ArrowUp', 'PageUp', 'ArrowLeft'].includes(e.key) ) {
      e.preventDefault();
      setFromRatio(target - 0.018);
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
