'use strict';

var Header = module.exports = function Header(header) {

    if (!(this instanceof Header)) {
        return new Header(header);
    }

    this.header = header;

    if (this.header) {
        this.init();
    }

};

Header.prototype.init = function(args) {

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
                menuPanelOpen: false,
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
                _this.resizeMenu();
            }

            _this.handleMenuLinks();

        }, false);

    }

};

Header.prototype.handleMenu = function() {

    var _this = this;

    if (this.menu.states.panelOpen) {

        this.header.style.marginBottom = '0px';

    } else {

        this.resizeMenu(true);

    }

    this.menu.states.panelOpen = !this.menu.states.panelOpen;

};

Header.prototype.resizeMenu = function(opening) {

    var _this = this,
        timer,
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

            this.menu.panelItems[i].classList.remove('visible', 'first');
            this.menu.panelItems[i].classList.add('hidden');

        } else {

            this.menu.primaryItems[i].classList.add('hidden');

            this.menu.panelItems[i].classList.remove('hidden', 'first');
            this.menu.panelItems[i].classList.add('visible');

            if (!done) {

                this.menu.primaryItems[i - 1].classList.add('hidden');

                this.menu.panelItems[i - 1].classList.add('visible', 'first');
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

Header.prototype.getJSON = function() {
    console.log('getting json')
    var xmlhttp = new XMLHttpRequest();
    var url = "/notifications.json";

    xmlhttp.onreadystatechange = function() {
        console.log(xmlhttp.readyState, xmlhttp.status)
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            return JSON.parse(xmlhttp.responseText);
        }
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

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
        // this.header.style.marginBottom = '0px';
        _this.page.style.transform = 'translateY(0px)';

        this.notifications.panel.classList.remove('is-open');

        for (var i = 0; i < this.notifications.items.childNodes.length; i++) {
            this.notifications.items.childNodes[i].isNew = false;
            this.notifications.items.childNodes[i].classList.remove('is-new');
        };

    }

    // panal is closed - open it
    else {

        _this.page.style.transform = 'translateY(' + this.notificationPanelHeight + 'px)';

        // this.header.style.marginBottom = this.notificationPanelHeight + 'px';
        this.notifications.panel.classList.add('is-open');

    }

    this.notifications.states.notifyPanelOpen = !this.notifications.states.notifyPanelOpen;

};

Header.prototype.getNotifications = function() {

    var xmlhttp = new XMLHttpRequest();
    var url = "/notifications.json";
    var haveNew = false;
    var _this = this;

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            templateNotifications(myArr);
            haveNew = true;
        }
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    function templateNotifications(arr) {

        var out = "";
        var i;

        for (i = 0; i < arr.length; i++) {

            out += '<li class="notify-panel__item ' + handleNew(arr[i].isNew) + ' ' + handleExpiry(arr[i].isExpiring) + ' js-notify-item"><a href="#">';
            out += '    <div class="notify-panel__item-attribution"><i class="icon icon--' + arr[i].type + '"></i></div>';
            out += '        <div class="notify-panel__item-controls">';
            out += '            <button class="js-notify-delete">delete</button>';
            out += '        </div>';
            out += '        <div class="notify-panel__item-details">';
            out += '            <h4>' + arr[i].title + '</h4>';
            out += '            <p>' + arr[i].desc + ' | ' + handleTimestamp(arr[i].time) + '</p>';
            out += '            <button class="js-notify-control">options' + i + '</button>';
            out += '        </div>';
            out += '    </a>';
            out += '</li>';

        }

        _this.notifications.items.innerHTML = out;

        var items = _this.notifications.items.childNodes;

        for (var i = 0; i < items.length; i++) {
            setupNotification(items[i]);
        };

        _this.notifications.cta.classList.add('has-notifications');

    }

    function setupNotification(notification) {

        console.log('item', notification);
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

        var ret = new Date(timestamp);
        ret = ret.toLocaleString();
        return ret;
    }

    if (haveNew) {
        this.notifications.states.newNotifications = true;
        this.notifications.cta.classList.add('has-notifications');
    } else {
        this.notifications.states.newNotifications = false;
        this.notifications.cta.classList.remove('has-notifications');
    }
};

Header.prototype.handleNotifications = function(type) {};