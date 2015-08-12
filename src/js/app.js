var header;

(function() {
  'use strict';
  var html = document.querySelectorAll('html');

  html[0].classList.remove('no-js');

  var headerEl = document.querySelectorAll('.js-header');
  console.log(header, Header);

  try {
    header = new Header(headerEl[0]);
  } catch (e) {
    if (typeof console !== 'undefined') {
      console.error(e.stack);
    }
  }

  console.log(header);
}());