
/*
  PALLAVI NAIR SM — INTERACTIVE CERTIFICATE GALLERY
  Complete replacement for certificates.js
  Works with the existing index.html, style.css,
  certificates.css, content.js and script.js.
*/

(() => {
  'use strict';

  const target = document.getElementById('certifications');
  if (!target) return;

  // Safely display text inside HTML.
  const esc = value =>
    String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));

  // Read existing portfolio certifications.
  function getCertifications() {
    try {
      const saved = localStorage.getItem('pallaviPortfolioDraft');

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.certifications)) {
          return parsed.certifications;
        }
      }
    } catch (error) {
      console.warn('Could not load local certifications.', error);
    }

    return Array.isArray(window.PORTFOLIO_CONTENT?.certifications)
      ? window.PORTFOLIO_CONTENT.certifications
      : [];
  }

  const raw = getCertifications();

  // Image filenames must match the GitHub images folder.
  const certificateImages = {
    pl300: 'images/pl300.png',
    ibm: 'images/ibm.png',
    anthropic: 'images/anthropic.png',
    topGraduate: 'images/top-graduate-award.jpg'
  };

  // Identify the certificates that already have images.
  function getImageForCertificate(name) {
    const text = String(name || '').toLowerCase();

    if (
      text.includes('pl-300') ||
      text.includes('power bi data analyst')
    ) {
      return certificateImages.pl300;
    }

    if (text.includes('data science 101')) {
      return certificateImages.ibm;
    }

    if (text.includes('ai fluency')) {
      return certificateImages.anthropic;
    }

    if (text.includes('top graduate')) {
      return certificateImages.topGraduate;
    }

    return '';
  }

  // Convert saved certifications into gallery entries.
  const entries = [
    {
      name: 'Top Graduate Award',
      issuer: 'University of Wollongong in Dubai',
      image: certificateImages.topGraduate,
      featured: true
    },

    ...raw
      .map(item => {
        if (typeof item === 'string') {
          return {
            name: item,
            issuer: 'Professional learning',
            image: getImageForCertificate(item),
            featured: false
          };
        }

        const name = item?.title || item?.name || 'Certification';

        return {
          name: name,
          issuer: item?.issuer || 'Professional learning',
          image:
            item?.image ||
            item?.certificate ||
            getImageForCertificate(name),
          featured: false
        };
      })
      .filter(entry =>
        !entry.name.toLowerCase().includes('top graduate')
      )
  ];

  // Make the certification gallery.
  target.classList.remove('chips');
  target.classList.add('certificate-gallery-grid');

  target.innerHTML = entries.map((entry, index) => `
    <button
      type="button"
      class="certificate-gallery-card"
      data-cert-index="${index}"
      aria-label="View ${esc(entry.name)} certificate"
    >
      <span
        class="certificate-gallery-symbol"
        aria-hidden="true"
      >
        ${entry.featured ? '✦' : '◈'}
      </span>

      <span class="certificate-gallery-copy">
        <strong>${esc(entry.name)}</strong>
        <small>${esc(entry.issuer)}</small>
        <span class="certificate-gallery-action">
          View certificate ↗
        </span>
      </span>
    </button>
  `).join('');

  // Create the certificate popup.
  const dialog = document.createElement('dialog');

  dialog.className = 'certificate-preview-dialog';
  dialog.setAttribute('aria-label', 'Certificate preview');

  document.body.appendChild(dialog);

  // Open the selected certificate.
  function showCertificate(entry) {
    let preview;

    if (entry.image) {
      preview = `
        <img
          src="${esc(entry.image)}"
          alt="Certificate: ${esc(entry.name)}"
          draggable="false"
        >

        <p class="certificate-preview-empty" hidden>
          Preview image not found.
          Check the filename in your GitHub images folder.
        </p>
      `;
    } else {
      preview = `
        <div class="certificate-preview-empty">
          <span>✦</span>
          <p>Certificate preview coming soon</p>
          <small>
            This certificate will be available for viewing soon.
          </small>
        </div>
      `;
    }

    dialog.innerHTML = `
      <div class="certificate-preview-head">
        <div>
          <span class="certificate-preview-kicker">
            CERTIFICATE VIEWER
          </span>

          <h2>${esc(entry.name)}</h2>
          <p>${esc(entry.issuer)}</p>
        </div>

        <button
          type="button"
          class="certificate-preview-close"
          aria-label="Close certificate"
        >
          ×
        </button>
      </div>

      <div class="certificate-preview-body">
        ${preview}
      </div>

      <p class="certificate-preview-note">
        Portfolio preview · No download button provided
      </p>
    `;

    // Close button.
    dialog
      .querySelector('.certificate-preview-close')
      .addEventListener('click', () => dialog.close());

    // Handle missing certificate images.
    const image = dialog.querySelector(
      '.certificate-preview-body img'
    );

    if (image) {
      image.addEventListener('error', () => {
        image.hidden = true;

        const message = image.nextElementSibling;
        if (message) message.hidden = false;
      });

      // Discourage ordinary right-click saving.
      image.addEventListener('contextmenu', event => {
        event.preventDefault();
      });

      image.addEventListener('dragstart', event => {
        event.preventDefault();
      });
    }

    dialog.showModal();
  }

  // Open the correct certificate when a card is clicked.
  target.addEventListener('click', event => {
    const button = event.target.closest('[data-cert-index]');
    if (!button) return;

    const index = Number(button.dataset.certIndex);
    const entry = entries[index];

    if (entry) showCertificate(entry);
  });

  // Close popup when clicking outside its content.
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  // Make the two featured achievement cards clickable.
  const featuredCards = document.querySelectorAll(
    '.achievement-grid .award'
  );

  featuredCards.forEach((card, index) => {
    const match = index === 0
      ? entries.find(entry =>
          entry.name.toLowerCase().includes('top graduate')
        )
      : entries.find(entry =>
          entry.name.toLowerCase().includes('pl-300') ||
          entry.name.toLowerCase().includes('power bi data analyst')
        );

    if (!match) return;

    card.style.cursor = 'pointer';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute(
      'aria-label',
      `View ${match.name} certificate`
    );

    card.addEventListener('click', () => {
      showCertificate(match);
    });

    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showCertificate(match);
      }
    });
  });

})();
