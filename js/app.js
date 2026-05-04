// ── MAIN APP CONTROLLER ──────────────────────────────
let currentSuggestion = null;
let currentRating = 0;

// ── INIT ──────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  await initDB();
  hideSplash();
});

function hideSplash() {
  setTimeout(() => {
    const splash = document.getElementById('splash');
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.style.display = 'none';
      // Check session
      if (restoreSession()) {
        enterApp();
      } else {
        document.getElementById('auth-screen').classList.remove('hidden');
      }
    }, 600);
  }, 2200);
}

async function enterApp() {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');

  // Set user info
  document.getElementById('user-badge').textContent = currentUser.username.split(' ')[0];
  document.getElementById('profile-avatar').textContent = currentUser.username.charAt(0).toUpperCase();
  document.getElementById('profile-name-display').textContent = currentUser.username;
  document.getElementById('profile-email-display').textContent = currentUser.email;

  // Render categories
  renderCategories();

  // Load settings
  await loadApiSettings();

  // Dark mode
  const dark = await dbGetSetting('dark_mode');
  if (dark) { document.documentElement.setAttribute('data-dark', 'true'); document.getElementById('dark-mode-toggle').checked = true; }

  navTo('home');
}

// ── NAVIGATION ─────────────────────────────────────────
function navTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.page === page);
  });
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');

  if (page === 'favourites') loadFavourites();
  if (page === 'analytics') renderCharts();
  if (page === 'settings') loadApiSettings();
}

// ── CATEGORIES ────────────────────────────────────────
function renderCategories() {
  const grid = document.getElementById('categories-grid');
  grid.innerHTML = MATERIALS.map(m => `
    <div class="cat-card" onclick="browseCategory(${m.id})" style="border-top: 3px solid ${m.color}">
      <div class="cat-emoji">${m.emoji}</div>
      <div class="cat-name">${m.name.split(' ')[0]}</div>
    </div>`).join('');
}

async function browseCategory(materialId) {
  const mat = getMaterial(materialId);
  const suggestions = getSuggestionsByMaterial(materialId);
  const savedIds = await dbGetSavedIds(currentUser.userId);

  const panel = document.getElementById('result-panel');
  panel.classList.remove('hidden');

  // Fake classification display for browsing
  document.getElementById('result-img').src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect fill='${encodeURIComponent(mat.bg)}' width='200' height='200'/><text x='100' y='115' font-size='80' text-anchor='middle'>${mat.emoji}</text></svg>`;
  document.getElementById('result-badge').textContent = mat.name;
  document.getElementById('confidence-bar').style.width = '100%';
  document.getElementById('confidence-text').textContent = 'Browse mode';

  const suggList = document.getElementById('suggestions-list');
  renderSuggestions(suggList, suggestions, savedIds);
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── FAVOURITES ────────────────────────────────────────
async function loadFavourites() {
  const savedIds = await dbGetSavedIds(currentUser.userId);
  const favList = document.getElementById('fav-list');

  if (!savedIds.length) {
    favList.innerHTML = `<div class="empty-state"><div class="empty-icon">♡</div><p>No saved ideas yet.<br>Scan waste and save ideas you like!</p></div>`;
    return;
  }

  const suggestions = savedIds.map(id => getSuggestionById(id)).filter(Boolean);
  favList.innerHTML = suggestions.map(s => {
    const mat = getMaterial(s.materialId);
    return `
      <div class="suggestion-card" onclick="openSuggestion(${s.id})">
        <div class="suggestion-emoji" style="background:${mat ? mat.bg : '#e8f5ee'}">${s.emoji}</div>
        <div class="suggestion-info">
          <div class="suggestion-title">${s.title}</div>
          <div class="suggestion-meta">
            <span class="diff-chip diff-${s.difficulty.toLowerCase()}">${s.difficulty}</span>
            <span class="time-chip">⏱ ${s.time}</span>
            <span class="time-chip">${mat ? mat.emoji + ' ' + mat.name : ''}</span>
          </div>
        </div>
        <button class="fav-heart saved" onclick="event.stopPropagation(); toggleFav(${s.id}, this)" title="Remove">♥</button>
      </div>`;
  }).join('');
}

// ── TOGGLE FAVOURITE ──────────────────────────────────
async function toggleFav(suggestionId, btn) {
  const savedIds = await dbGetSavedIds(currentUser.userId);
  const isSaved = savedIds.includes(suggestionId);

  if (isSaved) {
    await dbRemoveIdea(currentUser.userId, suggestionId);
    btn.classList.remove('saved'); btn.textContent = '♡';
    showToast('Removed from favourites');
  } else {
    await dbSaveIdea(currentUser.userId, suggestionId);
    btn.classList.add('saved'); btn.textContent = '♥';
    showToast('✓ Saved to favourites!');
    btn.style.transform = 'scale(1.4)';
    setTimeout(() => btn.style.transform = '', 300);
  }
  updateStats();
}

// ── SUGGESTION MODAL ──────────────────────────────────
async function openSuggestion(id) {
  currentSuggestion = getSuggestionById(id);
  if (!currentSuggestion) return;

  const s = currentSuggestion;
  const mat = getMaterial(s.materialId);

  document.getElementById('modal-title').textContent = s.title;
  document.getElementById('modal-difficulty').textContent = s.difficulty;
  document.getElementById('modal-difficulty').className = `difficulty-badge diff-${s.difficulty.toLowerCase()}`;
  document.getElementById('modal-time').textContent = '⏱ ' + s.time;

  // Emoji placeholder
  const imgEl = document.getElementById('modal-img');
  imgEl.textContent = s.emoji;
  imgEl.style.background = mat ? `linear-gradient(135deg, ${mat.bg}, ${mat.color}22)` : 'var(--green-light)';

  // Tools
  document.getElementById('modal-tools').innerHTML = s.tools.map(t =>
    `<span class="tool-chip">🔧 ${t}</span>`).join('');

  // Steps
  document.getElementById('modal-steps').innerHTML = s.steps.map((step, i) =>
    `<li><span class="step-num">${i + 1}</span><span class="step-text">${step}</span></li>`).join('');

  // Fav button state
  const savedIds = await dbGetSavedIds(currentUser.userId);
  const isSaved = savedIds.includes(s.id);
  const favBtn = document.getElementById('modal-fav-btn');
  favBtn.textContent = isSaved ? '♥ Saved' : '♡ Save';
  favBtn.className = 'btn-fav' + (isSaved ? ' saved' : '');

  // Reset rating
  document.getElementById('rating-section').classList.add('hidden');
  currentRating = 0;
  document.querySelectorAll('#star-rating span').forEach(s => s.classList.remove('active'));
  document.getElementById('rating-comment').value = '';

  document.getElementById('suggestion-modal').classList.remove('hidden');
}

async function toggleFavFromModal() {
  if (!currentSuggestion) return;
  const savedIds = await dbGetSavedIds(currentUser.userId);
  const isSaved = savedIds.includes(currentSuggestion.id);
  const favBtn = document.getElementById('modal-fav-btn');

  if (isSaved) {
    await dbRemoveIdea(currentUser.userId, currentSuggestion.id);
    favBtn.textContent = '♡ Save'; favBtn.classList.remove('saved');
    showToast('Removed from favourites');
  } else {
    await dbSaveIdea(currentUser.userId, currentSuggestion.id);
    favBtn.textContent = '♥ Saved'; favBtn.classList.add('saved');
    showToast('✓ Saved to favourites!');
  }
  updateStats();
  // Refresh suggestion cards if they exist
  const suggList = document.getElementById('suggestions-list');
  if (suggList.children.length) {
    const newSavedIds = await dbGetSavedIds(currentUser.userId);
    const btn = suggList.querySelector(`.fav-heart[onclick*="${currentSuggestion.id}"]`);
    if (btn) {
      btn.classList.toggle('saved', !isSaved);
      btn.textContent = isSaved ? '♡' : '♥';
    }
  }
}

function openRating() {
  document.getElementById('rating-section').classList.toggle('hidden');
}

function setRating(val) {
  currentRating = val;
  document.querySelectorAll('#star-rating span').forEach((s, i) => {
    s.classList.toggle('active', i < val);
  });
}

async function submitRating() {
  if (!currentRating || !currentSuggestion) { showToast('Please select a star rating.'); return; }
  const comment = document.getElementById('rating-comment').value.trim();
  await dbSaveFeedback(currentUser.userId, currentSuggestion.id, currentRating, comment);
  showToast(`★ ${currentRating} star rating submitted!`);
  document.getElementById('rating-section').classList.add('hidden');
}

function closeModal(event) {
  if (event.target === event.currentTarget) closeModalDirect();
}
function closeModalDirect() {
  document.getElementById('suggestion-modal').classList.add('hidden');
  currentSuggestion = null;
}

async function shareIdea() {
  if (!currentSuggestion) return;
  const s = currentSuggestion;
  const text = `Check out this waste reuse idea from WasteWorth!\n\n♻ ${s.title}\n⏱ ${s.time} | ${s.difficulty}\n\nSteps:\n${s.steps.slice(0,3).map((st,i) => `${i+1}. ${st}`).join('\n')}…\n\nDownload WasteWorth – AI Powered Waste Reuse App`;
  if (navigator.share) {
    await navigator.share({ title: 'WasteWorth Idea: ' + s.title, text });
  } else {
    await navigator.clipboard.writeText(text).catch(() => {});
    showToast('Idea copied to clipboard!');
  }
}

// ── SETTINGS ─────────────────────────────────────────
function toggleDarkMode(el) {
  const dark = el.checked;
  document.documentElement.setAttribute('data-dark', dark ? 'true' : 'false');
  dbSetSetting('dark_mode', dark ? 'true' : null);
}

async function clearAllData() {
  if (!confirm('Clear all scan history and favourites? This cannot be undone.')) return;
  await dbClearUserData(currentUser.userId);
  showToast('All data cleared.');
  updateStats();
}

// ── STATS UPDATE ──────────────────────────────────────
async function updateStats() {
  const history = await dbGetScanHistory(currentUser.userId);
  const savedIds = await dbGetSavedIds(currentUser.userId);
  const statScans = document.getElementById('stat-scans');
  const statSaved = document.getElementById('stat-saved');
  const statPoints = document.getElementById('stat-points');
  if (statScans) statScans.textContent = history.length;
  if (statSaved) statSaved.textContent = savedIds.length;
  if (statPoints) statPoints.textContent = history.length * 10 + savedIds.length * 5;
}

// ── TOAST ─────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2800);
}

// ── PWA SERVICE WORKER ────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
