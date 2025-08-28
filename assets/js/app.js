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
      <p>หน้านี้สำหรับรายงาน (ตัวอย่าง)</p>
      <ul>
        <li>Pending tasks</li>
        <li>Daily summary</li>
        <li>KPIs</li>
      </ul>
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

  // bind events ของหน้า Home
  const btn = document.getElementById('actionBtn');
  const status = document.getElementById('statusText');
  if (btn && status) {
    btn.addEventListener('click', () => {
      status.textContent = 'Button clicked! 🚀';
    });
  }
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);
