// ── AI MODULE ─────────────────────────────────────────
async function classifyWithAI(imageDataUrl, apiKey) {
  const model = await dbGetSetting('api_model') || 'claude-sonnet-4-20250514';
  const base64 = imageDataUrl.split(',')[1];
  const mediaType = imageDataUrl.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';

  const prompt = `You are a waste material classifier for the WasteWorth sustainability app. 
Analyze this image and identify the primary waste material type.

Respond with ONLY a JSON object (no other text) in this exact format:
{
  "material": "<one of: Plastic Bottle, Tin Can, Cardboard, Glass Jar, Fabric, Paper, Rubber, Wood>",
  "confidence": <float between 0.65 and 0.98>,
  "materialId": <integer 1-8 corresponding to the material>
}

Material ID mapping:
1=Plastic Bottle, 2=Tin Can, 3=Cardboard, 4=Glass Jar, 5=Fabric, 6=Paper, 7=Rubber, 8=Wood

If the image is unclear or doesn't show waste, pick the closest match with lower confidence.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: prompt }
        ]
      }]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'API error');
  }

  const data = await response.json();
  const text = data.content[0]?.text || '{}';

  // Parse JSON response
  const clean = text.replace(/```json|```/g, '').trim();
  const result = JSON.parse(clean);

  // Validate and sanitise
  const validMaterials = ['Plastic Bottle','Tin Can','Cardboard','Glass Jar','Fabric','Paper','Rubber','Wood'];
  if (!validMaterials.includes(result.material)) {
    throw new Error('Invalid material classification');
  }

  return {
    material: result.material,
    materialId: result.materialId || validMaterials.indexOf(result.material) + 1,
    confidence: Math.min(0.98, Math.max(0.5, result.confidence || 0.75))
  };
}

// ── API KEY MANAGEMENT ───────────────────────────────
async function saveApiKey() {
  const key   = document.getElementById('api-key-input').value.trim();
  const model = document.getElementById('api-model-select').value;
  if (!key) { showToast('Please enter an API key.'); return; }
  await dbSetSetting('api_key', key);
  await dbSetSetting('api_model', model);
  showToast('✓ API key saved!');
  updateApiStatus(true);
}

async function testApiKey() {
  const key = document.getElementById('api-key-input').value.trim();
  const resultEl = document.getElementById('api-test-result');
  resultEl.className = 'api-test-result';
  resultEl.classList.remove('hidden');
  resultEl.textContent = 'Testing connection…';

  if (!key) { resultEl.textContent = 'Enter an API key first.'; resultEl.classList.add('error'); return; }

  try {
    const model = document.getElementById('api-model-select').value;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }]
      })
    });
    if (response.ok) {
      resultEl.textContent = '✓ Connection successful! AI classification is ready.';
      resultEl.classList.add('success');
      updateApiStatus(true);
    } else {
      const err = await response.json().catch(() => ({}));
      resultEl.textContent = '✗ Error: ' + (err.error?.message || 'Invalid key');
      resultEl.classList.add('error');
    }
  } catch (e) {
    resultEl.textContent = '✗ Network error. Check your connection.';
    resultEl.classList.add('error');
  }
}

function updateApiStatus(connected) {
  const dot = document.getElementById('api-status-dot');
  if (dot) {
    dot.className = 'api-status' + (connected ? ' connected' : '');
    dot.title = connected ? 'API Connected' : 'Not connected';
  }
}

async function loadApiSettings() {
  const key   = await dbGetSetting('api_key');
  const model = await dbGetSetting('api_model');
  if (key) {
    document.getElementById('api-key-input').value = key;
    updateApiStatus(true);
  }
  if (model) {
    document.getElementById('api-model-select').value = model;
  }
}
