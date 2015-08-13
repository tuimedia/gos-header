var Header = (function() {

    'use strict';

    function Header(header) {

        if (!(this instanceof Header)) {
            return new Header(header);
        }

        this.header = header;

        console.log(this, this.header)
        if (this.header) {
            this.init();
        }

    }

    Header.prototype.init = function(args) {

        var _this = this;

        // store attributes
        this.attrs = this.header.dataset;

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

        }

        if (this.header.querySelectorAll('.js-notify')[0] && this.header.querySelectorAll('.js-notify-panel')[0]) {

            // only enable notifications if the stuff is there to allow them to work
            this.notificationsEnabled = true;

            this.notifications = {
                cta: this.header.querySelectorAll('.js-notify')[0],
                panel: this.header.querySelectorAll('.js-notify-panel')[0],
                items: this.header.querySelectorAll('.js-notify-item'),
                close: this.header.querySelectorAll('.js-notify-close')[0],
                settingsCta: this.header.querySelectorAll('.js-notify-settings')[0],
                settingsPanel: this.header.querySelectorAll('.js-notify-settings-panel')[0],
                settingsClose: this.header.querySelectorAll('.js-notify-settings-close')[0],
                states: {
                    menuPanelOpen: false,
                    notifyPanelOpen: false,
                    settingsPanelOpen: false,
                    newNotifications: false
                }
            };

        }

        // bind events to card elements
        this.bindEvents();

    };

    Header.prototype.bindEvents = function() {

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

        if (this.menuEnabled) {

            // initial menu link visibility
            this.handleMenuLinks();

            //
            this.menu.toggle.addEventListener('click', function(event) {

                _this.handleMenu();

            });

            // toggle menu link visibility on resize
            window.addEventListener('resize', function() {

                _this.menu.primary.style.visibility = 'hidden';

                for (var i = 0; i < _this.menu.primaryItems.length; i++) {

                    _this.menu.primaryItems[i].classList.remove('hidden');

                }

                console.log(_this.menu.states.panelOpen);

                if (_this.menu.states.panelOpen) {

                    console.log('here')
                    _this.resizeMenu();

                }

                _this.handleMenuLinks();

            }, false);

        }

    };

    Header.prototype.handleMenu = function() {

        console.log('menu')

        var _this = this;

        if (this.menu.states.panelOpen) {

            this.header.style.marginBottom = '0px';

        } else {

            this.resizeMenu(true);

        }

        this.menu.states.panelOpen = !this.menu.states.panelOpen;

    };

    Header.prototype.resizeMenu = function(opening) {

        var timer;

        var _this = this,
            secondaryMenuHeight;

        if (opening) {
            secondaryMenuHeight = _this.menu.secondary.clientHeight;
            _this.header.style.marginBottom = secondaryMenuHeight + 'px';

        } else {
            timer = setTimeout(function() {
                secondaryMenuHeight = _this.menu.secondary.clientHeight;
                _this.header.style.marginBottom = secondaryMenuHeight + 'px';
            }, 500);
        }


    };

    Header.prototype.handleMenuLinks = function() {

        var _this = this,
            availableMenuSpace = this.menu.primary.clientWidth,
            linkWidths = 0,
            done = false;

        for (var i = 0; i < this.menu.primaryItems.length; i++) {

            linkWidths = linkWidths + this.menu.primaryItems[i].clientWidth;

            if (linkWidths < availableMenuSpace) {

                this.menu.primaryItems[i].classList.remove('hidden');

                this.menu.panelItems[i].classList.remove('visible');
                this.menu.panelItems[i].classList.add('hidden');

            } else {

                this.menu.primaryItems[i].classList.add('hidden');

                this.menu.panelItems[i].classList.remove('hidden');
                this.menu.panelItems[i].classList.add('visible');

                if (!done) {

                    this.menu.primaryItems[i - 1].classList.add('hidden');

                    this.menu.panelItems[i - 1].classList.add('visible');
                    this.menu.panelItems[i - 1].classList.remove('hidden');

                    done = true;

                }

            }

        };

        this.menu.primary.style.visibility = 'visible';

    };

    Header.prototype.handleSettingsPanel = function() {

        if (this.notifications.states.settingsPanelOpen) {

            this.notifications.settingsPanel.classList.remove('is-open');

        } else {

            this.notifications.settingsPanel.classList.add('is-open');

        }

        this.notifications.states.settingsPanelOpen = !this.notifications.states.settingsPanelOpen;

    };

    Header.prototype.handleNotificationPanel = function() {

        // store panel height and set on load
        var _this = this;

        function setNotificationPanelHeight() {
            _this.notificationPanelHeight = window.innerHeight * 0.75;
            _this.notifications.panel.style.height = _this.notificationPanelHeight + 'px';
        }

        setNotificationPanelHeight();


        // panel is open - close it
        if (this.notifications.states.notifyPanelOpen) {
            this.header.style.marginBottom = '0px';
            this.notifications.panel.classList.remove('is-open');
        }

        // panal is closed - open it
        else {
            this.header.style.marginBottom = this.notificationPanelHeight + 'px';
            this.notifications.panel.classList.add('is-open');
        }

        this.notifications.states.notifyPanelOpen = !this.notifications.states.notifyPanelOpen;

    };

    Header.prototype.getNotifications = function() {};

    Header.prototype.handleNotifications = function() {};

    return Header;

}());