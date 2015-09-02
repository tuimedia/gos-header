'use strict';

var Header = require('./header');
var headerEl = document.querySelectorAll('.js-header');
var header;

try {

  header = new Header(headerEl[0]);

  setTimeout(function() {
    header.getNotifications();
  }, 500);

} catch (e) {
  if (typeof console !== 'undefined') {
    console.error(e.stack);
  }
}