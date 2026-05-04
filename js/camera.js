// ── CAMERA MODULE ─────────────────────────────────────
let cameraStream = null;
let lastCapturedImage = null;

async function openCamera() {
  try {
    const container = document.getElementById('camera-container');
    const video = document.getElementById('camera-feed');
    container.classList.remove('hidden');

    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } }
    });
    video.srcObject = cameraStream;
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (e) {
    // Fallback if no camera permission
    showToast('Camera not available. Use gallery instead.');
    console.warn('Camera error:', e);
    document.getElementById('camera-container').classList.add('hidden');
  }
}

function capturePhoto() {
  const video = document.getElementById('camera-feed');
  const canvas = document.getElementById('snap-canvas');
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  closeCamera();
  processImage(dataUrl);
}

function closeCamera() {
  if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
  document.getElementById('camera-container').classList.add('hidden');
}

function handleGalleryUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => processImage(e.target.result);
  reader.readAsDataURL(file);
  event.target.value = ''; // reset input
}

async function processImage(dataUrl) {
  lastCapturedImage = dataUrl;
  const panel = document.getElementById('result-panel');
  panel.classList.remove('hidden');

  // Show the image
  const resultImg = document.getElementById('result-img');
  resultImg.src = dataUrl;

  // Show loading
  const suggList = document.getElementById('suggestions-list');
  suggList.innerHTML = `
    <div class="ai-loading">
      <div class="ai-spinner"></div>
      <span>Analysing waste material with AI…</span>
    </div>`;

  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Try AI classification first, fall back to mock
  let classification;
  try {
    const apiKey = await dbGetSetting('api_key');
    if (apiKey) {
      classification = await classifyWithAI(dataUrl, apiKey);
    } else {
      // Simulate processing delay
      await new Promise(r => setTimeout(r, 1400));
      classification = mockClassify(dataUrl);
    }
  } catch (e) {
    await new Promise(r => setTimeout(r, 1000));
    classification = mockClassify(dataUrl);
  }

  const { material, materialId, confidence } = classification;

  // Update result badge
  document.getElementById('result-badge').textContent = material;
  const pct = Math.round(confidence * 100);
  document.getElementById('confidence-bar').style.width = pct + '%';
  document.getElementById('confidence-text').textContent = `${pct}% confidence`;

  // Log scan
  await dbLogScan(currentUser.userId, material, confidence);
  updateStats();

  // Show suggestions
  const suggestions = getSuggestionsByMaterial(materialId);
  const savedIds = await dbGetSavedIds(currentUser.userId);
  renderSuggestions(suggList, suggestions, savedIds);
}

function renderSuggestions(container, suggestions, savedIds) {
  if (!suggestions.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><p>No reuse ideas found for this material yet.</p></div>';
    return;
  }
  container.innerHTML = suggestions.map(s => {
    const isSaved = savedIds.includes(s.id);
    const mat = getMaterial(s.materialId);
    return `
      <div class="suggestion-card" onclick="openSuggestion(${s.id})">
        <div class="suggestion-emoji" style="background:${mat ? mat.bg : '#e8f5ee'}">${s.emoji}</div>
        <div class="suggestion-info">
          <div class="suggestion-title">${s.title}</div>
          <div class="suggestion-meta">
            <span class="diff-chip diff-${s.difficulty.toLowerCase()}">${s.difficulty}</span>
            <span class="time-chip">⏱ ${s.time}</span>
          </div>
        </div>
        <button class="fav-heart ${isSaved ? 'saved' : ''}" onclick="event.stopPropagation(); toggleFav(${s.id}, this)" title="${isSaved ? 'Remove from favourites' : 'Save'}">
          ${isSaved ? '♥' : '♡'}
        </button>
      </div>`;
  }).join('');
}
