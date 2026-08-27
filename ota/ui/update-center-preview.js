const detailButton = document.querySelector('[data-action="toggle-details"]');
const details = document.querySelector('#integrity-details');
const confirmButton = document.querySelector('[data-action="confirm-update"]');
const deferButton = document.querySelector('[data-action="defer-update"]');
const notesButton = document.querySelector('[data-action="show-notes"]');
const toast = document.querySelector('.toast');
let toastTimer;

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

detailButton.addEventListener('click', () => {
  const isOpen = !details.hidden;
  details.hidden = isOpen;
  detailButton.classList.toggle('is-open', !isOpen);
  detailButton.setAttribute('aria-expanded', String(!isOpen));
  detailButton.firstChild.textContent = isOpen ? 'Details ' : 'Details schließen ';
});

notesButton.addEventListener('click', () => {
  showToast('Release-Notizen geöffnet · Vorschau');
});

deferButton.addEventListener('click', () => {
  showToast('Erinnerung in 24 Stunden · Das Paket bleibt sicher vorbereitet');
});

confirmButton.addEventListener('click', () => {
  const label = document.querySelector('[data-confirm-label]');
  const icon = document.querySelector('[data-confirm-icon]');
  const title = document.querySelector('[data-install-title]');
  const badge = document.querySelector('[data-install-badge]');
  label.textContent = 'Neustart ist vorbereitet';
  icon.textContent = '↻';
  title.textContent = 'Kontrollierter Neustart bereit';
  badge.textContent = 'Bestätigt';
  badge.style.color = '#d5c7ff';
  badge.style.borderColor = 'rgba(180,145,255,.4)';
  badge.style.background = 'rgba(170,125,255,.14)';
  confirmButton.disabled = true;
  deferButton.textContent = 'Neustart später ausführen';
  showToast('Update bestätigt · VortexOS startet nur auf deine Aktion neu');
});
