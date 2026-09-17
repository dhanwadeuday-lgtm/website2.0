// SnickyLink — waitlist form logic
// Talks to POST /api/waitlist on the same origin (Vercel serverless
// function under /api), so no base URL/CORS config is needed.

(function () {
  const form = document.getElementById('invite-form');
  if (!form) return;

  const formState = document.getElementById('form-state');
  const successState = document.getElementById('success-state');
  const successMessage = document.getElementById('success-message');
  const successTicket = document.getElementById('success-ticket');
  const errorEl = document.getElementById('form-error');
  const selfInput = document.getElementById('email-self');
  const partnerInput = document.getElementById('email-partner');
  const submitBtn = document.getElementById('invite-submit-btn');
  const submitLabel = document.getElementById('invite-submit-label');

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    submitLabel.textContent = isLoading ? 'Requesting…' : 'Request Duo Cryptographic Key';
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearError();

    const email = (selfInput ? selfInput.value : '').trim();
    const partnerEmail = (partnerInput ? partnerInput.value : '').trim();

    if (!email || !partnerEmail) {
      showError('Please enter both your email and your partner\u2019s email.');
      return;
    }
    if (!EMAIL_REGEX.test(email) || !EMAIL_REGEX.test(partnerEmail)) {
      showError('Please enter two valid email addresses.');
      return;
    }
    if (email.toLowerCase() === partnerEmail.toLowerCase()) {
      showError('Your email and your partner\u2019s email must be different.');
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

      // Populate the success state with real data from the backend.
      if (successTicket && data.ticket) {
        successTicket.textContent = `PAIR TICKET: #${data.ticket}`;
      }
      if (successMessage && typeof data.position === 'number') {
        successMessage.textContent = `Both email addresses have been queued for Cohort 04 \u2014 you're #${data.position} in line. When the portal opens, you both will receive dual activation tokens simultaneously.`;
      }

      formState.classList.add('hidden');
      successState.classList.remove('hidden');
    } catch (err) {
      showError('Network error — please check your connection and try again.');
      setLoading(false);
    }
  });
})();
