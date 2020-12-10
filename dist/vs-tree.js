(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.vsTree = {}));
}(this, (function (exports) { 'use strict';

  var version = "2.0.0";

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var setepId = 0;

  var Node = /*#__PURE__*/function () {
    function Node(ops) {
      var _this = this;

      _classCallCheck(this, Node);

      this.id = setepId++;
      this.checked = false;
      this.expanded = false;
      this.indeterminate = false;
      this.visbile = false;
      this.disabled = false;
      this.loaded = false;
      this.isLeaf = false;
      this.level = 0;
      this.childNodes = [];
      this.store = ops.store;
      this.data = ops.data;

      if (typeof this.store.format === 'function') {
        var _data = this.store.format(Object.assign({}, ops.data));

        if (_typeof(_data) !== 'object') {
          throw new Error('format must return object! \nformat: function(data) {\n  return {name, children, isLeaf}\n}');
        }

        var props = ['name', 'children', 'isLeaf'];
        props.forEach(function (key) {
          if (Object.prototype.hasOwnProperty.call(_data, key)) {
            _this.data[key] = _data[key];
          }
        });
      }

      this.parent = ops.parent;

      if (this.store.expandKeys.includes(this.data.id)) {
        this.expanded = true;
      }

      if (this.store.disabledKeys.includes(this.data.id)) {
        this.disabled = true;
      }

      if (this.parent) {
        this.level = this.parent.level + 1;
      }

      if (this.data) {
        this.setData(this.data);
      }

      this.initData();
    }

    _createClass(Node, [{
      key: "initData",
      value: function initData() {
        var _this$parent;

        if (this.level > 1 && !((_this$parent = this.parent) !== null && _this$parent !== void 0 && _this$parent.expanded)) {
          this.visbile = false;
          return;
        }

        this.visbile = true;
      }
    }, {
      key: "createNode",
      value: function createNode() {
        var _this2 = this;

        if (this.dom) {
          this.checkboxNode && (this.checkboxNode.checked = this.checked);
          this.radioNode && (this.radioNode.checked = this.checked);
          return this.dom;
        }

        var dom = document.createElement('div');
        dom.className = 'tree-node';
        dom.appendChild(this.createInner());

        if (this.store.renderContent) {
          dom.appendChild(this.createContent());
        }

        dom.addEventListener('click', function (e) {
          e.stopPropagation();

          if (_this2.store.highlightCurrent) {
            if (_this2.store.selectedCurrent) {
              _this2.store.selectedCurrent.dom.classList.remove('selected');
            }

            dom.classList.add('selected');
          }

          if (_this2.store.checkOnClickNode) {
            _this2.handleCheckChange({
              target: {
                checked: !_this2.checked
              }
            });
          }

          _this2.store.selectedCurrent = _this2;

          _this2.store.click(e, _this2);
        }, {
          passive: false
        });
        this.dom = dom;
        return dom;
      }
    }, {
      key: "createInner",
      value: function createInner() {
        var _this$childNodes;

        var dom = document.createElement('div'); // 当隐藏根节点时减少一级缩进

        var level = this.store.hideRoot ? -1 : 0;
        dom.style.paddingLeft = (this.level + level) * this.store.indent + 'px';
        var checkDom = ((_this$childNodes = this.childNodes) !== null && _this$childNodes !== void 0 && _this$childNodes.length || this.store.lazy) && !this.isLeaf ? this.createExpand() : this.createExpandEmpty();
        dom.appendChild(checkDom);

        if (this.store.showCheckbox || this.store.showRadio) {
          if (!this.store.nocheckParent || !this.childNodes.length) {
            dom.appendChild(this.createCheckbox());
          }
        }

        dom.appendChild(this.createText());
        return dom;
      } // 自定义Dom 节点

    }, {
      key: "cusmtomNode",
      value: function cusmtomNode(name, info) {
        var _this3 = this;

        var box = document.createElement(name);
        info.text && (box.innerText = info.text);
        info.className && (box.className = info.className);

        if (info.children) {
          info.children.forEach(function (v) {
            box.appendChild(v);
          });
        }

        if (typeof info.click === 'function') {
          box.addEventListener('click', function (e) {
            e.stopPropagation();
            info.click(e, _this3);
          }, {
            passive: false
          });
        }

        return box;
      } // 自定义内容

    }, {
      key: "createContent",
      value: function createContent() {
        var tpl = this.store.renderContent(this.cusmtomNode.bind(this), this);
        tpl.addEventListener('click', function (e) {
          e.stopPropagation();
        }, {
          passive: false
        });
        return tpl;
      }
    }, {
      key: "createExpandEmpty",
      value: function createExpandEmpty() {
        var dom = document.createElement('span');
        dom.className = 'expand-empty';
        return dom;
      }
    }, {
      key: "createExpand",
      value: function createExpand() {
        var _this4 = this;

        var dom = document.createElement('span');
        dom.className = 'expand';
        dom.innerText = '+';

        if (this.level < 1 || this.expanded) {
          dom.classList.add('expand-true');
          this.expanded = true;
          dom.innerText = '-';
        }

        dom.addEventListener('click', function (e) {
          e.stopPropagation();
          if (_this4.loading) return;
          var expand = !dom.classList.contains('expand-true');
          dom.innerText = expand ? '-' : '+';
          dom.classList.toggle('expand-true');

          _this4.setExpand(expand);
        }, {
          passive: false
        });
        this.expandEl = dom;
        return dom;
      }
    }, {
      key: "createCheckbox",
      value: function createCheckbox() {
        var _this5 = this;

        var label = 'checkbox';

        if (this.store.showRadio) {
          label = 'radio';
        }

        var dom = document.createElement('label');
        dom.className = "vs-".concat(label);
        var inner = document.createElement('span');
        inner.className = "vs-".concat(label, "__inner");
        var checkbox = document.createElement('input');
        checkbox.type = label;
        checkbox.checked = this.checked;
        checkbox.disabled = this.disabled;
        checkbox.className = "vs-".concat(label, "__original");
        checkbox.name = label === 'radio' ? 'vs-radio' + (this.store.radioParentoOnly ? this.parent.id : '') : 'vs-checkbox';

        if (label === 'radio') {
          checkbox.name = 'vs-radio' + (this.store.radioParentoOnly ? this.parent.id : '');
          this.radioNode = checkbox;
        } else {
          checkbox.name = 'vs-checkbox';
          this.checkboxNode = checkbox;
        }

        dom.appendChild(checkbox);
        dom.appendChild(inner); // label 点击会出发两次

        dom.addEventListener('click', function (e) {
          e.stopPropagation();
        }, {
          passive: false
        }); // 点击回调

        checkbox.addEventListener('click', function (e) {
          _this5.store.check(e, _this5);
        }, {
          passive: false
        });
        checkbox.addEventListener('change', function (e) {
          e.stopPropagation();

          _this5.handleCheckChange(e);
        });
        return dom;
      }
    }, {
      key: "handleCheckChange",
      value: function handleCheckChange(e) {
        var checked = e.target.checked;

        if (checked && this.store.max && this.store.checkMaxNodes(this)) {
          this.store.limitAlert();
          e.target.checked = false;
          return;
        }

        if (this.store.showRadio) {
          this.updateRadioChecked(checked);
        } else {
          this.updateChecked(checked);
          this.updateCheckedParent(checked);
        }

        this.store.change(this);
      }
    }, {
      key: "createText",
      value: function createText() {
        var dom = document.createElement('span');
        dom.innerText = this.data.name;
        dom.className = 'name';
        return dom;
      }
    }, {
      key: "setData",
      value: function setData(data) {
        this.store.dataMap.set(data.id, this);
        this.data = data;
        this.childNodes = [];

        if (typeof data.isLeaf === 'boolean') {
          this.isLeaf = data.isLeaf;
        }

        var children;

        if (this.level === 0 && this.data instanceof Node) {
          children = this.data;
        } else {
          children = this.data.children || [];
        }

        if (children.length) {
          this.loaded = true;
        }

        for (var i = 0, j = children.length; i < j; i++) {
          this.insertChild({
            data: children[i]
          });
        }
      }
    }, {
      key: "insertChild",
      value: function insertChild(child) {
        if (!(child instanceof Node)) {
          Object.assign(child, {
            parent: this,
            store: this.store
          });
          child = new Node(child);
        }

        child.level = this.level + 1;
        this.childNodes.push(child);
        return child;
      }
    }, {
      key: "updateExpand",
      value: function updateExpand(expand) {
        var _this6 = this;

        if (this.childNodes.length) {
          this.childNodes.forEach(function (v) {
            if (expand && _this6.expanded) {
              v.visbile = true;
            } else {
              v.visbile = false;
            }

            v.updateExpand(expand);
          });
        }
      }
    }, {
      key: "updateChecked",
      value: function updateChecked(check) {
        this.checked = check;
        this.sortId = Date.now();
        this.checkboxNode && (this.checkboxNode.checked = check);
        this.parent && (this.parent.indeterminate = false);
        this.dom && this.dom.classList.remove('is-indeterminate');

        if (this.childNodes.length) {
          this.childNodes.forEach(function (v) {
            v.updateChecked(check);
          });
        }
      }
    }, {
      key: "updateCheckedParent",
      value: function updateCheckedParent() {
        if (!this.parent || this.store.nocheckParent) return;
        var allChecked = this.parent.childNodes.every(function (v) {
          return v.checked;
        });
        var someChecked = this.parent.childNodes.some(function (v) {
          return v.checked || v.indeterminate;
        });

        if (allChecked) {
          this.parent.checked = true;
          this.parent.indeterminate = false;
          this.parent.checkboxNode.checked = true;
          this.parent.dom.classList.remove('is-indeterminate');
        } else if (someChecked) {
          this.parent.checked = false;
          this.parent.indeterminate = true;
          this.parent.checkboxNode.checked = false;
          this.parent.dom.classList.add('is-indeterminate');
        } else {
          this.parent.checked = false;
          this.parent.indeterminate = false;
          this.parent.checkboxNode.checked = false;
          this.parent.dom.classList.remove('is-indeterminate');
        }

        this.parent.updateCheckedParent();
      } // 更新单选节点选中

    }, {
      key: "updateRadioChecked",
      value: function updateRadioChecked(checked) {
        // 父节点下唯一
        if (this.store.radioParentoOnly) {
          if (this.store.radioMap[this.parent.id]) {
            this.store.radioMap[this.parent.id].checked = false;
          }

          this.store.radioMap[this.parent.id] = this;
        } else {
          if (this.store.radioNode) {
            this.store.radioNode = false;
          }

          this.store.radioNode = this;
        }

        this.checked = checked;
        this.radioNode && (this.radioNode.checked = checked);
      } // 设置是否选中

    }, {
      key: "setChecked",
      value: function setChecked(checked, isInitDefault) {
        if (!isInitDefault && this.disabled) return;

        if (this.store.showRadio) {
          this.updateRadioChecked(checked);
          return;
        }

        if (!this.store.showCheckbox) return;
        this.updateChecked(checked);
        this.updateCheckedParent(checked);
      } // 设置默认展开

    }, {
      key: "setExpand",
      value: function setExpand(expand) {
        var _this7 = this;

        this.expanded = expand;
        this.updateExpand(this.expanded);

        if (this.store.lazy && !this.loaded) {
          this.loadData(function (data) {
            if (data) {
              _this7.store.update();
            }
          });
        } else {
          this.store.update();
        }
      } // 加载数据

    }, {
      key: "loadData",
      value: function loadData(callback) {
        var _this8 = this;

        if (this.loading) return;
        this.loading = true;

        if (this.expandEl) {
          this.expandEl.classList.add('is-loading');
        }

        var resolve = function resolve() {
          var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
          _this8.loaded = true;
          _this8.loading = false;

          if (_this8.expandEl) {
            _this8.expandEl.classList.remove('is-loading');
          }

          if (children.length) {
            children.forEach(function (data) {
              _this8.insertChild({
                data: data,
                store: _this8.store
              });
            });

            _this8.childNodes[0].updateCheckedParent();

            _this8.store.updateNodes();
          }

          if (callback) {
            callback.call(_this8, children);
          }
        };

        this.store.load(this, resolve);
      } // 删除节点

    }, {
      key: "remove",
      value: function remove() {
        var _this9 = this;

        var parent = this.parent;
        if (!parent) return;
        var children = parent.childNodes || [];
        var index = children.findIndex(function (d) {
          return d.id === _this9.id;
        });

        if (index > -1) {
          children.splice(index, 1);
        }

        this.store.updateNodes();
      } // 添加节点

    }, {
      key: "append",
      value: function append(data) {
        if (!data || _typeof(data) !== 'object') return;

        if (!this.childNodes.length) {
          delete this.dom;
        }

        var node = this.insertChild({
          data: data,
          store: this.store
        });
        node.updateCheckedParent();
        this.store.updateNodes();
      }
    }]);

    return Node;
  }();

  var TreeStore = /*#__PURE__*/function () {
    function TreeStore(options) {
      _classCallCheck(this, TreeStore);

      for (var option in options) {
        if (Object.prototype.hasOwnProperty.call(options, option)) {
          this[option] = options[option];
        }
      }

      this.nodes = [];
      this.dataMap = new Map();
      this.radioMap = {};
      this.root = new Node({
        data: this.data,
        store: this
      });
    }

    _createClass(TreeStore, [{
      key: "setData",
      value: function setData(val) {
        this.root.setData(val);
        this.updateNodes();
      } // 更新节点列表

    }, {
      key: "updateNodes",
      value: function updateNodes() {
        this.nodes = this.getAllNodes();
        this.nodesChange(this.nodes);
      } // 获取节点列表

    }, {
      key: "getAllNodes",
      value: function getAllNodes() {
        var nodes = [];

        var expand = function expand(val) {
          nodes.push(val);

          if (val.childNodes && val.childNodes.length) {
            val.childNodes.forEach(function (element) {
              expand(element);
            });
          }
        };

        expand(this.root);
        return nodes;
      } // 根据ID获取节点

    }, {
      key: "getNodeById",
      value: function getNodeById(id) {
        return this.dataMap.get(id);
      } // 获取选中节点

    }, {
      key: "getCheckedNodes",
      value: function getCheckedNodes() {
        var _this = this;

        var nodes = this.nodes.filter(function (v) {
          return v.checked && (!_this.nocheckParent || !v.childNodes.length);
        });

        if (this.sort) {
          return nodes.sort(function (a, b) {
            return a.sortId - b.sortId;
          }).map(function (v) {
            return v.data;
          });
        }

        return nodes.map(function (v) {
          return v.data;
        });
      } // 设置默认选中

    }, {
      key: "setDefaultChecked",
      value: function setDefaultChecked() {
        var _this2 = this;

        this.checkedKeys.forEach(function (id) {
          var node = _this2.getNodeById(id);

          if (node) {
            node.setChecked(true, true);
          } else {
            console.warn('not found node by ' + id);
          }
        });
      } // 验证是否已经选到最大

    }, {
      key: "checkMaxNodes",
      value: function checkMaxNodes(node) {
        var len = this.getCheckedNodes().length;

        if (len > this.max) {
          return true;
        }

        if (node.childNodes.length > this.max) {
          return true;
        }

        return false;
      }
    }]);

    return TreeStore;
  }();

  /**
   * virtual list core calculating center
   */
  var DIRECTION_TYPE = {
    FRONT: 'FRONT',
    // scroll up or left
    BEHIND: 'BEHIND' // scroll down or right

  };
  var CALC_TYPE = {
    INIT: 'INIT',
    FIXED: 'FIXED',
    DYNAMIC: 'DYNAMIC'
  };
  var LEADING_BUFFER = 2;

  var Virtual = /*#__PURE__*/function () {
    function Virtual(param, callUpdate) {
      _classCallCheck(this, Virtual);

      this.init(param, callUpdate);
    }

    _createClass(Virtual, [{
      key: "init",
      value: function init(param, callUpdate) {
        // param data
        this.param = param;
        this.callUpdate = callUpdate; // size data

        this.sizes = new Map();
        this.firstRangeTotalSize = 0;
        this.firstRangeAverageSize = 0;
        this.lastCalcIndex = 0;
        this.fixedSizeValue = 0;
        this.calcType = CALC_TYPE.INIT; // scroll data

        this.offset = 0;
        this.direction = ''; // range data

        this.range = Object.create(null);

        if (param) {
          this.checkRange(0, param.keeps - 1);
        } // benchmark test data
        // this.__bsearchCalls = 0
        // this.__getIndexOffsetCalls = 0

      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.init(null, null);
      } // return current render range

    }, {
      key: "getRange",
      value: function getRange() {
        var range = Object.create(null);
        range.start = this.range.start;
        range.end = this.range.end;
        range.padFront = this.range.padFront;
        range.padBehind = this.range.padBehind;
        return range;
      }
    }, {
      key: "isBehind",
      value: function isBehind() {
        return this.direction === DIRECTION_TYPE.BEHIND;
      }
    }, {
      key: "isFront",
      value: function isFront() {
        return this.direction === DIRECTION_TYPE.FRONT;
      } // return start index offset

    }, {
      key: "getOffset",
      value: function getOffset(start) {
        return (start < 1 ? 0 : this.getIndexOffset(start)) + this.param.slotHeaderSize;
      }
    }, {
      key: "updateParam",
      value: function updateParam(key, value) {
        var _this = this;

        if (this.param && key in this.param) {
          // if uniqueIds change, find out deleted id and remove from size map
          if (key === 'uniqueIds') {
            this.sizes.forEach(function (v, key) {
              if (!value.includes(key)) {
                _this.sizes.delete(key);
              }
            });
          }

          this.param[key] = value;
        }
      } // save each size map by id

    }, {
      key: "saveSize",
      value: function saveSize(id, size) {
        this.sizes.set(id, size); // we assume size type is fixed at the beginning and remember first size value
        // if there is no size value different from this at next comming saving
        // we think it's a fixed size list, otherwise is dynamic size list

        if (this.calcType === CALC_TYPE.INIT) {
          this.fixedSizeValue = size;
          this.calcType = CALC_TYPE.FIXED;
        } else if (this.calcType === CALC_TYPE.FIXED && this.fixedSizeValue !== size) {
          this.calcType = CALC_TYPE.DYNAMIC; // it's no use at all

          delete this.fixedSizeValue;
        } // calculate the average size only in the first range


        if (this.calcType !== CALC_TYPE.FIXED && typeof this.firstRangeTotalSize !== 'undefined') {
          if (this.sizes.size < Math.min(this.param.keeps, this.param.uniqueIds.length)) {
            this.firstRangeTotalSize = _toConsumableArray(this.sizes.values()).reduce(function (acc, val) {
              return acc + val;
            }, 0);
            this.firstRangeAverageSize = Math.round(this.firstRangeTotalSize / this.sizes.size);
          } else {
            // it's done using
            delete this.firstRangeTotalSize;
          }
        }
      } // in some special situation (e.g. length change) we need to update in a row
      // try goiong to render next range by a leading buffer according to current direction

    }, {
      key: "handleDataSourcesChange",
      value: function handleDataSourcesChange() {
        var start = this.range.start;

        if (this.isFront()) {
          start = start - LEADING_BUFFER;
        } else if (this.isBehind()) {
          start = start + LEADING_BUFFER;
        }

        start = Math.max(start, 0);
        this.updateRange(this.range.start, this.getEndByStart(start));
      } // when slot size change, we also need force update

    }, {
      key: "handleSlotSizeChange",
      value: function handleSlotSizeChange() {
        this.handleDataSourcesChange();
      } // calculating range on scroll

    }, {
      key: "handleScroll",
      value: function handleScroll(offset) {
        this.direction = offset < this.offset ? DIRECTION_TYPE.FRONT : DIRECTION_TYPE.BEHIND;
        this.offset = offset;

        if (!this.param) {
          return;
        }

        if (this.direction === DIRECTION_TYPE.FRONT) {
          this.handleFront();
        } else if (this.direction === DIRECTION_TYPE.BEHIND) {
          this.handleBehind();
        }
      } // ----------- public method end -----------

    }, {
      key: "handleFront",
      value: function handleFront() {
        var overs = this.getScrollOvers(); // should not change range if start doesn't exceed overs

        if (overs > this.range.start) {
          return;
        } // move up start by a buffer length, and make sure its safety


        var start = Math.max(overs - this.param.buffer, 0);
        this.checkRange(start, this.getEndByStart(start));
      }
    }, {
      key: "handleBehind",
      value: function handleBehind() {
        var overs = this.getScrollOvers(); // range should not change if scroll overs within buffer

        if (overs < this.range.start + this.param.buffer) {
          return;
        }

        this.checkRange(overs, this.getEndByStart(overs));
      } // return the pass overs according to current scroll offset

    }, {
      key: "getScrollOvers",
      value: function getScrollOvers() {
        // if slot header exist, we need subtract its size
        var offset = this.offset - this.param.slotHeaderSize;

        if (offset <= 0) {
          return 0;
        } // if is fixed type, that can be easily


        if (this.isFixedType()) {
          return Math.floor(offset / this.fixedSizeValue);
        }

        var low = 0;
        var middle = 0;
        var middleOffset = 0;
        var high = this.param.uniqueIds.length;

        while (low <= high) {
          // this.__bsearchCalls++
          middle = low + Math.floor((high - low) / 2);
          middleOffset = this.getIndexOffset(middle);

          if (middleOffset === offset) {
            return middle;
          } else if (middleOffset < offset) {
            low = middle + 1;
          } else if (middleOffset > offset) {
            high = middle - 1;
          }
        }

        return low > 0 ? --low : 0;
      } // return a scroll offset from given index, can efficiency be improved more here?
      // although the call frequency is very high, its only a superposition of numbers

    }, {
      key: "getIndexOffset",
      value: function getIndexOffset(givenIndex) {
        if (!givenIndex) {
          return 0;
        }

        var offset = 0;
        var indexSize = 0;

        for (var index = 0; index < givenIndex; index++) {
          // this.__getIndexOffsetCalls++
          indexSize = this.sizes.get(this.param.uniqueIds[index]);
          offset = offset + (typeof indexSize === 'number' ? indexSize : this.getEstimateSize());
        } // remember last calculate index


        this.lastCalcIndex = Math.max(this.lastCalcIndex, givenIndex - 1);
        this.lastCalcIndex = Math.min(this.lastCalcIndex, this.getLastIndex());
        return offset;
      } // is fixed size type

    }, {
      key: "isFixedType",
      value: function isFixedType() {
        return this.calcType === CALC_TYPE.FIXED;
      } // return the real last index

    }, {
      key: "getLastIndex",
      value: function getLastIndex() {
        return this.param.uniqueIds.length - 1;
      } // in some conditions range is broke, we need correct it
      // and then decide whether need update to next range

    }, {
      key: "checkRange",
      value: function checkRange(start, end) {
        var keeps = this.param.keeps;
        var total = this.param.uniqueIds.length; // datas less than keeps, render all

        if (total <= keeps) {
          start = 0;
          end = this.getLastIndex();
        } else if (end - start < keeps - 1) {
          // if range length is less than keeps, corrent it base on end
          start = end - keeps + 1;
        }

        if (this.range.start !== start) {
          this.updateRange(start, end);
        }
      } // setting to a new range and rerender

    }, {
      key: "updateRange",
      value: function updateRange(start, end) {
        this.range.start = start;
        this.range.end = end;
        this.range.padFront = this.getPadFront();
        this.range.padBehind = this.getPadBehind();
        this.callUpdate(this.getRange());
      } // return end base on start

    }, {
      key: "getEndByStart",
      value: function getEndByStart(start) {
        var theoryEnd = start + this.param.keeps - 1;
        var truelyEnd = Math.min(theoryEnd, this.getLastIndex());
        return truelyEnd;
      } // return total front offset

    }, {
      key: "getPadFront",
      value: function getPadFront() {
        if (this.isFixedType()) {
          return this.fixedSizeValue * this.range.start;
        } else {
          return this.getIndexOffset(this.range.start);
        }
      } // return total behind offset

    }, {
      key: "getPadBehind",
      value: function getPadBehind() {
        var end = this.range.end;
        var lastIndex = this.getLastIndex();

        if (this.isFixedType()) {
          return (lastIndex - end) * this.fixedSizeValue;
        } // if it's all calculated, return the exactly offset


        if (this.lastCalcIndex === lastIndex) {
          return this.getIndexOffset(lastIndex) - this.getIndexOffset(end);
        } else {
          // if not, use a estimated value
          return (lastIndex - end) * this.getEstimateSize();
        }
      } // get the item estimate size

    }, {
      key: "getEstimateSize",
      value: function getEstimateSize() {
        return this.isFixedType() ? this.fixedSizeValue : this.firstRangeAverageSize || this.param.estimateSize;
      }
    }]);

    return Virtual;
  }();

  var Vlist = /*#__PURE__*/function () {
    function Vlist(opts) {
      _classCallCheck(this, Vlist);

      this.range = null;
      this.$el = opts.root;
      this.$el.style.maxHeight = '400px';
      this.$el.style.overflowY = 'auto';
      this.dataSources = opts.data;
      this.wrapper = document.createElement('div');
      this.$el.appendChild(this.wrapper);
      this.$el.addEventListener('scroll', this.onScroll.bind(this), {
        passive: false
      });
      this.keeps = opts.keeps || 20;
      this.estimateSize = opts.estimateSize || 26;
      this.dataKey = 'id';
      this.installVirtual();
    } // return current scroll offset


    _createClass(Vlist, [{
      key: "getOffset",
      value: function getOffset() {
        var root = this.$el;
        return root ? Math.ceil(root.scrollTop) : 0;
      } // return client viewport size

    }, {
      key: "getClientSize",
      value: function getClientSize() {
        var root = this.$el;
        return root ? Math.ceil(root.clientHeight) : 0;
      } // return all scroll size

    }, {
      key: "getScrollSize",
      value: function getScrollSize() {
        var root = this.$el;
        return root ? Math.ceil(root.scrollHeight) : 0;
      } // ----------- public method end -----------

    }, {
      key: "installVirtual",
      value: function installVirtual() {
        this.virtual = new Virtual({
          slotHeaderSize: 0,
          slotFooterSize: 0,
          keeps: this.keeps,
          estimateSize: this.estimateSize,
          buffer: Math.round(this.keeps / 3),
          // recommend for a third of keeps
          uniqueIds: this.getUniqueIdFromDataSources()
        }, this.onRangeChanged.bind(this)); // sync initial range

        this.range = this.virtual.getRange();
        this.render();
      }
    }, {
      key: "getUniqueIdFromDataSources",
      value: function getUniqueIdFromDataSources() {
        var dataKey = this.dataKey;
        return this.dataSources.map(function (dataSource) {
          return typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey];
        });
      } // here is the rerendering entry

    }, {
      key: "onRangeChanged",
      value: function onRangeChanged(range) {
        this.range = range;
        this.render();
      }
    }, {
      key: "onScroll",
      value: function onScroll() {
        var offset = this.getOffset();
        var clientSize = this.getClientSize();
        var scrollSize = this.getScrollSize(); // iOS scroll-spring-back behavior will make direction mistake

        if (offset < 0 || offset + clientSize > scrollSize + 1 || !scrollSize) {
          return;
        }

        this.virtual.handleScroll(offset);
      }
    }, {
      key: "getRenderSlots",
      value: function getRenderSlots() {
        var _this$range = this.range,
            start = _this$range.start,
            end = _this$range.end;
        var dataSources = this.dataSources,
            dataKey = this.dataKey;
        this.wrapper.innerHTML = '';

        for (var index = start; index <= end; index++) {
          var dataSource = dataSources[index];

          if (dataSource) {
            var uniqueKey = typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey];

            if (typeof uniqueKey === 'string' || typeof uniqueKey === 'number') {
              this.wrapper.appendChild(dataSource.createNode());
            } else {
              console.warn("Cannot get the data-key '".concat(dataKey, "' from data-sources."));
            }
          } else {
            console.warn("Cannot get the index '".concat(index, "' from data-sources."));
          }
        }
      }
    }, {
      key: "update",
      value: function update(data) {
        this.dataSources = data;
        this.wrapper.innerHTML = '';
        this.virtual.updateParam('uniqueIds', this.getUniqueIdFromDataSources());
        this.virtual.handleDataSourcesChange();
      }
    }, {
      key: "render",
      value: function render() {
        var _this$range2 = this.range,
            padFront = _this$range2.padFront,
            padBehind = _this$range2.padBehind;
        var paddingStyle = "".concat(padFront, "px 0px ").concat(padBehind, "px");
        this.wrapper.style.padding = paddingStyle;
        this.getRenderSlots();
      }
    }]);

    return Vlist;
  }();

  var noop = function noop() {};

  var Tree = /*#__PURE__*/function () {
    function Tree(selector, ops) {
      var _this = this;

      _classCallCheck(this, Tree);

      var obj = new Proxy(ops, {
        get: function get(target, propKey, receiver) {
          console.log("getting ".concat(propKey, "!"));
          return Reflect.get(target, propKey, receiver);
        },
        set: function set(target, propKey, value, receiver) {
          console.log("setting ".concat(propKey, "!"));
          return Reflect.set(target, propKey, value, receiver);
        }
      });
      this.$options = obj;
      this.$el = document.querySelector(selector);

      if (!this.$el) {
        throw Error('请为组件提供根节点');
      } // 每一项的高度


      this.itemHeight = ops.itemHeight || 26; // 当前可见数量

      this.showCount = ops.showCount || 20; // 最大高度

      this.maxHeight = ops.maxHeight || '400px'; // 唯一ID

      this.dataKey = ops.dataKey || 'id'; // 当前可见项

      this.data = [];
      this.store = new TreeStore({
        data: ops.data,
        max: ops.max,
        lazy: ops.lazy || false,
        sort: ops.sort || false,
        indent: ops.indent || 10,
        checkedKeys: ops.checkedKeys || [],
        expandKeys: ops.expandKeys || [],
        disabledKeys: ops.disabledKeys || [],
        limitAlert: ops.limitAlert || noop,
        click: ops.click || noop,
        check: ops.check || noop,
        // 复选框被点击时出发
        change: ops.change || noop,
        load: ops.load || noop,
        highlightCurrent: ops.highlightCurrent || false,
        showCheckbox: ops.showCheckbox || false,
        showRadio: ops.showRadio || false,
        radioParentoOnly: ops.radioParentoOnly || false,
        // 每个父节点下唯一，仅raido模式有效
        renderContent: ops.renderContent || null,
        nocheckParent: ops.nocheckParent || false,
        // 只允许叶子节点选中
        checkOnClickNode: ops.checkOnClickNode || false,
        format: ops.format || null,
        update: function update() {
          _this.render();
        },
        nodesChange: function nodesChange(nodes) {
          _this.nodes = nodes;
          _this.vlist && _this.render();
        }
      });
      this.store.setData(ops.data);

      if (typeof ops.showRoot === 'boolean' && !ops.showRoot) {
        this.store.hideRoot = true; // 跟节点创建dom

        this.store.root.createNode();
      }

      this.init(); // 设置默认选中

      this.store.setDefaultChecked();
    }

    _createClass(Tree, [{
      key: "init",
      value: function init() {
        this.vlist = new Vlist({
          root: this.$el,
          data: [],
          maxHeight: this.maxHeight,
          estimateSize: this.itemHeight,
          keeps: this.showCount
        });
        this.render();
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        this.data = this.nodes.filter(function (v) {
          // 过滤隐藏节点 ｜ 隐藏root节点
          return v.visbile && !(_this2.store.hideRoot && v.level === 0);
        });
        this.vlist.update(this.data);
      } // 根据ID获取节点

    }, {
      key: "getNodeById",
      value: function getNodeById(id) {
        return this.store.getNodeById(id);
      } // 获取选中节点

    }, {
      key: "getCheckedNodes",
      value: function getCheckedNodes() {
        return this.store.getCheckedNodes();
      }
    }]);

    return Tree;
  }();

  var version$1 = version;

  exports.default = Tree;
  exports.version = version$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
