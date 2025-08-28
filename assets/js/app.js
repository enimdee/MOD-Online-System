const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const statusText = document.getElementById('statusText');
const btn = document.getElementById('actionBtn');

if (statusText) statusText.textContent = 'Ready ✅';

if (btn) {
  btn.addEventListener('click', () => {
    statusText.textContent = 'Button clicked! 🚀';
  });
}
