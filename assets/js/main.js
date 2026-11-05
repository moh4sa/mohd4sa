(function () {
  'use strict';

  var EMAILJS_PUBLIC_KEY = 'mn6MdiuVv7X7O_ZRu';
  var EMAILJS_SERVICE_ID = 'default_service';
  var EMAILJS_TEMPLATE_ID = 'template_pq3b2gk';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.getElementById('year').textContent = new Date().getFullYear();

  // ---------- Typewriter ----------
  var typed = document.querySelector('.typed');
  if (typed && !reduceMotion) {
    var words = typed.dataset.words.split('|');
    var wordIndex = 0;
    var charIndex = words[0].length;
    var deleting = true;

    var tick = function () {
      var word = words[wordIndex];
      charIndex += deleting ? -1 : 1;
      typed.textContent = word.slice(0, charIndex);

      var delay = deleting ? 45 : 90;
      if (!deleting && charIndex === word.length) {
        deleting = true;
        delay = 2200;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 400;
      }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2500);
  }

  // ---------- Contact dialog ----------
  var dialog = document.getElementById('contact');
  var form = document.getElementById('contact-form');
  var submit = document.getElementById('contact-submit');
  var status = document.getElementById('contact-status');
  var submitLabel = submit.textContent;

  var setStatus = function (message, state) {
    status.textContent = message;
    status.dataset.state = state || '';
  };

  var openContact = function () {
    setStatus('');
    dialog.showModal();
    form.querySelector('input').focus();
  };

  document.querySelectorAll('[data-open-contact]').forEach(function (el) {
    el.addEventListener('click', openContact);
  });

  // Allow linking straight to the form: https://…/#contact
  if (window.location.hash === '#contact') openContact();

  document.querySelectorAll('[data-close-contact]').forEach(function (el) {
    el.addEventListener('click', function () {
      dialog.close();
    });
  });

  // Close when clicking the backdrop
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) dialog.close();
  });

  form.addEventListener('input', function (event) {
    if (event.target.getAttribute('aria-invalid') === 'true' && event.target.checkValidity()) {
      event.target.removeAttribute('aria-invalid');
    }
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var fields = Array.prototype.slice.call(form.querySelectorAll('input[required], textarea[required]'));
    var firstInvalid = null;
    fields.forEach(function (field) {
      var valid = field.value.trim() !== '' && field.checkValidity();
      field.setAttribute('aria-invalid', valid ? 'false' : 'true');
      if (!valid && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      setStatus('Please fill in all fields with a valid email address.', 'error');
      firstInvalid.focus();
      return;
    }

    // Honeypot filled in: pretend success, send nothing
    if (form.elements.company.value) {
      form.reset();
      setStatus('Thanks! Your message has been sent.', 'success');
      return;
    }

    if (!window.emailjs) {
      setStatus('The mail service could not be loaded. Please try again later.', 'error');
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Sending…';
    setStatus('');

    window.emailjs
      .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, { publicKey: EMAILJS_PUBLIC_KEY })
      .then(function () {
        form.reset();
        fields.forEach(function (field) { field.removeAttribute('aria-invalid'); });
        setStatus('Thanks! Your message has been sent. I\'ll be in touch soon.', 'success');
      }, function (err) {
        console.error('EmailJS error:', err);
        setStatus('Sorry, something went wrong. Please try again in a moment.', 'error');
      })
      .then(function () {
        submit.disabled = false;
        submit.textContent = submitLabel;
      });
  });
})();
