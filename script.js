const DEFAULT = window.PORTFOLIO_CONTENT;
function getContent() {
  try {
    const saved = localStorage.getItem('pallaviPortfolioDraft');
    return saved ? JSON.parse(saved) : DEFAULT;
  } catch { return DEFAULT; }
}
const data = getContent();
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const screenshots = project => String(project.image || '').split(/\r?\n/).map(value => value.trim()).filter(Boolean);
const thumbnail = project => String(project.thumbnail || '').trim() || screenshots(project)[0] || '';
const grid = document.querySelector('#project-grid');
if (grid) grid.innerHTML = (data.projects || []).map((project, index) => {
  const cover = thumbnail(project);
  return `<button class="project-card" data-project="${esc(project.id)}">
    <div class="project-art">${cover
      ? `<img src="${esc(cover)}" alt="${esc(project.title)} thumbnail" loading="lazy">`
      : `<span>${esc(project.number || String(index+1).padStart(2,'0'))} / ${esc(project.category)}</span><strong>${esc(String(project.title).slice(0,2).toUpperCase())}</strong>`}</div>
    <div class="project-meta"><span>${esc(project.category)}</span><span>↗</span></div>
    <h3>${esc(project.title)}</h3><p class="project-subtitle">${esc(project.subtitle)}</p><p>${esc(project.summary)}</p>
    <div class="tags">${(project.tools || []).slice(0,4).map(tool => `<span>${esc(tool)}</span>`).join('')}</div>
    <span class="read-more">View case study →</span>
  </button>`;
}).join('');
const experience = document.querySelector('#experience-list');
if (experience) experience.innerHTML = (data.experience || []).map(item => `<article class="timeline-row"><span>${esc(item.period)}</span><div><h3>${esc(item.role)}</h3><p>${esc(item.company)} · ${esc(item.detail)}</p></div><span>↗</span></article>`).join('');
const certifications = document.querySelector('#certifications');
if (certifications) certifications.innerHTML = (data.certifications || []).map(item => `<span>${esc(item)}</span>`).join('');
const email = document.querySelector('#email-link');
if (email) email.href = 'mailto:' + encodeURIComponent(data.email || '');
const linkedin = document.querySelector('#linkedin-link');
if (linkedin) linkedin.href = data.linkedin || '#';
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
const modal = document.querySelector('#project-modal');
let activePictures = [], activeIndex = 0;
function showPicture(index) {
  if (!activePictures.length) return;
  activeIndex = (index + activePictures.length) % activePictures.length;
  const image = document.querySelector('#gallery-main-image');
  if (image) {
    image.src = activePictures[activeIndex];
    image.alt = `Dashboard screenshot ${activeIndex+1} of ${activePictures.length}`;
  }
  const counter = document.querySelector('#gallery-counter');
  if (counter) counter.textContent = `${activeIndex+1} / ${activePictures.length}`;
  document.querySelectorAll('[data-gallery-thumb]').forEach((button, index) => {
    button.setAttribute('aria-pressed', String(index === activeIndex));
    button.style.borderColor = index === activeIndex ? '#79b7ff' : '#365474';
  });
}
function openFullImage() {
  if (!activePictures.length) return;
  const overlay = document.createElement('div');
  overlay.id = 'portfolio-image-lightbox';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(2,9,22,.96);display:flex;align-items:center;justify-content:center;padding:48px 18px;cursor:zoom-out';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-label','Enlarged screenshot');
  overlay.innerHTML = `<button type="button" aria-label="Close enlarged screenshot" style="position:absolute;right:20px;top:12px;background:#18314c;color:white;border:1px solid #587493;border-radius:8px;padding:9px 14px;cursor:pointer;font-size:18px">✕</button><img src="${esc(activePictures[activeIndex])}" alt="Enlarged dashboard screenshot" style="max-width:100%;max-height:90vh;object-fit:contain;cursor:zoom-out">`;
  overlay.addEventListener('click', () => overlay.remove());
  document.body.appendChild(overlay);
  overlay.querySelector('button').focus();
}
grid?.addEventListener('click', event => {
  const card = event.target.closest('[data-project]');
  if (!card || !modal) return;
  const project = (data.projects || []).find(item => item.id === card.dataset.project);
  if (!project) return;
  activePictures = screenshots(project);
  activeIndex = 0;
  const gallery = activePictures.length ? `<div class="portfolio-gallery" style="margin:20px 0">
    <img id="gallery-main-image" src="${esc(activePictures[0])}" alt="Dashboard screenshot 1" style="display:block;width:100%;max-height:480px;object-fit:contain;border-radius:12px;background:#071426;border:1px solid #365474;cursor:zoom-in" title="Click to enlarge">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin:12px 0">
      <button type="button" id="gallery-prev" style="padding:9px 14px;border-radius:8px;border:1px solid #365474;background:#18314c;color:white;cursor:pointer">← Previous</button>
      <span id="gallery-counter">1 / ${activePictures.length}</span>
      <button type="button" id="gallery-next" style="padding:9px 14px;border-radius:8px;border:1px solid #365474;background:#18314c;color:white;cursor:pointer">Next →</button>
    </div>
    <div style="display:flex;gap:8px;overflow-x:auto;padding:5px 0">${activePictures.map((source,index) => `<button type="button" data-gallery-thumb="${index}" aria-label="Show screenshot ${index+1}" aria-pressed="${index===0}" style="flex:0 0 94px;border:2px solid ${index===0?'#79b7ff':'#365474'};border-radius:7px;background:#08172b;padding:3px;cursor:pointer"><img src="${esc(source)}" alt="Screenshot ${index+1} thumbnail" loading="lazy" style="display:block;width:100%;height:54px;object-fit:cover;border-radius:4px"></button>`).join('')}</div>
    <p style="font-size:12px;opacity:.75">Click the main screenshot to enlarge. This is a visual preview, not a live Power BI report.</p>
  </div>` : '';
  const detail = document.querySelector('#project-detail');
  if (!detail) return;
  detail.innerHTML = `<span class="kicker">${esc(project.category)}</span><h2>${esc(project.title)}</h2><h3>${esc(project.subtitle)}</h3>${gallery}
    <p class="detail-summary">${esc(project.summary)}</p><h4>The challenge</h4><p>${esc(project.challenge)}</p>
    <h4>My approach</h4><p>${esc(project.approach)}</p><h4>Outcome</h4><p>${esc(project.outcome)}</p>
    <div class="tags">${(project.tools || []).map(tool => `<span>${esc(tool)}</span>`).join('')}</div>
    ${project.link ? `<p><a class="button secondary" href="${esc(project.link)}" target="_blank" rel="noopener noreferrer">View project ↗</a></p>` : ''}`;
  modal.showModal();
  document.querySelector('#gallery-prev')?.addEventListener('click', () => showPicture(activeIndex - 1));
  document.querySelector('#gallery-next')?.addEventListener('click', () => showPicture(activeIndex + 1));
  document.querySelectorAll('[data-gallery-thumb]').forEach(button => button.addEventListener('click', () => showPicture(Number(button.dataset.galleryThumb))));
  document.querySelector('#gallery-main-image')?.addEventListener('click', openFullImage);
});
document.querySelector('#close-modal')?.addEventListener('click', () => modal.close());
modal?.addEventListener('click', event => { if (event.target === modal) modal.close(); });
