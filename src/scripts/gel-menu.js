'use strict';
var utils = require('../../bower_components/gos-core/src/scripts/utils');

var GEL_Menu = module.exports = function GEL_Menu(args) {

  if (!(this instanceof GEL_Menu)) {
    return new GEL_Menu();
  }

  // store any arguments
  this.args = args;

  // store initial screen size. Update on window resize
  this.screenSize = utils.screenSize();

  this.navWrap = document.querySelectorAll(args.selector)[0];
  this.nav = this.navWrap.querySelectorAll('.js-nav')[0];
  this.navItems = this.nav.children;
  this.panel = this.navWrap.querySelectorAll('.js-nav-panel')[0];
  this.toggle = this.navWrap.querySelectorAll('.js-nav-toggle')[0];

  this.states = {
    panelOpen: false
  }

  // go
  this.init();

};

GEL_Menu.prototype.init = function() {

  var self = this;

  switch(this.args.type) {
    case 'all':

      break;
    case 'local':

      // clone primary items and append to panel
      this.secondary = self.nav.cloneNode(true);
      this.secondaryItems = self.secondary.children;
      this.panel.appendChild(self.secondary);
      break;
  }

  self.toggle.innerText = self.args.toggle.inactive;

  // initial menu link visibility
  handleMenuLinks();

  // open/close menu panel on click
  this.toggle.addEventListener('click', function(event) {
    handleMenuPanel('panel');
  });

  // toggle menu link visibility on resize
  window.addEventListener('resize', function() {

    // store/update screen size
    self.screenSize = utils.screenSize();

    // hide things while resizing
    self.nav.style.visibility = 'hidden'; // hide menu when recalculating visible links

    // show all primary menu items so we can calculate available space
    for (var i = 0; i < self.navItems.length; i++) {
      self.navItems[i].classList.remove('is-hidden');
    }

    // handle link visibility
    handleMenuLinks();

  }, false);

  // panel state controller
  function handleMenuPanel(type) {

    if(self.states.panelOpen) {
      self.toggle.innerText = self.args.toggle.inactive;
    } else {
      self.toggle.innerText = self.args.toggle.active;
    }

    switch(type) {
      case 'panel':
        self.panel.classList.toggle('is-open');
      break;
      case 'mobile':
        self.panel.classList.remove('is-open');
        self.navWrap.classList.toggle('is-open');
      break;
    }

    // toggle menu panel open state
    self.states.panelOpen = !self.states.panelOpen;

  };

  // handle vidibility of menu items based on available space
  // if no space in primary emnu, show items in panel
  function handleMenuLinks() {

    var availableMenuSpace = self.nav.clientWidth,
      linkWidths = 0;

    if(self.screenSize !== 'palm') {
      var visibleItems = 0;

      for (var i = 0; i < self.navItems.length; i++) {

        linkWidths = linkWidths + self.navItems[i].clientWidth;

        // if total width of links is less than available space
        if (linkWidths < availableMenuSpace - 100) {

          visibleItems ++;

          // show primary item
          self.navItems[i].classList.remove('is-hidden');
          if(self.args.type === 'local') {
            // hide secondary item
            self.secondaryItems[i].classList.remove('is-visible', 'is-first');
            self.secondaryItems[i].classList.add('is-hidden');
          }

        } else {

          visibleItems --;

          // hide primary item
          self.navItems[i].classList.add('is-hidden');

          // show secondary item
          if(self.args.type === 'local') {
            self.secondaryItems[i].classList.remove('is-hidden', 'is-first');
            self.secondaryItems[i].classList.add('is-visible');
          }

        }

      }

      // if all menu items are visible
      if(visibleItems === self.navItems.length && self.args.type === 'local')  {
        self.toggle.classList.add('is-hidden');
      } else {
        self.toggle.classList.remove('is-hidden');
      }

    } else {

      for (var i = 0; i < self.navItems.length; i++) {
          self.navItems[i].classList.remove('is-hidden');
      }

    }

    self.nav.style.visibility = 'visible';

  };


};


