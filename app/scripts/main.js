'use strict';

var Header = require('./header');
var headerEl = document.querySelectorAll('.js-header');
var header;

try {
  header = new Header(headerEl[0]);
} catch (e) {
  if (typeof console !== 'undefined') {
    console.error(e.stack);
  }
}
