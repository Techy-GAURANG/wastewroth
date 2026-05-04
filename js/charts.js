// ── CHARTS MODULE ─────────────────────────────────────
// Lightweight canvas-based charts (no external library needed)

function drawBarChart(canvasId, labels, data, color = '#1a7a4a') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 600;
  const H = canvas.height;
  canvas.width = W;
  ctx.clearRect(0, 0, W, H);

  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartW = W - padding.left - padding.right;
  const chartH = H - padding.top - padding.bottom;
  const max = Math.max(...data, 1);
  const barW = chartW / labels.length;

  // Dark mode check
  const isDark = document.documentElement.getAttribute('data-dark') === 'true';
  const textColor = isDark ? '#8ec9a8' : '#4a6155';
  const gridColor = isDark ? '#1e3828' : '#d0e8da';

  // Grid lines
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH / 4) * i;
    ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(W - padding.right, y); ctx.stroke();
    const val = Math.round(max - (max / 4) * i);
    ctx.fillStyle = textColor; ctx.font = '10px Space Grotesk'; ctx.textAlign = 'right';
    ctx.fillText(val, padding.left - 4, y + 4);
  }

  // Bars
  data.forEach((val, i) => {
    const x = padding.left + i * barW + barW * 0.15;
    const bW = barW * 0.7;
    const bH = (val / max) * chartH;
    const y = padding.top + chartH - bH;

    // Gradient
    const grad = ctx.createLinearGradient(0, y, 0, y + bH);
    grad.addColorStop(0, color);
    grad.addColorStop(1, color + '66');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, bW, bH, [4, 4, 0, 0]);
    ctx.fill();

    // Label
    ctx.fillStyle = textColor; ctx.font = '9px Space Grotesk'; ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + bW / 2, H - padding.bottom + 16);

    // Value on top
    if (val > 0) {
      ctx.fillStyle = color; ctx.font = 'bold 10px Space Grotesk';
      ctx.fillText(val, x + bW / 2, y - 4);
    }
  });
}

function drawDonutChart(canvasId, labels, data, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 600;
  const H = canvas.height;
  canvas.width = W;
  ctx.clearRect(0, 0, W, H);

  const total = data.reduce((a, b) => a + b, 0) || 1;
  const cx = W * 0.35, cy = H / 2;
  const radius = Math.min(cx, cy) * 0.85;
  const innerR = radius * 0.55;
  let angle = -Math.PI / 2;

  const isDark = document.documentElement.getAttribute('data-dark') === 'true';
  const textColor = isDark ? '#8ec9a8' : '#4a6155';

  data.forEach((val, i) => {
    const slice = (val / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, angle + slice);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    angle += slice;
  });

  // Inner circle (donut hole)
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, 2 * Math.PI);
  ctx.fillStyle = isDark ? '#132214' : '#fff';
  ctx.fill();

  // Center text
  ctx.fillStyle = textColor; ctx.font = 'bold 14px Syne'; ctx.textAlign = 'center';
  ctx.fillText(total, cx, cy + 4);
  ctx.font = '10px Space Grotesk';
  ctx.fillText('total', cx, cy + 18);

  // Legend
  const legendX = W * 0.65;
  const itemH = Math.min(22, (H - 20) / labels.length);
  labels.forEach((label, i) => {
    const ly = 20 + i * itemH;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(legendX, ly, 12, 12);
    ctx.fillStyle = textColor; ctx.font = '10px Space Grotesk'; ctx.textAlign = 'left';
    const truncated = label.length > 14 ? label.slice(0, 12) + '…' : label;
    ctx.fillText(`${truncated} (${data[i]})`, legendX + 16, ly + 10);
  });
}

function drawLineChart(canvasId, labels, datasets) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 600;
  const H = canvas.height;
  canvas.width = W;
  ctx.clearRect(0, 0, W, H);

  const pad = { top: 16, right: 20, bottom: 36, left: 36 };
  const cW = W - pad.left - pad.right;
  const cH = H - pad.top - pad.bottom;

  const allVals = datasets.flatMap(d => d.data);
  const max = Math.max(...allVals, 1);

  const isDark = document.documentElement.getAttribute('data-dark') === 'true';
  const textColor = isDark ? '#8ec9a8' : '#4a6155';
  const gridColor = isDark ? '#1e3828' : '#d0e8da';

  // Grid
  ctx.strokeStyle = gridColor; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (cH / 4) * i;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
  }

  // X labels
  ctx.fillStyle = textColor; ctx.font = '9px Space Grotesk'; ctx.textAlign = 'center';
  labels.forEach((l, i) => {
    const x = pad.left + (i / (labels.length - 1)) * cW;
    ctx.fillText(l, x, H - pad.bottom + 14);
  });

  // Lines
  datasets.forEach(ds => {
    ctx.beginPath();
    ds.data.forEach((val, i) => {
      const x = pad.left + (i / (ds.data.length - 1)) * cW;
      const y = pad.top + cH - (val / max) * cH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = ds.color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Dots
    ds.data.forEach((val, i) => {
      const x = pad.left + (i / (ds.data.length - 1)) * cW;
      const y = pad.top + cH - (val / max) * cH;
      ctx.beginPath(); ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = ds.color; ctx.fill();
      ctx.strokeStyle = isDark ? '#132214' : '#fff'; ctx.lineWidth = 2; ctx.stroke();
    });
  });
}

async function renderCharts() {
  const history = await dbGetScanHistory(currentUser.userId);
  const savedIds = await dbGetSavedIds(currentUser.userId);

  // Update stats
  document.getElementById('stat-scans').textContent = history.length;
  document.getElementById('stat-saved').textContent = savedIds.length;
  document.getElementById('stat-points').textContent = history.length * 10 + savedIds.length * 5;

  // ── Scan History (last 7 days) ────────────────────
  const days = [];
  const dayCounts = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push(['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]);
    dayCounts.push(history.filter(h => h.scannedAt.startsWith(key)).length);
  }
  drawBarChart('scan-chart', days, dayCounts, '#1a7a4a');

  // ── Material Distribution ─────────────────────────
  const matCounts = {};
  history.forEach(h => { matCounts[h.material] = (matCounts[h.material] || 0) + 1; });
  const matLabels = Object.keys(matCounts);
  const matData = matLabels.map(k => matCounts[k]);
  const palette = ['#3498db','#7f8c8d','#d35400','#27ae60','#8e44ad','#2980b9','#1a252f','#784212'];
  if (matLabels.length === 0) {
    matLabels.push('No scans yet'); matData.push(1); // placeholder
  }
  drawDonutChart('material-chart', matLabels, matData, palette);

  // ── Weekly Activity (last 4 weeks) ───────────────
  const weeks = ['Wk 4','Wk 3','Wk 2','Wk 1'];
  const weekScans = weeks.map((_, wi) => {
    const start = new Date(); start.setDate(start.getDate() - (wi + 1) * 7);
    const end = new Date(); end.setDate(end.getDate() - wi * 7);
    return history.filter(h => {
      const d = new Date(h.scannedAt);
      return d >= start && d < end;
    }).length;
  }).reverse();
  drawLineChart('activity-chart', weeks, [
    { data: weekScans, color: '#1a7a4a', label: 'Scans' }
  ]);
}
