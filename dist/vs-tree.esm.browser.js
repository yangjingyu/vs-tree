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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
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

function insterAfter(newElement, targetElement) {
  var parent = targetElement.parentNode;

  if (!parent) {
    return;
  }

  if (parent.lastChild === targetElement) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
}
function onDragEnterGap(e, treeNode) {
  var offsetTop = treeNode.getBoundingClientRect().top;
  var offsetHeight = treeNode.offsetHeight;
  var pageY = e.pageY;
  var gapHeight = 2;

  if (pageY > offsetTop + offsetHeight - offsetHeight) {
    return 1; // bottom
  }

  if (pageY < offsetTop + gapHeight) {
    return -1; // top
  }

  return 0;
}

var setepId = 0;

var Node = /*#__PURE__*/function () {
  function Node(ops) {
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
    this.parent = ops.parent;
    this.originData = ops.data;
    this.data = Object.assign({}, ops.data);

    if (typeof this.store.format === 'function' && !ops.data._vsroot) {
      var _data = this.store.format(Object.assign({}, ops.data), this);

      if (_typeof(_data) !== 'object') {
        throw new Error('format must return object! \nformat: function(data) {\n  return {id, name, children, isLeaf}\n}');
      }

      var props = ['id', 'name', 'children', 'isLeaf', 'icon', 'extra'];

      for (var i = 0, len = props.length; i < len; i++) {
        if (Object.prototype.hasOwnProperty.call(_data, props[i])) {
          this.data[props[i]] = _data[props[i]];
        }
      }
    }

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

      if (this.level > this.store.expandLevel && this.store.expandLevel !== -1 && !((_this$parent = this.parent) !== null && _this$parent !== void 0 && _this$parent.expanded)) {
        this.visbile = false;
        return;
      }

      this.visbile = true;
    }
  }, {
    key: "createNode",
    value: function createNode() {
      var _this = this;

      if (this.dom) {
        this.checkboxNode && (this.checkboxNode.checked = this.checked);
        this.radioNode && (this.radioNode.checked = this.checked);
        return this.dom;
      }

      var dom = document.createElement('div');
      dom.className = 'vs-tree-node';
      dom.setAttribute('vs-index', this.id);
      !this.isLeaf && this.childNodes.length && dom.setAttribute('vs-child', true);
      dom.appendChild(this.createInner());

      if (this.store.renderContent) {
        dom.appendChild(this.createContent());
      }

      dom.addEventListener('click', function (e) {
        e.stopPropagation();

        if (_this.store.highlightCurrent) {
          if (_this.store.selectedCurrent) {
            _this.store.selectedCurrent.dom.classList.remove('selected');
          }

          dom.classList.add('selected');
        }

        if (_this.store.checkOnClickNode && !_this.disabled) {
          _this.handleCheckChange({
            target: {
              checked: !_this.checked
            }
          });
        }

        _this.store.selectedCurrent = _this;

        if (_this.store.breadcrumb && !_this.isLeaf) {
          _this.store.breadcrumbs.push(_this);

          _this.setExpand(true);
        }

        _this.store.click(e, _this);
      }, {
        passive: false
      });
      dom.addEventListener('contextmenu', function (e) {
        if (_this.store.contextmenu && typeof _this.store.contextmenu === 'function') {
          e.stopPropagation();
          e.preventDefault();

          _this.store.contextmenu(e, _this);
        }
      });

      if (this.store.draggable) {
        this.createDragable(dom);
      }

      this.dom = dom;
      return dom;
    }
  }, {
    key: "createInner",
    value: function createInner() {
      var dom = document.createElement('div');
      dom.className = 'vs-tree-inner'; // 当隐藏根节点时减少一级缩进

      var level = this.level + (this.store.hideRoot ? -1 : 0);

      if (this.store.breadcrumb) {
        level = 0;
      }

      if (this.store.showLine) {
        for (var i = 0; i < level; i++) {
          var indent = document.createElement('span');
          indent.className = 'vs-indent-unit';
          dom.appendChild(indent);
        }
      } else {
        dom.style.paddingLeft = level * this.store.indent + 'px';
      }

      var expandDom;

      if (!this.store.breadcrumb) {
        if (this.store.strictLeaf) {
          expandDom = !this.isLeaf ? this.createExpand() : this.createExpandEmpty();
        } else {
          var _this$childNodes;

          expandDom = ((_this$childNodes = this.childNodes) !== null && _this$childNodes !== void 0 && _this$childNodes.length || this.store.lazy) && !this.isLeaf ? this.createExpand() : this.createExpandEmpty();
        }

        dom.appendChild(expandDom);
      }

      if (this.store.showCheckbox || this.store.showRadio) {
        if (!this.store.nocheckParent || !this.childNodes.length) {
          dom.appendChild(this.createCheckbox());
        }
      }

      if (this.store.showIcon) {
        if (!this.store.onlyShowLeafIcon || !this.childNodes.length || this.isLeaf) {
          dom.appendChild(this.createIcon());
        }
      }

      dom.appendChild(this.createText());
      return dom;
    } // 自定义Dom 节点

  }, {
    key: "cusmtomNode",
    value: function cusmtomNode(name, info) {
      var _this2 = this;

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
          info.click(e, _this2);
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

      if (!tpl) {
        return document.createElement('span');
      }

      tpl.addEventListener('click', function (e) {
        e.stopPropagation();
      }, {
        passive: false
      });
      return tpl;
    } // 叶子节点-无需展开

  }, {
    key: "createExpandEmpty",
    value: function createExpandEmpty() {
      var dom = document.createElement('span');
      dom.className = 'expand-empty ' + this.store.expandClass;
      return dom;
    } // 有子元素-需要展开

  }, {
    key: "createExpand",
    value: function createExpand() {
      var _this3 = this;

      var dom = document.createElement('span');
      dom.className = 'expand ' + this.store.expandClass;

      if (this.level < this.store.expandLevel || this.store.expandLevel === -1 || this.expanded) {
        dom.classList.add('expanded');
        this.expanded = true;
      }

      dom.addEventListener('click', function (e) {
        e.stopPropagation();
        if (_this3.loading) return;
        var expand = !dom.classList.contains('expanded'); // dom.classList.toggle('expanded')

        _this3.setExpand(expand);
      }, {
        passive: false
      });
      this.expandEl = dom;
      return dom;
    }
  }, {
    key: "createCheckbox",
    value: function createCheckbox() {
      var _this4 = this;

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
        _this4.store.check(e, _this4);
      }, {
        passive: false
      });
      checkbox.addEventListener('change', function (e) {
        e.stopPropagation();

        _this4.handleCheckChange(e);
      });
      this.checkboxEl = checkbox;
      return dom;
    }
  }, {
    key: "handleCheckChange",
    value: function handleCheckChange(e) {
      var checked = e.target.checked;

      if (typeof this.store.beforeCheck === 'function') {
        if (!this.store.beforeCheck(this)) {
          e.target.checked = !checked;
          return;
        }
      }

      if (checked && this.store.checkMaxNodes(this)) {
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
      dom.className = 'vs-tree-text';
      return dom;
    }
  }, {
    key: "createIcon",
    value: function createIcon() {
      var icon = document.createElement('span');
      icon.className = this.isLeaf || !this.childNodes.length ? 'vs-icon-leaf' : 'vs-icon-parent';

      if (this.data.icon) {
        if (this.data.icon instanceof HTMLElement) {
          icon.style.backgroundImage = 'none';
          icon.appendChild(this.data.icon);
        } else {
          icon.classList.add(this.data.icon);
        }
      }

      return icon;
    }
  }, {
    key: "setData",
    value: function setData(data) {
      this.store.dataMap.set(data.id, this);
      this.store.nodeMap.set(this.id, this);
      this.data = data;
      this.childNodes = [];

      if (typeof data.isLeaf === 'boolean') {
        this.isLeaf = data.isLeaf;
      } else if (!data.children && !this.store.lazy) {
        this.isLeaf = true;
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
    value: function insertChild(child, index) {
      if (!(child instanceof Node)) {
        Object.assign(child, {
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

      return child;
    }
  }, {
    key: "insertBefore",
    value: function insertBefore(child, ref) {
      var index;

      if (ref) {
        index = this.childNodes.indexOf(ref);
      }

      this.insertChild(child, index);
    }
  }, {
    key: "insertAfter",
    value: function insertAfter(child, ref) {
      var index;

      if (ref) {
        index = this.childNodes.indexOf(ref);
        if (index !== -1) index += 1;
      }

      this.insertChild(child, index);
    }
  }, {
    key: "updateExpand",
    value: function updateExpand(expand) {
      var _this5 = this;

      if (this.childNodes.length) {
        this.childNodes.forEach(function (v) {
          if (expand && _this5.expanded) {
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
      if (this.disabled) return;
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
        this.parent.checkboxNode && (this.parent.checkboxNode.checked = true);
        this.parent.dom && this.parent.dom.classList.remove('is-indeterminate');
      } else if (someChecked) {
        this.parent.checked = false;
        this.parent.indeterminate = true;
        this.parent.checkboxNode && (this.parent.checkboxNode.checked = false);
        this.parent.dom && this.parent.dom.classList.add('is-indeterminate');
      } else {
        this.parent.checked = false;
        this.parent.indeterminate = false;
        this.parent.checkboxNode && (this.parent.checkboxNode.checked = false);
        this.parent.dom && this.parent.dom.classList.remove('is-indeterminate');
      }

      this.parent.updateCheckedParent();
    } // 更新单选节点选中

  }, {
    key: "updateRadioChecked",
    value: function updateRadioChecked(checked) {
      if (this.store.nocheckParent && (this.childNodes.length || !this.isLeaf)) return; // 父节点下唯一

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
    } // 设置禁止选中

  }, {
    key: "setDisabled",
    value: function setDisabled() {
      var disabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.disabled = disabled;
      this.checkboxEl && (this.checkboxEl.disabled = disabled);
    } // 设置默认展开

  }, {
    key: "setExpand",
    value: function setExpand(expand, noUpdate) {
      var _this6 = this;

      this.expanded = expand;
      this.updateExpand(this.expanded);
      this.setAccordion(expand);

      if (this.expandEl) {
        if (expand) {
          this.expandEl.classList.add('expanded');
        } else {
          this.expandEl.classList.remove('expanded');
        }
      }

      if (this.store.lazy && !this.loaded) {
        this.loadData(function (data) {
          if (data) {
            !noUpdate && _this6.storeUpdate();
          }
        });
      } else {
        !noUpdate && this.storeUpdate();
      }
    }
  }, {
    key: "storeUpdate",
    value: function storeUpdate() {
      if (this.store.animation) {
        this.createAnimation();
      } else {
        this.store.update();
      }
    } // 创建动画

  }, {
    key: "createAnimation",
    value: function createAnimation() {
      var _this7 = this;

      this.transitionNode && this.transitionNode.parentNode && this.transitionNode.parentNode.removeChild(this.transitionNode);
      var tg = document.createElement('div');
      tg.className = 'vs-transition';

      if (this.childNodes.length > this.store.showCount) {
        for (var i = 0; i < this.store.showCount - 1; i++) {
          var _v = this.childNodes[i];
          tg.appendChild(_v.dom || _v.createNode());
        }
      } else {
        this.childNodes.forEach(function (_v) {
          tg.appendChild(_v.dom || _v.createNode());
        });
      }

      insterAfter(tg, this.dom);
      var animatHeight = (this.childNodes.length > this.store.showCount ? this.store.showCount : this.childNodes.length) * this.store.itemHeight + 'px';

      if (this.expanded) {
        setTimeout(function () {
          tg.style.height = animatHeight;
        }, 0);
      } else {
        tg.style.height = animatHeight;
        setTimeout(function () {
          tg.style.height = 0;
        }, 0);
      }

      var transend = function transend() {
        tg.removeEventListener('transitionend', transend);
        tg.parentNode && tg.parentNode.removeChild(tg);
        tg.removeEventListener('transitionend', transend);

        _this7.store.update();
      };

      tg.addEventListener('transitionend', transend);
      this.transitionNode = tg;
    } // 创建拖拽

  }, {
    key: "createDragable",
    value: function createDragable(dom) {
      var _this8 = this;

      dom.draggable = true;
      dom.addEventListener('dragstart', function (e) {
        e.stopPropagation();
        _this8.store.dragNode = _this8;

        _this8.store.onDragstart(e, _this8); // wrap in try catch to address IE's error when first param is 'text/plain'


        try {
          // setData is required for draggable to work in FireFox
          // the content has to be '' so dragging a node out of the tree won't open a new tab in FireFox
          e.dataTransfer.setData('text/plain', '');
        } catch (e) {}
      }); // Chorme下，拖拽必须禁止默认事件否则drop事件不会触发

      dom.addEventListener('dragover', function (e) {
        e.preventDefault();
      });
      dom.addEventListener('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
        removeClass(_this8.store.dropNode);
        var dropNode = _this8.dom;
        if (!dropNode) return;
        var enterGap = onDragEnterGap(e, dropNode);
        if (_this8.store.dragNode.dom === dropNode && enterGap === 0) return;
        _this8.store.dropPostion = enterGap;
        _this8.store.dropNode = dropNode;

        _this8.store.onDragenter(e, _this8, dropNode, enterGap);

        if (_this8.store.dropable) {
          if (!_this8.expanded && !_this8.isLeaf) {
            _this8.setExpand(true);
          }

          if (enterGap === -1) {
            dropNode.classList.add('vs-drag-over-gap-top');
            return;
          }

          if (enterGap === 1) {
            dropNode.classList.add('vs-drag-over-gap-bottom');
            return;
          }

          if (!_this8.isLeaf) {
            dropNode.classList.add('vs-drag-enter');
          }
        }
      });

      function removeClass(dom) {
        if (!dom) return;
        dom.classList.remove('vs-drag-enter');
        dom.classList.remove('vs-drag-over-gap-bottom');
        dom.classList.remove('vs-drag-over-gap-top');
      }

      dom.addEventListener('dragleave', function (e) {
        if (_this8.store.dropable) {
          removeClass(e.target);
        }
      });
      dom.addEventListener('drop', function (e) {
        e.stopPropagation();

        _this8.store.onDrop(e, _this8, _this8.store.dropPostion);

        if (_this8.store.dropable) {
          removeClass(_this8.store.dropNode);
          var dragNode = _this8.store.dragNode;

          if (dragNode && _this8.parent) {
            var data = Object.assign({}, dragNode.data);
            dragNode.remove();
            if (!data) return;

            if (_this8.store.dropPostion === -1) {
              _this8.parent.insertBefore({
                data: data
              }, _this8);

              _this8.updateCheckedParent();

              _this8.store.updateNodes();
            } else if (_this8.store.dropPostion === 1) {
              _this8.parent.insertAfter({
                data: data
              }, _this8);

              _this8.updateCheckedParent();

              _this8.store.updateNodes();
            } else if (!_this8.isLeaf) {
              _this8.append(data);
            }
          }
        }
      });
    } // 更新手风琴状态

  }, {
    key: "setAccordion",
    value: function setAccordion(expand) {
      if (this.store.accordion && this.parent && expand) {
        var preExpand = this.store.expandMap[this.parent.id];
        if (preExpand === this) return;

        if (preExpand) {
          preExpand.setExpand(false);
        }

        this.store.expandMap[this.parent.id] = this;
      }
    } // 加载数据

  }, {
    key: "loadData",
    value: function loadData(callback) {
      var _this9 = this;

      if (this.loading) return;
      this.loading = true;

      if (this.expandEl) {
        this.expandEl.classList.add('is-loading');
      }

      var resolve = function resolve() {
        var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        _this9.loaded = true;
        _this9.loading = false;

        if (_this9.expandEl) {
          _this9.expandEl.classList.remove('is-loading');
        }

        if (children.length) {
          children.forEach(function (data) {
            _this9.insertChild({
              data: data,
              store: _this9.store
            });
          });

          _this9.childNodes[0].updateCheckedParent();

          _this9.store.updateNodes();
        }

        if (callback) {
          callback.call(_this9, children);
        }
      };

      this.store.load(this, resolve);
    } // 删除节点

  }, {
    key: "remove",
    value: function remove() {
      var _this10 = this;

      var parent = this.parent;
      if (!parent) return;
      var children = parent.childNodes || [];
      var index = children.findIndex(function (d) {
        return d.id === _this10.id;
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
      var olddom = this.dom;

      if (this.childNodes.length !== 0) {
        olddom = null;
      }

      var node = this.insertChild({
        data: data,
        store: this.store
      });
      this.data.children ? this.data.children.push(data) : this.data.children = [data];
      this.isLeaf = false;

      if (olddom) {
        delete this.dom;
        olddom.parentNode.replaceChild(this.createNode(), olddom);
      }

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
    this.nodeMap = new Map(); // 当前选中节点

    this.radioMap = {}; // 当前展开节点

    this.expandMap = {};
    this.root = new Node({
      data: this.data,
      store: this
    });
    this.updateNodes(); // 面包屑

    this.breadcrumbs = [this.root];
  }

  _createClass(TreeStore, [{
    key: "setData",
    value: function setData(val) {
      this.root.childNodes = [];
      this.root.setData(val);
      this.updateNodes();
    } // 更新节点列表

  }, {
    key: "updateNodes",
    value: function updateNodes() {
      this.nodes = this.flattenTreeData();
      this.nodesChange(this.nodes);
    } // 获取节点列表

  }, {
    key: "flattenTreeData",
    value: function flattenTreeData() {
      var nodes = [];

      var dig = function dig(val) {
        nodes.push(val);

        if (val.childNodes && val.childNodes.length) {
          for (var i = 0, len = val.childNodes.length; i < len; i++) {
            dig(val.childNodes[i]);
          }
        }
      };

      dig(this.root);
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
        return v.checked && !v.data._vsroot && _this._checkVerify(v) && (!_this.nocheckParent || !v.childNodes.length);
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
      if (!this.max) {
        return false;
      }

      if (!node.checked && node.hasChildCount > this.max) {
        return true;
      }

      var len = this.getCheckedNodes().length;

      if (!node.checked && len + (node.isLeaf ? 1 : this.getUnCheckLeafsCount(node)) > this.max) {
        return true;
      }

      return false;
    }
  }, {
    key: "getUnCheckLeafsCount",
    value: function getUnCheckLeafsCount(node) {
      var _this3 = this;

      var count = this._checkVerify(node) && !node.checked ? 1 : 0;
      node.childNodes.forEach(function (v) {
        count += _this3.getUnCheckLeafsCount(v);
      });
      return count;
    }
  }, {
    key: "_checkVerify",
    value: function _checkVerify(node) {
      if (typeof this.checkFilter === 'function') {
        return this.checkFilter(node);
      } else if (this.checkFilterLeaf) {
        return node.isLeaf;
      } else {
        return true;
      }
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
    this.$el.style.maxHeight = opts.maxHeight || '400px';
    this.$el.style.overflowY = 'auto';
    this.dataSources = opts.data;
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'vs-virtual-list';
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
    } // set current scroll position to a expectant index

  }, {
    key: "scrollToIndex",
    value: function scrollToIndex(index) {
      // scroll to bottom
      if (index >= this.dataSources.length - 1) {
        this.scrollToBottom();
      } else {
        var offset = this.virtual.getOffset(index);
        this.scrollToOffset(offset);
      }
    } // reset all state back to initial

  }, {
    key: "reset",
    value: function reset() {
      this.virtual.destroy();
      this.scrollToOffset(0);
      this.installVirtual();
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
            var dom = dataSource.createNode();

            if (dataSource.store.onlySearchLeaf) {
              dom.classList.add('vs-search-only-leaf');
            } else {
              dom.classList.remove('vs-search-only-leaf');
            }

            if (dataSource.store.isSearch && dataSource.store.searchRender) {
              var searchNode = dataSource.store.searchRender(dataSource, dom.cloneNode(true));

              if (!(searchNode instanceof HTMLElement)) {
                throw Error('searchRender must return HTMLElement');
              }

              this.wrapper.appendChild(searchNode);
            } else {
              this.wrapper.appendChild(dom);
            }
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

var Breadcrumb = /*#__PURE__*/function () {
  function Breadcrumb(node) {
    _classCallCheck(this, Breadcrumb);

    this.node = node;
    this.data = node.data;
    this.store = node.store;
    var _this$store$breadcrum = this.store.breadcrumb,
        icon = _this$store$breadcrum.icon,
        link = _this$store$breadcrum.link,
        _this$store$breadcrum2 = _this$store$breadcrum.separator,
        separator = _this$store$breadcrum2 === void 0 ? '/' : _this$store$breadcrum2;
    this.renderIcon = icon;
    this.renderLink = link;
    this.renderSeparator = separator;
  }

  _createClass(Breadcrumb, [{
    key: "createDom",
    value: function createDom() {
      var _this = this;

      var breads = this.store.breadcrumbs;
      var index = breads.findIndex(function (v) {
        return v === _this.node;
      });
      var last = index === breads.length - 1;
      var dom = document.createElement('span');

      if (this.renderIcon) {
        var icon = this.createIcon();
        icon && dom.appendChild(icon);
      }

      dom.appendChild(this.createLink(breads, index, last));

      if (!last) {
        dom.appendChild(this.createSeparator());
      }

      return dom;
    }
  }, {
    key: "createIcon",
    value: function createIcon() {
      var _iconInner;

      if (typeof this.renderIcon === 'function') {
        _iconInner = this.renderIcon(this.node, this.data);
      } else {
        _iconInner = this.renderIcon;
      }

      if (!_iconInner) return false;
      var icon = document.createElement('span');
      icon.className = 'vs-breadcrumb-icon';

      if (typeof this.renderIcon === 'function') {
        if (_iconInner instanceof HTMLElement) {
          icon.appendChild(_iconInner);
        } else {
          icon.innerHTML = _iconInner;
        }
      } else {
        icon.innerHTML = this.renderIcon;
      }

      return icon;
    }
  }, {
    key: "createLink",
    value: function createLink(breads, index, last) {
      var _this2 = this;

      var link = document.createElement('span');
      link.className = 'vs-breadcrumb-link';

      if (typeof this.renderLink === 'function') {
        var _linkR = this.renderLink(this.node, this.data);

        if (_linkR instanceof HTMLElement) {
          link.appendChild(_linkR);
        } else {
          link.innerHTML = _linkR;
        }
      } else {
        link.innerHTML = this.data.name;
      }

      link.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (last) return;
        breads.splice(index + 1);

        _this2.store.update();
      });
      return link;
    }
  }, {
    key: "createSeparator",
    value: function createSeparator() {
      var separator = document.createElement('span');
      separator.className = 'vs-breadcrumb-separator';

      if (typeof this.renderSeparator === 'function') {
        separator.innerHTML = this.renderSeparator(this.node, this.data);
      } else {
        separator.innerHTML = this.renderSeparator;
      }

      return separator;
    }
  }]);

  return Breadcrumb;
}();

var noop = function noop() {};

var Tree = /*#__PURE__*/function () {
  function Tree(selector, ops) {
    var _this = this;

    _classCallCheck(this, Tree);

    if (typeof selector === 'string') {
      this.$el = document.querySelector(selector);
    } else {
      this.$el = selector;
    }

    if (!(this.$el instanceof HTMLElement)) {
      throw Error('请为组件提供根节点');
    }

    this.$el.classList.add('vs-tree');

    if (ops.theme) {
      this.$el.classList.add('vs-theme-' + ops.theme);
    }

    if (Array.isArray(ops.data)) {
      this._data = {
        _vsroot: true,
        name: ops.rootName || '---',
        children: ops.data
      };

      if (!ops.rootName) {
        ops.hideRoot = true;
      }
    } else if (_typeof(ops.data) === 'object') {
      this._data = ops.data;
    } else {
      throw Error('参数data仅支持对象或数组！');
    }

    this.nodes = []; // 每一项的高度

    this.itemHeight = ops.itemHeight || 26; // 当前可见数量

    this.showCount = ops.showCount || 20; // 最大高度

    this.maxHeight = ops.maxHeight || '400px'; // 唯一ID

    this.dataKey = ops.dataKey || 'id'; // 当前可见项

    this.data = []; // 关键字过滤

    this.keyword = '';
    this.searchFilter = ops.searchFilter;
    this.ready = ops.ready || noop;

    var start = function start() {
      _this.store = new TreeStore({
        data: _this._data,
        max: ops.max,
        breadcrumb: ops.breadcrumb || null,
        strictLeaf: ops.strictLeaf || false,
        showCount: _this.showCount,
        itemHeight: _this.itemHeight,
        hideRoot: ops.hideRoot || false,
        animation: ops.animation || false,
        // 动画
        expandLevel: typeof ops.expandLevel === 'number' ? ops.expandLevel : 1,
        // 默认展开1级节点
        beforeCheck: ops.beforeCheck || null,
        showLine: ops.showLine || false,
        // 是否显示连接线
        showIcon: ops.showIcon || false,
        onlyShowLeafIcon: ops.onlyShowLeafIcon || false,
        showCheckbox: ops.showCheckbox || false,
        showRadio: ops.showRadio || false,
        highlightCurrent: ops.highlightCurrent || false,
        checkFilterLeaf: ops.checkFilterLeaf || false,
        // 过滤非叶子节点
        checkFilter: ops.checkFilter || null,
        // 过滤选中节点
        accordion: ops.accordion || false,
        // 手风琴模式
        draggable: ops.draggable || false,
        dropable: ops.dropable || false,
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
        contextmenu: ops.contextmenu || null,
        radioParentoOnly: ops.radioParentoOnly || false,
        // 每个父节点下唯一，仅raido模式有效
        renderContent: ops.renderContent || null,
        nocheckParent: ops.nocheckParent || false,
        // 只允许叶子节点选中
        checkOnClickNode: ops.checkOnClickNode || false,
        format: ops.format || null,
        searchRender: ops.searchRender || null,
        searchDisabledChecked: ops.searchDisabledChecked || false,
        expandClass: ops.expandClass || 'vs-expand-icon',
        onDragstart: ops.onDragstart || noop,
        onDragenter: ops.onDragenter || noop,
        onDrop: ops.onDrop || noop,
        update: function update() {
          _this.render();
        },
        nodesChange: function nodesChange(nodes) {
          _this.nodes = nodes;
          _this.vlist && _this.render();
        }
      }); // this.store.setData(this._data)

      if (_this.store.hideRoot) {
        // 跟节点创建dom
        _this.store.root.createNode();
      }

      _this.init(); // 设置默认选中


      _this.store.setDefaultChecked();
    };

    if (ops.async) {
      setTimeout(function () {
        start();
      }, 0);
    } else {
      start();
    }
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
      this.ready && this.ready(this);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var update = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (Object.prototype.toString.call(this.store.breadcrumb) === '[object Object]') {
        var bread = this.store.breadcrumbs[this.store.breadcrumbs.length - 1];
        this.data = this.nodes.filter(function (v) {
          return v.parent && v.parent.data.id === bread.data.id;
        });
        this.renderBreadcrumb(bread);
      } else {
        this.data = this.nodes.filter(function (v) {
          // 过滤隐藏节点 ｜ 隐藏root节点
          return _this2.hasKeyword(v) && v.visbile && !(_this2.store.hideRoot && v.level === 0);
        });
      }

      update && this.vlist.update(this.data);
    }
  }, {
    key: "renderBreadcrumb",
    value: function renderBreadcrumb(bread) {
      var _this$store$breadcrum = this.store.breadcrumb,
          el = _this$store$breadcrum.el,
          _this$store$breadcrum2 = _this$store$breadcrum.change,
          change = _this$store$breadcrum2 === void 0 ? noop : _this$store$breadcrum2;

      var _el;

      if (el instanceof HTMLElement) {
        _el = el;
      } else if (el && typeof el === 'string') {
        _el = document.querySelector(el);
      }

      if (!_el) {
        _el = document.createElement('section');
      }

      _el.classList.add('vs-breadcrumb');

      var bs = this.store.breadcrumbs.map(function (node) {
        return new Breadcrumb(node).createDom();
      });
      _el.innerHTML = '';
      bs.forEach(function (html) {
        _el.appendChild(html);
      });
      change(_el, this.store.breadcrumbs, bread);
    } // TODO:

  }, {
    key: "hasKeyword",
    value: function hasKeyword(v) {
      var _this3 = this;

      if (!this.keyword) return true;
      var boo = this.checkFilter(v);

      if (!boo) {
        v.childNodes.forEach(function (node) {
          if (!boo) {
            boo = _this3.hasKeyword(node);
          }
        });
      } else {
        v.parent && (v.parent.requireExpand = true);
      }

      return boo;
    }
  }, {
    key: "checkFilter",
    value: function checkFilter(v) {
      if (!this.keyword) return;

      if (typeof this.searchFilter === 'function') {
        return this.searchFilter(this.keyword, v, v.data);
      }

      return v.data.name && v.data.name.includes(this.keyword);
    } // 过滤节点

  }, {
    key: "filter",
    value: function filter() {
      var _this4 = this;

      var keyword = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var onlySearchLeaf = arguments.length > 1 ? arguments[1] : undefined;
      this.keyword = keyword;
      this.store.onlySearchLeaf = onlySearchLeaf && !!keyword;
      this.store.isSearch = !!keyword;

      if (this.store.onlySearchLeaf) {
        var data = this.nodes.filter(function (v) {
          return !v.childNodes.length && _this4.checkFilter(v) && !(_this4.store.hideRoot && v.level === 0);
        });
        this.vlist.update(data);
        return data;
      }

      this.render(false);

      for (var i = 0, len = this.data.length; i < len; i++) {
        var v = this.data[i];

        if (v.requireExpand) {
          v.requireExpand = false;
          v.setExpand(true, true);
        }
      }

      this.render();
      return this.data;
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
    } // 设置最大可选

  }, {
    key: "setMaxValue",
    value: function setMaxValue() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      this.store.max = value;
    } // 滚动到索引位置

  }, {
    key: "scrollToIndex",
    value: function scrollToIndex() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      this.vlist.scrollToIndex(index);
    }
  }]);

  return Tree;
}();

var plugin = (function (VsTree) {
  return function (Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    Vue.component('vs-tree', {
      props: {
        data: Array | Object,
        options: Object,
        async: Boolean,
        animation: Boolean,
        draggable: Boolean,
        dropable: Boolean,
        hideRoot: Boolean,
        showCheckbox: Boolean,
        showRadio: Boolean,
        radioParentoOnly: Boolean,
        showLine: Boolean,
        showIcon: Boolean,
        onlyShowLeafIcon: Boolean,
        highlightCurrent: Boolean,
        accordion: Boolean,
        nocheckParent: Boolean,
        sort: Boolean,
        checkOnClickNode: Boolean,
        checkFilterLeaf: Boolean,
        strictLeaf: Boolean,
        rootName: String,
        max: Number,
        lazy: Boolean,
        load: Function,
        format: Function,
        disabledKeys: Array,
        checkedKeys: Array,
        expandKeys: Array,
        keyword: String,
        expandClass: String,
        theme: String,
        expandLevel: {
          type: Number,
          default: 1
        },
        indent: {
          type: Number,
          default: 10
        },
        showCount: {
          type: Number,
          default: 20
        },
        itemHeight: {
          type: Number,
          default: 26
        },
        beforeCheck: Function,
        renderContent: Function,
        checkFilter: Function,
        searchFilter: Function,
        searchRender: Function,
        onDragstart: Function,
        onDragenter: Function,
        onDrop: Function
      },
      data: function data() {
        return {
          tree: {}
        };
      },
      watch: {
        max: function max() {
          var newVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          this.setMaxValue(newVal);
        },
        keyword: function keyword(newVal) {
          this.filter(newVal);
        }
      },
      mounted: function mounted() {
        var _this = this;

        this.$nextTick(function () {
          _this._vsinit();
        });
      },
      methods: {
        _vsinit: function _vsinit() {
          var _this2 = this;

          console.time('render:tree');
          this.tree.tree = new VsTree(this.$refs.tree, Object.assign({}, options, this.$props, _objectSpread2(_objectSpread2({}, this.options), {}, {
            data: this.data,
            click: function click(event, node) {
              _this2.$emit('click', event, node);
            },
            check: function check(event, node) {
              _this2.$emit('check', event, node);
            },
            change: function change(node) {
              _this2.$emit('change', node);
            },
            contextmenu: function contextmenu(event, node) {
              _this2.$emit('node-contextmenu', event, node);
            },
            limitAlert: function limitAlert() {
              _this2.$emit('limit-alert');
            }
          })));
          console.timeEnd('render:tree');
        },
        getNodeById: function getNodeById(id) {
          return this.tree.tree.getNodeById(id);
        },
        getCheckedNodes: function getCheckedNodes() {
          return this.tree.tree.getCheckedNodes();
        },
        filter: function filter(value) {
          return this.tree.tree.filter(value);
        },
        setMaxValue: function setMaxValue() {
          var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          this.tree.tree.setMaxValue(value);
        }
      },
      render: function render(h) {
        return h('div', {
          ref: 'tree'
        });
      }
    });
  };
});

var version$1 = version; // Vue 插件

var install = plugin(Tree);

export default Tree;
export { install, version$1 as version };
