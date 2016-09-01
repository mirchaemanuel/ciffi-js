// importo libreria npm jquery
var $ = require('jquery');

// router
require('./modules/router');

// importo moduli .js
var Device = require('./modules/device');
var Cookies = require('./modules/cookies');
var Utils = require('./modules/utils');

$('body').addClass('appIsReady');

$(document).ready(function() {

	/* COOKIES */
	/*
	var cookiesPrivacy = new Cookies({
		name: 'cookie__privacy',
		value: {
			userName: 'ciffi'
		}
	});

	cookiesPrivacy.write();
	var _privacy = cookiesPrivacy.read();
	console.log(_privacy);
	cookiesPrivacy.remove();
	*/
	/* COOKIES */

	/* UTILS */

	var utils = new Utils();

	utils.preloadImages([
		'http://ec2-54-229-173-102.eu-west-1.compute.amazonaws.com/assets/images/land/route-1.png',
		'http://ec2-54-229-173-102.eu-west-1.compute.amazonaws.com/assets/images/land/route-2.png',
		'http://ec2-54-229-173-102.eu-west-1.compute.amazonaws.com/assets/images/land/route-3.png'
	],function() {
	},function(res) {
		console.log(res);
	});

	utils.resizeEnd(function(res) {
		console.log('resize end',res);
	});

	utils.scrollEnd(function(res) {
		console.log('scroll end',res);
	});

	/* UTILS */

});