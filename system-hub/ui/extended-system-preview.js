const toast = document.querySelector('.toast');
let toastTimer;

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function activateTab(tab) {
  document.querySelectorAll('[data-tab]').forEach((button) => button.classList.toggle('selected', button.dataset.tab === tab));
  document.querySelectorAll('[data-panel]').forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === tab));
}

document.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', () => activateTab(button.dataset.tab)));
const requestedTab = window.location.hash.slice(1);
if (['now', 'energy', 'guard', 'find'].includes(requestedTab)) activateTab(requestedTab);
document.querySelector('[data-action="back"]').addEventListener('click', () => { window.location.href = 'system-hub-preview.html'; });

let unread = 2;
function markAllRead() {
  document.querySelectorAll('[data-notification]').forEach((card) => { card.hidden = true; });
  unread = 0;
  document.querySelector('[data-notification-title]').textContent = 'Alles ruhig';
  document.querySelector('.empty-state').hidden = false;
  showToast('Alle Benachrichtigungen als gelesen markiert.');
}
document.querySelectorAll('[data-action="all-read"]').forEach((button) => button.addEventListener('click', markAllRead));

document.querySelector('[data-action="torch"]').addEventListener('click', () => showToast('Taschenlampe aktiviert · Vorschau'));
document.querySelector('[data-action="screenshot"]').addEventListener('click', () => showToast('Screenshot vorgemerkt · Vorschau'));
document.querySelector('[data-action="camera"]').addEventListener('click', () => showToast('Kamera-Schnellstart · Vorschau'));
document.querySelector('[data-action="clean"]').addEventListener('click', () => showToast('Bereinigung vorgemerkt. Es wird noch nichts gelöscht.'));

document.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-mode]').forEach((mode) => mode.classList.remove('selected'));
  button.classList.add('selected');
  const data = { balance: ['Balance hält durch.', 'Bis 23:40 · geschätzt'], endurance: ['Ausdauer hält länger.', 'Bis morgen · geschätzt'], boost: ['Boost ist bereit.', 'Volle Reaktion · erhöhte Energie'] }[button.dataset.mode];
  document.querySelector('[data-energy-title]').textContent = data[0];
  document.querySelector('.energy-hero .trust').lastChild.textContent = ` ${data[1]}`;
  showToast(`Leistungsmodus: ${button.querySelector('b').textContent} · Vorschau`);
}));

document.querySelector('[data-action="charge"]').addEventListener('click', (event) => {
  const active = event.currentTarget.classList.toggle('is-on');
  event.currentTarget.setAttribute('aria-pressed', String(active));
  showToast(`Intelligentes Laden ${active ? 'aktiviert' : 'deaktiviert'} · Vorschau`);
});
document.querySelector('[data-action="privacy-report"]').addEventListener('click', () => showToast('Privatsphäre-Bericht wird vorbereitet · Vorschau'));
document.querySelector('[data-action="clipboard"]').addEventListener('click', () => showToast('Zwischenablage lokal geleert · Vorschau'));
document.querySelector('[data-action="ring"]').addEventListener('click', () => showToast('Klingeln wird lokal vorbereitet. Keine Standortübertragung.'));
document.querySelector('[data-action="find-setup"]').addEventListener('click', () => showToast('Find benötigt später deine Anmeldung und Zustimmung.'));

function updateTime() { document.querySelector('[data-time]').textContent = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(new Date()); }
updateTime(); window.setInterval(updateTime, 30000);
