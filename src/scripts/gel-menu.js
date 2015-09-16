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

  console.log('GEL menu init');

  // clone primary items and append to panel
  menu.secondary = menu.primary.cloneNode(true);
  menu.secondaryItems = menu.secondary.children;
  menu.panel.appendChild(menu.secondary);

  // open/close menu panel on click
  menu.toggle.addEventListener('click', function(event) {
    handleMenuPanel('panel');
  });

  menu.mobileToggle.addEventListener('click', function(event) {
    handleMenuPanel('mobile');
  });

  // initial menu link visibility
  handleMenuLinks();

  // toggle menu link visibility on resize
  window.addEventListener('resize', function() {

    _this.screenSize = utils.screenSize();

    menu.primary.style.visibility = 'hidden'; // hide menu when recalculating visible links

    // show all primary menu items so we can calculat available space
    for (var i = 0; i < menu.primaryItems.length; i++) {
      menu.primaryItems[i].classList.remove('is-hidden');
    }

    if (menu.states.panelOpen) {
      resizeMenu();
    }

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

    menu.states.panelOpen = !menu.states.panelOpen;

  };

  // handle vidibility of menu items based on available space
  // if no space in primary emnu, show items in panel
  function handleMenuLinks() {

    var availableMenuSpace = menu.primary.clientWidth,
      linkWidths = 0,
      done = false;

    if(_this.screenSize !== 'palm') {

      for (var i = 0; i < menu.primaryItems.length; i++) {

        linkWidths = linkWidths + menu.primaryItems[i].clientWidth;

        // if total width of links is less than available space
        if (linkWidths < availableMenuSpace) {

          // show primary item
          menu.primaryItems[i].classList.remove('is-hidden');

          // hide secondary item
          menu.secondaryItems[i].classList.remove('is-visible', 'is-first');
          menu.secondaryItems[i].classList.add('is-hidden');

        } else {

          // hide primary item
          menu.primaryItems[i].classList.add('is-hidden');

          // show secondary item
          menu.secondaryItems[i].classList.remove('is-hidden', 'is-first');
          menu.secondaryItems[i].classList.add('is-visible');

          if (!done) {
            menu.primaryItems[i - 1].classList.add('is-hidden');
            menu.secondaryItems[i - 1].classList.add('is-visible', 'is-first');
            menu.secondaryItems[i - 1].classList.remove('is-hidden');
            done = true;
          }
        }
      }
    } else {

      for (var i = 0; i < menu.primaryItems.length; i++) {
          menu.primaryItems[i].classList.remove('is-hidden');
      }

    }


    menu.primary.style.visibility = 'visible';

  };

  // function resizeMenu(opening) {

  //   var timer,
  //     secondaryMenuHeight;

  //   if (opening) {
  //     menu.panel.classList.add('is-open');
  //     menu.panel.classList.remove('is-closed');
  //   } else {
  //     menu.panel.classList.remove('is-open');
  //     menu.panel.classList.add('is-closed');
  //   }

  // };

};


