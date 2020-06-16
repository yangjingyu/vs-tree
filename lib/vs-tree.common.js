module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NODE_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return markNodeData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getNodeKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return findNearestComponent; });
var NODE_KEY = '$treeNodeId';

var markNodeData = function markNodeData(node, data) {
  if (!data || data[NODE_KEY]) return;
  Object.defineProperty(data, NODE_KEY, {
    value: node.id,
    enumerable: false,
    configurable: false,
    writable: false
  });
};

var getNodeKey = function getNodeKey(key, data) {
  if (!key) return data[NODE_KEY];
  return data[key];
};

var findNearestComponent = function findNearestComponent(element, componentName) {
  var target = element;
  while (target && target.tagName !== 'BODY') {
    if (target.__vue__ && target.__vue__.$options.name === componentName) {
      return target.__vue__;
    }
    target = target.parentNode;
  }
  return null;
};

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export on */
/* unused harmony export off */
/* unused harmony export once */
/* unused harmony export hasClass */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return addClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return removeClass; });
/* unused harmony export getStyle */
/* unused harmony export setStyle */
/* unused harmony export isScroll */
/* unused harmony export getScrollContainer */
/* unused harmony export isInContainer */
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* istanbul ignore next */



var isServer = vue__WEBPACK_IMPORTED_MODULE_0___default.a.prototype.$isServer;
var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
var MOZ_HACK_REGEXP = /^moz([A-Z])/;
var ieVersion = isServer ? 0 : Number(document.documentMode);

/* istanbul ignore next */
var trim = function trim(string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};
/* istanbul ignore next */
var camelCase = function camelCase(name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  }).replace(MOZ_HACK_REGEXP, 'Moz$1');
};

/* istanbul ignore next */
var on = function () {
  if (!isServer && document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
}();

/* istanbul ignore next */
var off = function () {
  if (!isServer && document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
}();

/* istanbul ignore next */
var once = function once(el, event, fn) {
  var listener = function listener() {
    if (fn) {
      fn.apply(this, arguments);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
};

/* istanbul ignore next */
function hasClass(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
};

/* istanbul ignore next */
function addClass(el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || '').split(' ');

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName;
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};

/* istanbul ignore next */
function removeClass(el, cls) {
  if (!el || !cls) return;
  var classes = cls.split(' ');
  var curClass = ' ' + el.className + ' ';

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ');
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
};

/* istanbul ignore next */
var getStyle = ieVersion < 9 ? function (element, styleName) {
  if (isServer) return;
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
    styleName = 'styleFloat';
  }
  try {
    switch (styleName) {
      case 'opacity':
        try {
          return element.filters.item('alpha').opacity / 100;
        } catch (e) {
          return 1.0;
        }
      default:
        return element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null;
    }
  } catch (e) {
    return element.style[styleName];
  }
} : function (element, styleName) {
  if (isServer) return;
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
    styleName = 'cssFloat';
  }
  try {
    var computed = document.defaultView.getComputedStyle(element, '');
    return element.style[styleName] || computed ? computed[styleName] : null;
  } catch (e) {
    return element.style[styleName];
  }
};

/* istanbul ignore next */
function setStyle(element, styleName, value) {
  if (!element || !styleName) return;

  if ((typeof styleName === 'undefined' ? 'undefined' : _typeof(styleName)) === 'object') {
    for (var prop in styleName) {
      if (styleName.hasOwnProperty(prop)) {
        setStyle(element, prop, styleName[prop]);
      }
    }
  } else {
    styleName = camelCase(styleName);
    if (styleName === 'opacity' && ieVersion < 9) {
      element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')';
    } else {
      element.style[styleName] = value;
    }
  }
};

var isScroll = function isScroll(el, vertical) {
  if (isServer) return;

  var determinedDirection = vertical !== null || vertical !== undefined;
  var overflow = determinedDirection ? vertical ? getStyle(el, 'overflow-y') : getStyle(el, 'overflow-x') : getStyle(el, 'overflow');

  return overflow.match(/(scroll|auto)/);
};

var getScrollContainer = function getScrollContainer(el, vertical) {
  if (isServer) return;

  var parent = el;
  while (parent) {
    if ([window, document, document.documentElement].includes(parent)) {
      return window;
    }
    if (isScroll(parent, vertical)) {
      return parent;
    }
    parent = parent.parentNode;
  }

  return parent;
};

var isInContainer = function isInContainer(el, container) {
  if (isServer || !el || !container) return false;

  var elRect = el.getBoundingClientRect();
  var containerRect = void 0;

  if ([window, document, document.documentElement, null, undefined].includes(container)) {
    containerRect = {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0
    };
  } else {
    containerRect = container.getBoundingClientRect();
  }

  return elRect.top < containerRect.bottom && elRect.bottom > containerRect.top && elRect.right > containerRect.left && elRect.left < containerRect.right;
};

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function _broadcast(componentName, eventName, params) {
  this.$children.forEach(function (child) {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      _broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
/* harmony default export */ __webpack_exports__["a"] = ({
  methods: {
    dispatch: function dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast: function broadcast(componentName, eventName, params) {
      _broadcast.call(this, componentName, eventName, params);
    }
  }
});

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var vs_tree_src_utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var Transition = function () {
  function Transition() {
    _classCallCheck(this, Transition);
  }

  Transition.prototype.beforeEnter = function beforeEnter(el) {
    Object(vs_tree_src_utils_dom__WEBPACK_IMPORTED_MODULE_0__[/* addClass */ "a"])(el, 'collapse-transition');
    if (!el.dataset) el.dataset = {};

    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;

    el.style.height = '0';
    el.style.paddingTop = 0;
    el.style.paddingBottom = 0;
  };

  Transition.prototype.enter = function enter(el) {
    el.dataset.oldOverflow = el.style.overflow;
    if (el.scrollHeight !== 0) {
      el.style.height = el.scrollHeight + 'px';
      el.style.paddingTop = el.dataset.oldPaddingTop;
      el.style.paddingBottom = el.dataset.oldPaddingBottom;
    } else {
      el.style.height = '';
      el.style.paddingTop = el.dataset.oldPaddingTop;
      el.style.paddingBottom = el.dataset.oldPaddingBottom;
    }

    el.style.overflow = 'hidden';
  };

  Transition.prototype.afterEnter = function afterEnter(el) {
    // for safari: remove class then reset height is necessary
    Object(vs_tree_src_utils_dom__WEBPACK_IMPORTED_MODULE_0__[/* removeClass */ "b"])(el, 'collapse-transition');
    el.style.height = '';
    el.style.overflow = el.dataset.oldOverflow;
  };

  Transition.prototype.beforeLeave = function beforeLeave(el) {
    if (!el.dataset) el.dataset = {};
    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;
    el.dataset.oldOverflow = el.style.overflow;

    el.style.height = el.scrollHeight + 'px';
    el.style.overflow = 'hidden';
  };

  Transition.prototype.leave = function leave(el) {
    if (el.scrollHeight !== 0) {
      // for safari: add class after set height, or it will jump to zero height suddenly, weired
      Object(vs_tree_src_utils_dom__WEBPACK_IMPORTED_MODULE_0__[/* addClass */ "a"])(el, 'collapse-transition');
      el.style.height = 0;
      el.style.paddingTop = 0;
      el.style.paddingBottom = 0;
    }
  };

  Transition.prototype.afterLeave = function afterLeave(el) {
    Object(vs_tree_src_utils_dom__WEBPACK_IMPORTED_MODULE_0__[/* removeClass */ "b"])(el, 'collapse-transition');
    el.style.height = '';
    el.style.overflow = el.dataset.oldOverflow;
    el.style.paddingTop = el.dataset.oldPaddingTop;
    el.style.paddingBottom = el.dataset.oldPaddingBottom;
  };

  return Transition;
}();

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'VsCollapseTransition',
  functional: true,
  render: function render(h, _ref) {
    var children = _ref.children;

    var data = {
      on: new Transition()
    };

    return h('transition', data, children);
  }
});

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/checkbox/src/checkbox.vue?vue&type=template&id=d0387074&
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "label",
    {
      staticClass: "vs-checkbox",
      class: [
        _vm.border && _vm.checkboxSize
          ? "vs-checkbox--" + _vm.checkboxSize
          : "",
        { "is-disabled": _vm.isDisabled },
        { "is-bordered": _vm.border },
        { "is-checked": _vm.isChecked }
      ],
      attrs: { id: _vm.id }
    },
    [
      _c(
        "span",
        {
          staticClass: "vs-checkbox__input",
          class: {
            "is-disabled": _vm.isDisabled,
            "is-checked": _vm.isChecked,
            "is-indeterminate": _vm.indeterminate,
            "is-focus": _vm.focus
          },
          attrs: {
            tabindex: _vm.indeterminate ? 0 : false,
            role: _vm.indeterminate ? "checkbox" : false,
            "aria-checked": _vm.indeterminate ? "mixed" : false
          }
        },
        [
          _c("span", { staticClass: "vs-checkbox__inner" }),
          _vm.trueLabel || _vm.falseLabel
            ? _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.model,
                    expression: "model"
                  }
                ],
                staticClass: "vs-checkbox__original",
                attrs: {
                  type: "checkbox",
                  "aria-hidden": _vm.indeterminate ? "true" : "false",
                  name: _vm.name,
                  disabled: _vm.isDisabled,
                  "true-value": _vm.trueLabel,
                  "false-value": _vm.falseLabel
                },
                domProps: {
                  checked: Array.isArray(_vm.model)
                    ? _vm._i(_vm.model, null) > -1
                    : _vm._q(_vm.model, _vm.trueLabel)
                },
                on: {
                  change: [
                    function($event) {
                      var $$a = _vm.model,
                        $$el = $event.target,
                        $$c = $$el.checked ? _vm.trueLabel : _vm.falseLabel
                      if (Array.isArray($$a)) {
                        var $$v = null,
                          $$i = _vm._i($$a, $$v)
                        if ($$el.checked) {
                          $$i < 0 && (_vm.model = $$a.concat([$$v]))
                        } else {
                          $$i > -1 &&
                            (_vm.model = $$a
                              .slice(0, $$i)
                              .concat($$a.slice($$i + 1)))
                        }
                      } else {
                        _vm.model = $$c
                      }
                    },
                    _vm.handleChange
                  ],
                  focus: function($event) {
                    _vm.focus = true
                  },
                  blur: function($event) {
                    _vm.focus = false
                  }
                }
              })
            : _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.model,
                    expression: "model"
                  }
                ],
                staticClass: "vs-checkbox__original",
                attrs: {
                  type: "checkbox",
                  "aria-hidden": _vm.indeterminate ? "true" : "false",
                  disabled: _vm.isDisabled,
                  name: _vm.name
                },
                domProps: {
                  value: _vm.label,
                  checked: Array.isArray(_vm.model)
                    ? _vm._i(_vm.model, _vm.label) > -1
                    : _vm.model
                },
                on: {
                  change: [
                    function($event) {
                      var $$a = _vm.model,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false
                      if (Array.isArray($$a)) {
                        var $$v = _vm.label,
                          $$i = _vm._i($$a, $$v)
                        if ($$el.checked) {
                          $$i < 0 && (_vm.model = $$a.concat([$$v]))
                        } else {
                          $$i > -1 &&
                            (_vm.model = $$a
                              .slice(0, $$i)
                              .concat($$a.slice($$i + 1)))
                        }
                      } else {
                        _vm.model = $$c
                      }
                    },
                    _vm.handleChange
                  ],
                  focus: function($event) {
                    _vm.focus = true
                  },
                  blur: function($event) {
                    _vm.focus = false
                  }
                }
              })
        ]
      ),
      _vm.$slots.default || _vm.label
        ? _c(
            "span",
            { staticClass: "vs-checkbox__label" },
            [
              _vm._t("default"),
              !_vm.$slots.default ? [_vm._v(_vm._s(_vm.label))] : _vm._e()
            ],
            2
          )
        : _vm._e()
    ]
  )
}
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./packages/checkbox/src/checkbox.vue?vue&type=template&id=d0387074&

// EXTERNAL MODULE: ./src/mixins/emitter.js
var emitter = __webpack_require__(3);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/checkbox/src/checkbox.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var checkboxvue_type_script_lang_js_ = ({
  name: 'VsCheckbox',

  mixins: [emitter["a" /* default */]],

  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },

  componentName: 'ElCheckbox',

  data: function data() {
    return {
      selfModel: false,
      focus: false,
      isLimitExceeded: false
    };
  },


  computed: {
    model: {
      get: function get() {
        return this.isGroup ? this.store : this.value !== undefined ? this.value : this.selfModel;
      },
      set: function set(val) {
        if (this.isGroup) {
          this.isLimitExceeded = false;
          this._checkboxGroup.min !== undefined && val.length < this._checkboxGroup.min && (this.isLimitExceeded = true);

          this._checkboxGroup.max !== undefined && val.length > this._checkboxGroup.max && (this.isLimitExceeded = true);

          this.isLimitExceeded === false && this.dispatch('ElCheckboxGroup', 'input', [val]);
        } else {
          this.$emit('input', val);
          this.selfModel = val;
        }
      }
    },

    isChecked: function isChecked() {
      if ({}.toString.call(this.model) === '[object Boolean]') {
        return this.model;
      } else if (Array.isArray(this.model)) {
        return this.model.indexOf(this.label) > -1;
      } else if (this.model !== null && this.model !== undefined) {
        return this.model === this.trueLabel;
      }
    },
    isGroup: function isGroup() {
      var parent = this.$parent;
      while (parent) {
        if (parent.$options.componentName !== 'ElCheckboxGroup') {
          parent = parent.$parent;
        } else {
          this._checkboxGroup = parent;
          return true;
        }
      }
      return false;
    },
    store: function store() {
      return this._checkboxGroup ? this._checkboxGroup.value : this.value;
    },


    /* used to make the isDisabled judgment under max/min props */
    isLimitDisabled: function isLimitDisabled() {
      var _checkboxGroup = this._checkboxGroup,
          max = _checkboxGroup.max,
          min = _checkboxGroup.min;

      return !!(max || min) && this.model.length >= max && !this.isChecked || this.model.length <= min && this.isChecked;
    },
    isDisabled: function isDisabled() {
      return this.isGroup ? this._checkboxGroup.disabled || this.disabled || (this.elForm || {}).disabled || this.isLimitDisabled : this.disabled || (this.elForm || {}).disabled;
    },
    _elFormItemSize: function _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },
    checkboxSize: function checkboxSize() {
      var temCheckboxSize = this.size || this._elFormItemSize || (this.$KUI || {}).size;
      return this.isGroup ? this._checkboxGroup.checkboxGroupSize || temCheckboxSize : temCheckboxSize;
    }
  },

  props: {
    value: {},
    label: {},
    indeterminate: Boolean,
    disabled: Boolean,
    checked: Boolean,
    name: String,
    trueLabel: [String, Number],
    falseLabel: [String, Number],
    id: String, /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/
    controls: String, /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/
    border: Boolean,
    size: String
  },

  methods: {
    addToStore: function addToStore() {
      if (Array.isArray(this.model) && this.model.indexOf(this.label) === -1) {
        this.model.push(this.label);
      } else {
        this.model = this.trueLabel || true;
      }
    },
    handleChange: function handleChange(ev) {
      var _this = this;

      if (this.isLimitExceeded) return;
      var value = void 0;
      if (ev.target.checked) {
        value = this.trueLabel === undefined ? true : this.trueLabel;
      } else {
        value = this.falseLabel === undefined ? false : this.falseLabel;
      }
      this.$emit('change', value, ev);
      this.$nextTick(function () {
        if (_this.isGroup) {
          _this.dispatch('ElCheckboxGroup', 'change', [_this._checkboxGroup.value]);
        }
      });
    }
  },

  created: function created() {
    this.checked && this.addToStore();
  },
  mounted: function mounted() {
    // 为indeterminate元素 添加aria-controls 属性
    if (this.indeterminate) {
      this.$el.setAttribute('aria-controls', this.controls);
    }
  },


  watch: {
    value: function value(_value) {
      this.dispatch('ElFormItem', 'el.form.change', _value);
    }
  }
});
// CONCATENATED MODULE: ./packages/checkbox/src/checkbox.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_checkboxvue_type_script_lang_js_ = (checkboxvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./packages/checkbox/src/checkbox.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  src_checkboxvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/checkbox/src/checkbox.vue"
/* harmony default export */ var src_checkbox = (component.exports);
// CONCATENATED MODULE: ./packages/checkbox/index.js


/* istanbul ignore next */
src_checkbox.install = function (Vue) {
  Vue.component(src_checkbox.name, src_checkbox);
};

/* harmony default export */ var packages_checkbox = __webpack_exports__["a"] = (src_checkbox);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/tree/src/tree-item.vue?vue&type=template&id=352635ec&
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("vs-tree-node", {
    attrs: {
      node: _vm.source,
      props: _vm.props,
      breadcrumb: _vm.breadcrumb,
      "render-after-expand": _vm.renderAfterExpand,
      "show-checkbox": true,
      "render-content": _vm.renderContent
    },
    on: { "node-expand": _vm.handleNodeExpand }
  })
}
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./packages/tree/src/tree-item.vue?vue&type=template&id=352635ec&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/tree/src/tree-item.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//

/* eslint-disable */
/* harmony default export */ var tree_itemvue_type_script_lang_js_ = ({
  name: 'VsTreeItem',

  componentName: 'VsTreeItem',

  components: {
    VsTreeNode: function VsTreeNode() {
      return Promise.resolve(/* import() */).then(__webpack_require__.bind(null, 9));
    }
  },

  inject: ['props', 'breadcrumb'],
  props: {
    index: { // index of current item
      type: Number
    },
    renderContent: Function,
    showCheckbox: Boolean,
    handleNodeExpand: Function,
    renderAfterExpand: Boolean,
    source: { // here is: {uid: 'unique_1', text: 'abc'}
      type: Object,
      default: function _default() {
        return {};
      }
    }
  }
});
// CONCATENATED MODULE: ./packages/tree/src/tree-item.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_tree_itemvue_type_script_lang_js_ = (tree_itemvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./packages/tree/src/tree-item.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  src_tree_itemvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/tree/src/tree-item.vue"
/* harmony default export */ var tree_item = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("vue");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("vue-virtual-scroll-list");

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/tree/src/tree-node.vue?vue&type=template&id=3ba3ef0e&
var render = function() {
  var this$1 = this
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.node.visible,
          expression: "node.visible"
        }
      ],
      ref: "node",
      staticClass: "vs-tree-node",
      class: {
        "is-expanded": _vm.expanded,
        "is-current": _vm.node.isCurrent,
        "is-hidden": !_vm.node.visible,
        "is-focusable": !_vm.node.disabled,
        "is-checked": !_vm.node.disabled && _vm.node.checked
      },
      attrs: {
        role: "treeitem",
        tabindex: "-1",
        "aria-expanded": _vm.expanded,
        "aria-disabled": _vm.node.disabled,
        "aria-checked": _vm.node.checked,
        draggable: _vm.tree.draggable
      },
      on: {
        click: function($event) {
          $event.stopPropagation()
          return _vm.handleClick($event)
        },
        contextmenu: function($event) {
          return this$1.handleContextMenu($event)
        },
        dragstart: function($event) {
          $event.stopPropagation()
          return _vm.handleDragStart($event)
        },
        dragover: function($event) {
          $event.stopPropagation()
          return _vm.handleDragOver($event)
        },
        dragend: function($event) {
          $event.stopPropagation()
          return _vm.handleDragEnd($event)
        },
        drop: function($event) {
          $event.stopPropagation()
          return _vm.handleDrop($event)
        }
      }
    },
    [
      _c(
        "div",
        {
          staticClass: "vs-tree-node__content",
          style: !_vm.breadcrumb && {
            "padding-left": (_vm.node.level - 1) * _vm.tree.indent + "px"
          },
          attrs: {
            rid: _vm.tree.currentNode && _vm.tree.currentNode.node.id,
            pid: _vm.node.parent.id
          }
        },
        [
          !_vm.breadcrumb
            ? _c("span", {
                class: [
                  {
                    "is-leaf": _vm.node.isLeaf,
                    expanded: !_vm.node.isLeaf && _vm.expanded
                  },
                  "vs-tree-node__expand-icon",
                  _vm.tree.iconClass
                    ? _vm.tree.iconClass
                    : "vs-icon-caret-right"
                ],
                on: {
                  click: function($event) {
                    $event.stopPropagation()
                    return _vm.handleExpandIconClick($event)
                  }
                }
              })
            : _vm._e(),
          _vm.showCheckbox
            ? _c("vs-checkbox", {
                attrs: {
                  value: _vm.node.checked,
                  indeterminate: _vm.node.indeterminate,
                  disabled: !!_vm.node.disabled
                },
                on: { change: _vm.handleCheckChange },
                nativeOn: {
                  click: function($event) {
                    $event.stopPropagation()
                  }
                }
              })
            : _vm._e(),
          _vm.node.loading
            ? _c("span", {
                staticClass: "vs-tree-node__loading-icon vs-icon-loading"
              })
            : _vm._e(),
          _c("node-content", { attrs: { node: _vm.node } })
        ],
        1
      ),
      !_vm.breadcrumb
        ? _c("vs-collapse-transition", [
            !_vm.renderAfterExpand || _vm.childNodeRendered
              ? _c(
                  "div",
                  {
                    directives: [
                      {
                        name: "show",
                        rawName: "v-show",
                        value: _vm.expanded,
                        expression: "expanded"
                      }
                    ],
                    staticClass: "vs-tree-node__children",
                    attrs: { role: "group", "aria-expanded": _vm.expanded }
                  },
                  [
                    _vm.virtual
                      ? [
                          _c("virtual-list", {
                            staticStyle: {
                              "max-height": "360px",
                              "overflow-y": "auto"
                            },
                            attrs: {
                              "data-key": _vm.getNodeKey,
                              "data-sources": _vm.node.childNodes,
                              "extra-props": {
                                showCheckbox: _vm.showCheckbox,
                                renderContent: _vm.renderContent,
                                renderAfterExpand: _vm.renderAfterExpand,
                                handleNodeExpand: _vm.handleChildNodeExpand
                              },
                              "data-component": _vm.VsTteeItem
                            }
                          })
                        ]
                      : _vm._l(_vm.node.childNodes, function(child) {
                          return _c("vs-tree-node", {
                            key: _vm.getNodeKey(child),
                            attrs: {
                              "render-content": _vm.renderContent,
                              "render-after-expand": _vm.renderAfterExpand,
                              "show-checkbox": _vm.showCheckbox,
                              node: child
                            },
                            on: { "node-expand": _vm.handleChildNodeExpand }
                          })
                        })
                  ],
                  2
                )
              : _vm._e()
          ])
        : _vm._e()
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./packages/tree/src/tree-node.vue?vue&type=template&id=3ba3ef0e&

// EXTERNAL MODULE: ./src/transitions/collapse-transition.js
var collapse_transition = __webpack_require__(4);

// EXTERNAL MODULE: ./packages/checkbox/index.js + 5 modules
var packages_checkbox = __webpack_require__(5);

// EXTERNAL MODULE: ./src/mixins/emitter.js
var emitter = __webpack_require__(3);

// EXTERNAL MODULE: ./packages/tree/src/model/util.js
var util = __webpack_require__(0);

// EXTERNAL MODULE: ./packages/tree/src/tree-item.vue + 4 modules
var tree_item = __webpack_require__(6);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/tree/src/tree-node.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/* harmony default export */ var tree_nodevue_type_script_lang_js_ = ({
  name: 'VsTreeNode',

  componentName: 'VsTreeNode',

  mixins: [emitter["a" /* default */]],

  inject: ["nodePrarnt", "virtual"],

  props: {
    node: {
      default: function _default() {
        return {};
      }
    },
    props: {},
    renderContent: Function,
    renderAfterExpand: {
      type: Boolean,
      default: true
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    breadcrumb: {
      type: Boolean,
      default: false
    }
  },

  components: {
    VsCollapseTransition: collapse_transition["a" /* default */],
    VsCheckbox: packages_checkbox["a" /* default */],
    NodeContent: {
      props: {
        node: {
          required: true
        }
      },
      render: function render(h) {
        var parent = this.$parent;
        var tree = parent.tree;
        var node = this.node;
        var data = node.data,
            store = node.store;

        return parent.renderContent ? parent.renderContent.call(parent._renderProxy, h, { _self: tree.$vnode.context, node: node, data: data, store: store }) : tree.$scopedSlots.default ? tree.$scopedSlots.default({ node: node, data: data }) : h(
          'span',
          { 'class': 'vs-tree-node__label' },
          [node.label]
        );
      }
    }
  },

  data: function data() {
    return {
      VsTteeItem: tree_item["a" /* default */],
      tree: null,
      expanded: false,
      childNodeRendered: false,
      oldChecked: null,
      oldIndeterminate: null
    };
  },


  watch: {
    'node.indeterminate': function nodeIndeterminate(val) {
      this.handleSelectChange(this.node.checked, val);
    },
    'node.checked': function nodeChecked(val) {
      this.handleSelectChange(val, this.node.indeterminate);
    },
    'node.expanded': function nodeExpanded(val) {
      var _this = this;

      this.$nextTick(function () {
        return _this.expanded = val;
      });
      if (val) {
        this.childNodeRendered = true;
      }
    }
  },

  methods: {
    getNodeKey: function getNodeKey(node) {
      return Object(util["c" /* getNodeKey */])(this.tree.nodeKey, node.data);
    },
    handleSelectChange: function handleSelectChange(checked, indeterminate) {
      if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
        this.tree.$emit('check-change', this.node.data, checked, indeterminate);
      }
      this.oldChecked = checked;
      this.indeterminate = indeterminate;
    },
    handleClick: function handleClick() {
      var store = this.tree.store;
      store.setCurrentNode(this.node);
      this.tree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode);
      this.tree.currentNode = this;
      if (this.tree.expandOnClickNode) {
        this.handleExpandIconClick();
      }
      if (this.tree.checkOnClickNode && !this.node.disabled) {
        this.handleCheckChange(null, {
          target: { checked: !this.node.checked }
        });
      }
      this.tree.$emit('node-click', this.node.data, this.node, this);
    },
    handleContextMenu: function handleContextMenu(event) {
      if (this.tree._events['node-contextmenu'] && this.tree._events['node-contextmenu'].length > 0) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.tree.$emit('node-contextmenu', event, this.node.data, this.node, this);
    },
    handleExpandIconClick: function handleExpandIconClick() {
      if (this.node.isLeaf) return;
      if (this.expanded) {
        this.tree.$emit('node-collapse', this.node.data, this.node, this);
        this.node.collapse();
      } else {
        this.node.expand();
        this.$emit('node-expand', this.node.data, this.node, this);
      }
    },
    handleCheckChange: function handleCheckChange(value, ev) {
      var _this2 = this;

      this.tree.store.checkMax(this.node, value).then(function () {
        _this2.node.setChecked(ev.target.checked, !_this2.tree.checkStrictly);
        _this2.$nextTick(function () {
          var store = _this2.tree.store;
          _this2.tree.$emit('check', _this2.node.data, {
            checkedNodes: store.getCheckedNodes(),
            checkedKeys: store.getCheckedKeys(),
            halfCheckedNodes: store.getHalfCheckedNodes(),
            halfCheckedKeys: store.getHalfCheckedKeys()
          });
        });
      }, function () {
        _this2.node.checked = false;
        _this2.tree.$emit('limit-check', _this2.node.data);
      });
    },
    handleChildNodeExpand: function handleChildNodeExpand(nodeData, node, instance) {
      this.broadcast('VsTreeNode', 'tree-node-expand', node);
      this.tree.$emit('node-expand', nodeData, node, instance);
    },
    handleDragStart: function handleDragStart(event) {
      if (!this.tree.draggable) return;
      this.tree.$emit('tree-node-drag-start', event, this);
    },
    handleDragOver: function handleDragOver(event) {
      if (!this.tree.draggable) return;
      this.tree.$emit('tree-node-drag-over', event, this);
      event.preventDefault();
    },
    handleDrop: function handleDrop(event) {
      event.preventDefault();
    },
    handleDragEnd: function handleDragEnd(event) {
      if (!this.tree.draggable) return;
      this.tree.$emit('tree-node-drag-end', event, this);
    }
  },

  created: function created() {
    var _this3 = this;

    var parent = this.nodePrarnt;

    if (parent.isTree) {
      this.tree = parent;
    } else {
      this.tree = parent.tree;
    }

    var tree = this.tree;
    if (!tree) {
      console.warn('Can not find node\'s tree.');
    }

    var props = tree.props || {};
    var childrenKey = props['children'] || 'children';

    this.$watch('node.data.' + childrenKey, function () {
      _this3.node.updateChildren();
    });

    if (this.node.expanded) {
      this.expanded = true;
      this.childNodeRendered = true;
    }

    if (this.tree.accordion) {
      this.$on('tree-node-expand', function (node) {
        if (_this3.node !== node) {
          _this3.node.collapse();
        }
      });
    }
  }
});
// CONCATENATED MODULE: ./packages/tree/src/tree-node.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_tree_nodevue_type_script_lang_js_ = (tree_nodevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./packages/tree/src/tree-node.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  src_tree_nodevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/tree/src/tree-node.vue"
/* harmony default export */ var tree_node = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(11);


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./packages/checkbox/index.js + 5 modules
var packages_checkbox = __webpack_require__(5);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/breadcrumb/src/breadcrumb.vue?vue&type=template&id=4b464c06&
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "vs-breadcrumb",
      attrs: { "aria-label": "Breadcrumb", role: "navigation" }
    },
    [_vm._t("default")],
    2
  )
}
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./packages/breadcrumb/src/breadcrumb.vue?vue&type=template&id=4b464c06&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/breadcrumb/src/breadcrumb.vue?vue&type=script&lang=js&
//
//
//
//
//

/* harmony default export */ var breadcrumbvue_type_script_lang_js_ = ({
  name: 'VsBreadcrumb',

  props: {
    separator: {
      type: String,
      default: '/'
    },
    separatorClass: {
      type: String,
      default: ''
    }
  },

  provide: function provide() {
    return {
      elBreadcrumb: this
    };
  },
  mounted: function mounted() {
    var items = this.$el.querySelectorAll('.vs-breadcrumb__item');
    if (items.length) {
      items[items.length - 1].setAttribute('aria-current', 'page');
    }
  }
});
// CONCATENATED MODULE: ./packages/breadcrumb/src/breadcrumb.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_breadcrumbvue_type_script_lang_js_ = (breadcrumbvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./packages/breadcrumb/src/breadcrumb.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  src_breadcrumbvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "packages/breadcrumb/src/breadcrumb.vue"
/* harmony default export */ var breadcrumb = (component.exports);
// CONCATENATED MODULE: ./packages/breadcrumb/index.js


/* istanbul ignore next */
breadcrumb.install = function (Vue) {
  Vue.component(breadcrumb.name, breadcrumb);
};

/* harmony default export */ var packages_breadcrumb = (breadcrumb);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/breadcrumb/src/breadcrumb-item.vue?vue&type=template&id=fcf9eaac&
var breadcrumb_itemvue_type_template_id_fcf9eaac_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("span", { staticClass: "vs-breadcrumb__item" }, [
    _c(
      "span",
      {
        ref: "link",
        class: ["vs-breadcrumb__inner", _vm.to ? "is-link" : ""],
        attrs: { role: "link" }
      },
      [_vm._t("default")],
      2
    ),
    _vm.separatorClass
      ? _c("i", {
          staticClass: "vs-breadcrumb__separator",
          class: _vm.separatorClass
        })
      : _c(
          "span",
          {
            staticClass: "vs-breadcrumb__separator",
            attrs: { role: "presentation" }
          },
          [_vm._v(_vm._s(_vm.separator))]
        )
  ])
}
var breadcrumb_itemvue_type_template_id_fcf9eaac_staticRenderFns = []
breadcrumb_itemvue_type_template_id_fcf9eaac_render._withStripped = true


// CONCATENATED MODULE: ./packages/breadcrumb/src/breadcrumb-item.vue?vue&type=template&id=fcf9eaac&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/breadcrumb/src/breadcrumb-item.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var breadcrumb_itemvue_type_script_lang_js_ = ({
  name: 'VsBreadcrumbItem',
  props: {
    to: {},
    replace: Boolean
  },
  data: function data() {
    return {
      separator: '',
      separatorClass: ''
    };
  },


  inject: ['elBreadcrumb'],

  mounted: function mounted() {
    var _this = this;

    this.separator = this.elBreadcrumb.separator;
    this.separatorClass = this.elBreadcrumb.separatorClass;
    var link = this.$refs.link;
    link.setAttribute('role', 'link');
    link.addEventListener('click', function (_) {
      var to = _this.to,
          $router = _this.$router;

      if (!to || !$router) return;
      _this.replace ? $router.replace(to) : $router.push(to);
    });
  }
});
// CONCATENATED MODULE: ./packages/breadcrumb/src/breadcrumb-item.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_breadcrumb_itemvue_type_script_lang_js_ = (breadcrumb_itemvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/breadcrumb/src/breadcrumb-item.vue





/* normalize component */

var breadcrumb_item_component = Object(componentNormalizer["a" /* default */])(
  src_breadcrumb_itemvue_type_script_lang_js_,
  breadcrumb_itemvue_type_template_id_fcf9eaac_render,
  breadcrumb_itemvue_type_template_id_fcf9eaac_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var breadcrumb_item_api; }
breadcrumb_item_component.options.__file = "packages/breadcrumb/src/breadcrumb-item.vue"
/* harmony default export */ var breadcrumb_item = (breadcrumb_item_component.exports);
// CONCATENATED MODULE: ./packages/breadcrumb-item/index.js


/* istanbul ignore next */
breadcrumb_item.install = function (Vue) {
  Vue.component(breadcrumb_item.name, breadcrumb_item);
};

/* harmony default export */ var packages_breadcrumb_item = (breadcrumb_item);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./packages/tree/src/tree.vue?vue&type=template&id=547575a6&
var treevue_type_template_id_547575a6_render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "vs-tree",
      class: {
        "vs-tree--highlight-current": _vm.highlightCurrent,
        "is-dragging": !!_vm.dragState.draggingNode,
        "is-drop-not-allow": !_vm.dragState.allowDrop,
        "is-drop-inner": _vm.dragState.dropType === "inner"
      },
      attrs: { role: "tree" }
    },
    [
      _vm.breadcrumb
        ? _c(
            "vs-breadcrumb",
            {
              staticClass: "vs-tree-breadcrumb",
              class: [_vm.breadcrumbClass],
              attrs: { "separator-class": "vs-icon-arrow-right" }
            },
            [
              _c("vs-breadcrumb-item", [
                _c(
                  "a",
                  {
                    on: {
                      click: function($event) {
                        _vm.onCutCrumb(-1)
                      }
                    }
                  },
                  [_vm._v("根目录")]
                )
              ]),
              _vm._l(_vm.breadcrumbs, function(item, index) {
                return _c("vs-breadcrumb-item", { key: item.id }, [
                  _c(
                    "a",
                    {
                      on: {
                        click: function($event) {
                          _vm.onCutCrumb(index)
                        }
                      }
                    },
                    [_vm._v(_vm._s(item.data[_vm.props.label]))]
                  )
                ])
              })
            ],
            2
          )
        : _vm._e(),
      _vm.virtual
        ? [
            _c("virtual-list", {
              ref: "treeVirtual",
              staticStyle: { "max-height": "360px", "overflow-y": "auto" },
              attrs: {
                "data-key": _vm.getNodeKey,
                "data-sources": _vm.root.childNodes,
                "extra-props": {
                  showCheckbox: _vm.showCheckbox,
                  renderContent: _vm.renderContent,
                  renderAfterExpand: _vm.renderAfterExpand,
                  handleNodeExpand: _vm.handleNodeExpand
                },
                "data-component": _vm.item
              }
            })
          ]
        : _vm._l(_vm.root.childNodes, function(node) {
            return _c("vs-tree-node", {
              key: _vm.getNodeKey(node),
              attrs: {
                node: node,
                props: _vm.props,
                breadcrumb: _vm.breadcrumb,
                "render-after-expand": _vm.renderAfterExpand,
                "show-checkbox": _vm.showCheckbox,
                "render-content": _vm.renderContent
              },
              on: { "node-expand": _vm.handleNodeExpand }
            })
          }),
      _vm.isEmpty
        ? _c("div", { staticClass: "vs-tree__empty-block" }, [
            _c("span", { staticClass: "vs-tree__empty-text" }, [
              _vm._v(_vm._s(_vm.emptyText))
            ])
          ])
        : _vm._e(),
      _c("div", {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.dragState.showDropIndicator,
            expression: "dragState.showDropIndicator"
          }
        ],
        ref: "dropIndicator",
        staticClass: "vs-tree__drop-indicator"
      })
    ],
    2
  )
}
var treevue_type_template_id_547575a6_staticRenderFns = []
treevue_type_template_id_547575a6_render._withStripped = true


// CONCATENATED MODULE: ./packages/tree/src/tree.vue?vue&type=template&id=547575a6&

// CONCATENATED MODULE: ./src/utils/merge.js
/* harmony default export */ var merge = (function (target) {
  for (var i = 1, j = arguments.length; i < j; i++) {
    var source = arguments[i] || {};
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        var value = source[prop];
        if (value !== undefined) {
          target[prop] = value;
        }
      }
    }
  }

  return target;
});;
// EXTERNAL MODULE: ./packages/tree/src/model/util.js
var util = __webpack_require__(0);

// CONCATENATED MODULE: ./src/utils/util.js
function extend(to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to;
};

function toObject(arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
};

// TODO: use native Array.find, Array.findIndex when IE support is dropped
var arrayFindIndex = function arrayFindIndex(arr, pred) {
  for (var i = 0; i !== arr.length; ++i) {
    if (pred(arr[i])) {
      return i;
    }
  }
  return -1;
};
// CONCATENATED MODULE: ./packages/tree/src/model/node.js
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }





var getChildState = function getChildState(node) {
  var all = true;
  var none = true;
  var allWithoutDisable = true;
  for (var i = 0, j = node.length; i < j; i++) {
    var n = node[i];
    if (n.checked !== true || n.indeterminate) {
      all = false;
      if (!n.disabled) {
        allWithoutDisable = false;
      }
    }
    if (n.checked !== false || n.indeterminate) {
      none = false;
    }
  }

  return { all: all, none: none, allWithoutDisable: allWithoutDisable, half: !all && !none };
};

var reInitChecked = function reInitChecked(node) {
  if (node.childNodes.length === 0) return;

  var _getChildState = getChildState(node.childNodes),
      all = _getChildState.all,
      none = _getChildState.none,
      half = _getChildState.half;

  if (all) {
    node.checked = true;
    node.indeterminate = false;
  } else if (half) {
    node.checked = false;
    node.indeterminate = true;
  } else if (none) {
    node.checked = false;
    node.indeterminate = false;
  }

  var parent = node.parent;
  if (!parent || parent.level === 0) return;

  if (!node.store.checkStrictly) {
    reInitChecked(parent);
  }
};

var getPropertyFromData = function getPropertyFromData(node, prop) {
  var props = node.store.props;
  var data = node.data || {};
  var config = props[prop];

  if (typeof config === 'function') {
    return config(data, node);
  } else if (typeof config === 'string') {
    return data[config];
  } else if (typeof config === 'undefined') {
    var dataProp = data[prop];
    return dataProp === undefined ? '' : dataProp;
  }
};

var nodeIdSeed = 0;

var node_Node = function () {
  function Node(options) {
    _classCallCheck(this, Node);

    this.id = nodeIdSeed++;
    this.text = null;
    this.checked = false;
    this.indeterminate = false;
    this.data = null;
    this.expanded = false;
    this.parent = null;
    this.visible = true;
    this.isCurrent = false;

    for (var name in options) {
      if (options.hasOwnProperty(name)) {
        this[name] = options[name];
      }
    }

    // internal
    this.level = 0;
    this.loaded = false;
    this.childNodes = [];
    this.loading = false;

    if (this.parent) {
      this.level = this.parent.level + 1;
    }

    var store = this.store;
    if (!store) {
      throw new Error('[Node]store is required!');
    }
    store.registerNode(this);

    var props = store.props;
    if (props && typeof props.isLeaf !== 'undefined') {
      var isLeaf = getPropertyFromData(this, 'isLeaf');
      if (typeof isLeaf === 'boolean') {
        this.isLeafByUser = isLeaf;
      }
    }

    if (store.lazy !== true && this.data) {
      this.setData(this.data);

      if (store.defaultExpandAll) {
        this.expanded = true;
      }
    } else if (this.level > 0 && store.lazy && store.defaultExpandAll) {
      this.expand();
    }
    if (!Array.isArray(this.data)) {
      Object(util["d" /* markNodeData */])(this, this.data);
    }
    if (!this.data) return;
    var defaultExpandedKeys = store.defaultExpandedKeys;
    var key = store.key;
    if (key && defaultExpandedKeys && defaultExpandedKeys.indexOf(this.key) !== -1) {
      this.expand(null, store.autoExpandParent);
    }

    if (key && store.currentNodeKey !== undefined && this.key === store.currentNodeKey) {
      store.currentNode = this;
      store.currentNode.isCurrent = true;
    }

    if (store.lazy) {
      store._initDefaultCheckedNode(this);
    }

    this.updateLeafState();
  }

  Node.prototype.setData = function setData(data) {
    if (!Array.isArray(data)) {
      Object(util["d" /* markNodeData */])(this, data);
    }

    this.data = data;
    this.childNodes = [];

    var children = void 0;
    if (this.level === 0 && this.data instanceof Array) {
      children = this.data;
    } else {
      children = getPropertyFromData(this, 'children') || [];
    }

    for (var i = 0, j = children.length; i < j; i++) {
      this.insertChild({ data: children[i] });
    }
  };

  Node.prototype.contains = function contains(target) {
    var deep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var walk = function walk(parent) {
      var children = parent.childNodes || [];
      var result = false;
      for (var i = 0, j = children.length; i < j; i++) {
        var child = children[i];
        if (child === target || deep && walk(child)) {
          result = true;
          break;
        }
      }
      return result;
    };

    return walk(this);
  };

  Node.prototype.remove = function remove() {
    var parent = this.parent;
    if (parent) {
      parent.removeChild(this);
    }
  };

  Node.prototype.insertChild = function insertChild(child, index, batch) {
    if (!child) throw new Error('insertChild error: child is required.');

    if (!(child instanceof Node)) {
      if (!batch) {
        var children = this.getChildren(true);
        if (children.indexOf(child.data) === -1) {
          if (typeof index === 'undefined' || index < 0) {
            children.push(child.data);
          } else {
            children.splice(index, 0, child.data);
          }
        }
      }
      merge(child, {
        parent: this,
        store: this.store
      });
      child = new Node(child);
    }

    child.level = this.level + 1;

    if (typeof index === 'undefined' || index < 0) {
      this.childNodes.push(child);
    } else {
      this.childNodes.splice(index, 0, child);
    }

    this.updateLeafState();
  };

  Node.prototype.insertBefore = function insertBefore(child, ref) {
    var index = void 0;
    if (ref) {
      index = this.childNodes.indexOf(ref);
    }
    this.insertChild(child, index);
  };

  Node.prototype.insertAfter = function insertAfter(child, ref) {
    var index = void 0;
    if (ref) {
      index = this.childNodes.indexOf(ref);
      if (index !== -1) index += 1;
    }
    this.insertChild(child, index);
  };

  Node.prototype.removeChild = function removeChild(child) {
    var children = this.getChildren() || [];
    var dataIndex = children.indexOf(child.data);
    if (dataIndex > -1) {
      children.splice(dataIndex, 1);
    }

    var index = this.childNodes.indexOf(child);

    if (index > -1) {
      this.store && this.store.deregisterNode(child);
      child.parent = null;
      this.childNodes.splice(index, 1);
    }

    this.updateLeafState();
  };

  Node.prototype.removeChildByData = function removeChildByData(data) {
    var targetNode = null;

    for (var i = 0; i < this.childNodes.length; i++) {
      if (this.childNodes[i].data === data) {
        targetNode = this.childNodes[i];
        break;
      }
    }

    if (targetNode) {
      this.removeChild(targetNode);
    }
  };

  Node.prototype.expand = function expand(callback, expandParent) {
    var _this = this;

    var done = function done() {
      if (expandParent) {
        var parent = _this.parent;
        while (parent.level > 0) {
          parent.expanded = true;
          parent = parent.parent;
        }
      }
      _this.expanded = true;
      if (callback) callback();
    };

    if (this.shouldLoadData()) {
      this.loadData(function (data) {
        if (data instanceof Array) {
          if (_this.checked) {
            _this.setChecked(true, true);
          } else if (!_this.store.checkStrictly) {
            reInitChecked(_this);
          }
          done();
        }
      });
    } else {
      done();
    }
  };

  Node.prototype.doCreateChildren = function doCreateChildren(array) {
    var _this2 = this;

    var defaultProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    array.forEach(function (item) {
      _this2.insertChild(merge({ data: item }, defaultProps), undefined, true);
    });
  };

  Node.prototype.collapse = function collapse() {
    this.expanded = false;
  };

  Node.prototype.shouldLoadData = function shouldLoadData() {
    return this.store.lazy === true && this.store.load && !this.loaded;
  };

  Node.prototype.updateLeafState = function updateLeafState() {
    if (this.store.lazy === true && this.loaded !== true && typeof this.isLeafByUser !== 'undefined') {
      this.isLeaf = this.isLeafByUser;
      return;
    }
    var childNodes = this.childNodes;
    if (!this.store.lazy || this.store.lazy === true && this.loaded === true) {
      this.isLeaf = !childNodes || childNodes.length === 0;
      return;
    }
    this.isLeaf = false;
  };

  Node.prototype.setChecked = function setChecked(value, deep, recursion, passValue) {
    var _this3 = this;

    this.indeterminate = value === 'half';
    this.checked = value === true;

    if (this.store.checkStrictly) return;

    if (!(this.shouldLoadData() && !this.store.checkDescendants)) {
      var _getChildState2 = getChildState(this.childNodes),
          all = _getChildState2.all,
          allWithoutDisable = _getChildState2.allWithoutDisable;

      if (!this.isLeaf && !all && allWithoutDisable) {
        this.checked = false;
        value = false;
      }

      var handleDescendants = function handleDescendants() {
        if (deep) {
          var childNodes = _this3.childNodes;
          for (var i = 0, j = childNodes.length; i < j; i++) {
            var child = childNodes[i];
            passValue = passValue || value !== false;
            var isCheck = child.disabled ? child.checked : passValue;
            child.setChecked(isCheck, deep, true, passValue);
          }

          var _getChildState3 = getChildState(childNodes),
              half = _getChildState3.half,
              _all = _getChildState3.all;

          if (!_all) {
            _this3.checked = _all;
            _this3.indeterminate = half;
          }
        }
      };

      if (this.shouldLoadData()) {
        // Only work on lazy load data.
        this.loadData(function () {
          handleDescendants();
          reInitChecked(_this3);
        }, {
          checked: value !== false
        });
        return;
      } else {
        handleDescendants();
      }
    }

    var parent = this.parent;
    if (!parent || parent.level === 0) return;

    if (!recursion) {
      reInitChecked(parent);
    }
  };

  Node.prototype.getChildren = function getChildren() {
    var forceInit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    // this is data
    if (this.level === 0) return this.data;
    var data = this.data;
    if (!data) return null;

    var props = this.store.props;
    var children = 'children';
    if (props) {
      children = props.children || 'children';
    }

    if (data[children] === undefined) {
      data[children] = null;
    }

    if (forceInit && !data[children]) {
      data[children] = [];
    }

    return data[children];
  };

  Node.prototype.updateChildren = function updateChildren() {
    var _this4 = this;

    var newData = this.getChildren() || [];
    var oldData = this.childNodes.map(function (node) {
      return node.data;
    });

    var newDataMap = {};
    var newNodes = [];

    newData.forEach(function (item, index) {
      var key = item[util["a" /* NODE_KEY */]];
      var isNodeExists = !!key && arrayFindIndex(oldData, function (data) {
        return data[util["a" /* NODE_KEY */]] === key;
      }) >= 0;
      if (isNodeExists) {
        newDataMap[key] = { index: index, data: item };
      } else {
        newNodes.push({ index: index, data: item });
      }
    });

    if (!this.store.lazy) {
      oldData.forEach(function (item) {
        if (!newDataMap[item[util["a" /* NODE_KEY */]]]) _this4.removeChildByData(item);
      });
    }

    newNodes.forEach(function (_ref) {
      var index = _ref.index,
          data = _ref.data;

      _this4.insertChild({ data: data }, index);
    });

    this.updateLeafState();
  };

  Node.prototype.loadData = function loadData(callback) {
    var _this5 = this;

    var defaultProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (this.store.lazy === true && this.store.load && !this.loaded && (!this.loading || Object.keys(defaultProps).length)) {
      this.loading = true;

      var resolve = function resolve(children) {
        _this5.loaded = true;
        _this5.loading = false;
        _this5.childNodes = [];

        _this5.doCreateChildren(children, defaultProps);

        _this5.updateLeafState();
        if (callback) {
          callback.call(_this5, children);
        }
      };

      this.store.load(this, resolve);
    } else {
      if (callback) {
        callback.call(this);
      }
    }
  };

  _createClass(Node, [{
    key: 'label',
    get: function get() {
      return getPropertyFromData(this, 'label');
    }
  }, {
    key: 'key',
    get: function get() {
      var nodeKey = this.store.key;
      if (this.data) return this.data[nodeKey];
      return null;
    }
  }, {
    key: 'disabled',
    get: function get() {
      return getPropertyFromData(this, 'disabled');
    }
  }, {
    key: 'nextSibling',
    get: function get() {
      var parent = this.parent;
      if (parent) {
        var index = parent.childNodes.indexOf(this);
        if (index > -1) {
          return parent.childNodes[index + 1];
        }
      }
      return null;
    }
  }, {
    key: 'previousSibling',
    get: function get() {
      var parent = this.parent;
      if (parent) {
        var index = parent.childNodes.indexOf(this);
        if (index > -1) {
          return index > 0 ? parent.childNodes[index - 1] : null;
        }
      }
      return null;
    }
  }]);

  return Node;
}();

/* harmony default export */ var model_node = (node_Node);
// CONCATENATED MODULE: ./packages/tree/src/model/tree-store.js
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function tree_store_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var tree_store_TreeStore = function () {
  function TreeStore(options) {
    var _this = this;

    tree_store_classCallCheck(this, TreeStore);

    this.currentNode = null;
    this.currentNodeKey = null;

    for (var option in options) {
      if (options.hasOwnProperty(option)) {
        this[option] = options[option];
      }
    }

    this.nodesMap = {};

    this.root = new model_node({
      data: this.data,
      store: this
    });

    if (this.lazy && this.load) {
      var loadFn = this.load;
      loadFn(this.root, function (data) {
        _this.root.doCreateChildren(data);
        _this._initDefaultCheckedNodes();
      });
    } else {
      this._initDefaultCheckedNodes();
    }
  }

  TreeStore.prototype.filter = function filter(value) {
    var filterNodeMethod = this.filterNodeMethod;
    var lazy = this.lazy;
    var traverse = function traverse(node) {
      var childNodes = node.root ? node.root.childNodes : node.childNodes;

      childNodes.forEach(function (child) {
        child.visible = filterNodeMethod.call(child, value, child.data, child);

        traverse(child);
      });

      if (!node.visible && childNodes.length) {
        var allHidden = true;
        allHidden = !childNodes.some(function (child) {
          return child.visible;
        });

        if (node.root) {
          node.root.visible = allHidden === false;
        } else {
          node.visible = allHidden === false;
        }
      }
      if (!value) return;

      if (node.visible && !node.isLeaf && !lazy) node.expand();
    };

    traverse(this);
  };

  TreeStore.prototype.setData = function setData(newVal) {
    var instanceChanged = newVal !== this.root.data;
    if (instanceChanged) {
      this.root.setData(newVal);
      this._initDefaultCheckedNodes();
    } else {
      this.root.updateChildren();
    }
  };

  TreeStore.prototype.getNode = function getNode(data) {
    if (data instanceof model_node) return data;
    var key = (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' ? data : Object(util["c" /* getNodeKey */])(this.key, data);
    return this.nodesMap[key] || null;
  };

  TreeStore.prototype.insertBefore = function insertBefore(data, refData) {
    var refNode = this.getNode(refData);
    refNode.parent.insertBefore({ data: data }, refNode);
  };

  TreeStore.prototype.insertAfter = function insertAfter(data, refData) {
    var refNode = this.getNode(refData);
    refNode.parent.insertAfter({ data: data }, refNode);
  };

  TreeStore.prototype.remove = function remove(data) {
    var node = this.getNode(data);

    if (node && node.parent) {
      if (node === this.currentNode) {
        this.currentNode = null;
      }
      node.parent.removeChild(node);
    }
  };

  TreeStore.prototype.append = function append(data, parentData) {
    var parentNode = parentData ? this.getNode(parentData) : this.root;

    if (parentNode) {
      parentNode.insertChild({ data: data });
    }
  };

  TreeStore.prototype._initDefaultCheckedNodes = function _initDefaultCheckedNodes() {
    var _this2 = this;

    var defaultCheckedKeys = this.defaultCheckedKeys || [];
    var nodesMap = this.nodesMap;

    defaultCheckedKeys.forEach(function (checkedKey) {
      var node = nodesMap[checkedKey];

      if (node) {
        node.setChecked(true, !_this2.checkStrictly);
      }
    });
  };

  TreeStore.prototype._initDefaultCheckedNode = function _initDefaultCheckedNode(node) {
    var defaultCheckedKeys = this.defaultCheckedKeys || [];

    if (defaultCheckedKeys.indexOf(node.key) !== -1) {
      node.setChecked(true, !this.checkStrictly);
    }
  };

  TreeStore.prototype.setDefaultCheckedKey = function setDefaultCheckedKey(newVal) {
    if (newVal !== this.defaultCheckedKeys) {
      this.defaultCheckedKeys = newVal;
      this._initDefaultCheckedNodes();
    }
  };

  TreeStore.prototype.registerNode = function registerNode(node) {
    var key = this.key;
    if (!key || !node || !node.data) return;

    var nodeKey = node.key;
    if (nodeKey !== undefined) this.nodesMap[node.key] = node;
  };

  TreeStore.prototype.deregisterNode = function deregisterNode(node) {
    var _this3 = this;

    var key = this.key;
    if (!key || !node || !node.data) return;

    node.childNodes.forEach(function (child) {
      _this3.deregisterNode(child);
    });

    delete this.nodesMap[node.key];
  };

  TreeStore.prototype.getCheckedNodes = function getCheckedNodes() {
    var leafOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var includeHalfChecked = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var checkedNodes = [];
    var traverse = function traverse(node) {
      var childNodes = node.root ? node.root.childNodes : node.childNodes;

      childNodes.forEach(function (child) {
        if ((child.checked || includeHalfChecked && child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) {
          checkedNodes.push(child.data);
        }

        traverse(child);
      });
    };

    traverse(this);

    return checkedNodes;
  };

  TreeStore.prototype.getCheckedKeys = function getCheckedKeys() {
    var _this4 = this;

    var leafOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    return this.getCheckedNodes(leafOnly).map(function (data) {
      return (data || {})[_this4.key];
    });
  };

  TreeStore.prototype.getHalfCheckedNodes = function getHalfCheckedNodes() {
    var nodes = [];
    var traverse = function traverse(node) {
      var childNodes = node.root ? node.root.childNodes : node.childNodes;

      childNodes.forEach(function (child) {
        if (child.indeterminate) {
          nodes.push(child.data);
        }

        traverse(child);
      });
    };

    traverse(this);

    return nodes;
  };

  TreeStore.prototype.getHalfCheckedKeys = function getHalfCheckedKeys() {
    var _this5 = this;

    return this.getHalfCheckedNodes().map(function (data) {
      return (data || {})[_this5.key];
    });
  };

  TreeStore.prototype._getAllNodes = function _getAllNodes() {
    var allNodes = [];
    var nodesMap = this.nodesMap;
    for (var nodeKey in nodesMap) {
      if (nodesMap.hasOwnProperty(nodeKey)) {
        allNodes.push(nodesMap[nodeKey]);
      }
    }

    return allNodes;
  };

  TreeStore.prototype.updateChildren = function updateChildren(key, data) {
    var node = this.nodesMap[key];
    if (!node) return;
    var childNodes = node.childNodes;
    for (var i = childNodes.length - 1; i >= 0; i--) {
      var child = childNodes[i];
      this.remove(child.data);
    }
    for (var _i = 0, j = data.length; _i < j; _i++) {
      var _child = data[_i];
      this.append(_child, node.data);
    }
  };

  TreeStore.prototype._setCheckedKeys = function _setCheckedKeys(key) {
    var leafOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var checkedKeys = arguments[2];

    var allNodes = this._getAllNodes().sort(function (a, b) {
      return b.level - a.level;
    });
    var cache = Object.create(null);
    var keys = Object.keys(checkedKeys);
    allNodes.forEach(function (node) {
      return node.setChecked(false, false);
    });
    for (var i = 0, j = allNodes.length; i < j; i++) {
      var node = allNodes[i];
      var nodeKey = node.data[key].toString();
      var checked = keys.indexOf(nodeKey) > -1;
      if (!checked) {
        if (node.checked && !cache[nodeKey]) {
          node.setChecked(false, false);
        }
        continue;
      }

      var parent = node.parent;
      while (parent && parent.level > 0) {
        cache[parent.data[key]] = true;
        parent = parent.parent;
      }

      if (node.isLeaf || this.checkStrictly) {
        node.setChecked(true, false);
        continue;
      }
      node.setChecked(true, true);

      if (leafOnly) {
        (function () {
          node.setChecked(false, false);
          var traverse = function traverse(node) {
            var childNodes = node.childNodes;
            childNodes.forEach(function (child) {
              if (!child.isLeaf) {
                child.setChecked(false, false);
              }
              traverse(child);
            });
          };
          traverse(node);
        })();
      }
    }
  };

  TreeStore.prototype.setCheckedNodes = function setCheckedNodes(array) {
    var leafOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var key = this.key;
    var checkedKeys = {};
    array.forEach(function (item) {
      checkedKeys[(item || {})[key]] = true;
    });

    this._setCheckedKeys(key, leafOnly, checkedKeys);
  };

  TreeStore.prototype.setCheckedKeys = function setCheckedKeys(keys) {
    var leafOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    this.defaultCheckedKeys = keys;
    var key = this.key;
    var checkedKeys = {};
    keys.forEach(function (key) {
      checkedKeys[key] = true;
    });

    this._setCheckedKeys(key, leafOnly, checkedKeys);
  };

  TreeStore.prototype.setDefaultExpandedKeys = function setDefaultExpandedKeys(keys) {
    var _this6 = this;

    keys = keys || [];
    this.defaultExpandedKeys = keys;

    keys.forEach(function (key) {
      var node = _this6.getNode(key);
      if (node) node.expand(null, _this6.autoExpandParent);
    });
  };

  TreeStore.prototype.setChecked = function setChecked(data, checked, deep) {
    var node = this.getNode(data);

    if (node) {
      node.setChecked(!!checked, deep);
    }
  };

  TreeStore.prototype.getCurrentNode = function getCurrentNode() {
    return this.currentNode;
  };

  TreeStore.prototype.setCurrentNode = function setCurrentNode(currentNode) {
    var prevCurrentNode = this.currentNode;
    if (prevCurrentNode) {
      prevCurrentNode.isCurrent = false;
    }
    this.currentNode = currentNode;
    this.currentNode.isCurrent = true;
  };

  TreeStore.prototype.setUserCurrentNode = function setUserCurrentNode(node) {
    var key = node[this.key];
    var currNode = this.nodesMap[key];
    this.setCurrentNode(currNode);
  };

  TreeStore.prototype.setCurrentNodeKey = function setCurrentNodeKey(key) {
    if (key === null || key === undefined) {
      this.currentNode && (this.currentNode.isCurrent = false);
      this.currentNode = null;
      return;
    }
    var node = this.getNode(key);
    if (node) {
      this.setCurrentNode(node);
    }
  };

  TreeStore.prototype._maxRegular = function _maxRegular(node) {
    var count = this.props.count;
    if (!count) {
      return true;
    }
    if (node.data[count] > this.max) {
      return false;
    }

    var cs = node.store.getCheckedNodes();
    var num = 0;
    for (var i = 0; i < cs.length; i++) {
      if (cs[i].isLeaf) {
        num += 1;
      } else {
        if (cs[i][count] > 0) {
          num += cs[i][count];
        }
      }
    }

    if (node.isLeaf) {
      if (num + 1 > this.max) {
        return false;
      }
    } else if (node.indeterminate) {
      var leafs = function leafs(nodes) {
        for (var _i2 = 0; _i2 < nodes.length; _i2++) {
          if (nodes[_i2].isLeaf && nodes[_i2].checked) {
            num--;
          } else if (nodes[_i2].childNodes && nodes[_i2].childNodes.length) {
            leafs(nodes[_i2].childNodes);
          }
        }
      };
      leafs(node.childNodes);
      if (num + node.data[count] > this.max) {
        return false;
      };
    } else {
      if (num + node.data[count] > this.max) {
        return false;
      }
    }
  };

  TreeStore.prototype.checkMax = function checkMax(node, val) {
    var _this7 = this;

    // eslint-disable-next-line no-undef
    return new Promise(function (resolve, reject) {
      if (!val || _this7.max === -1) {
        // 取消选择或max === -1时可以不验证
        resolve();
      } else if (_this7.lazy) {
        // 如果是懒加载则需自定义验证规则
        if (_this7.maxRegular || _this7._maxRegular) {
          var maxRegularFn = _this7.maxRegular || _this7._maxRegular.bind(_this7);
          if (maxRegularFn(node) === false) {
            reject();
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      } else if (node.isLeaf) {
        // 验证是叶子节点
        var num = node.store.getCheckedNodes().filter(function (v) {
          return v.isLeaf;
        }).length;
        if (num + 1 > _this7.max) {
          reject();
        } else {
          resolve();
        }
      } else {
        if (node.indeterminate) {
          // 此节点为半选状态时，要先验证内部选中
          var _num = node.store.getCheckedNodes().filter(function (v) {
            return v.isLeaf;
          }).length;

          var leafs = function leafs(nodes) {
            for (var i = 0; i < nodes.length; i++) {
              if (nodes[i].isLeaf && !nodes[i].checked) {
                _num++;
              } else if (nodes[i].childNodes && nodes[i].childNodes.length) {
                leafs(nodes[i].childNodes);
              }
            }
          };

          leafs(node.childNodes);

          if (_num > _this7.max) {
            reject();
          } else {
            resolve();
          }
        } else {
          var unleafs = node.childNodes.filter(function (v) {
            return !v.isLeaf;
          });
          if (node.childNodes.length - unleafs.length > _this7.max) {
            reject();
          } else {
            var _num2 = node.store.getCheckedNodes().filter(function (v) {
              return v.isLeaf;
            }).length;
            var _leafs = function _leafs(nodes) {
              for (var i = 0; i < nodes.length; i++) {
                if (_num2 > _this7.max) {
                  break;
                }
                if (nodes[i].isLeaf) {
                  _num2++;
                } else {
                  _leafs(nodes[i].childNodes);
                }
              }
            };
            _leafs(node.childNodes);
            if (_num2 > _this7.max) {
              reject();
            } else {
              resolve();
            }
          }
        }
      }
    });
  };

  return TreeStore;
}();

/* harmony default export */ var tree_store = (tree_store_TreeStore);
;
// EXTERNAL MODULE: ./packages/tree/src/tree-node.vue + 4 modules
var tree_node = __webpack_require__(9);

// EXTERNAL MODULE: ./packages/tree/src/tree-item.vue + 4 modules
var tree_item = __webpack_require__(6);

// EXTERNAL MODULE: ./src/mixins/emitter.js
var emitter = __webpack_require__(3);

// EXTERNAL MODULE: ./src/utils/dom.js
var dom = __webpack_require__(2);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./packages/tree/src/tree.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//









/* harmony default export */ var treevue_type_script_lang_js_ = ({
  name: 'VsTree',

  mixins: [emitter["a" /* default */]],

  components: {
    VsTreeNode: tree_node["default"],
    VsBreadcrumb: packages_breadcrumb
  },

  provide: function provide() {
    return {
      nodePrarnt: this,
      props: this.props,
      breadcrumb: this.breadcrumb,
      virtual: this.virtual
    };
  },
  data: function data() {
    return {
      item: tree_item["a" /* default */],
      store: null,
      root: null,
      rootCopy: null,
      currentNode: null,
      treeItems: null,
      checkboxItems: [],
      breadcrumbs: [],
      dragState: {
        showDropIndicator: false,
        draggingNode: null,
        dropNode: null,
        allowDrop: true
      }
    };
  },


  props: {
    data: {
      type: Array
    },
    emptyText: {
      type: String,
      default: function _default() {
        return '暂无数据';
      }
    },
    renderAfterExpand: {
      type: Boolean,
      default: true
    },
    nodeKey: String,
    checkStrictly: Boolean,
    defaultExpandAll: Boolean,
    expandOnClickNode: {
      type: Boolean,
      default: true
    },
    checkOnClickNode: Boolean,
    checkDescendants: {
      type: Boolean,
      default: false
    },
    autoExpandParent: {
      type: Boolean,
      default: true
    },
    defaultCheckedKeys: Array,
    defaultExpandedKeys: Array,
    currentNodeKey: [String, Number],
    renderContent: Function,
    showCheckbox: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: false
    },
    allowDrag: Function,
    allowDrop: Function,
    props: {
      default: function _default() {
        return {
          children: 'children',
          label: 'label',
          disabled: 'disabled',
          count: null
        };
      }
    },
    breadcrumb: {
      type: Boolean,
      default: false
    },
    virtual: {
      type: Boolean,
      default: false
    },
    lazy: {
      type: Boolean,
      default: false
    },
    highlightCurrent: Boolean,
    load: Function,
    filterNodeMethod: Function,
    accordion: Boolean,
    indent: {
      type: Number,
      default: 18
    },
    max: {
      type: Number,
      default: -1
    },
    maxRegular: Function,
    iconClass: String,
    breadcrumbClass: String
  },

  computed: {
    children: {
      set: function set(value) {
        this.data = value;
      },
      get: function get() {
        return this.data;
      }
    },

    treeItemArray: function treeItemArray() {
      return Array.prototype.slice.call(this.treeItems);
    },
    isEmpty: function isEmpty() {
      var childNodes = this.root.childNodes;

      return !childNodes || childNodes.length === 0 || childNodes.every(function (_ref) {
        var visible = _ref.visible;
        return !visible;
      });
    }
  },

  watch: {
    defaultCheckedKeys: function defaultCheckedKeys(newVal) {
      this.store.setDefaultCheckedKey(newVal);
    },
    defaultExpandedKeys: function defaultExpandedKeys(newVal) {
      this.store.defaultExpandedKeys = newVal;
      this.store.setDefaultExpandedKeys(newVal);
    },
    data: function data(newVal) {
      this.store.setData(newVal);
    },
    checkboxItems: function checkboxItems(val) {
      Array.prototype.forEach.call(val, function (checkbox) {
        checkbox.setAttribute('tabindex', -1);
      });
    },
    checkStrictly: function checkStrictly(newVal) {
      this.store.checkStrictly = newVal;
    }
  },

  methods: {
    filter: function filter(value) {
      if (!this.filterNodeMethod) throw new Error('[Tree] filterNodeMethod is required when filter');
      this.store.filter(value);
    },
    getNodeKey: function getNodeKey(node) {
      return Object(util["c" /* getNodeKey */])(this.nodeKey, node.data);
    },
    getNodePath: function getNodePath(data) {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in getNodePath');
      var node = this.store.getNode(data);
      if (!node) return [];
      var path = [node.data];
      var parent = node.parent;
      while (parent && parent !== this.root) {
        path.push(parent.data);
        parent = parent.parent;
      }
      return path.reverse();
    },
    getCheckedNodes: function getCheckedNodes(leafOnly, includeHalfChecked) {
      return this.store.getCheckedNodes(leafOnly, includeHalfChecked);
    },
    getCheckedKeys: function getCheckedKeys(leafOnly) {
      return this.store.getCheckedKeys(leafOnly);
    },
    getCurrentNode: function getCurrentNode() {
      var currentNode = this.store.getCurrentNode();
      return currentNode ? currentNode.data : null;
    },
    getCurrentKey: function getCurrentKey() {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in getCurrentKey');
      var currentNode = this.getCurrentNode();
      return currentNode ? currentNode[this.nodeKey] : null;
    },
    setCheckedNodes: function setCheckedNodes(nodes, leafOnly) {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedNodes');
      this.store.setCheckedNodes(nodes, leafOnly);
    },
    setCheckedKeys: function setCheckedKeys(keys, leafOnly) {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedKeys');
      this.store.setCheckedKeys(keys, leafOnly);
    },
    setChecked: function setChecked(data, checked, deep) {
      this.store.setChecked(data, checked, deep);
    },
    getHalfCheckedNodes: function getHalfCheckedNodes() {
      return this.store.getHalfCheckedNodes();
    },
    getHalfCheckedKeys: function getHalfCheckedKeys() {
      return this.store.getHalfCheckedKeys();
    },
    setCurrentNode: function setCurrentNode(node) {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCurrentNode');
      this.store.setUserCurrentNode(node);
    },
    setCurrentKey: function setCurrentKey(key) {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCurrentKey');
      this.store.setCurrentNodeKey(key);
    },
    getNode: function getNode(data) {
      return this.store.getNode(data);
    },
    remove: function remove(data) {
      this.store.remove(data);
    },
    append: function append(data, parentNode) {
      this.store.append(data, parentNode);
    },
    insertBefore: function insertBefore(data, refNode) {
      this.store.insertBefore(data, refNode);
    },
    insertAfter: function insertAfter(data, refNode) {
      this.store.insertAfter(data, refNode);
    },
    handleNodeExpand: function handleNodeExpand(nodeData, node, instance) {
      this.broadcast('VsTreeNode', 'tree-node-expand', node);
      this.$emit('node-expand', nodeData, node, instance);
    },
    updateKeyChildren: function updateKeyChildren(key, data) {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in updateKeyChild');
      this.store.updateChildren(key, data);
    },
    initTabIndex: function initTabIndex() {
      this.treeItems = this.$el.querySelectorAll('.is-focusable[role=treeitem]');
      this.checkboxItems = this.$el.querySelectorAll('input[type=checkbox]');
      var checkedItem = this.$el.querySelectorAll('.is-checked[role=treeitem]');
      if (checkedItem.length) {
        checkedItem[0].setAttribute('tabindex', 0);
        return;
      }
      this.treeItems[0] && this.treeItems[0].setAttribute('tabindex', 0);
    },
    handleKeydown: function handleKeydown(ev) {
      var currentItem = ev.target;
      if (currentItem.className.indexOf('vs-tree-node') === -1) return;
      var keyCode = ev.keyCode;
      this.treeItems = this.$el.querySelectorAll('.is-focusable[role=treeitem]');
      var currentIndex = this.treeItemArray.indexOf(currentItem);
      var nextIndex = void 0;
      if ([38, 40].indexOf(keyCode) > -1) {
        // up、down
        ev.preventDefault();
        if (keyCode === 38) {
          // up
          nextIndex = currentIndex !== 0 ? currentIndex - 1 : 0;
        } else {
          nextIndex = currentIndex < this.treeItemArray.length - 1 ? currentIndex + 1 : 0;
        }
        this.treeItemArray[nextIndex].focus(); // 选中
      }
      if ([37, 39].indexOf(keyCode) > -1) {
        // left、right 展开
        ev.preventDefault();
        currentItem.click(); // 选中
      }
      var hasInput = currentItem.querySelector('[type="checkbox"]');
      if ([13, 32].indexOf(keyCode) > -1 && hasInput) {
        // space enter选中checkbox
        ev.preventDefault();
        hasInput.click();
      }
    },
    onload: function onload(node, resolve) {
      var _this = this;

      this.load(node, function (data, addbread) {
        if (data && Array.isArray(data)) {
          resolve(data);
          if (_this.breadcrumb && !node.isLeaf && addbread) {
            _this.breadcrumbs.push(node);
            node.expanded = false;
            _this.root = node;
            _this.forceRender();
          }
        }
      });
    },
    onCutCrumb: function onCutCrumb(idx) {
      if (idx === -1) {
        this.breadcrumbs = [];
      } else {
        this.breadcrumbs = this.breadcrumbs.splice(0, idx + 1);
      }

      if (this.breadcrumbs.length) {
        this.root = this.breadcrumbs[this.breadcrumbs.length - 1];
      } else {
        this.root = this.store.root;
      }
      this.forceRender();
    },
    forceRender: function forceRender() {
      this.$nextTick(function () {
        // this.$refs.treeVirtual.forceRender();
      });
    }
  },

  created: function created() {
    var _this2 = this;

    this.isTree = true;

    this.store = new tree_store({
      key: this.nodeKey,
      data: this.data,
      lazy: this.lazy,
      max: this.max,
      maxRegular: this.maxRegular,
      props: this.props,
      load: this.onload,
      currentNodeKey: this.currentNodeKey,
      checkStrictly: this.checkStrictly,
      checkDescendants: this.checkDescendants,
      defaultCheckedKeys: this.defaultCheckedKeys,
      defaultExpandedKeys: this.defaultExpandedKeys,
      autoExpandParent: this.autoExpandParent,
      defaultExpandAll: this.defaultExpandAll,
      filterNodeMethod: this.filterNodeMethod
    });

    this.root = this.store.root;

    var dragState = this.dragState;
    this.$on('tree-node-drag-start', function (event, treeNode) {
      if (typeof _this2.allowDrag === 'function' && !_this2.allowDrag(treeNode.node)) {
        event.preventDefault();
        return false;
      }
      event.dataTransfer.effectAllowed = 'move';

      // wrap in try catch to address IE's error when first param is 'text/plain'
      try {
        // setData is required for draggable to work in FireFox
        // the content has to be '' so dragging a node out of the tree won't open a new tab in FireFox
        event.dataTransfer.setData('text/plain', '');
      } catch (e) {}
      dragState.draggingNode = treeNode;
      _this2.$emit('node-drag-start', treeNode.node, event);
    });

    this.$on('tree-node-drag-over', function (event, treeNode) {
      var dropNode = Object(util["b" /* findNearestComponent */])(event.target, 'VsTreeNode');
      var oldDropNode = dragState.dropNode;
      if (oldDropNode && oldDropNode !== dropNode) {
        Object(dom["b" /* removeClass */])(oldDropNode.$el, 'is-drop-inner');
      }
      var draggingNode = dragState.draggingNode;
      if (!draggingNode || !dropNode) return;

      var dropPrev = true;
      var dropInner = true;
      var dropNext = true;
      var userAllowDropInner = true;
      if (typeof _this2.allowDrop === 'function') {
        dropPrev = _this2.allowDrop(draggingNode.node, dropNode.node, 'prev');
        userAllowDropInner = dropInner = _this2.allowDrop(draggingNode.node, dropNode.node, 'inner');
        dropNext = _this2.allowDrop(draggingNode.node, dropNode.node, 'next');
      }
      event.dataTransfer.dropEffect = dropInner ? 'move' : 'none';
      if ((dropPrev || dropInner || dropNext) && oldDropNode !== dropNode) {
        if (oldDropNode) {
          _this2.$emit('node-drag-leave', draggingNode.node, oldDropNode.node, event);
        }
        _this2.$emit('node-drag-enter', draggingNode.node, dropNode.node, event);
      }

      if (dropPrev || dropInner || dropNext) {
        dragState.dropNode = dropNode;
      }

      if (dropNode.node.nextSibling === draggingNode.node) {
        dropNext = false;
      }
      if (dropNode.node.previousSibling === draggingNode.node) {
        dropPrev = false;
      }
      if (dropNode.node.contains(draggingNode.node, false)) {
        dropInner = false;
      }
      if (draggingNode.node === dropNode.node || draggingNode.node.contains(dropNode.node)) {
        dropPrev = false;
        dropInner = false;
        dropNext = false;
      }

      var targetPosition = dropNode.$el.getBoundingClientRect();
      var treePosition = _this2.$el.getBoundingClientRect();

      var dropType = void 0;
      var prevPercent = dropPrev ? dropInner ? 0.25 : dropNext ? 0.45 : 1 : -1;
      var nextPercent = dropNext ? dropInner ? 0.75 : dropPrev ? 0.55 : 0 : 1;

      var indicatorTop = -9999;
      var distance = event.clientY - targetPosition.top;
      if (distance < targetPosition.height * prevPercent) {
        dropType = 'before';
      } else if (distance > targetPosition.height * nextPercent) {
        dropType = 'after';
      } else if (dropInner) {
        dropType = 'inner';
      } else {
        dropType = 'none';
      }

      var iconPosition = dropNode.$el.querySelector('.vs-tree-node__expand-icon').getBoundingClientRect();
      var dropIndicator = _this2.$refs.dropIndicator;
      if (dropType === 'before') {
        indicatorTop = iconPosition.top - treePosition.top;
      } else if (dropType === 'after') {
        indicatorTop = iconPosition.bottom - treePosition.top;
      }
      dropIndicator.style.top = indicatorTop + 'px';
      dropIndicator.style.left = iconPosition.right - treePosition.left + 'px';

      if (dropType === 'inner') {
        Object(dom["a" /* addClass */])(dropNode.$el, 'is-drop-inner');
      } else {
        Object(dom["b" /* removeClass */])(dropNode.$el, 'is-drop-inner');
      }

      dragState.showDropIndicator = dropType === 'before' || dropType === 'after';
      dragState.allowDrop = dragState.showDropIndicator || userAllowDropInner;
      dragState.dropType = dropType;
      _this2.$emit('node-drag-over', draggingNode.node, dropNode.node, event);
    });

    this.$on('tree-node-drag-end', function (event) {
      var draggingNode = dragState.draggingNode,
          dropType = dragState.dropType,
          dropNode = dragState.dropNode;

      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';

      if (draggingNode && dropNode) {
        var draggingNodeCopy = { data: draggingNode.node.data };
        if (dropType !== 'none') {
          draggingNode.node.remove();
        }
        if (dropType === 'before') {
          dropNode.node.parent.insertBefore(draggingNodeCopy, dropNode.node);
        } else if (dropType === 'after') {
          dropNode.node.parent.insertAfter(draggingNodeCopy, dropNode.node);
        } else if (dropType === 'inner') {
          dropNode.node.insertChild(draggingNodeCopy);
        }
        if (dropType !== 'none') {
          _this2.store.registerNode(draggingNodeCopy);
        }

        Object(dom["b" /* removeClass */])(dropNode.$el, 'is-drop-inner');

        _this2.$emit('node-drag-end', draggingNode.node, dropNode.node, dropType, event);
        if (dropType !== 'none') {
          _this2.$emit('node-drop', draggingNode.node, dropNode.node, dropType, event);
        }
      }
      if (draggingNode && !dropNode) {
        _this2.$emit('node-drag-end', draggingNode.node, null, dropType, event);
      }

      dragState.showDropIndicator = false;
      dragState.draggingNode = null;
      dragState.dropNode = null;
      dragState.allowDrop = true;
    });

    this.$on('node-click', function (event, node) {
      if (_this2.breadcrumb && !node.loading && !node.isLeaf) {
        _this2.breadcrumbs.push(node);
        _this2.root = node;
        _this2.forceRender();
      }
    });
  },
  mounted: function mounted() {
    this.initTabIndex();
    this.$el.addEventListener('keydown', this.handleKeydown);
  },
  updated: function updated() {
    this.treeItems = this.$el.querySelectorAll('[role=treeitem]');
    this.checkboxItems = this.$el.querySelectorAll('input[type=checkbox]');
  }
});
// CONCATENATED MODULE: ./packages/tree/src/tree.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_treevue_type_script_lang_js_ = (treevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./packages/tree/src/tree.vue





/* normalize component */

var tree_component = Object(componentNormalizer["a" /* default */])(
  src_treevue_type_script_lang_js_,
  treevue_type_template_id_547575a6_render,
  treevue_type_template_id_547575a6_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var tree_api; }
tree_component.options.__file = "packages/tree/src/tree.vue"
/* harmony default export */ var tree = (tree_component.exports);
// EXTERNAL MODULE: external "vue-virtual-scroll-list"
var external_vue_virtual_scroll_list_ = __webpack_require__(8);
var external_vue_virtual_scroll_list_default = /*#__PURE__*/__webpack_require__.n(external_vue_virtual_scroll_list_);

// CONCATENATED MODULE: ./packages/tree/index.js



/* istanbul ignore next */
tree.install = function (Vue) {
  Vue.component(tree.name, tree);
  Vue.component('virtual-list', external_vue_virtual_scroll_list_default.a);
};

/* harmony default export */ var packages_tree = (tree);
// EXTERNAL MODULE: ./src/transitions/collapse-transition.js
var collapse_transition = __webpack_require__(4);

// CONCATENATED MODULE: ./src/index.js
/* Automatically generated by './build/bin/build-entry.js' */







var components = [packages_checkbox["a" /* default */], packages_breadcrumb, packages_breadcrumb_item, packages_tree, collapse_transition["a" /* default */]];

var install = function install(Vue) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  components.forEach(function (component) {
    Vue.component(component.name, component);
  });

  Vue.prototype.$KUI = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  };
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

/* harmony default export */ var src = __webpack_exports__["default"] = ({
  version: '1.2.0',
  install: install,
  CollapseTransition: collapse_transition["a" /* default */],
  Checkbox: packages_checkbox["a" /* default */],
  Breadcrumb: packages_breadcrumb,
  BreadcrumbItem: packages_breadcrumb_item,
  Tree: packages_tree
});

/***/ })
/******/ ])["default"];