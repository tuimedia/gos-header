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

    this.init();

};

GEL_Header.prototype.init = function(args) {

    var _this = this;

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

        this.gelMenu();

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

    // bind events to card elements
    this.bindEvents();

    //
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



GEL_Header.prototype.gelMenu = function() {

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