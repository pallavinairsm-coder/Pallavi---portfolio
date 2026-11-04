/* Interactive certificate gallery for Pallavi portfolio.
   Works with existing content.js and script.js without editing either. */
(() => {
  'use strict';
  const target = document.getElementById('certifications');
  if (!target) return;
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const raw = (() => {
    try { return JSON.parse(localStorage.getItem('pallaviPortfolioDraft'))?.certifications || window.PORTFOLIO_CONTENT?.certifications || []; }
    catch { return window.PORTFOLIO_CONTENT?.certifications || []; }
  })();
  const entries = [
    {name:'Top Graduate Award', issuer:'University of Wollongong in Dubai', image:'images/top-graduate-award.jpg', featured:true},
    ...raw.map(item => typeof item === 'string' ? {name:item, issuer:'Certificate of completion', image:''} : ({name:item.title || item.name || 'Certification', issuer:item.issuer || 'Professional learning', image:item.image || item.certificate || ''}))
  ];
  const existing = document.querySelector('.achievement-grid');
  if (existing) existing.setAttribute('aria-label', 'Featured achievements');
  target.classList.remove('chips');
  target.classList.add('certificate-gallery-grid');
  target.innerHTML = entries.map((entry, i) => `<button type="button" class="certificate-gallery-card" data-cert-index="${i}" aria-label="View ${esc(entry.name)} certificate"><span class="certificate-gallery-symbol" aria-hidden="true">${entry.featured ? '✦' : '◈'}</span><span class="certificate-gallery-copy"><strong>${esc(entry.name)}</strong><small>${esc(entry.issuer)}</small><span class="certificate-gallery-action">View certificate ↗</span></span></button>`).join('');
  const dialog = document.createElement('dialog');
  dialog.className = 'certificate-preview-dialog';
  dialog.setAttribute('aria-label','Certificate preview');
  document.body.appendChild(dialog);
  const show = entry => {
    dialog.innerHTML = `<div class="certificate-preview-head"><div><span class="certificate-preview-kicker">CERTIFICATE VIEWER</span><h2>${esc(entry.name)}</h2><p>${esc(entry.issuer)}</p></div><button type="button" class="certificate-preview-close" aria-label="Close certificate">×</button></div><div class="certificate-preview-body">${entry.image ? `<img src="${esc(entry.image)}" alt="Certificate: ${esc(entry.name)}" draggable="false" onerror="this.style.display='none';this.nextElementSibling.hidden=false"><p class="certificate-preview-empty" hidden>Preview image not found. Check the image filename in certificates.js.</p>` : `<div class="certificate-preview-empty"><span>✦</span><p>Certificate preview coming soon</p><small>Add the certificate image path in certificates.js when you're ready.</small></div>`}</div><p class="certificate-preview-note">Portfolio preview · No download button provided</p>`;
    dialog.querySelector('.certificate-preview-close').addEventListener('click', () => dialog.close());
    dialog.querySelectorAll('img').forEach(img => img.addEventListener('contextmenu', e => e.preventDefault()));
    dialog.showModal();
  };
  target.addEventListener('click', e => {
    const button = e.target.closest('[data-cert-index]');
    if (!button) return;
    const entry = entries[Number(button.dataset.certIndex)];
    if (entry) show(entry);
  });
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
})();
