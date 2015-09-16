'use strict';

var Header = require('./header');
var Masthead = require('./masthead');
var Promos = require('./gel-promos');

var pageHeader;
var masthead = document.querySelectorAll('.js-masthead');
var promoGroups = document.querySelectorAll('.js-promo-group');



var mastheadArgs = {
  el: masthead,
  primaryMenu: {
    type: '',
    selectors = {
      navWrap: '.js-nav-wrap',
      nav: '.js-nav-primary',
      navItems: '.js-nav-primary',
      panel: '.gel-masthead__nav-panel--primary',
      toggle: '.js-nav-toggle',
      mobileToggle: '.js-m-nav-toggle'
    }
  }
}

try {
  masthead = new Masthead(mastheadArgs);
} catch (e) {
  if (typeof console !== 'undefined') {
    console.error(e.stack);
  }
}

for (var i = 0; i < promoGroups.length; i++) {

  try {
    var args = {
      el: promoGroups[i],
      arg1: 'arg1'
    };
    var promoGroupInstance = new Promos(args);
  } catch (e) {
    if (typeof console !== 'undefined') {
      console.error(e.stack);
    }
  }

};

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