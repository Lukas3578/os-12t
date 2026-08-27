const storageKey = 'vortexos-home-preferences-v1';
const defaults = {
  grid: '4', dock: '5', widget: 'glance', motion: true,
  gestures: { down: 'control', up: 'drawer', double: 'lock' },
};
let state = loadState();
let gestureStart = null;
let longPressTimer = null;
let toastTimer = null;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return { ...defaults, ...saved, gestures: { ...defaults.gestures, ...(saved?.gestures || {}) } };
  } catch { return structuredClone(defaults); }
}

function saveState() { localStorage.setItem(storageKey, JSON.stringify(state)); }

function showToast(message) {
  const toast = document.querySelector('.toast');
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

function openOverlay(name) {
  document.querySelectorAll('[data-overlay]').forEach((overlay) => { overlay.hidden = overlay.dataset.overlay !== name; });
}

function closeOverlays() {
  document.querySelectorAll('[data-overlay]').forEach((overlay) => { overlay.hidden = true; });
  document.querySelector('[data-app-grid]').classList.remove('editing');
}

function updateWidget() {
  const widgets = {
    glance: ['VORTEX GLANCE', 'Alles im Flow.', '18:00 · Fokus bereit · 75 % Energie', '◌'],
    focus: ['VORTEX FOKUS', 'Zeit für Ruhe.', '42 Minuten fokussierte Zeit heute', '☾'],
    update: ['SYSTEMUPDATE', 'VortexOS 0.2.0 bereit.', 'Signiert · WLAN geschützt · Bestätigung nötig', '✓'],
  };
  const [kicker, title, detail, icon] = widgets[state.widget];
  document.querySelector('[data-widget-kicker]').textContent = kicker;
  document.querySelector('[data-widget-title]').textContent = title;
  document.querySelector('[data-widget-detail]').textContent = detail;
  document.querySelector('[data-widget-icon]').textContent = icon;
}

function applyPreferences() {
  const grid = document.querySelector('[data-app-grid]');
  const dock = document.querySelector('[data-dock]');
  grid.classList.toggle('grid-4', state.grid === '4');
  grid.classList.toggle('grid-5', state.grid === '5');
  dock.classList.toggle('dock-3', state.dock === '3');
  dock.classList.toggle('dock-5', state.dock === '5');
  [...dock.children].forEach((item, index) => { item.hidden = state.dock === '3' && index > 2; });
  document.body.classList.toggle('ambient-paused', !state.motion);
  document.querySelector('[data-action="motion"]').classList.toggle('is-on', state.motion);
  document.querySelector('[data-action="motion"]').setAttribute('aria-pressed', String(state.motion));
  document.querySelectorAll('[data-setting="grid"] button').forEach((button) => button.classList.toggle('selected', button.dataset.value === state.grid));
  document.querySelectorAll('[data-setting="dock"] button').forEach((button) => button.classList.toggle('selected', button.dataset.value === state.dock));
  document.querySelectorAll('[data-setting="widget"] button').forEach((button) => button.classList.toggle('selected', button.dataset.value === state.widget));
  document.querySelectorAll('[data-gesture]').forEach((select) => { select.value = state.gestures[select.dataset.gesture]; });
  updateWidget();
}

function executeAction(action, source = 'Geste') {
  const labels = { control: 'Control Center', drawer: 'App-Übersicht', focus: 'Fokusmodus', torch: 'Licht', lock: 'Sperrbildschirm' };
  if (action === 'control' || action === 'drawer' || action === 'lock') openOverlay(action);
  if (action === 'focus' || action === 'torch') showToast(`${labels[action]} aktiviert · ${source}`);
  if (action === 'control' || action === 'drawer' || action === 'lock') showToast(`${labels[action]} geöffnet · ${source}`);
}

function clearLongPress() { window.clearTimeout(longPressTimer); longPressTimer = null; }

function runApp(app) {
  if (app === 'update') { window.location.href = '../../ota/ui/update-center-preview.html'; return; }
  if (app === 'hub') { window.location.href = '../../system-hub/ui/system-hub-preview.html'; return; }
  const labels = { camera: 'Kamera', gallery: 'Galerie', pulse: 'Pulse', music: 'Musik', messages: 'Nachrichten', files: 'Dateien', phone: 'Telefon', browser: 'Browser' };
  showToast(`${labels[app] || 'App'} wird in der VortexOS-Vorschau geöffnet.`);
}

document.querySelectorAll('[data-action="customize"], [data-action="show-gestures"]').forEach((button) => button.addEventListener('click', () => openOverlay('edit')));
document.querySelectorAll('[data-action="close-overlay"]').forEach((button) => button.addEventListener('click', closeOverlays));
document.querySelector('[data-action="unlock"]').addEventListener('click', () => { closeOverlays(); showToast('VortexOS entsperrt · Vorschau'); });
document.querySelector('[data-action="motion"]').addEventListener('click', () => { state.motion = !state.motion; saveState(); applyPreferences(); showToast(`Hintergrundbewegung ${state.motion ? 'aktiviert' : 'reduziert'}`); });

document.querySelectorAll('[data-setting] button').forEach((button) => {
  button.addEventListener('click', () => {
    const setting = button.closest('[data-setting]').dataset.setting;
    state[setting] = button.dataset.value;
    saveState(); applyPreferences();
    showToast(`${setting === 'grid' ? 'App-Raster' : setting === 'dock' ? 'Dock' : 'Start-Widget'} angepasst.`);
  });
});

document.querySelectorAll('[data-gesture]').forEach((select) => {
  select.addEventListener('change', () => {
    state.gestures[select.dataset.gesture] = select.value;
    saveState();
    showToast('Geste gespeichert.');
  });
});

document.querySelectorAll('[data-app]').forEach((button) => button.addEventListener('click', () => runApp(button.dataset.app)));
document.querySelectorAll('[data-control]').forEach((button) => button.addEventListener('click', () => { button.classList.toggle('active'); showToast(`${button.querySelector('b').textContent} ${button.classList.contains('active') ? 'aktiviert' : 'deaktiviert'} · Vorschau`); }));
document.querySelector('[data-search]').addEventListener('input', (event) => { const query = event.target.value.trim().toLowerCase(); document.querySelectorAll('.drawer-list button').forEach((item) => { item.hidden = !item.textContent.toLowerCase().includes(query); }); });

const home = document.querySelector('[data-home-shell]');
home.addEventListener('pointerdown', (event) => {
  if (event.target.closest('button,input,select')) return;
  gestureStart = { x: event.clientX, y: event.clientY, time: Date.now() };
  longPressTimer = window.setTimeout(() => { gestureStart = null; home.querySelector('[data-app-grid]').classList.add('editing'); openOverlay('edit'); showToast('Homescreen bearbeiten · Vorschau'); }, 560);
});
home.addEventListener('pointermove', (event) => { if (gestureStart && Math.hypot(event.clientX - gestureStart.x, event.clientY - gestureStart.y) > 12) clearLongPress(); });
home.addEventListener('pointerup', (event) => {
  clearLongPress();
  if (!gestureStart) return;
  const dx = event.clientX - gestureStart.x, dy = event.clientY - gestureStart.y;
  gestureStart = null;
  if (Math.abs(dy) > 62 && Math.abs(dy) > Math.abs(dx)) executeAction(dy > 0 ? state.gestures.down : state.gestures.up, dy > 0 ? 'Wischen nach unten' : 'Wischen nach oben');
  else if (Math.abs(dx) > 62) showToast(dx > 0 ? 'Vorherige Homescreen-Seite · Vorschau' : 'Nächste Homescreen-Seite · Vorschau');
});
home.addEventListener('pointercancel', () => { gestureStart = null; clearLongPress(); });
home.addEventListener('dblclick', (event) => { if (!event.target.closest('button,input,select')) executeAction(state.gestures.double, 'Doppeltippen'); });

function updateTime() { document.querySelector('[data-time]').textContent = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(new Date()); }
updateTime(); window.setInterval(updateTime, 30000); applyPreferences();
