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


