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

  // go
  this.init(args);

};

GEL_Menu.prototype.init = function(menu) {

  var _this = this;

  // clone primary items and append to panel
  menu.secondary = menu.nav.cloneNode(true);
  menu.secondaryItems = menu.secondary.children;
  menu.panel.appendChild(menu.secondary);

  // initial menu link visibility
  handleMenuLinks();

  // open/close menu panel on click
  menu.toggle.addEventListener('click', function(event) {
    handleMenuPanel('panel');
  });

  // mobile menu trigger
  menu.mobileToggle.addEventListener('click', function(event) {
    handleMenuPanel('mobile');
  });

  // toggle menu link visibility on resize
  window.addEventListener('resize', function() {

    // store/update screen size
    _this.screenSize = utils.screenSize();

    // hide things while resizing
    menu.nav.style.visibility = 'hidden'; // hide menu when recalculating visible links

    // show all primary menu items so we can calculate available space
    for (var i = 0; i < menu.navItems.length; i++) {
      menu.navItems[i].classList.remove('is-hidden');
    }

    // handle link visibility
    handleMenuLinks();

  }, false);

  // panel state controller
  function handleMenuPanel(type) {

    switch(type) {
      case 'panel':
        menu.panel.classList.toggle('is-open');
      break;
      case 'mobile':
        menu.panel.classList.remove('is-open');
        menu.navWrap.classList.toggle('is-open');
      break;
    }

    // toggle menu panel open state
    menu.states.panelOpen = !menu.states.panelOpen;

  };

  // handle vidibility of menu items based on available space
  // if no space in primary emnu, show items in panel
  function handleMenuLinks() {

    var availableMenuSpace = menu.nav.clientWidth,
      linkWidths = 0,
      done = false;

    if(_this.screenSize !== 'palm') {
      var visibleItems = 0;

      for (var i = 0; i < menu.navItems.length; i++) {

        linkWidths = linkWidths + menu.navItems[i].clientWidth;

        // if total width of links is less than available space
        if (linkWidths < availableMenuSpace) {

          visibleItems ++;

          // show primary item
          menu.navItems[i].classList.remove('is-hidden');

          // hide secondary item
          menu.secondaryItems[i].classList.remove('is-visible', 'is-first');
          menu.secondaryItems[i].classList.add('is-hidden');

        } else {

          // hide primary item
          menu.navItems[i].classList.add('is-hidden');

          // show secondary item
          menu.secondaryItems[i].classList.remove('is-hidden', 'is-first');
          menu.secondaryItems[i].classList.add('is-visible');

          if (!done) {
            menu.navItems[i - 1].classList.add('is-hidden');
            menu.secondaryItems[i - 1].classList.add('is-visible', 'is-first');
            menu.secondaryItems[i - 1].classList.remove('is-hidden');
            done = true;
          }

        }

      }

      // if all menu items are visible
      if(visibleItems === menu.navItems.length)  {
        menu.toggle.classList.add('is-hidden');
      } else {
        menu.toggle.classList.remove('is-hidden');
      }

    } else {

      for (var i = 0; i < menu.navItems.length; i++) {
          menu.navItems[i].classList.remove('is-hidden');
      }

    }

    menu.nav.style.visibility = 'visible';

  };


};


