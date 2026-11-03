const original = window.PORTFOLIO_CONTENT;
const clone = value => JSON.parse(JSON.stringify(value));
let draft;
try {
  draft = JSON.parse(localStorage.getItem('pallaviPortfolioDraft')) || clone(original);
} catch {
  draft = clone(original);
}
const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const projectDefaults = { id:'', number:'', title:'', subtitle:'', category:'', summary:'', challenge:'', approach:'', outcome:'', tools:[], thumbnail:'', image:'', link:'' };
draft.projects = (draft.projects || []).map(project => ({...projectDefaults, ...project, tools: Array.isArray(project.tools) ? project.tools : []}));
draft.experience ||= [];
draft.certifications ||= [];
$('#email').value = draft.email || '';
$('#linkedin').value = draft.linkedin || '';
$('#certifications-field').value = draft.certifications.join('\n');
const fields = [
  ['title','Project title'],
  ['subtitle','Subtitle'],
  ['category','Category'],
  ['summary','Short summary'],
  ['challenge','Challenge'],
  ['approach','Approach'],
  ['outcome','Outcome'],
  ['tools','Tools (comma separated)'],
  ['thumbnail','Thumbnail image — shown on project card (e.g. images/orbit-thumbnail.png)'],
  ['image','Case study screenshots — one image path per line (e.g. images/orbit-overview.png)'],
  ['link','Project link (optional)']
];
let selected = 0;
function syncProject() {
  const project = draft.projects[selected];
  if (!project) return;
  document.querySelectorAll('#project-fields [data-field]').forEach(input => {
    project[input.dataset.field] = input.dataset.field === 'tools'
      ? input.value.split(',').map(item => item.trim()).filter(Boolean)
      : input.value;
  });
}
function renderProject() {
  const picker = $('#project-picker');
  picker.innerHTML = draft.projects.map((project, index) => `<option value="${index}">${escapeHTML(project.title)}</option>`).join('');
  picker.value = String(selected);
  const project = draft.projects[selected];
  if (!project) {
    $('#project-fields').innerHTML = '<p>No projects. Add one to begin.</p>';
    return;
  }
  $('#project-fields').innerHTML = fields.map(([key, label]) => {
    const value = key === 'tools' ? (project.tools || []).join(', ') : String(project[key] || '');
    const field = ['summary','challenge','approach','outcome','image'].includes(key)
      ? `<textarea id="f-${key}" data-field="${key}" ${key === 'image' ? 'rows="8"' : ''}>${escapeHTML(value)}</textarea>`
      : `<input id="f-${key}" data-field="${key}" value="${escapeHTML(value)}">`;
    return `<label for="f-${key}">${label}</label>${field}`;
  }).join('');
}
$('#project-picker').addEventListener('change', event => {
  syncProject(); selected = Number(event.target.value); renderProject();
});
$('#add-project').addEventListener('click', () => {
  syncProject();
  draft.projects.push({...projectDefaults, id:'project-'+Date.now(), number:String(draft.projects.length+1).padStart(2,'0'), title:'New Project', category:'PORTFOLIO', tools:[]});
  selected = draft.projects.length - 1;
  renderProject();
});
$('#remove-project').addEventListener('click', () => {
  if (!draft.projects.length || !confirm('Remove this project from your draft?')) return;
  draft.projects.splice(selected, 1);
  selected = Math.max(0, Math.min(selected, draft.projects.length - 1));
  renderProject();
});
renderProject();
function renderExperience() {
  const container = $('#experience-fields');
  container.innerHTML = draft.experience.map((experience, index) => `<div class="panel" data-exp="${index}">
    <label>Role</label><input data-key="role" value="${escapeHTML(experience.role)}">
    <label>Company</label><input data-key="company" value="${escapeHTML(experience.company)}">
    <label>Period</label><input data-key="period" value="${escapeHTML(experience.period)}">
    <label>Details</label><textarea data-key="detail">${escapeHTML(experience.detail)}</textarea>
    <button class="outline" data-remove="${index}">Remove role</button>
  </div>`).join('');
  container.querySelectorAll('[data-key]').forEach(input => input.addEventListener('input', () => {
    draft.experience[Number(input.closest('[data-exp]').dataset.exp)][input.dataset.key] = input.value;
  }));
  container.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => {
    draft.experience.splice(Number(button.dataset.remove), 1);
    renderExperience();
  }));
}
renderExperience();
$('#add-experience').addEventListener('click', () => {
  draft.experience.push({role:'New role', company:'', period:'', detail:''});
  renderExperience();
});
function collect() {
  syncProject();
  draft.email = $('#email').value;
  draft.linkedin = $('#linkedin').value;
  draft.certifications = $('#certifications-field').value.split('\n').map(value => value.trim()).filter(Boolean);
}
$('#save').addEventListener('click', () => {
  collect();
  localStorage.setItem('pallaviPortfolioDraft', JSON.stringify(draft));
  $('#status').textContent = 'Saved in this browser. Not published to GitHub.';
});
$('#download').addEventListener('click', () => {
  collect();
  const text = '/* Portfolio content — exported from the visual editor */\nwindow.PORTFOLIO_CONTENT = ' + JSON.stringify(draft, null, 2) + ';\n';
  const url = URL.createObjectURL(new Blob([text], {type:'text/javascript'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'content.js';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  $('#status').textContent = 'Downloaded content.js. Upload it to GitHub to publish.';
});
$('#reset').addEventListener('click', () => {
  if (!confirm('Discard this browser’s local preview changes?')) return;
  localStorage.removeItem('pallaviPortfolioDraft');
  location.reload();
});
