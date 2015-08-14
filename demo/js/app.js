'use strict';
var header;

document.addEventListener('DOMContentLoaded', function() {

  var html = document.querySelectorAll('html');

  html[0].classList.remove('no-js');

  var headerEl = document.querySelectorAll('.js-header');

  try {
    header = new Header(headerEl[0]);
  } catch (e) {
    if (typeof console !== 'undefined') {
      console.error(e.stack);
    }
  }

}, false);