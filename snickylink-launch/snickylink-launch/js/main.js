// SnickyLink — registration + snick lock/unlock mechanism
//
// Rule: every "snick" section (Today's Resonance Arc + the 4-card Co-Op
// Arcade) stays visually locked (blurred, non-interactive) until the
// visitor registers via the Duo Pair Key form. Registration POSTs to
// /api/waitlist (same Vercel serverless backend used elsewhere on this
// project). Once registration succeeds, the lock is lifted with a soft
// "bloom" reveal and the unlocked state is remembered in localStorage
// so a returning registered visitor doesn't see the lock again.

(function () {
  const STORAGE_KEY = 'snickylink_registered';
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const lockedSectionIds = ['daily-arc', 'coop-arcade'];

  function getLockedSections() {
    return lockedSectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
  }

  function unlockSnicks(withBloom) {
    getLockedSections().forEach((section) => {
      section.classList.add('snick-unlocked');
      if (withBloom) {
        const target = section.querySelector('.snick-lock-target');
        if (target) {
          target.classList.add('snick-bloom');
        }
      }
    });
  }

  // Restore unlocked state for a returning registered visitor.
  function restoreRegisteredState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        unlockSnicks(false);
      }
    } catch (e) {
      // localStorage unavailable — fail silently, sections stay locked.
    }
  }

  window.scrollToRegister = function scrollToRegister() {
    const target = document.getElementById('request-duo-key');
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const firstInput = document.getElementById('player1-email');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 400);
    }
  };

  function initDuoKeyForm() {
    const form = document.getElementById('duo-key-form');
    if (!form) return;

    const p1Input = document.getElementById('player1-email');
    const p2Input = document.getElementById('player2-email');
    const errorEl = document.getElementById('duo-key-error');
    const submitBtn = document.getElementById('duo-key-submit-btn');
    const submitLabel = document.getElementById('duo-key-submit-label');
    const successMsg = document.getElementById('key-success-msg');

    function showError(message) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
    }
    function clearError() {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
    function setLoading(isLoading) {
      submitBtn.disabled = isLoading;
      submitBtn.style.opacity = isLoading ? '0.6' : '1';
      submitLabel.textContent = isLoading
        ? 'Pairing…'
        : 'PRESS TO PAIR // REQUEST DUO KEY 🗝️';
    }

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      clearError();

      const email = p1Input.value.trim();
      const partnerEmail = p2Input.value.trim();

      if (!email || !partnerEmail) {
        showError('Please enter both Player 1 and Player 2 email addresses.');
        return;
      }
      if (!EMAIL_REGEX.test(email) || !EMAIL_REGEX.test(partnerEmail)) {
        showError('Please enter two valid email addresses.');
        return;
      }
      if (email.toLowerCase() === partnerEmail.toLowerCase()) {
        showError('Player 1 and Player 2 emails must be different.');
        return;
      }

      setLoading(true);

      try {
        const response = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, partnerEmail }),
        });
        const data = await response.json();

        if (!response.ok) {
          showError(data.error || 'Something went wrong. Please try again.');
          setLoading(false);
          return;
        }

        // Persist registration so a returning visitor stays unlocked.
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ ticket: data.ticket, position: data.position })
          );
        } catch (e) {
          /* localStorage unavailable, ignore */
        }

        if (successMsg) {
          successMsg.textContent =
            typeof data.position === 'number' && data.ticket
              ? `✨ Duo Pair Key #${data.ticket} dispatched to both inboxes! You're #${data.position} in the Evening Cohort. When you both tap within 10 minutes, the Dusk Portal synchronizes.`
              : '✨ Duo Pair Key dispatched to both inboxes! When you both tap within 10 minutes, the Dusk Portal synchronizes.';
          successMsg.classList.remove('hidden');
        }

        setLoading(false);
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

        // Unseal every snick on the page with a soft bloom reveal.
        unlockSnicks(true);

        // Let the visitor see their snicks unlock.
        setTimeout(() => {
          const daily = document.getElementById('daily-arc');
          if (daily) daily.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 600);
      } catch (err) {
        showError('Network error — please check your connection and try again.');
        setLoading(false);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    restoreRegisteredState();
    initDuoKeyForm();
  });
})();
