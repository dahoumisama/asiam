// ===== Asiam – interactions =====
document.addEventListener('DOMContentLoaded', () => {

  // AOS scroll animations
  if (window.AOS) {
    AOS.init({ duration: 900, easing: 'ease-out-cubic', once: true, offset: 80 });
  }

  // Navbar scrolled state
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const icon = navToggle.querySelector('i');
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-xmark');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-xmark');
  }));

  // Smooth scroll for anchor links (extra polish above CSS smooth-scroll)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const y = target.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    });
  });

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== RESERVATION MODAL + WHATSAPP =====
  const WA_NUMBER = '212629019075';
  const modal = document.getElementById('reserveModal');
  const form = document.getElementById('reserveForm');
  const errBox = document.getElementById('rf-error');
  const successBox = document.getElementById('rf-success');
  const submitBtn = document.getElementById('rf-submit');

  const openModal = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('rf-name')?.focus(), 200);
  };
  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    resetForm();
  };
  const resetForm = () => {
    form.reset();
    errBox.hidden = true;
    successBox.hidden = true;
    submitBtn.classList.remove('loading');
    form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
  };

  // Open from any .js-reserve button
  document.querySelectorAll('.js-reserve').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openModal();
    });
  });

  // Close handlers
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // Validate + submit
  form.addEventListener('submit', e => {
    e.preventDefault();
    errBox.hidden = true;
    successBox.hidden = true;

    const data = {
      name:    form.name.value.trim(),
      phone:   form.phone.value.trim(),
      date:    form.date.value,
      time:    form.time.value,
      persons: form.persons.value,
      seating: form.seating.value
    };

    // Reset invalid state
    form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

    // Validate
    const missing = [];
    Object.entries(data).forEach(([k, v]) => {
      if (!v) {
        missing.push(k);
        const el = form.querySelector(`[name="${k}"]`);
        if (el) el.classList.add('invalid');
      }
    });
    if (missing.length) {
      errBox.textContent = 'Veuillez remplir tous les champs.';
      errBox.hidden = false;
      return;
    }
    // Phone basic check
    if (!/^[\d\s+()-]{6,}$/.test(data.phone)) {
      form.phone.classList.add('invalid');
      errBox.textContent = 'Numéro de téléphone invalide.';
      errBox.hidden = false;
      return;
    }
    // Persons range
    const p = parseInt(data.persons, 10);
    if (isNaN(p) || p < 1 || p > 20) {
      form.persons.classList.add('invalid');
      errBox.textContent = 'Le nombre de personnes doit être entre 1 et 20.';
      errBox.hidden = false;
      return;
    }

    // Loading state
    submitBtn.classList.add('loading');

    const message =
`Hello Asiam, I would like to reserve a table:

Name: ${data.name}
Phone: ${data.phone}
Date: ${data.date}
Time: ${data.time}
Persons: ${data.persons}
Seating: ${data.seating}`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

    // Brief delay so the loading state is visible, then redirect
    setTimeout(() => {
      successBox.hidden = false;
      window.open(url, '_blank');
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        closeModal();
      }, 1200);
    }, 600);
  });
});
