// SnickyLink — waitlist form logic
// Talks to POST /api/waitlist on the same origin (server.js serves this file
// and the API from one Express app, so no base URL/CORS config is needed).

(function () {
  const form = document.getElementById('invite-form');
  if (!form) return;

  const formState = document.getElementById('form-state');
  const successState = document.getElementById('success-state');
  const successMessage = document.getElementById('success-message');
  const successTicket = document.getElementById('success-ticket');
  const errorEl = document.getElementById('form-error');
  const emailInput = document.getElementById('email-input');
  const submitBtn = document.getElementById('invite-submit-btn');
  const submitLabel = document.getElementById('invite-submit-label');

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
    submitLabel.textContent = isLoading ? 'Requesting…' : 'Request Key';
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearError();

    const email = emailInput.value.trim();
    if (!email) {
      showError('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      // Populate the success state with real data from the backend.
      if (successTicket) {
        successTicket.textContent = `COHORT TICKET: #${data.ticket}`;
      }
      if (successMessage && typeof data.position === 'number') {
        successMessage.textContent = `You're #${data.position} in the queue. When your window unlocks, both you and your partner will receive a dual activation link directly to your inbox.`;
      }

      formState.classList.add('hidden');
      successState.classList.remove('hidden');
    } catch (err) {
      showError('Network error — please check your connection and try again.');
      setLoading(false);
    }
  });
})();
