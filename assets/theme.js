// Light/dark theme. Loaded in <head> so the saved theme applies before first paint.
(function () {
  var root = document.documentElement;
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) {}

  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : mq.matches;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    function render() {
      btn.textContent = isDark() ? '☀' : '☾';
      btn.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
    }

    btn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      render();
    });
    mq.addEventListener && mq.addEventListener('change', render);
    render();
  });
})();
