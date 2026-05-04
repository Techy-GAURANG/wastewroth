// ── AUTH MODULE ────────────────────────────────────────
let currentUser = null;

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function doRegister() {
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const pass  = document.getElementById('reg-password').value;
  const err   = document.getElementById('reg-error');

  err.classList.add('hidden');

  if (!name || !email || !pass) {
    err.textContent = 'Please fill in all fields.'; err.classList.remove('hidden'); return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    err.textContent = 'Please enter a valid email.'; err.classList.remove('hidden'); return;
  }
  if (pass.length < 8) {
    err.textContent = 'Password must be at least 8 characters.'; err.classList.remove('hidden'); return;
  }

  try {
    const salt = generateSalt();
    const passwordHash = await sha256(salt + pass);
    await dbRegisterUser(name, email, passwordHash, salt);
    showToast('Account created! Please sign in.');
    showView('login-view');
    document.getElementById('login-email').value = email;
  } catch (e) {
    err.textContent = e.message || 'Registration failed.'; err.classList.remove('hidden');
  }
}

async function doLogin() {
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const pass  = document.getElementById('login-password').value;
  const err   = document.getElementById('login-error');

  err.classList.add('hidden');

  if (!email || !pass) {
    err.textContent = 'Please fill in all fields.'; err.classList.remove('hidden'); return;
  }

  try {
    const user = await dbGetUserByEmail(email);
    if (!user) { err.textContent = 'Invalid email or password.'; err.classList.remove('hidden'); return; }

    const hash = await sha256(user.salt + pass);
    if (hash !== user.passwordHash) {
      err.textContent = 'Invalid email or password.'; err.classList.remove('hidden'); return;
    }
    currentUser = user;
    sessionStorage.setItem('ww_uid', user.userId);
    sessionStorage.setItem('ww_uname', user.username);
    sessionStorage.setItem('ww_uemail', user.email);
    enterApp();
  } catch (e) {
    err.textContent = 'Login failed. Try again.'; err.classList.remove('hidden');
  }
}

function logout() {
  if (!confirm('Are you sure you want to log out?')) return;
  currentUser = null;
  sessionStorage.clear();
  closeCamera();
  document.getElementById('app').classList.add('hidden');
  document.getElementById('auth-screen').classList.remove('hidden');
  showView('login-view');
  document.getElementById('login-password').value = '';
  navTo('home');
}

function restoreSession() {
  const uid = sessionStorage.getItem('ww_uid');
  if (uid) {
    currentUser = {
      userId: parseInt(uid),
      username: sessionStorage.getItem('ww_uname'),
      email: sessionStorage.getItem('ww_uemail')
    };
    return true;
  }
  return false;
}

function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
  else { input.type = 'password'; btn.textContent = '👁'; }
}

function showView(viewId) {
  document.querySelectorAll('.auth-view').forEach(v => v.classList.add('hidden'));
  document.getElementById(viewId).classList.remove('hidden');
}
