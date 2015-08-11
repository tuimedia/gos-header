var Header = (function() {

    'use strict';

    function Header(header) {

        if (!(this instanceof Header)) {
            return new Header(header);
        }

        this.header = header;
        console.log(header)
        if (this.header) {
            this.init();
        }

    }

    Header.prototype.init = function(args) {

        console.log('Header init()', this.header);

        var _this = this;

        // store attributes
        this.attrs = this.header.dataset;

        if (this.header.querySelectorAll('.js-notify')[0] && this.header.querySelectorAll('.js-notify-panel')[0]) {

            // only enable notifications if the stuff is there to allow them to work
            this.notificationsEnabled = true;

            this.notifications = {
                cta: this.header.querySelectorAll('.js-notify')[0],
                panel: this.header.querySelectorAll('.js-notify-panel')[0],
                items: this.header.querySelectorAll('.js-notify-item'),
                close: this.header.querySelectorAll('.js-notify-close')[0],
                settingsCta: this.header.querySelectorAll('.js-notify-settings')[0],
                states: {
                    notifyPanelOpen: false,
                    settingsPanelOpen: false,
                    newNotifications: false
                }
            };

            // set height of panel to 75% of total page height
            console.log(window.innerHeight * 0.75);


        }

        // bind events to card elements
        this.bindEvents();

    };

    Header.prototype.bindEvents = function() {

        console.log('binding events for Header');

        var _this = this;

        if (this.notificationsEnabled) {

            this.notifications.cta.addEventListener('click', function(event) {

                _this.handleNotificationPanel();

            });

        }

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

    return Header;

}());