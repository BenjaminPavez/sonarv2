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

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

	
	let Tooltip = function ($) {

		/**
		 * Check for Tether dependency
		 * Tether - http://tether.io/
		 */
		if (typeof Tether === 'undefined') {
			throw new Error('Bootstrap tooltips require Tether (http://tether.io/)');
		}

		/**
		 * ------------------------------------------------------------------------
		 * Constants
		 * ------------------------------------------------------------------------
		 */

		let NAME = 'tooltip';
		let VERSION = '4.0.0-alpha.6';
		let DATA_KEY = 'bs.tooltip';
		let EVENT_KEY = '.' + DATA_KEY;
		let JQUERY_NO_CONFLICT = $.fn[NAME];
		let TRANSITION_DURATION = 150;
		let CLASS_PREFIX = 'bs-tether';

		let Default = {
			animation: true,
			template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-inner"></div></div>',
			trigger: 'hover focus',
			title: '',
			delay: 0,
			html: false,
			selector: false,
			placement: 'top',
			offset: '0 0',
			constraints: [],
			container: false
		};

		let DefaultType = {
			animation: 'boolean',
			template: 'string',
			title: '(string|element|function)',
			trigger: 'string',
			delay: '(number|object)',
			html: 'boolean',
			selector: '(string|boolean)',
			placement: '(string|function)',
			offset: 'string',
			constraints: 'array',
			container: '(string|element|boolean)'
		};

		let AttachmentMap = {
			TOP: 'bottom center',
			RIGHT: 'middle left',
			BOTTOM: 'top center',
			LEFT: 'middle right'
		};

		let HoverState = {
			SHOW: 'show',
			OUT: 'out'
		};

		let Event = {
			HIDE: 'hide' + EVENT_KEY,
			HIDDEN: 'hidden' + EVENT_KEY,
			SHOW: 'show' + EVENT_KEY,
			SHOWN: 'shown' + EVENT_KEY,
			INSERTED: 'inserted' + EVENT_KEY,
			CLICK: 'click' + EVENT_KEY,
			FOCUSIN: 'focusin' + EVENT_KEY,
			FOCUSOUT: 'focusout' + EVENT_KEY,
			MOUSEENTER: 'mouseenter' + EVENT_KEY,
			MOUSELEAVE: 'mouseleave' + EVENT_KEY
		};

		let ClassName = {
			FADE: 'fade',
			SHOW: 'show'
		};

		let Selector = {
			TOOLTIP: '.tooltip',
			TOOLTIP_INNER: '.tooltip-inner'
		};

		let TetherClass = {
			element: false,
			enabled: false
		};

		let Trigger = {
			HOVER: 'hover',
			FOCUS: 'focus',
			CLICK: 'click',
			MANUAL: 'manual'
		};

		/**
		 * ------------------------------------------------------------------------
		 * Class Definition
		 * ------------------------------------------------------------------------
		 */

		let Tooltip = function () {
			function Tooltip(element, config) {
				_classCallCheck(this, Tooltip);

				// private
				this._isEnabled = true;
				this._timeout = 0;
				this._hoverState = '';
				this._activeTrigger = {};
				this._isTransitioning = false;
				this._tether = null;

				// protected
				this.element = element;
				this.config = this._getConfig(config);
				this.tip = null;

				this._setListeners();
			}

			// getters

			// public

			Tooltip.prototype.enable = function enable() {
				this._isEnabled = true;
			};

			Tooltip.prototype.disable = function disable() {
				this._isEnabled = false;
			};

			Tooltip.prototype.toggleEnabled = function toggleEnabled() {
				this._isEnabled = !this._isEnabled;
			};

			Tooltip.prototype.toggle = function toggle(event) {
				if (event) {
					let dataKey = this.constructor.DATA_KEY;
					let context = $(event.currentTarget).data(dataKey);

					if (!context) {
						context = new this.constructor(event.currentTarget, this._getDelegateConfig());
						$(event.currentTarget).data(dataKey, context);
					}

					context._activeTrigger.click = !context._activeTrigger.click;

					if (context._isWithActiveTrigger()) {
						context._enter(null, context);
					} else {
						context._leave(null, context);
					}
				} else {

					if ($(this.getTipElement()).hasClass(ClassName.SHOW)) {
						this._leave(null, this);
						return;
					}

					this._enter(null, this);
				}
			};

			Tooltip.prototype.dispose = function dispose() {
				clearTimeout(this._timeout);

				this.cleanupTether();

				$.removeData(this.element, this.constructor.DATA_KEY);

				$(this.element).off(this.constructor.EVENT_KEY);
				$(this.element).closest('.modal').off('hide.bs.modal');

				if (this.tip) {
					$(this.tip).remove();
				}

				this._isEnabled = null;
				this._timeout = null;
				this._hoverState = null;
				this._activeTrigger = null;
				this._tether = null;

				this.element = null;
				this.config = null;
				this.tip = null;
			};

			Tooltip.prototype.show = function show() {
				let _this22 = this;

				if ($(this.element).css('display') === 'none') {
					throw new Error('Please use show on visible elements');
				}

				let showEvent = $.Event(this.constructor.Event.SHOW);
				if (this.isWithContent() && this._isEnabled) {
					if (this._isTransitioning) {
						throw new Error('Tooltip is transitioning');
					}
					$(this.element).trigger(showEvent);

					let isInTheDom = $.contains(this.element.ownerDocument.documentElement, this.element);

					if (showEvent.isDefaultPrevented() || !isInTheDom) {
						return;
					}

					let tip = this.getTipElement();
					let tipId = Util.getUID(this.constructor.NAME);

					tip.setAttribute('id', tipId);
					this.element.setAttribute('aria-describedby', tipId);

					this.setContent();

					if (this.config.animation) {
						$(tip).addClass(ClassName.FADE);
					}

					let placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.element) : this.config.placement;

					let attachment = this._getAttachment(placement);

					let container = this.config.container === false ? document.body : $(this.config.container);

					$(tip).data(this.constructor.DATA_KEY, this).appendTo(container);

					$(this.element).trigger(this.constructor.Event.INSERTED);

					this._tether = new Tether({
						attachment: attachment,
						element: tip,
						target: this.element,
						classes: TetherClass,
						classPrefix: CLASS_PREFIX,
						offset: this.config.offset,
						constraints: this.config.constraints,
						addTargetClasses: false
					});

					Util.reflow(tip);
					this._tether.position();

					$(tip).addClass(ClassName.SHOW);

					let complete = function complete() {
						let prevHoverState = _this22._hoverState;
						_this22._hoverState = null;
						_this22._isTransitioning = false;

						$(_this22.element).trigger(_this22.constructor.Event.SHOWN);

						if (prevHoverState === HoverState.OUT) {
							_this22._leave(null, _this22);
						}
					};

					if (Util.supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE)) {
						this._isTransitioning = true;
						$(this.tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(Tooltip._TRANSITION_DURATION);
						return;
					}

					complete();
				}
			};

			Tooltip.prototype.hide = function hide(callback) {
				let _this23 = this;

				let tip = this.getTipElement();
				let hideEvent = $.Event(this.constructor.Event.HIDE);
				if (this._isTransitioning) {
					throw new Error('Tooltip is transitioning');
				}
				let complete = function complete() {
					if (_this23._hoverState !== HoverState.SHOW && tip.parentNode) {
						tip.parentNode.removeChild(tip);
					}

					_this23.element.removeAttribute('aria-describedby');
					$(_this23.element).trigger(_this23.constructor.Event.HIDDEN);
					_this23._isTransitioning = false;
					_this23.cleanupTether();

					if (callback) {
						callback();
					}
				};

				$(this.element).trigger(hideEvent);

				if (hideEvent.isDefaultPrevented()) {
					return;
				}

				$(tip).removeClass(ClassName.SHOW);

				this._activeTrigger[Trigger.CLICK] = false;
				this._activeTrigger[Trigger.FOCUS] = false;
				this._activeTrigger[Trigger.HOVER] = false;

				if (Util.supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE)) {
					this._isTransitioning = true;
					$(tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
				} else {
					complete();
				}

				this._hoverState = '';
			};

			// protected

			Tooltip.prototype.isWithContent = function isWithContent() {
				return Boolean(this.getTitle());
			};

			Tooltip.prototype.getTipElement = function getTipElement() {
				return this.tip = this.tip || $(this.config.template)[0];
			};

			Tooltip.prototype.setContent = function setContent() {
				let $tip = $(this.getTipElement());

				this.setElementContent($tip.find(Selector.TOOLTIP_INNER), this.getTitle());

				$tip.removeClass(ClassName.FADE + ' ' + ClassName.SHOW);

				this.cleanupTether();
			};

			Tooltip.prototype.setElementContent = function setElementContent($element, content) {
				let html = this.config.html;
				if ((typeof content === 'undefined' ? 'undefined' : _typeof(content)) === 'object' && (content.nodeType || content.jquery)) {
					// content is a DOM node or a jQuery
					if (html) {
						if (!$(content).parent().is($element)) {
							$element.empty().append(content);
						}
					} else {
						$element.text($(content).text());
					}
				} else {
					$element[html ? 'html' : 'text'](content);
				}
			};

			Tooltip.prototype.getTitle = function getTitle() {
				let title = this.element.getAttribute('data-original-title');

				if (!title) {
					title = typeof this.config.title === 'function' ? this.config.title.call(this.element) : this.config.title;
				}

				return title;
			};

			Tooltip.prototype.cleanupTether = function cleanupTether() {
				if (this._tether) {
					this._tether.destroy();
				}
			};

			// private

			Tooltip.prototype._getAttachment = function _getAttachment(placement) {
				return AttachmentMap[placement.toUpperCase()];
			};

			Tooltip.prototype._setListeners = function _setListeners() {
				let _this24 = this;

				let triggers = this.config.trigger.split(' ');

				triggers.forEach(function (trigger) {
					if (trigger === 'click') {
						$(_this24.element).on(_this24.constructor.Event.CLICK, _this24.config.selector, function (event) {
							return _this24.toggle(event);
						});
					} else if (trigger !== Trigger.MANUAL) {
						let eventIn = trigger === Trigger.HOVER ? _this24.constructor.Event.MOUSEENTER : _this24.constructor.Event.FOCUSIN;
						let eventOut = trigger === Trigger.HOVER ? _this24.constructor.Event.MOUSELEAVE : _this24.constructor.Event.FOCUSOUT;

						$(_this24.element).on(eventIn, _this24.config.selector, function (event) {
							return _this24._enter(event);
						}).on(eventOut, _this24.config.selector, function (event) {
							return _this24._leave(event);
						});
					}

					$(_this24.element).closest('.modal').on('hide.bs.modal', function () {
						return _this24.hide();
					});
				});

				if (this.config.selector) {
					this.config = $.extend({}, this.config, {
						trigger: 'manual',
						selector: ''
					});
				} else {
					this._fixTitle();
				}
			};

			Tooltip.prototype._fixTitle = function _fixTitle() {
				let titleType = _typeof(this.element.getAttribute('data-original-title'));
				if (this.element.getAttribute('title') || titleType !== 'string') {
					this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '');
					this.element.setAttribute('title', '');
				}
			};

			Tooltip.prototype._enter = function _enter(event, context) {
				let dataKey = this.constructor.DATA_KEY;

				context = context || $(event.currentTarget).data(dataKey);

				if (!context) {
					context = new this.constructor(event.currentTarget, this._getDelegateConfig());
					$(event.currentTarget).data(dataKey, context);
				}

				if (event) {
					context._activeTrigger[event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER] = true;
				}

				if ($(context.getTipElement()).hasClass(ClassName.SHOW) || context._hoverState === HoverState.SHOW) {
					context._hoverState = HoverState.SHOW;
					return;
				}

				clearTimeout(context._timeout);

				context._hoverState = HoverState.SHOW;

				if (!context.config.delay || !context.config.delay.show) {
					context.show();
					return;
				}

				context._timeout = setTimeout(function () {
					if (context._hoverState === HoverState.SHOW) {
						context.show();
					}
				}, context.config.delay.show);
			};

			Tooltip.prototype._leave = function _leave(event, context) {
				let dataKey = this.constructor.DATA_KEY;

				context = context || $(event.currentTarget).data(dataKey);

				if (!context) {
					context = new this.constructor(event.currentTarget, this._getDelegateConfig());
					$(event.currentTarget).data(dataKey, context);
				}

				if (event) {
					context._activeTrigger[event.type === 'focusout' ? Trigger.FOCUS : Trigger.HOVER] = false;
				}

				if (context._isWithActiveTrigger()) {
					return;
				}

				clearTimeout(context._timeout);

				context._hoverState = HoverState.OUT;

				if (!context.config.delay || !context.config.delay.hide) {
					context.hide();
					return;
				}

				context._timeout = setTimeout(function () {
					if (context._hoverState === HoverState.OUT) {
						context.hide();
					}
				}, context.config.delay.hide);
			};

			Tooltip.prototype._isWithActiveTrigger = function _isWithActiveTrigger() {
				for (let trigger in this._activeTrigger) {
					if (this._activeTrigger[trigger]) {
						return true;
					}
				}

				return false;
			};

			Tooltip.prototype._getConfig = function _getConfig(config) {
				config = $.extend({}, this.constructor.Default, $(this.element).data(), config);

				if (config.delay && typeof config.delay === 'number') {
					config.delay = {
						show: config.delay,
						hide: config.delay
					};
				}

				Util.typeCheckConfig(NAME, config, this.constructor.DefaultType);

				return config;
			};

			Tooltip.prototype._getDelegateConfig = function _getDelegateConfig() {
				let config = {};

				if (this.config) {
					for (let key in this.config) {
						if (this.constructor.Default[key] !== this.config[key]) {
							config[key] = this.config[key];
						}
					}
				}

				return config;
			};

			// static

			Tooltip._jQueryInterface = function _jQueryInterface(config) {
				return this.each(function () {
					let data = $(this).data(DATA_KEY);
					let _config = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && config;

					if (!data && /dispose|hide/.test(config)) {
						return;
					}

					if (!data) {
						data = new Tooltip(this, _config);
						$(this).data(DATA_KEY, data);
					}

					if (typeof config === 'string') {
						if (data[config] === undefined) {
							throw new Error('No method named "' + config + '"');
						}
						data[config]();
					}
				});
			};

			_createClass(Tooltip, null, [{
				key: 'VERSION',
				get: function get() {
					return VERSION;
				}
			}, {
				key: 'Default',
				get: function get() {
					return Default;
				}
			}, {
				key: 'NAME',
				get: function get() {
					return NAME;
				}
			}, {
				key: 'DATA_KEY',
				get: function get() {
					return DATA_KEY;
				}
			}, {
				key: 'Event',
				get: function get() {
					return Event;
				}
			}, {
				key: 'EVENT_KEY',
				get: function get() {
					return EVENT_KEY;
				}
			}, {
				key: 'DefaultType',
				get: function get() {
					return DefaultType;
				}
			}]);

			return Tooltip;
		}();

		/**
		 * ------------------------------------------------------------------------
		 * jQuery
		 * ------------------------------------------------------------------------
		 */

		$.fn[NAME] = Tooltip._jQueryInterface;
		$.fn[NAME].Constructor = Tooltip;
		$.fn[NAME].noConflict = function () {
			$.fn[NAME] = JQUERY_NO_CONFLICT;
			return Tooltip._jQueryInterface;
		};

		return Tooltip;
	}(jQuery);

})();
