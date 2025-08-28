import { saveReport, listReports, deleteReport } from './api.js';

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const $app = document.getElementById('app');

const routes = {
  '/': () => `
    <section class="page">
      <h2>Home</h2>
      <p>ยินดีต้อนรับสู่ MOD Online System</p>
      <button id="actionBtn">Click me</button>
      <p id="statusText">Ready ✅</p>
    </section>
  `,
  '/report': () => `
    <section class="page">
      <h2>Report</h2>
      <form id="reportForm" class="form">
        <div class="row">
          <label>Title</label>
          <input type="text" name="title" required placeholder="ปัญหาที่พบ / หัวข้อรายงาน" />
        </div>
        <div class="row">
          <label>Category</label>
          <select name="category" required>
            <option value="">-- เลือกประเภท --</option>
            <option>Operation</option>
            <option>Maintenance</option>
            <option>Guest Issue</option>
            <option>IT</option>
          </select>
        </div>
        <div class="row">
          <label>Details</label>
          <textarea name="details" rows="4" placeholder="รายละเอียดเหตุการณ์"></textarea>
        </div>
        <div class="row">
          <label>Priority</label>
          <select name="priority" required>
            <option>Low</option>
            <option selected>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div class="row">
          <button type="submit">Save Report</button>
        </div>
        <p id="formMsg" class="muted"></p>
      </form>

      <h3 style="margin-top:24px;">Recent Reports</h3>
      <div id="reportList" class="table-wrap"></div>
    </section>
  `,
  '/about': () => `
    <section class="page">
      <h2>About</h2>
      <p>โปรเจกต์เดโม่สำหรับสอน deploy แบบ GitHub Pages</p>
    </section>
  `
};

function render() {
  const hash = location.hash.replace('#', '') || '/';
  const view = routes[hash] || routes['/'];
  $app.innerHTML = view();

  // Home events
  const btn = document.getElementById('actionBtn');
  const status = document.getElementById('statusText');
  if (btn && status) {
    btn.addEventListener('click', () => {
      status.textContent = 'Button clicked! 🚀';
    });
  }

  // Report page wiring
  const form = document.getElementById('reportForm');
  const list = document.getElementById('reportList');
  const msg = document.getElementById('formMsg');

  if (form && list) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const payload = {
        title: formData.get('title')?.toString().trim(),
        category: formData.get('category'),
        details: formData.get('details')?.toString().trim(),
        priority: formData.get('priority'),
        createdAt: new Date().toISOString()
      };
      try {
        msg.textContent = 'Saving...';
        await saveReport(payload);
        form.reset();
        msg.textContent = 'Saved ✅';
        await renderReports(list);
      } catch (err) {
        console.error(err);
        msg.textContent = 'Save failed ❌';
      }
    });

    renderReports(list);
  }
}

async function renderReports(container) {
  container.innerHTML = 'Loading...';
  try {
    const items = await listReports();
    if (!items.length) {
      container.innerHTML = '<p class="muted">No data.</p>';
      return;
    }
    const rows = items.map(r => `
      <tr>
        <td>${escapeHtml(r.title || '')}</td>
        <td>${escapeHtml(r.category || '')}</td>
        <td>${escapeHtml(r.priority || '')}</td>
        <td>${new Date(r.createdAt || r.id).toLocaleString()}</td>
        <td><button class="link danger" data-id="${r.id}">Delete</button></td>
      </tr>
    `).join('');
    container.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Title</th><th>Category</th><th>Priority</th><th>Created</th><th></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;

    // bind delete
    container.querySelectorAll('button[data-id]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = Number(btn.getAttribute('data-id'));
        await deleteReport(id);
        await renderReports(container);
      });
    });
  } catch (e) {
    console.error(e);
    container.innerHTML = '<p class="muted">Load failed.</p>';
  }
}

function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);
