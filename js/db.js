// ── WASTEWROTH DATABASE (IndexedDB) ─────────────────────
const DB_NAME = 'WasteWorthDB';
const DB_VER  = 1;
let db;

function initDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = e => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains('users')) {
        const us = d.createObjectStore('users', { keyPath: 'userId', autoIncrement: true });
        us.createIndex('email', 'email', { unique: true });
      }
      if (!d.objectStoreNames.contains('savedIdeas')) {
        const si = d.createObjectStore('savedIdeas', { keyPath: 'saveId', autoIncrement: true });
        si.createIndex('userId', 'userId');
        si.createIndex('userSuggestion', ['userId', 'suggestionId'], { unique: true });
      }
      if (!d.objectStoreNames.contains('feedback')) {
        const fb = d.createObjectStore('feedback', { keyPath: 'feedbackId', autoIncrement: true });
        fb.createIndex('userId', 'userId');
      }
      if (!d.objectStoreNames.contains('scanHistory')) {
        const sh = d.createObjectStore('scanHistory', { keyPath: 'scanId', autoIncrement: true });
        sh.createIndex('userId', 'userId');
      }
      if (!d.objectStoreNames.contains('settings')) {
        d.createObjectStore('settings', { keyPath: 'key' });
      }
    };
    req.onsuccess = e => { db = e.target.result; resolve(db); };
    req.onerror = e => reject(e.target.error);
  });
}

// ── GENERIC HELPERS ───────────────────────────────────
function dbTx(store, mode, fn) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const s  = tx.objectStore(store);
    const req = fn(s);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

function dbGetAll(store, indexName, value) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const s  = tx.objectStore(store);
    const req = indexName ? s.index(indexName).getAll(value) : s.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

// ── USER ──────────────────────────────────────────────
async function dbRegisterUser(username, email, passwordHash, salt) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readwrite');
    const s  = tx.objectStore('users');
    const chk = s.index('email').get(email);
    chk.onsuccess = () => {
      if (chk.result) { reject(new Error('Email already registered')); return; }
      const add = s.add({ username, email, passwordHash, salt, createdAt: new Date().toISOString() });
      add.onsuccess = () => resolve(add.result);
      add.onerror = () => reject(add.error);
    };
  });
}

function dbGetUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readonly');
    const req = tx.objectStore('users').index('email').get(email);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

// ── SAVED IDEAS ──────────────────────────────────────
async function dbSaveIdea(userId, suggestionId) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('savedIdeas', 'readwrite');
    const s = tx.objectStore('savedIdeas');
    const req = s.add({ userId, suggestionId, savedAt: new Date().toISOString() });
    req.onsuccess = () => resolve(true);
    req.onerror = () => resolve(false); // already saved (unique constraint)
  });
}

async function dbRemoveIdea(userId, suggestionId) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('savedIdeas', 'readwrite');
    const s = tx.objectStore('savedIdeas');
    const idx = s.index('userSuggestion');
    const req = idx.get([userId, suggestionId]);
    req.onsuccess = () => {
      if (req.result) {
        const del = s.delete(req.result.saveId);
        del.onsuccess = () => resolve(true);
      } else resolve(false);
    };
    req.onerror = () => reject(req.error);
  });
}

async function dbGetSavedIds(userId) {
  const rows = await dbGetAll('savedIdeas', 'userId', userId);
  return rows.map(r => r.suggestionId);
}

// ── FEEDBACK ──────────────────────────────────────────
async function dbSaveFeedback(userId, suggestionId, rating, comment) {
  return dbTx('feedback', 'readwrite', s =>
    s.add({ userId, suggestionId, rating, comment, createdAt: new Date().toISOString() })
  );
}

// ── SCAN HISTORY ─────────────────────────────────────
async function dbLogScan(userId, material, confidence) {
  return dbTx('scanHistory', 'readwrite', s =>
    s.add({ userId, material, confidence, scannedAt: new Date().toISOString() })
  );
}

async function dbGetScanHistory(userId) {
  return dbGetAll('scanHistory', 'userId', userId);
}

// ── SETTINGS ─────────────────────────────────────────
async function dbSetSetting(key, value) {
  return dbTx('settings', 'readwrite', s => s.put({ key, value }));
}

async function dbGetSetting(key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('settings', 'readonly');
    const req = tx.objectStore('settings').get(key);
    req.onsuccess = () => resolve(req.result ? req.result.value : null);
    req.onerror = () => reject(req.error);
  });
}

// ── CLEAR ALL ─────────────────────────────────────────
async function dbClearUserData(userId) {
  // Clear saved ideas
  const saved = await dbGetAll('savedIdeas', 'userId', userId);
  const tx1 = db.transaction('savedIdeas', 'readwrite');
  const s1 = tx1.objectStore('savedIdeas');
  saved.forEach(r => s1.delete(r.saveId));

  // Clear scan history
  const scans = await dbGetAll('scanHistory', 'userId', userId);
  const tx2 = db.transaction('scanHistory', 'readwrite');
  const s2 = tx2.objectStore('scanHistory');
  scans.forEach(r => s2.delete(r.scanId));
}
