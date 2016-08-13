'use strict';

let defaults = require('./defaults.js');
let my = require('./my.js');

const config = Object.assign({}, defaults, my);

module.exports = config;
