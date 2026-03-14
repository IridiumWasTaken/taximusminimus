const revealNodes = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: '0px 0px -9% 0px',
  }
);

revealNodes.forEach((node) => observer.observe(node));

const floatCards = document.querySelectorAll('.float-card');

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

floatCards.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const rotateY = clamp((x - 0.5) * 4.4, -4.4, 4.4);
    const rotateX = clamp((0.5 - y) * 3.6, -3.6, 3.6);

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

const contactForm = document.querySelector('#contact-form');
const formNote = document.querySelector('#form-note');

if (contactForm && formNote) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const topic = String(formData.get('topic') || '').trim();
    const message = String(formData.get('message') || '').trim();

    const subject = `Erstgespräch: ${topic}`;
    const body = [
      'Neue Anfrage über die Website von Taximus Minimus',
      '',
      `Name: ${name}`,
      `E-Mail: ${email}`,
      `Telefon: ${phone || 'nicht angegeben'}`,
      `Thema: ${topic}`,
      '',
      'Anliegen:',
      message,
    ].join('\n');

    formNote.textContent = 'Ihr Mailprogramm wird geöffnet und die Anfrage vorbereitet.';
    window.location.href = `mailto:intro@taximusminimus.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
