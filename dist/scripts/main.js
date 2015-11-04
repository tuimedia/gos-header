(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = {
  breakpoints: {
      'lap': 450,
      'desk': 768,
      'desk-wide': 1008
  },
  getAllElementsWithAttribute: function(attribute) {
    var matchingElements = [];
    var allElements = document.getElementsByTagName('*');
    for (var i = 0, n = allElements.length; i < n; i++) {
      if (allElements[i].getAttribute(attribute) !== null) {
        // Element exists with attribute. Add to array.
        matchingElements.push(allElements[i]);
      }
    }
    return matchingElements;
  },
  debounce: function(fn, delay) {
    var timer = null;
    return function() {
      var context = this,
          args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(context, args);
      }, delay);
    };
  },
  throttle: function(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
        deferTimer;
    return function() {

      var context = scope || this;

      var now = +new Date(),
          args = arguments;

      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function() {
            last = now;
            fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  },
  screenSize: function() {
    if (window.innerWidth >= this.breakpoints['desk-wide']) {
        return 'desk-wide';
    } else if (window.innerWidth < this.breakpoints['desk-wide'] && window.innerWidth >= this.breakpoints['desk']) {
        return 'desk';
    } else if (window.innerWidth < this.breakpoints['desk'] && window.innerWidth >= this.breakpoints['lap']) {
        return 'lap';
    } else {
        return 'palm';
    }
  }
};

},{}],2:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],3:[function(require,module,exports){
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
      this.secondary = self.nav.cloneNode(true);
      this.secondaryItems = self.secondary.children;
      this.panel.appendChild(self.secondary);
      break;
  }

  self.toggle.innerText = self.args.toggle.inactive;
  // self.activePrimaryLink = this.navItems;

  // console.log('self.activePrimaryLink', self.activePrimaryLink);

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



},{"../../bower_components/gos-core/src/scripts/utils":1}],4:[function(require,module,exports){
'use strict';

var GEL_Promos = module.exports = function Promos(args) {

    if (!(this instanceof Promos)) {
        return new Promos();
    }

    this.args = args;

    this.init();

};

GEL_Promos.prototype.init = function() {

    var _this = this;

    this.promos = this.args.el.querySelectorAll('.js-promo');

    for (var i = 0; i < this.promos.length; i++) {
        this.setupPromo(this.promos[i]);
    };

};

GEL_Promos.prototype.setupPromo = function(promo) {

    // setup promo media (if required)
    if(promo.dataset.bgImg) {
        promo.querySelectorAll('.js-media')[0].style.backgroundImage = 'url(' + promo.dataset.bgImg + ')';
    }

};



},{}],5:[function(require,module,exports){
'use strict';
var Menu = require('./gel-menu');

var GEL_Header = module.exports = function Header(args) {

    if (!(this instanceof Header)) {
        return new Header(args);
    }

    if (args.el.length > 1) {
        console.error('More than one header element found');
        return;
    }

    this.header = args.el[0];
    this.args = args;

    this.init();

};

GEL_Header.prototype.init = function(args) {


    // store attributes
    this.attrs = this.header.dataset;

    this.page = document.querySelectorAll('.js-content-wrap')[0];

    if (this.header.querySelectorAll('.js-menu-primary')[0] && this.header.querySelectorAll('.js-menu-panel')[0]) {

        this.menuEnabled = true;

        this.menu = {
            primary: this.header.querySelectorAll('.js-menu-primary')[0],
            secondary: this.header.querySelectorAll('.js-menu-secondary')[0],
            primaryItems: this.header.querySelectorAll('.js-menu-primary')[0].children,
            panel: this.header.querySelectorAll('.js-menu-panel')[0],
            panelItems: this.header.querySelectorAll('.js-menu-secondary')[0].children,
            toggle: this.header.querySelectorAll('.js-menu-toggle')[0],
            states: {
                panelOpen: false,
                expanding: false,
                contracting: false
            }
        };

        this.gelMenu(this.menu);

    }

    if (this.header.querySelectorAll('.js-notify')[0] && this.header.querySelectorAll('.js-notify-panel')[0]) {

        // only enable notifications if the stuff is there to allow them to work
        this.notificationsEnabled = true;

        this.notifications = {
            cta: this.header.querySelectorAll('.js-notify')[0],
            panel: this.header.querySelectorAll('.js-notify-panel')[0],
            items: this.header.querySelectorAll('.js-notify-items')[0],
            close: this.header.querySelectorAll('.js-notify-close')[0],
            settingsCta: this.header.querySelectorAll('.js-notify-settings')[0],
            settingsPanel: this.header.querySelectorAll('.js-notify-settings-panel')[0],
            settingsClose: this.header.querySelectorAll('.js-notify-settings-close')[0],
            states: {
                notifyPanelOpen: false,
                settingsPanelOpen: false,
                newNotifications: false
            }
        };

    }

    this.bindEvents();

};

GEL_Header.prototype.bindEvents = function() {

    var _this = this;

    if (this.notificationsEnabled) {

        this.notifications.cta.addEventListener('click', function(event) {

            _this.handleNotificationPanel();

            if (_this.notifications.states.settingsPanelOpen) {
                _this.handleSettingsPanel();
            }

        });

        this.notifications.close.addEventListener('click', function(event) {
            _this.handleNotificationPanel();
        });

        this.notifications.settingsCta.addEventListener('click', function(event) {
            _this.handleSettingsPanel();
        });

        this.notifications.settingsClose.addEventListener('click', function(event) {
            _this.handleSettingsPanel();
        });

    }

};



GEL_Header.prototype.gelMenu = function(menu) {

    var _this = this;

    // initial menu link visibility
    handleMenuLinks();

    menu.toggle.addEventListener('click', function(event) {

        handleMenuPanel();
    });

    // toggle menu link visibility on resize
    window.addEventListener('resize', function() {

        menu.primary.style.visibility = 'hidden';

        for (var i = 0; i < menu.primaryItems.length; i++) {
            menu.primaryItems[i].classList.remove('is-hidden');
        }

        if (menu.states.panelOpen) {
            resizeMenu();
        }

        handleMenuLinks();

    }, false);


    function handleMenuPanel() {

        if (_this.notifications.states.notifyPanelOpen) {
            _this.notifications.states.notifyPanelOpen = false;
            _this.notifications.panel.classList.remove('is-open');
        }

        if (menu.states.panelOpen) {
            menu.panel.classList.remove('is-open');
            _this.page.style.transform = 'translateY(0px)';
        } else {
            menu.panel.classList.add('is-open');
            resizeMenu(true);
        }

        menu.states.panelOpen = !menu.states.panelOpen;

    };

    function handleMenuLinks() {

        var availableMenuSpace = menu.primary.clientWidth,
            linkWidths = 0,
            done = false;

        for (var i = 0; i < menu.primaryItems.length; i++) {
            linkWidths = linkWidths + menu.primaryItems[i].clientWidth;
            if (linkWidths < availableMenuSpace) {
                menu.primaryItems[i].classList.remove('is-hidden');
                menu.panelItems[i].classList.remove('is-visible', 'is-first');
                menu.panelItems[i].classList.add('is-hidden');
            } else {
                menu.primaryItems[i].classList.add('is-hidden');
                menu.panelItems[i].classList.remove('is-hidden', 'is-first');
                menu.panelItems[i].classList.add('is-visible');
                if (!done) {
                    menu.primaryItems[i - 1].classList.add('is-hidden');
                    menu.panelItems[i - 1].classList.add('is-visible', 'is-first');
                    menu.panelItems[i - 1].classList.remove('is-hidden');
                    done = true;
                }
            }
        }

        menu.primary.style.visibility = 'visible';

    };

    function resizeMenu(opening) {

        var timer,
            secondaryMenuHeight;

        if (opening) {
            secondaryMenuHeight = _this.menu.secondary.clientHeight;
            _this.page.style.transform = 'translateY(' + secondaryMenuHeight + 'px)';
        } else {
            timer = setTimeout(function() {
                secondaryMenuHeight = _this.menu.secondary.clientHeight;
                _this.page.style.transform = 'translateY(' + secondaryMenuHeight + 'px)';
            }, 500);
        }

    };

};



GEL_Header.prototype.handleSettingsPanel = function() {

    if (this.notifications.states.settingsPanelOpen) {
        this.notifications.settingsPanel.classList.remove('is-open');
    } else {
        this.notifications.settingsPanel.classList.add('is-open');
    }

    this.notifications.states.settingsPanelOpen = !this.notifications.states.settingsPanelOpen;

};


GEL_Header.prototype.handleNotificationPanel = function() {

    var _this = this;

    function setNotificationPanelHeight() {

        if (_this.notifications.states.newNotifications) {
            _this.notificationPanelHeight = window.innerHeight * 0.75;
            _this.notifications.panel.style.height = _this.notificationPanelHeight + 'px';
        } else {
            console.log('here');
        }
    }


    // if menu is open when opening notifications panel then close menu
    if (this.menu.states.panelOpen) {
        this.menu.states.panelOpen = false;
        this.menu.panel.classList.remove('is-open');
    }

    setNotificationPanelHeight();

    // panel is open - close it
    if (this.notifications.states.notifyPanelOpen) {

        _this.page.style.transform = 'translateY(0px)';

        setTimeout(function() {
            _this.notifications.panel.classList.remove('is-open');
        }, 400);


        for (var i = 0; i < this.notifications.items.childNodes.length; i++) {
            this.notifications.items.childNodes[i].isNew = false;
            this.notifications.items.childNodes[i].classList.remove('is-new');
        };

    } else {

        // panel is opening. Trigger notification panel open event
        _this.page.style.transform = 'translateY(' + this.notificationPanelHeight + 'px)';

        this.notifications.panel.classList.add('is-open');

    }

    this.notifications.states.notifyPanelOpen = !this.notifications.states.notifyPanelOpen;

};

GEL_Header.prototype.getNotifications = function() {

    var xmlhttp = new XMLHttpRequest();
    var url = '/notifications.json';
    var haveNew = false;
    var _this = this;

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            haveNew = true;
            templateNotifications(myArr);
        }
    };

    xmlhttp.open('GET', url, true);
    xmlhttp.send();

    function templateNotifications(arr) {

        var out = '';
        var i;

        for (i = 0; i < arr.length; i++) {

            out += '<li class="notify-panel__item ' + handleNew(arr[i].isNew) + ' ' + handleExpiry(arr[i].isExpiring) + ' js-notify-item"><a href="#">';
            out += '    <div class="notify-panel__item-attribution"><i class="icon icon--' + arr[i].type + '"></i></div>';
            out += '        <div class="notify-panel__item-controls">';
            out += '            <div class="notify-panel__item-control notify-panel__item-control--options">';
            out += '                <button class="js-notify-control">options</button>';
            out += '            </div>';
            out += '            <div class="notify-panel__item-control notify-panel__item-control--delete">';
            out += '                <button class="js-notify-delete">delete</button>';
            out += '            </div>';
            out += '        </div>';
            out += '        <div class="notify-panel__item-details">';
            out += '            <h4>' + arr[i].title + '</h4>';
            out += '            <p>' + arr[i].desc + ' | ' + handleTimestamp(arr[i].time) + '</p>';
            out += '        </div>';
            out += '    </a>';
            out += '</li>';

        }

        _this.notifications.items.innerHTML = out;

        var items = _this.notifications.items.childNodes;

        for (var x = 0; x < items.length; x++) {
            setupNotification(items[x]);
        };

        setNotificationStatus();

    }

    function setupNotification(notification) {

        var optionsButton = notification.querySelectorAll('.js-notify-control');
        var deleteButton = notification.querySelectorAll('.js-notify-delete');

        optionsButton[0].addEventListener('click', function(event) {
            handleNotificationPanel(notification);
        });

        deleteButton[0].addEventListener('click', function(event) {
            deleteItem(notification);
        });

    }

    function handleNotificationPanel(notification) {
        console.log(notification);
        notification.classList.toggle('is-open');
    }

    function deleteItem(item) {
        item.parentNode.removeChild(item);
    }

    function handleExpiry(isExpiring) {
        return isExpiring ? 'is-expiring' : '';
    }

    function handleNew(isNew) {
        return isNew ? 'is-new' : '';
    }

    function handleTimestamp(timestamp) {
        // var ret = new Date(timestamp);
        // ret = ret.toLocaleString();
        // return ret;
        return timestamp;
    }

    var bellAnimationTimer;

    function setNotificationStatus() {

        if (haveNew) {
            _this.notifications.states.newNotifications = true;
            _this.notifications.cta.classList.add('has-notifications', 'animate');

            bellAnimationTimer = setInterval(function() {
                animateBell();
            }, 10000);

        } else {
            _this.notifications.states.newNotifications = false;
            _this.notifications.cta.classList.remove('has-notifications');
        }

    }

    function animateBell() {
        _this.notifications.cta.classList.add('animate');
        setTimeout(function() {
            _this.notifications.cta.classList.remove('animate');
        }, 5000);
    }

    function myStopFunction() {
        clearInterval(bellAnimationTimer);
    }

};

GEL_Header.prototype.handleNotifications = function(type) {};
},{"./gel-menu":3}],6:[function(require,module,exports){
'use strict';

var Header = require('./header');
var Masthead = require('./masthead');
var Promos = require('./gel-promos');

var pageHeader;
var masthead = document.querySelectorAll('.js-masthead');
var promoGroups = document.querySelectorAll('.js-promo-group');



var mastheadArgs = {
  el: masthead,
  menus: [{
    type: 'all',
    selector: '.gel-masthead__nav-wrap--primary',
    toggle: {
      active: 'Close',
      inactive: 'Show All'
    }
  }, {
    type: 'local',
    selector: '.gel-masthead__nav-wrap--local',
    activePrimaryLink: 'link3',
    toggle: {
      active: 'Hide',
      inactive: 'More'
    }
  }]
}

document.addEventListener("DOMContentLoaded", function(event) {

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
});

},{"./gel-promos":4,"./header":5,"./masthead":7}],7:[function(require,module,exports){
'use strict';

var extend = require('extend');
var utils = require('../../bower_components/gos-core/src/scripts/utils');

var GEL_Menu = require('./gel-menu');

var Masthead = module.exports = function Masthead(args) {

  if (!(this instanceof Masthead)) {
    return new Masthead(masthead);
  }

  this.masthead = args.el[0];
  this.args = args;

  if (this.masthead) {
    this.init();
  }

};

Masthead.prototype.init = function(args) {

  var _this = this;

  this.menus = [];

  for (var i = 0; i < this.args.menus.length; i++) {
    var menu = new GEL_Menu(this.args.menus[i]);
    this.menus.push(menu);
  };

};

},{"../../bower_components/gos-core/src/scripts/utils":1,"./gel-menu":3,"extend":2}]},{},[3,4,5,6,7]);
