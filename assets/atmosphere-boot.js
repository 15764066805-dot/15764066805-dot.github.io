(function () {
  if (window.parent !== window) document.documentElement.classList.add('detail-window-embedded');
  var theme;
  try { theme = localStorage.getItem('xxun-atmosphere'); } catch (_) {}
  if (theme !== 'light' && theme !== 'dark') theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();
