// Life page: click a photo to see the whole picture larger. Click anywhere or press Esc to close.
(function () {
  var links = document.querySelectorAll('.photo-row a');
  if (!links.length || !window.HTMLDialogElement) return; // without <dialog>, links just open the image

  var dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  var big = document.createElement('img');
  dialog.appendChild(big);
  document.body.appendChild(dialog);

  dialog.addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('close', function () { big.removeAttribute('src'); });

  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      big.src = a.href;
      big.alt = a.querySelector('img').alt;
      dialog.showModal();
    });
  });
})();
