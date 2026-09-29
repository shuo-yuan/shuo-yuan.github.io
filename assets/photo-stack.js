// Photo stacks: click (or Enter/Space) sends the top photo to the back.
// Works for every .photo-stack on the page.
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function setup(stack) {
    var photos = Array.prototype.slice.call(stack.querySelectorAll('img'));
    var busy = false;

    // Top photo gets data-pos 0, the next 1; everything further back shares pos 2.
    function layout() {
      photos.forEach(function (img, i) {
        img.style.zIndex = photos.length - i;
        img.setAttribute('data-pos', Math.min(i, 2));
      });
    }

    function next() {
      if (busy) return;
      var top = photos[0];

      function finish() {
        photos.push(photos.shift());
        top.classList.remove('lift');
        layout();
        busy = false;
      }

      if (reduceMotion.matches) return finish();
      busy = true;
      top.classList.add('lift'); // slide the top photo out, then tuck it behind
      setTimeout(finish, 300);
    }

    layout();

    if (photos.length < 2) {
      stack.classList.add('single');
      stack.removeAttribute('role');
      stack.removeAttribute('tabindex');
      stack.removeAttribute('aria-label');
      return;
    }

    stack.addEventListener('click', next);
    stack.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        next();
      }
    });
  }

  document.querySelectorAll('.photo-stack').forEach(setup);
})();
