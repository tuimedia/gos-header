'use strict';

var GEL_Menu = module.exports = function Menu(args) {

    console.log('here1');

    if (!(this instanceof Menu)) {
        return new Menu();
    }

    this.args = args;

    this.init();

};

GEL_Menu.prototype.init = function() {

    var _this = this;

    console.log('menu init');

    // store attributes
    // this.attrs = this.header.dataset;

    // this.page = document.querySelectorAll('.js-content-wrap')[0];

        this.menuEnabled = true;

        this.menu = this.args;

        this.gelMenu();


        console.log(this)
    // // bind events to card elements
    // this.bindEvents();

};

GEL_Menu.prototype.bindEvents = function() {

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



GEL_Menu.prototype.gelMenu = function() {

    var _this = this;

    // initial menu link visibility
    handleMenuLinks();

    //
    this.menu.toggle.addEventListener('click', function(event) {
        handleMenuPanel();
    });

    // toggle menu link visibility on resize
    window.addEventListener('resize', function() {

        _this.menu.primary.style.visibility = 'hidden';

        for (var i = 0; i < _this.menu.primaryItems.length; i++) {
            _this.menu.primaryItems[i].classList.remove('is-hidden');
        }

        if (_this.menu.states.panelOpen) {
            resizeMenu();
        }

        handleMenuLinks();

    }, false);


    function handleMenuPanel() {

        if (_this.notifications.states.notifyPanelOpen) {
            _this.notifications.states.notifyPanelOpen = false;
            _this.notifications.panel.classList.remove('is-open');
        }

        if (_this.menu.states.panelOpen) {
            _this.menu.panel.classList.remove('is-open');
            _this.page.style.transform = 'translateY(0px)';
        } else {
            _this.menu.panel.classList.add('is-open');
            resizeMenu(true);
        }

        _this.menu.states.panelOpen = !_this.menu.states.panelOpen;

    };

    function handleMenuLinks() {

        var availableMenuSpace = _this.menu.primary.clientWidth,
            linkWidths = 0,
            done = false;

        for (var i = 0; i < _this.menu.primaryItems.length; i++) {
            linkWidths = linkWidths + _this.menu.primaryItems[i].clientWidth;
            if (linkWidths < availableMenuSpace) {
                _this.menu.primaryItems[i].classList.remove('is-hidden');
                _this.menu.panelItems[i].classList.remove('is-visible', 'is-first');
                _this.menu.panelItems[i].classList.add('is-hidden');
            } else {
                _this.menu.primaryItems[i].classList.add('is-hidden');
                _this.menu.panelItems[i].classList.remove('is-hidden', 'is-first');
                _this.menu.panelItems[i].classList.add('is-visible');
                if (!done) {
                    _this.menu.primaryItems[i - 1].classList.add('is-hidden');
                    _this.menu.panelItems[i - 1].classList.add('is-visible', 'is-first');
                    _this.menu.panelItems[i - 1].classList.remove('is-hidden');
                    done = true;
                }
            }
        }

        _this.menu.primary.style.visibility = 'visible';

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


