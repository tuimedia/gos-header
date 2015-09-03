'use strict';

var Header = require('./header');
var Masthead = require('./masthead');
var header = document.querySelectorAll('.js-header');
var masthead = document.querySelectorAll('.js-masthead');

try {
  masthead = new Masthead(masthead);
} catch (e) {
  if (typeof console !== 'undefined') {
    console.error(e.stack);
  }
}

try {
  header = new Header(header[0]);

  // spoof notifications
  setTimeout(function() {
    header.getNotifications();
  }, 500);

} catch (e) {
  if (typeof console !== 'undefined') {
    console.error(e.stack);
  }
}