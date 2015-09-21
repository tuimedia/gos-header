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
