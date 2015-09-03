'use strict';

var Header = require('./header');
var Masthead = require('./masthead');
var pageHeader;
var masthead = document.querySelectorAll('.js-masthead');

try {
  masthead = new Masthead(masthead);
} catch (e) {
  if (typeof console !== 'undefined') {
    console.error(e.stack);
  }
}

try {

  pageHeader = new Header({
    el: document.querySelectorAll('.js-header')
  });

  // spoof notifications
  setTimeout(function() {
    pageHeader.getNotifications();
  }, 500);

} catch (e) {
  if (typeof console !== 'undefined') {
    console.error(e.stack);
  }
}