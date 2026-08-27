const toast = document.querySelector('.toast');
let toastTimer;

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

const toggleText = {
  wifi: ['Vortex Home', 'Aus'],
  bluetooth: ['Verbunden', 'Aus'],
  focus: ['An', 'Aus'],
  torch: ['An', 'Aus'],
};

const toggleToast = {
  wifi: 'WLAN', bluetooth: 'Bluetooth', focus: 'Fokus', torch: 'Licht',
};

document.querySelectorAll('[data-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const feature = button.dataset.toggle;
    const active = button.classList.toggle('active');
    document.querySelector(`[data-label="${feature}"]`).textContent = toggleText[feature][active ? 0 : 1];
    showToast(`${toggleToast[feature]} ${active ? 'aktiviert' : 'deaktiviert'} · Vorschau`);
  });
});

document.querySelectorAll('[data-scene]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-scene]').forEach((scene) => scene.classList.remove('selected'));
    button.classList.add('selected');
    const names = { balance: 'Balance', quiet: 'Ruhe', boost: 'Boost' };
    showToast(`Vortex Flow: ${names[button.dataset.scene]} · Vorschau`);
  });
});

const playButton = document.querySelector('[data-action="media"]');
playButton.addEventListener('click', () => {
  const icon = playButton.querySelector('span');
  const playing = icon.textContent === '▶';
  icon.textContent = playing ? 'Ⅱ' : '▶';
  playButton.setAttribute('aria-label', playing ? 'Wiedergabe pausieren' : 'Wiedergabe starten');
  showToast(playing ? 'Wiedergabe gestartet · Vorschau' : 'Wiedergabe pausiert · Vorschau');
});

document.querySelector('[data-action="flow-info"]').addEventListener('click', () => {
  showToast('Flow stimmt Benachrichtigungsruhe und Systemstil aufeinander ab.');
});

document.querySelector('[data-action="storage"]').addEventListener('click', () => {
  showToast('184 GB frei · Medien und Dateien kannst du hier später verwalten.');
});

document.querySelector('[data-action="privacy"]').addEventListener('click', () => {
  showToast('Guard aktiv · Keine offenen Datenschutzwarnungen.');
});

document.querySelector('[data-action="update"]').addEventListener('click', () => {
  window.location.href = '../../ota/ui/update-center-preview.html';
});

function updateTime() {
  document.querySelector('[data-time]').textContent = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(new Date());
}
updateTime();
window.setInterval(updateTime, 30000);
