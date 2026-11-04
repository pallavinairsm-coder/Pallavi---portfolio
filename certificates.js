
/*
  PALLAVI NAIR SM — INTERACTIVE CERTIFICATE GALLERY
  Complete replacement for certificates.js

  Compatible with:
  index.html, style.css, certificates.css,
  content.js and script.js.
*/

(() => {
  'use strict';

  const target = document.getElementById('certifications');
  if (!target) return;

  // Escape text safely before inserting into HTML.
  const esc = value =>
    String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));

  // Certificate details and image filenames.
  // All images belong inside the images/ folder.
  const certificates = [
    {
      name: 'Top Graduate Award',
      issuer: 'University of Wollongong in Dubai',
      image: 'images/top-graduate-award.jpg',
      featured: true,
      keywords: ['top graduate']
    },
    {
      name: 'Microsoft Certified: Power BI Data Analyst Associate (PL-300)',
      issuer: 'Microsoft',
      image: 'images/pl300.png',
      keywords: ['pl-300', 'power bi data analyst']
    },
    {
      name: 'IBM – Data Science 101',
      issuer: 'IBM / Cognitive Class',
      image: 'images/ibm.png',
      keywords: ['data science 101']
    },
    {
      name: 'Anthropic – AI Fluency: Framework & Foundations',
      issuer: 'Anthropic',
      image: 'images/anthropic.png',
      keywords: ['ai fluency']
    },
    {
      name: 'McKinsey Forward Program',
      issuer: 'McKinsey.org',
      image: 'images/mckinsey.png',
      keywords: ['mckinsey']
    },
    {
      name: 'Deloitte Australia – Data Analytics Job Simulation',
      issuer: 'Deloitte / Forage',
      image: 'images/deloitte.png',
      keywords: ['deloitte']
    },
    {
      name: 'Microsoft Azure AI Essentials',
      issuer: 'LinkedIn Learning',
      image: 'images/azure-ai.png',
      keywords: ['azure ai', 'azure essentials']
    },
    {
      name: 'Sirocco Group – Marketing Automation Certificate',
      issuer: 'Sirocco Group',
      image: 'images/sirocco.png',
      keywords: ['sirocco', 'marketing automation']
    },
    {
      name: 'Udemy – SAP S/4HANA',
      issuer: 'Udemy',
      image: 'images/sap.png',
      keywords: ['sap s/4hana', 'sap s4', 's/4hana']
    }
  ];

  // Load any additional certificates saved in the portfolio.
  function getSavedCertifications() {
    try {
      const saved = localStorage.getItem('pallaviPortfolioDraft');

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed.certifications)) {
          return parsed.certifications;
        }
      }
    } catch (error) {
      console.warn('Unable to read saved certifications.', error);
    }

    return Array.isArray(window.PORTFOLIO_CONTENT?.certifications)
      ? window.PORTFOLIO_CONTENT.certifications
      : [];
  }

  const raw = getSavedCertifications();

  // Start with the nine certificates listed above.
  const entries = certificates.map(cert => ({
    name: cert.name,
    issuer: cert.issuer,
    image: cert.image,
    featured: Boolean(cert.featured),
    keywords: cert.keywords
  }));

  // Add other certifications without creating duplicates.
  raw.forEach(item => {
    const name = typeof item === 'string'
      ? item
      : item?.title || item?.name || '';

    if (!name) return;

    const normalizedName = name.toLowerCase();

    const alreadyExists = entries.some(entry => {
      const sameName =
        entry.name.toLowerCase() === normalizedName;

      const keywordMatch = entry.keywords.some(keyword =>
        normalizedName.includes(keyword)
      );

      return sameName || keywordMatch;
    });

    if (alreadyExists) return;

    entries.push({
      name: name,
      issuer: typeof item === 'string'
        ? 'Professional learning'
        : item?.issuer || 'Professional learning',
      image: typeof item === 'string'
        ? ''
        : item?.image || item?.certificate || '',
      featured: false,
      keywords: []
    });
  });

  // Build the certificate gallery.
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

  // Create the certificate preview popup.
  const dialog = document.createElement('dialog');

  dialog.className = 'certificate-preview-dialog';
  dialog.setAttribute('aria-label', 'Certificate preview');

  document.body.appendChild(dialog);

  // Display a certificate inside the popup.
  function showCertificate(entry) {
    let preview = '';

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

    // Close popup button.
    const closeButton = dialog.querySelector(
      '.certificate-preview-close'
    );

    closeButton.addEventListener('click', () => {
      dialog.close();
    });

    // Handle certificate image errors.
    const image = dialog.querySelector(
      '.certificate-preview-body img'
    );

    if (image) {
      image.addEventListener('error', () => {
        image.style.display = 'none';

        const message = image.nextElementSibling;

        if (message) {
          message.hidden = false;
        }
      });

      // Disable normal right-click image menu.
      image.addEventListener('contextmenu', event => {
        event.preventDefault();
      });

      // Disable normal image dragging.
      image.addEventListener('dragstart', event => {
        event.preventDefault();
      });
    }

    dialog.showModal();
  }

  // Open the selected certificate.
  target.addEventListener('click', event => {
    const button = event.target.closest('[data-cert-index]');

    if (!button) return;

    const index = Number(button.dataset.certIndex);
    const entry = entries[index];

    if (entry) {
      showCertificate(entry);
    }
  });

  // Close popup when clicking outside its contents.
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  // Make existing featured achievement cards clickable.
  const featuredCards = document.querySelectorAll(
    '.achievement-grid .award'
  );

  featuredCards.forEach((card, index) => {
    const match = index === 0
      ? entries.find(entry =>
          entry.name.toLowerCase().includes('top graduate')
        )
      : entries.find(entry =>
          entry.name.toLowerCase().includes('pl-300')
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
