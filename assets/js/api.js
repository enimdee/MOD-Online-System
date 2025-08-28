import { CONFIG } from './config.js';

// mock save (localStorage) เมื่อยังไม่มี BASE_API
function mockSaveReport(payload) {
  const key = 'mod_reports';
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  list.push({ id: Date.now(), ...payload });
  localStorage.setItem(key, JSON.stringify(list));
  return Promise.resolve({ ok: true, id: Date.now() });
}

export async function saveReport(payload) {
  if (!CONFIG.BASE_API) {
    return mockSaveReport(payload);
  }
  const res = await fetch(CONFIG.BASE_API + '/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to save');
  return res.json();
}

export async function listReports() {
  if (!CONFIG.BASE_API) {
    const key = 'mod_reports';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    return Promise.resolve(list.sort((a,b) => b.id - a.id));
  }
  const res = await fetch(CONFIG.BASE_API + '/reports');
  if (!res.ok) throw new Error('Failed to list');
  return res.json();
}

export async function deleteReport(id) {
  if (!CONFIG.BASE_API) {
    const key = 'mod_reports';
    const list = JSON.parse(localStorage.getItem(key) || '[]').filter(r => r.id !== id);
    localStorage.setItem(key, JSON.stringify(list));
    return Promise.resolve({ ok: true });
  }
  const res = await fetch(CONFIG.BASE_API + '/reports/' + id, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
  return res.json();
}
