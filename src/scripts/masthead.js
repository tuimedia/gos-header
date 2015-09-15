'use strict';

var extend = require('extend');
var utils = require('../../bower_components/gos-core/src/scripts/utils');

var Masthead = module.exports = function Masthead(masthead) {

  if (!(this instanceof Masthead)) {
    return new Masthead(masthead);
  }

  this.masthead = masthead;

  if (this.masthead) {
    this.init();
  }

};

Masthead.prototype.init = function(args) {

  var _this = this;

  // TODO: better checking
  if (this.masthead[0].querySelectorAll('.js-menu-primary')[0]) {

    this.menu = {
      mobileTrigger: this.masthead[0].querySelectorAll('.js-m-menu-toggle')[0],
      desktopTrigger: this.masthead[0].querySelectorAll('.js-menu-toggle')[0],
      menuWrap: this.masthead[0].querySelectorAll('.js-masthead-nav')[0],
      flyouts: this.masthead[0].querySelectorAll('.js-flyout'),
      states: {
        isOpen: false
      },
      layouts: {
        compact: false,
        expanded: false
      }
    };

  }

  if (this.masthead[0].querySelectorAll('.js-drawer-nav')) {

    // create object to store draw nav configs. Index used as key

    this.drawerNavs = {};

    for (var i = 0; i < this.masthead[0].querySelectorAll('.js-drawer-nav').length; i++) {
      this.initDrawerNav(this.masthead[0].querySelectorAll('.js-drawer-nav')[i], i);
    };

  }

  this.bindEvents();

};

Masthead.prototype.bindEvents = function() {

  var _this = this;

  if (this.menu.mobileTrigger) {

    this.menu.mobileTrigger.addEventListener('click', function() {
      _this.menu.menuWrap.classList.toggle('is-open');
      _this.menu.states.isOpen = !_this.menu.states.isOpen;
    }, false);


    this.menu.desktopTrigger.addEventListener('click', function() {
      _this.menu.menuWrap.classList.toggle('is-open');
      _this.menu.states.isOpen = !_this.menu.states.isOpen;
    }, false);

  }

  // setup flyouts if they exist in the menu
  if (this.menu.flyouts) {

    for (var i = 0; i < this.menu.flyouts.length; i++) {


      _this.menu.flyouts[i].addEventListener('click', function() {

        if (this.isOpen) {
          this.classList.toggle('is-open');
        } else {
          closeOpenItems();
          this.classList.toggle('is-open');
        }

        this.isOpen = !this.isOpen;

      }, false);

    };

  }

  function closeOpenItems() {
    for (var i = 0; i < _this.menu.flyouts.length; i++) {
      _this.menu.flyouts[i].classList.remove('is-open');
    };
  }

};

// reset on window resize
Masthead.prototype.resetMenus = function() {

  // close flyouts

  // close menu

};

Masthead.prototype.initDrawerNav = function(el, index) {

  var _this = this;

  this.drawerNavs[index] = {
    container: el.querySelectorAll('ul')[0],
    items: el.querySelectorAll('li'),
    toggle: el.querySelectorAll('.js-drawer-nav-toggle')[0],
    drawer: el.querySelectorAll('.js-drawer-nav-drawer')[0]
  };

  var drawerList = document.createElement('ul');


  var handleVisibleItems = function() {

    var totalLinkWidth = 0;
    var availableSpace = _this.drawerNavs[index].container.clientWidth;

    for (var i = 0; i < _this.drawerNavs[index].items.length; i++) {

      // incremement total width
      totalLinkWidth = totalLinkWidth + _this.drawerNavs[index].items[i].clientWidth;

      // if the links are wider than the available space...
      if (totalLinkWidth > availableSpace - 100) {
        _this.drawerNavs[index].drawerItems[i].classList.remove('is-hidden');
        _this.drawerNavs[index].items[i].classList.add('is-hidden');
      } else {
        _this.drawerNavs[index].drawerItems[i].classList.add('is-hidden');
        _this.drawerNavs[index].items[i].classList.remove('is-hidden');
      }
    }

    _this.drawerNavs[index].container.style.visibility = 'visible';

    console.log('called');

  };

  // clone all links into drawer
  for (var i = 0; i < this.drawerNavs[index].items.length; i++) {
    var clonedItem = this.drawerNavs[index].items[i].cloneNode(true);
    drawerList.appendChild(clonedItem);
  };

  this.drawerNavs[index].drawer.appendChild(drawerList);
  this.drawerNavs[index].drawerItems = this.drawerNavs[index].drawer.querySelectorAll('li');

  handleVisibleItems();

  window.addEventListener('resize', function() {
    _this.drawerNavs[index].container.style.visibility = 'hidden';

    // utils.debounce(function() {
    handleVisibleItems();
    // });

  });

};