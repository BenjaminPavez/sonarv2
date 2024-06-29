/*!
 * Bootstrap v4.0.0-alpha.6 (https://getbootstrap.com)
 * Copyright 2011-2017 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
	throw new Error('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.')
}

(function ($) {
	let version = $.fn.jquery.split(' ')[0].split('.')
	if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] >= 4)) {
		throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0')
	}
})(jQuery);


(function () {

	let _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	let _createClass = function () { function defineProperties(target, props) { for (let i = 0; i < props.length; i++) { let descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * --------------------------------------------------------------------------
	 * Bootstrap (v4.0.0-alpha.6): util.js
	 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
	 * --------------------------------------------------------------------------
	 */

	let Util = function ($) {

		/**
		 * ------------------------------------------------------------------------
		 * Private TransitionEnd Helpers
		 * ------------------------------------------------------------------------
		 */

		let transition = false;

		let MAX_UID = 1000000;

		let TransitionEndEvent = {
			WebkitTransition: 'webkitTransitionEnd',
			MozTransition: 'transitionend',
			OTransition: 'oTransitionEnd otransitionend',
			transition: 'transitionend'
		};

		// shoutout AngusCroll (https://goo.gl/pxwQGp)
		function toType(obj) {
			return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
		}

		function isElement(obj) {
			return (obj[0] || obj).nodeType;
		}

		function getSpecialTransitionEndEvent() {
			return {
				bindType: transition.end,
				delegateType: transition.end,
				handle: function handle(event) {
					if ($(event.target).is(this)) {
						return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
					}
					return undefined;
				}
			};
		}

		function transitionEndTest() {
			if (window.QUnit) {
				return false;
			}

			let el = document.createElement('bootstrap');

			for (let name in TransitionEndEvent) {
				if (el.style[name] !== undefined) {
					return {
						end: TransitionEndEvent[name]
					};
				}
			}

			return false;
		}

		function transitionEndEmulator(duration) {
			let _this = this;

			let called = false;

			$(this).one(Util.TRANSITION_END, function () {
				called = true;
			});

			setTimeout(function () {
				if (!called) {
					Util.triggerTransitionEnd(_this);
				}
			}, duration);

			return this;
		}

		function setTransitionEndSupport() {
			transition = transitionEndTest();

			$.fn.emulateTransitionEnd = transitionEndEmulator;

			if (Util.supportsTransitionEnd()) {
				$.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
			}
		}

		/**
		 * --------------------------------------------------------------------------
		 * Public Util Api
		 * --------------------------------------------------------------------------
		 */

		let Util = {

			TRANSITION_END: 'bsTransitionEnd',

			getUID: function getUID(prefix) {
				do {
					// eslint-disable-next-line no-bitwise
					prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
				} while (document.getElementById(prefix));
				return prefix;
			},
			getSelectorFromElement: function getSelectorFromElement(element) {
				let selector = element.getAttribute('data-target');

				if (!selector) {
					selector = element.getAttribute('href') || '';
					selector = /^#[a-z]/i.test(selector) ? selector : null;
				}

				return selector;
			},
			reflow: function reflow(element) {
				return element.offsetHeight;
			},
			triggerTransitionEnd: function triggerTransitionEnd(element) {
				$(element).trigger(transition.end);
			},
			supportsTransitionEnd: function supportsTransitionEnd() {
				return Boolean(transition);
			},
			typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
				for (let property in configTypes) {
					if (configTypes.hasOwnProperty(property)) {
						let expectedTypes = configTypes[property];
						let value = config[property];
						let valueType = value && isElement(value) ? 'element' : toType(value);

						if (!new RegExp(expectedTypes).test(valueType)) {
							throw new Error(componentName.toUpperCase() + ': ' + ('Option "' + property + '" provided type "' + valueType + '" ') + ('but expected type "' + expectedTypes + '".'));
						}
					}
				}
			}
		};

		setTransitionEndSupport();

		return Util;
	}(jQuery);


})();
