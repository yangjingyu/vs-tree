var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const version$1 = "2.2.0";
var vsTree = "";
function insterAfter(newElement, targetElement) {
  const parent = targetElement.parentNode;
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
    return 1;
  }
  if (pageY < offsetTop + gapHeight) {
    return -1;
  }
  return 0;
}
const parseTemplate = (name, ctx) => {
  const slotName = ctx.store.slots[name];
  if (slotName) {
    const node = slotName.node.cloneNode(true);
    node.classList.add("vs-tree-text");
    node.setAttribute("tree-node-id", ctx.id);
    ctx.__buffer = {};
    var prefix = `
        var ${slotName.scope} = _;
      `;
    slotName.text.replace(slotName.interpolate, (a, b) => {
      prefix += `_.__buffer['${a}'] = ${b};`;
    });
    const render = new Function("_", prefix);
    render.call(ctx, ctx);
    node.innerText = node.innerText.replace(slotName.interpolate, (a) => {
      return ctx.__buffer[a];
    }).replace(/\n/g, "");
    return node;
  }
  return false;
};
let setepId = 0;
class TreeNode {
  constructor(ops) {
    __publicField(this, "id", setepId++);
    __publicField(this, "checked", false);
    __publicField(this, "expanded", false);
    __publicField(this, "indeterminate", false);
    __publicField(this, "visbile", false);
    __publicField(this, "disabled", false);
    __publicField(this, "loaded", false);
    __publicField(this, "isLeaf", false);
    __publicField(this, "level", 0);
    __publicField(this, "childNodes", []);
    __publicField(this, "store");
    __publicField(this, "parent");
    __publicField(this, "originData");
    __publicField(this, "__buffer");
    __publicField(this, "data");
    __publicField(this, "sortId", 0);
    __publicField(this, "hasChildCount", 0);
    __publicField(this, "dom");
    __publicField(this, "checkboxNode");
    __publicField(this, "radioNode");
    __publicField(this, "loadingEl");
    __publicField(this, "loading");
    __publicField(this, "expandEl");
    __publicField(this, "checkboxEl");
    __publicField(this, "transitionNode");
    this.store = ops.store;
    this.parent = ops.parent;
    this.originData = ops.data;
    this.__buffer = {};
    this.data = Object.assign({}, ops.data);
    if (typeof this.store.format === "function" && !ops.data._vsroot) {
      const _data = this.store.format(Object.assign({}, ops.data), this);
      if (typeof _data !== "object") {
        throw new Error("format must return object! \nformat: function(data) {\n  return {id, name, children, isLeaf}\n}");
      }
      const props = ["id", "name", "children", "isLeaf", "icon", "extra"];
      for (let i = 0, len = props.length; i < len; i++) {
        if (Object.prototype.hasOwnProperty.call(_data, props[i])) {
          this.data[props[i]] = _data[props[i]];
        }
      }
    }
    if (this.store.checkInherit && this.parent) {
      this.checked = this.parent.checked;
    }
    if (this.store.disabledInherit && this.parent) {
      this.disabled = this.parent.disabled;
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
  initData() {
    var _a;
    if (this.level > this.store.expandLevel && this.store.expandLevel !== -1 && !((_a = this.parent) == null ? void 0 : _a.expanded)) {
      this.visbile = false;
      return;
    }
    this.visbile = true;
  }
  createNode() {
    if (this.dom) {
      this.checkboxNode && (this.checkboxNode.checked = this.checked);
      this.radioNode && (this.radioNode.checked = this.checked);
      if (this.indeterminate)
        this.dom.classList.add("is-indeterminate");
      return this.dom;
    }
    const dom = document.createElement("div");
    dom.className = "vs-tree-node";
    dom.setAttribute("vs-index", `${this.id}`);
    if (this.indeterminate)
      dom.classList.add("is-indeterminate");
    !this.isLeaf && this.childNodes.length && dom.setAttribute("vs-child", `${true}`);
    dom.appendChild(this.createInner());
    const slotAppend = parseTemplate("append", this);
    if (slotAppend) {
      dom.appendChild(slotAppend);
    } else if (this.store.renderContent) {
      dom.appendChild(this.createContent());
    }
    dom.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.store.highlightCurrent) {
        if (this.store.selectedCurrent) {
          this.store.selectedCurrent.dom.classList.remove("selected");
        }
        dom.classList.add("selected");
      }
      if (this.store.checkOnClickNode && !this.disabled && !(this.store.breadcrumb && !this.isLeaf)) {
        this.handleCheckChange({
          target: { checked: !this.checked }
        });
      }
      this.store.selectedCurrent = this;
      if (this.store.breadcrumb && !this.isLeaf) {
        this.store.breadcrumb.list.push(this);
        this.setExpand(true);
      }
      this.store.click(e, this);
    }, {
      passive: false
    });
    dom.addEventListener("contextmenu", (e) => {
      if (this.store.contextmenu && typeof this.store.contextmenu === "function") {
        e.stopPropagation();
        e.preventDefault();
        this.store.contextmenu(e, this);
      }
    });
    if (this.store.draggable) {
      this.createDragable(dom);
    }
    this.dom = dom;
    return dom;
  }
  createInner() {
    var _a;
    const dom = document.createElement("div");
    dom.className = "vs-tree-inner";
    let level = this.level + (this.store.hideRoot ? -1 : 0);
    if (this.store.breadcrumb) {
      level = 0;
    }
    if (this.store.showLine) {
      for (let i = 0; i < level; i++) {
        const indent = document.createElement("span");
        indent.className = "vs-indent-unit";
        dom.appendChild(indent);
      }
    } else {
      dom.style.paddingLeft = level * this.store.indent + "px";
    }
    let expandDom;
    if (!this.store.breadcrumb) {
      if (this.store.strictLeaf) {
        expandDom = !this.isLeaf ? this.createExpand() : this.createExpandEmpty();
      } else {
        expandDom = (((_a = this.childNodes) == null ? void 0 : _a.length) || this.store.lazy) && !this.isLeaf ? this.createExpand() : this.createExpandEmpty();
      }
      dom.appendChild(expandDom);
    } else {
      this.loadingEl = document.createElement("span");
      this.loadingEl.className = "vs-loading-unit";
      dom.appendChild(this.loadingEl);
    }
    if (this.store.showCheckbox || this.store.showRadio) {
      if (!this.store.nocheckParent || this.isLeaf && !this.childNodes.length) {
        dom.appendChild(this.createCheckbox());
      }
    }
    if (this.store.showIcon) {
      if (!this.store.onlyShowLeafIcon || (!this.childNodes.length || this.isLeaf)) {
        dom.appendChild(this.createIcon());
      }
    }
    dom.appendChild(this.createText());
    return dom;
  }
  cusmtomNode(name, info) {
    const box = document.createElement(name);
    info.text && (box.innerText = info.text);
    info.className && (box.className = info.className);
    if (info.children) {
      info.children.forEach((v) => {
        box.appendChild(v);
      });
    }
    if (typeof info.click === "function") {
      box.addEventListener("click", (e) => {
        e.stopPropagation();
        info.click(e, this);
      }, { passive: false });
    }
    return box;
  }
  createContent() {
    const tpl = this.store.renderContent(this.cusmtomNode.bind(this), this);
    if (!tpl) {
      return document.createElement("span");
    }
    tpl.addEventListener("click", (e) => {
      e.stopPropagation();
    }, { passive: false });
    return tpl;
  }
  createExpandEmpty() {
    const dom = document.createElement("span");
    dom.className = "expand-empty " + this.store.expandClass;
    return dom;
  }
  createExpand() {
    const dom = document.createElement("span");
    dom.className = "expand " + this.store.expandClass;
    if (this.level < this.store.expandLevel || this.store.expandLevel === -1 || this.expanded) {
      dom.classList.add("expanded");
      this.expanded = true;
    }
    dom.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.loading)
        return;
      const expand = !dom.classList.contains("expanded");
      this.setExpand(expand);
    }, {
      passive: false
    });
    this.expandEl = dom;
    return dom;
  }
  createCheckbox() {
    let label = "checkbox";
    if (this.store.showRadio) {
      label = "radio";
    }
    const dom = document.createElement("label");
    dom.className = `vs-${label}`;
    const inner = document.createElement("span");
    inner.className = `vs-${label}__inner`;
    const checkbox = document.createElement("input");
    checkbox.type = label;
    checkbox.checked = this.checked;
    checkbox.disabled = this.disabled;
    checkbox.className = `vs-${label}__original`;
    checkbox.name = label === "radio" ? "vs-radio" + (this.store.radioParentoOnly ? this.parent.id : "") : "vs-checkbox";
    if (label === "radio") {
      checkbox.name = "vs-radio" + (this.store.radioParentoOnly ? this.parent.id : "");
      this.radioNode = checkbox;
    } else {
      checkbox.name = "vs-checkbox";
      this.checkboxNode = checkbox;
    }
    dom.appendChild(checkbox);
    dom.appendChild(inner);
    dom.addEventListener("click", (e) => {
      e.stopPropagation();
    }, { passive: false });
    checkbox.addEventListener("click", (e) => {
      this.store.check(e, this);
    }, { passive: false });
    checkbox.addEventListener("change", (e) => {
      e.stopPropagation();
      this.handleCheckChange(e);
    });
    this.checkboxEl = checkbox;
    return dom;
  }
  handleCheckChange(e) {
    const checked = e.target.checked;
    if (typeof this.store.beforeCheck === "function") {
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
    this.store._change(this);
  }
  createText() {
    const slot = parseTemplate("name", this);
    if (slot) {
      return slot;
    }
    const dom = document.createElement("span");
    dom.innerText = this.data.name;
    dom.className = "vs-tree-text";
    return dom;
  }
  createIcon() {
    const icon = document.createElement("span");
    icon.className = this.isLeaf && !this.childNodes.length ? "vs-icon-leaf" : "vs-icon-parent";
    if (this.data.icon) {
      if (this.data.icon instanceof HTMLElement) {
        icon.style.backgroundImage = "none";
        icon.appendChild(this.data.icon);
      } else {
        icon.classList.add(this.data.icon);
      }
    }
    return icon;
  }
  setData(data) {
    this.store.dataMap.set(data.id, this);
    this.store.nodeMap.set(this.id, this);
    this.data = data;
    this.childNodes = [];
    if (typeof data.isLeaf === "boolean") {
      this.isLeaf = data.isLeaf;
    } else if (!data.children && !this.store.lazy) {
      this.isLeaf = true;
    }
    let children;
    if (this.level === 0 && this.data instanceof TreeNode) {
      children = this.data;
    } else {
      children = this.data.children || [];
    }
    if (children.length) {
      this.loaded = true;
    }
    for (let i = 0, j = children.length; i < j; i++) {
      this.insertChild({ data: children[i] });
    }
  }
  insertChild(child, index = -1) {
    if (!(child instanceof TreeNode)) {
      Object.assign(child, {
        parent: this,
        store: this.store
      });
      child = new TreeNode(child);
    }
    child.level = this.level + 1;
    if (typeof index === "undefined" || index < 0) {
      this.childNodes.push(child);
    } else {
      this.childNodes.splice(index, 0, child);
    }
    return child;
  }
  insertBefore(child, ref) {
    let index;
    if (ref) {
      index = this.childNodes.indexOf(ref);
    }
    this.insertChild(child, index);
  }
  insertAfter(child, ref) {
    let index;
    if (ref) {
      index = this.childNodes.indexOf(ref);
      if (index !== -1)
        index += 1;
    }
    this.insertChild(child, index);
  }
  updateExpand(expand = false) {
    if (this.childNodes.length) {
      this.childNodes.forEach((v) => {
        if (expand && this.expanded) {
          v.visbile = true;
        } else {
          v.visbile = false;
        }
        v.updateExpand(expand);
      });
    }
  }
  updateChecked(check = false, isInitDefault = false) {
    if (!isInitDefault && this.disabled)
      return;
    if (!this.store.showCheckbox)
      return;
    this.checked = check;
    this.sortId = Date.now();
    this.checkboxNode && (this.checkboxNode.checked = check);
    this.dom && this.dom.classList.remove("is-indeterminate");
    if (this.store.allowEmit(check, "p")) {
      this.parent && (this.parent.indeterminate = false);
    }
    if (!this.store.allowEmit(check, "s")) {
      return;
    }
    if (this.childNodes.length) {
      this.childNodes.forEach((v) => {
        v.updateChecked(check);
      });
    }
  }
  updateCheckedParent(_checked = false, isInitDefault = false) {
    if (!isInitDefault && this.disabled)
      return;
    if (!this.store.showCheckbox)
      return;
    if (!this.store.allowEmit(_checked, "p")) {
      return;
    }
    if (!this.parent || this.store.nocheckParent)
      return;
    const allChecked = this.parent.childNodes.every((v) => v.checked);
    const someChecked = this.parent.childNodes.some((v) => v.checked || v.indeterminate);
    if (allChecked) {
      this.parent.checked = true;
      this.parent.indeterminate = false;
      this.parent.checkboxNode && (this.parent.checkboxNode.checked = true);
      this.parent.dom && this.parent.dom.classList.remove("is-indeterminate");
    } else if (someChecked) {
      this.parent.checked = false;
      this.parent.indeterminate = true;
      this.parent.checkboxNode && (this.parent.checkboxNode.checked = false);
      this.parent.dom && this.parent.dom.classList.add("is-indeterminate");
    } else {
      this.parent.checked = false;
      this.parent.indeterminate = false;
      this.parent.checkboxNode && (this.parent.checkboxNode.checked = false);
      this.parent.dom && this.parent.dom.classList.remove("is-indeterminate");
    }
    this.parent.updateCheckedParent();
  }
  updateRadioChecked(checked = false, isInitDefault = false) {
    if (!isInitDefault && this.disabled)
      return;
    if (this.store.nocheckParent && (this.childNodes.length || !this.isLeaf))
      return;
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
  }
  setChecked(checked = false, isInitDefault = false) {
    if (checked && this.store.checkMaxNodes(this)) {
      this.store.limitAlert();
      return;
    }
    if (this.store.showRadio) {
      this.updateRadioChecked(checked, isInitDefault);
      return;
    }
    if (!this.store.showCheckbox)
      return;
    this.updateChecked(checked, isInitDefault);
    this.updateCheckedParent(checked, isInitDefault);
    this.store._change(this);
  }
  setDisabled(disabled = true) {
    this.disabled = disabled;
    this.checkboxEl && (this.checkboxEl.disabled = disabled);
  }
  setExpand(expand, noUpdate = false) {
    this.expanded = expand;
    this.updateExpand(this.expanded);
    this.setAccordion(expand);
    if (this.expandEl) {
      if (expand) {
        this.expandEl.classList.add("expanded");
      } else {
        this.expandEl.classList.remove("expanded");
      }
    }
    if (this.store.lazy && !this.loaded) {
      this.loadData((data) => {
        if (data) {
          !noUpdate && this.storeUpdate();
        }
      });
    } else {
      !noUpdate && this.storeUpdate();
    }
  }
  storeUpdate() {
    if (this.store.animation) {
      this.createAnimation();
    } else {
      this.store.update();
    }
  }
  createAnimation() {
    this.transitionNode && this.transitionNode.parentNode && this.transitionNode.parentNode.removeChild(this.transitionNode);
    const tg = document.createElement("div");
    tg.className = "vs-transition";
    if (this.childNodes.length > this.store.showCount) {
      for (let i = 0; i < this.store.showCount - 1; i++) {
        const _v = this.childNodes[i];
        tg.appendChild(_v.dom || _v.createNode());
      }
    } else {
      this.childNodes.forEach((_v) => {
        tg.appendChild(_v.dom || _v.createNode());
      });
    }
    insterAfter(tg, this.dom);
    const animatHeight = (this.childNodes.length > this.store.showCount ? this.store.showCount : this.childNodes.length) * this.store.itemHeight + "px";
    if (this.expanded) {
      setTimeout(() => {
        tg.style.height = animatHeight;
      }, 0);
    } else {
      tg.style.height = animatHeight;
      setTimeout(() => {
        tg.style.height = "0";
      }, 0);
    }
    const transend = () => {
      tg.removeEventListener("transitionend", transend);
      tg.parentNode && tg.parentNode.removeChild(tg);
      tg.removeEventListener("transitionend", transend);
      this.store.update();
    };
    tg.addEventListener("transitionend", transend);
    this.transitionNode = tg;
  }
  createDragable(dom) {
    dom.draggable = true;
    dom.addEventListener("dragstart", (e) => {
      e.stopPropagation();
      this.store.dragNode = this;
      this.store.onDragstart(e, this);
      try {
        e.dataTransfer.setData("text/plain", "");
      } catch (e2) {
      }
    });
    dom.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    dom.addEventListener("dragenter", (e) => {
      e.stopPropagation();
      e.preventDefault();
      removeClass(this.store.dropNode);
      const dropNode = this.dom;
      if (!dropNode)
        return;
      const enterGap = onDragEnterGap(e, dropNode);
      if (this.store.dragNode.dom === dropNode && enterGap === 0)
        return;
      this.store.dropPostion = enterGap;
      this.store.dropNode = dropNode;
      this.store.onDragenter(e, this, dropNode, enterGap);
      if (this.store.dropable) {
        if (!this.expanded && !this.isLeaf) {
          this.setExpand(true);
        }
        if (enterGap === -1) {
          dropNode.classList.add("vs-drag-over-gap-top");
          return;
        }
        if (enterGap === 1) {
          dropNode.classList.add("vs-drag-over-gap-bottom");
          return;
        }
        if (!this.isLeaf) {
          dropNode.classList.add("vs-drag-enter");
        }
      }
    });
    function removeClass(dom2) {
      if (!dom2)
        return;
      dom2.classList.remove("vs-drag-enter");
      dom2.classList.remove("vs-drag-over-gap-bottom");
      dom2.classList.remove("vs-drag-over-gap-top");
    }
    dom.addEventListener("dragleave", (e) => {
      if (this.store.dropable) {
        removeClass(e.target);
      }
    });
    dom.addEventListener("drop", (e) => {
      e.stopPropagation();
      this.store.onDrop(e, this, this.store.dropPostion);
      if (this.store.dropable) {
        removeClass(this.store.dropNode);
        const dragNode = this.store.dragNode;
        if (dragNode && this.parent) {
          const data = Object.assign({}, dragNode.data);
          dragNode.remove();
          if (!data)
            return;
          if (this.store.dropPostion === -1) {
            this.parent.insertBefore({ data }, this);
            this.updateCheckedParent();
            this.store.updateNodes();
          } else if (this.store.dropPostion === 1) {
            this.parent.insertAfter({ data }, this);
            this.updateCheckedParent();
            this.store.updateNodes();
          } else if (!this.isLeaf) {
            this.append(data);
          }
        }
      }
    });
  }
  setAccordion(expand) {
    if (this.store.accordion && this.parent && expand) {
      const preExpand = this.store.expandMap[this.parent.id];
      if (preExpand === this)
        return;
      if (preExpand) {
        preExpand.setExpand(false);
      }
      this.store.expandMap[this.parent.id] = this;
    }
  }
  loadData(callback) {
    if (this.loading)
      return;
    this.loading = true;
    if (this.expandEl) {
      this.expandEl.classList.add("is-loading");
    } else if (this.loadingEl) {
      this.loadingEl.classList.add("is-loading");
    }
    const resolve = (children = []) => {
      this.loaded = true;
      this.loading = false;
      if (this.expandEl) {
        this.expandEl.classList.remove("is-loading");
      } else if (this.loadingEl) {
        this.loadingEl.classList.remove("is-loading");
      }
      if (children.length) {
        children.forEach((data) => {
          this.insertChild({
            data,
            store: this.store
          });
        });
        this.childNodes[0].updateCheckedParent();
        this.store.updateNodes();
      }
      if (callback) {
        callback.call(this, children);
      }
    };
    this.store.load(this, resolve);
  }
  remove() {
    const parent = this.parent;
    if (!parent)
      return;
    const children = parent.childNodes || [];
    const index = children.findIndex((d) => d.id === this.id);
    if (index > -1) {
      children.splice(index, 1);
    }
    this.store.updateNodes();
  }
  append(data) {
    if (!data || typeof data !== "object")
      return;
    let olddom = this.dom;
    if (this.childNodes.length !== 0) {
      olddom = null;
    }
    const node = this.insertChild({
      data,
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
}
class TreeStore {
  constructor(options) {
    __publicField(this, "root");
    __publicField(this, "nodes", []);
    __publicField(this, "radioMap", {});
    __publicField(this, "expandMap", {});
    for (const option in options) {
      if (Object.prototype.hasOwnProperty.call(options, option)) {
        this[option] = options[option];
      }
    }
    this.dataMap = new Map();
    this.nodeMap = new Map();
    this.root = new TreeNode({
      data: this.data,
      store: this
    });
    this.updateNodes();
    if (this.breadcrumb) {
      this.breadcrumb.list.push(this.root);
    }
    this.changeNodes = [];
  }
  setData(val) {
    this.root.childNodes = [];
    this.root.setData(val);
    this.updateNodes();
  }
  updateNodes() {
    this.nodes = this.flattenTreeData();
    this.nodesChange(this.nodes);
  }
  flattenTreeData() {
    const nodes = [];
    const dig = (val) => {
      nodes.push(val);
      if (val.childNodes && val.childNodes.length) {
        for (let i = 0, len = val.childNodes.length; i < len; i++) {
          dig(val.childNodes[i]);
        }
      }
    };
    dig(this.root);
    return nodes;
  }
  getNodeById(id) {
    return this.dataMap.get(id);
  }
  getCheckedNodes(isTreeNode = false) {
    const nodes = this.nodes.filter((v) => v.checked && !v.data._vsroot && this._checkVerify(v) && (!this.nocheckParent || !v.childNodes.length));
    if (this.sort) {
      const sortNodes = nodes.sort((a, b) => a.sortId - b.sortId);
      if (isTreeNode) {
        return sortNodes;
      }
      return sortNodes.map((v) => v.data);
    }
    if (isTreeNode) {
      return nodes;
    }
    return nodes.map((v) => v.data);
  }
  setDefaultChecked() {
    this.checkedKeys.forEach((id) => {
      const node = this.getNodeById(id);
      if (node) {
        node.setChecked(true, true);
      } else {
        console.warn("not found node by " + id);
      }
    });
  }
  checkMaxNodes(node) {
    if (!this.max) {
      return false;
    }
    if (!node.checked && node.hasChildCount > this.max) {
      return true;
    }
    const len = this.getCheckedNodes().length;
    if (!node.checked && len + (node.isLeaf ? 1 : this.getUnCheckLeafsCount(node)) > this.max) {
      return true;
    }
    return false;
  }
  getUnCheckLeafsCount(node) {
    let count = this._checkVerify(node) && !node.checked ? 1 : 0;
    node.childNodes.forEach((v) => {
      count += this.getUnCheckLeafsCount(v);
    });
    return count;
  }
  allowEmit(check, type) {
    const { Y, N } = this.checkboxType;
    if (check) {
      if (!Y.includes(type)) {
        return false;
      }
    } else {
      if (!N.includes(type)) {
        return false;
      }
    }
    return true;
  }
  _checkVerify(node) {
    if (typeof this.checkFilter === "function") {
      return this.checkFilter(node);
    } else if (this.checkFilterLeaf) {
      return node.isLeaf;
    } else {
      return true;
    }
  }
  _change(node) {
    this.changeNodes.push(node);
    if (this._changeTimer)
      clearTimeout(this._changeTimer);
    this._changeTimer = setTimeout(() => {
      this.change(this.changeNodes);
      this.changeNodes = [];
    }, 0);
  }
}
const DIRECTION_TYPE = {
  FRONT: "FRONT",
  BEHIND: "BEHIND"
};
const CALC_TYPE = {
  INIT: "INIT",
  FIXED: "FIXED",
  DYNAMIC: "DYNAMIC"
};
const LEADING_BUFFER = 2;
class Virtual {
  constructor(param, callUpdate) {
    __publicField(this, "param");
    __publicField(this, "callUpdate");
    __publicField(this, "sizes", new Map());
    __publicField(this, "firstRangeTotalSize", 0);
    __publicField(this, "firstRangeAverageSize", 0);
    __publicField(this, "lastCalcIndex", 0);
    __publicField(this, "fixedSizeValue", 0);
    __publicField(this, "calcType");
    __publicField(this, "offset", 0);
    __publicField(this, "direction");
    __publicField(this, "range");
    this.init(param, callUpdate);
  }
  init(param, callUpdate) {
    this.param = param;
    this.callUpdate = callUpdate;
    this.sizes = new Map();
    this.firstRangeTotalSize = 0;
    this.firstRangeAverageSize = 0;
    this.lastCalcIndex = 0;
    this.fixedSizeValue = 0;
    this.calcType = CALC_TYPE.INIT;
    this.offset = 0;
    this.direction = "";
    this.range = Object.create(null);
    if (param) {
      this.checkRange(0, param.keeps - 1);
    }
  }
  destroy() {
    this.init(null, () => {
    });
  }
  getRange() {
    const range = Object.create(null);
    range.start = this.range.start;
    range.end = this.range.end;
    range.padFront = this.range.padFront;
    range.padBehind = this.range.padBehind;
    return range;
  }
  isBehind() {
    return this.direction === DIRECTION_TYPE.BEHIND;
  }
  isFront() {
    return this.direction === DIRECTION_TYPE.FRONT;
  }
  getOffset(start) {
    return (start < 1 ? 0 : this.getIndexOffset(start)) + this.param.slotHeaderSize;
  }
  updateParam(key, value) {
    if (this.param && key in this.param) {
      if (key === "uniqueIds") {
        this.sizes.forEach((_v, key2) => {
          if (!value.includes(key2)) {
            this.sizes.delete(key2);
          }
        });
      }
      this.param[key] = value;
    }
  }
  handleDataSourcesChange() {
    let start = this.range.start;
    if (this.isFront()) {
      start = start - LEADING_BUFFER;
    } else if (this.isBehind()) {
      start = start + LEADING_BUFFER;
    }
    start = Math.max(start, 0);
    this.updateRange(this.range.start, this.getEndByStart(start));
  }
  handleSlotSizeChange() {
    this.handleDataSourcesChange();
  }
  handleScroll(offset) {
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
  }
  handleFront() {
    const overs = this.getScrollOvers();
    if (overs > this.range.start) {
      return;
    }
    const start = Math.max(overs - this.param.buffer, 0);
    this.checkRange(start, this.getEndByStart(start));
  }
  handleBehind() {
    const overs = this.getScrollOvers();
    if (overs < this.range.start + this.param.buffer) {
      return;
    }
    this.checkRange(overs, this.getEndByStart(overs));
  }
  getScrollOvers() {
    const offset = this.offset - this.param.slotHeaderSize;
    if (offset <= 0) {
      return 0;
    }
    if (this.isFixedType()) {
      return Math.floor(offset / this.fixedSizeValue);
    }
    let low = 0;
    let middle = 0;
    let middleOffset = 0;
    let high = this.param.uniqueIds.length;
    while (low <= high) {
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
  }
  getIndexOffset(givenIndex) {
    if (!givenIndex) {
      return 0;
    }
    let offset = 0;
    let indexSize = 0;
    for (let index = 0; index < givenIndex; index++) {
      indexSize = this.sizes.get(this.param.uniqueIds[index]);
      offset = offset + (typeof indexSize === "number" ? indexSize : this.getEstimateSize());
    }
    this.lastCalcIndex = Math.max(this.lastCalcIndex, givenIndex - 1);
    this.lastCalcIndex = Math.min(this.lastCalcIndex, this.getLastIndex());
    return offset;
  }
  isFixedType() {
    return this.calcType === CALC_TYPE.FIXED;
  }
  getLastIndex() {
    return this.param.uniqueIds.length - 1;
  }
  checkRange(start, end) {
    const keeps = this.param.keeps;
    const total = this.param.uniqueIds.length;
    if (total <= keeps) {
      start = 0;
      end = this.getLastIndex();
    } else if (end - start < keeps - 1) {
      start = end - keeps + 1;
    }
    if (this.range.start !== start) {
      this.updateRange(start, end);
    }
  }
  updateRange(start, end) {
    this.range.start = start;
    this.range.end = end;
    this.range.padFront = this.getPadFront();
    this.range.padBehind = this.getPadBehind();
    this.callUpdate(this.getRange());
  }
  getEndByStart(start) {
    const theoryEnd = start + this.param.keeps - 1;
    const truelyEnd = Math.min(theoryEnd, this.getLastIndex());
    return truelyEnd;
  }
  getPadFront() {
    if (this.isFixedType()) {
      return this.fixedSizeValue * this.range.start;
    } else {
      return this.getIndexOffset(this.range.start);
    }
  }
  getPadBehind() {
    const end = this.range.end;
    const lastIndex = this.getLastIndex();
    if (this.isFixedType()) {
      return (lastIndex - end) * this.fixedSizeValue;
    }
    if (this.lastCalcIndex === lastIndex) {
      return this.getIndexOffset(lastIndex) - this.getIndexOffset(end);
    } else {
      return (lastIndex - end) * this.getEstimateSize();
    }
  }
  getEstimateSize() {
    return this.isFixedType() ? this.fixedSizeValue : this.firstRangeAverageSize || this.param.estimateSize;
  }
}
class Vlist {
  constructor(opts) {
    __publicField(this, "$el");
    __publicField(this, "wrapper");
    __publicField(this, "virtual");
    __publicField(this, "dataSources");
    __publicField(this, "range");
    __publicField(this, "keeps");
    __publicField(this, "estimateSize");
    __publicField(this, "dataKey");
    this.range = null;
    this.$el = opts.root;
    this.$el.style.maxHeight = typeof opts.maxHeight === "number" ? opts.maxHeight + "px" : opts.maxHeight;
    this.$el.style.minHeight = typeof opts.minHeight === "number" ? opts.minHeight + "px" : opts.minHeight;
    this.$el.style.overflowY = "auto";
    this.dataSources = opts.data;
    this.wrapper = document.createElement("div");
    this.wrapper.className = "vs-virtual-list";
    this.$el.appendChild(this.wrapper);
    this.$el.addEventListener("scroll", this.onScroll.bind(this), {
      passive: false
    });
    this.keeps = opts.keeps || 20;
    this.estimateSize = opts.estimateSize || 26;
    this.dataKey = "id";
    this.installVirtual();
  }
  getOffset() {
    const root = this.$el;
    return root ? Math.ceil(root.scrollTop) : 0;
  }
  getClientSize() {
    const root = this.$el;
    return root ? Math.ceil(root.clientHeight) : 0;
  }
  getScrollSize() {
    const root = this.$el;
    return root ? Math.ceil(root.scrollHeight) : 0;
  }
  scrollToIndex(index) {
    if (index >= this.dataSources.length - 1) {
      this.scrollToBottom();
    } else {
      const offset = this.virtual.getOffset(index);
      this.scrollToOffset(offset);
    }
  }
  scrollToBottom() {
    throw new Error("Method not implemented.");
  }
  scrollToOffset(_offset) {
    throw new Error("Method not implemented.");
  }
  reset() {
    this.virtual.destroy();
    this.scrollToOffset(0);
    this.installVirtual();
  }
  installVirtual() {
    this.virtual = new Virtual({
      slotHeaderSize: 0,
      slotFooterSize: 0,
      keeps: this.keeps,
      estimateSize: this.estimateSize,
      buffer: Math.round(this.keeps / 3),
      uniqueIds: this.getUniqueIdFromDataSources()
    }, this.onRangeChanged.bind(this));
    this.range = this.virtual.getRange();
    this.render();
  }
  getUniqueIdFromDataSources() {
    const { dataKey } = this;
    return this.dataSources.map((dataSource) => typeof dataKey === "function" ? dataKey(dataSource) : dataSource[dataKey]);
  }
  onRangeChanged(range) {
    this.range = range;
    this.render();
  }
  onScroll() {
    const offset = this.getOffset();
    const clientSize = this.getClientSize();
    const scrollSize = this.getScrollSize();
    if (offset < 0 || offset + clientSize > scrollSize + 1 || !scrollSize) {
      return;
    }
    this.virtual.handleScroll(offset);
  }
  getRenderSlots() {
    const { start, end } = this.range;
    const { dataSources, dataKey } = this;
    this.wrapper.innerHTML = "";
    for (let index = start; index <= end; index++) {
      const dataSource = dataSources[index];
      if (dataSource) {
        const uniqueKey = typeof dataKey === "function" ? dataKey(dataSource) : dataSource[dataKey];
        if (typeof uniqueKey === "string" || typeof uniqueKey === "number") {
          const dom = dataSource.createNode();
          if (dataSource.store.onlySearchLeaf) {
            dom.classList.add("vs-search-only-leaf");
          } else {
            dom.classList.remove("vs-search-only-leaf");
          }
          if (dataSource.store.isSearch && dataSource.store.searchRender) {
            const searchNode = dataSource.store.searchRender(dataSource, dom.cloneNode(true));
            if (!(searchNode instanceof HTMLElement)) {
              throw Error("searchRender must return HTMLElement");
            }
            this.wrapper.appendChild(searchNode);
          } else {
            this.wrapper.appendChild(dom);
          }
        } else {
          console.warn(`Cannot get the data-key '${dataKey}' from data-sources.`);
        }
      } else {
        console.warn(`Cannot get the index '${index}' from data-sources.`);
      }
    }
  }
  update(data) {
    this.dataSources = data;
    this.wrapper.innerHTML = "";
    this.virtual.updateParam("uniqueIds", this.getUniqueIdFromDataSources());
    this.virtual.handleDataSourcesChange();
  }
  render() {
    const { padFront, padBehind } = this.range;
    const paddingStyle = `${padFront}px 0px ${padBehind}px`;
    this.wrapper.style.padding = paddingStyle;
    this.getRenderSlots();
  }
}
class BreadcrumbItem {
  constructor(node, parent) {
    __publicField(this, "node");
    __publicField(this, "data");
    __publicField(this, "store");
    __publicField(this, "parent");
    __publicField(this, "renderIcon");
    __publicField(this, "renderLink");
    __publicField(this, "renderSeparator");
    this.node = node;
    this.data = node.data;
    this.store = node.store;
    this.parent = parent;
    const { icon, link, separator = "/" } = this.parent.options;
    this.renderIcon = icon;
    this.renderLink = link;
    this.renderSeparator = separator;
  }
  createDom() {
    const breads = this.parent.list;
    const index = breads.findIndex((v) => v === this.node);
    const last = index === breads.length - 1;
    const dom = document.createElement("span");
    if (this.renderIcon) {
      const icon = this.createIcon();
      icon && dom.appendChild(icon);
    }
    dom.appendChild(this.createLink(breads, index, last));
    if (!last) {
      dom.appendChild(this.createSeparator());
    }
    return dom;
  }
  createIcon() {
    let _iconInner;
    if (typeof this.renderIcon === "function") {
      _iconInner = this.renderIcon(this.node, this.data);
    } else {
      _iconInner = this.renderIcon;
    }
    if (!_iconInner)
      return false;
    const icon = document.createElement("span");
    icon.className = "vs-breadcrumb-icon";
    if (typeof this.renderIcon === "function") {
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
  createLink(breads, index, last) {
    const link = document.createElement("span");
    link.className = "vs-breadcrumb-link";
    if (typeof this.renderLink === "function") {
      const _linkR = this.renderLink(this.node, this.data);
      if (_linkR instanceof HTMLElement) {
        link.appendChild(_linkR);
      } else {
        link.innerHTML = _linkR;
      }
    } else {
      link.innerHTML = this.data.name;
    }
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (last)
        return;
      breads.splice(index + 1);
      this.store.update();
    });
    return link;
  }
  createSeparator() {
    const separator = document.createElement("span");
    separator.className = "vs-breadcrumb-separator";
    if (typeof this.renderSeparator === "function") {
      separator.innerHTML = this.renderSeparator(this.node, this.data);
    } else {
      separator.innerHTML = this.renderSeparator;
    }
    return separator;
  }
}
class Breadcrumb {
  constructor(options) {
    __publicField(this, "store");
    __publicField(this, "list", []);
    __publicField(this, "options");
    this.options = options;
  }
  get current() {
    return this.list[this.list.length - 1];
  }
  renderBreadcrumb() {
    this.store = this.current.store;
    const { el, change = () => {
    } } = this.options;
    let _el;
    if (el instanceof HTMLElement) {
      _el = el;
    } else if (el && typeof el === "string") {
      _el = document.querySelector(el);
    }
    if (!_el) {
      _el = document.createElement("section");
    }
    _el.classList.add("vs-breadcrumb");
    const bs = this.list.map((node) => {
      return new BreadcrumbItem(node, this).createDom();
    });
    _el.innerHTML = "";
    bs.forEach((html) => {
      _el.appendChild(html);
    });
    change(_el, this.list, this.current);
  }
}
const noop = () => {
};
class Tree {
  constructor(selector, ops) {
    __publicField(this, "$el");
    __publicField(this, "store");
    __publicField(this, "vlist");
    __publicField(this, "data");
    __publicField(this, "interpolate");
    __publicField(this, "_data");
    __publicField(this, "nodes");
    __publicField(this, "itemHeight");
    __publicField(this, "showCount");
    __publicField(this, "maxHeight");
    __publicField(this, "minHeight");
    __publicField(this, "keyword");
    __publicField(this, "searchFilter");
    __publicField(this, "ready");
    __publicField(this, "$$breadcrumb");
    if (typeof selector === "string") {
      const el = document.querySelector(selector);
      if (el instanceof HTMLElement) {
        this.$el = el;
      }
    } else {
      this.$el = selector;
    }
    if (!(this.$el instanceof HTMLElement)) {
      throw Error("\u8BF7\u4E3A\u7EC4\u4EF6\u63D0\u4F9B\u6839\u8282\u70B9");
    }
    this.$el.classList.add("vs-tree");
    const delimiters = ["#\\[\\[", "\\]\\]"];
    const [open, close] = delimiters;
    var interpolate = open + "([\\s\\S]+?)" + close;
    this.interpolate = new RegExp(interpolate, "igm");
    const slotsMap = {};
    const slots = this.$el.querySelectorAll("[tree-slot]");
    if (slots && slots.length) {
      slots.forEach((v) => {
        const name = v.attributes["tree-slot"].value;
        const scope = v.attributes["tree-slot-scope"].value;
        slotsMap[name] = {
          scope,
          node: v,
          interpolate: this.interpolate,
          text: v.innerText,
          inner: v.outerHTML
        };
        v.parentNode.removeChild(v);
      });
    }
    if (ops.theme) {
      this.$el.classList.add("vs-theme-" + ops.theme);
    }
    if (Array.isArray(ops.data)) {
      this._data = {
        _vsroot: true,
        name: ops.rootName || "---",
        children: ops.data
      };
      if (!ops.rootName) {
        ops.hideRoot = true;
      }
    } else if (typeof ops.data === "object") {
      this._data = ops.data;
    } else {
      throw Error("\u53C2\u6570data\u4EC5\u652F\u6301\u5BF9\u8C61\u6216\u6570\u7EC4\uFF01");
    }
    this.nodes = [];
    const { showCount = 20, itemHeight = 26, maxHeight = "400px", minHeight = "0px" } = ops.virtual || {};
    this.itemHeight = itemHeight;
    this.showCount = showCount;
    this.maxHeight = ops.maxHeight || maxHeight;
    this.minHeight = ops.minHeight || minHeight;
    this.data = [];
    this.keyword = "";
    this.searchFilter = ops.searchFilter;
    this.ready = ops.ready || noop;
    if (Object.prototype.toString.call(ops.breadcrumb) === "[object Object]") {
      this.$$breadcrumb = new Breadcrumb(ops.breadcrumb);
    }
    const start = () => {
      this.store = new TreeStore({
        data: this._data,
        max: ops.max,
        slots: slotsMap,
        breadcrumb: this.$$breadcrumb || null,
        strictLeaf: ops.strictLeaf || false,
        showCount: this.showCount,
        itemHeight: this.itemHeight,
        hideRoot: ops.hideRoot || false,
        animation: ops.animation || false,
        expandLevel: typeof ops.expandLevel === "number" ? ops.expandLevel : 1,
        beforeCheck: ops.beforeCheck || null,
        showLine: ops.showLine || false,
        showIcon: ops.showIcon || false,
        onlyShowLeafIcon: ops.onlyShowLeafIcon || false,
        showCheckbox: ops.showCheckbox || false,
        checkboxType: ops.checkboxType || { Y: "ps", N: "ps" },
        checkInherit: ops.checkInherit || false,
        disabledInherit: ops.disabledInherit || false,
        showRadio: ops.showRadio || false,
        highlightCurrent: ops.highlightCurrent || false,
        checkFilterLeaf: ops.checkFilterLeaf || false,
        checkFilter: ops.checkFilter || null,
        accordion: ops.accordion || false,
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
        change: ops.change || noop,
        load: ops.load || noop,
        contextmenu: ops.contextmenu || null,
        radioParentoOnly: ops.radioType === "level" ? "level" : "all",
        renderContent: ops.renderContent || null,
        nocheckParent: ops.nocheckParent || false,
        checkOnClickNode: ops.checkOnClickNode || false,
        format: ops.format || null,
        searchRender: ops.searchRender || null,
        searchDisabledChecked: ops.searchDisabledChecked || false,
        expandClass: ops.expandClass || "vs-expand-icon",
        onDragstart: ops.onDragstart || noop,
        onDragenter: ops.onDragenter || noop,
        onDrop: ops.onDrop || noop,
        update: () => {
          this._render();
        },
        nodesChange: (nodes) => {
          this.nodes = nodes;
          this.vlist && this._render();
        }
      });
      if (this.store.hideRoot) {
        this.store.root.createNode();
      }
      this._init();
      this.store.setDefaultChecked();
    };
    if (ops.async) {
      setTimeout(() => {
        start();
      }, 0);
    } else {
      start();
    }
  }
  _init() {
    this.vlist = new Vlist({
      root: this.$el,
      data: [],
      maxHeight: this.maxHeight,
      minHeight: this.minHeight,
      estimateSize: this.itemHeight,
      keeps: this.showCount
    });
    this._render();
    this.ready && this.ready(this);
  }
  _render(update = true) {
    if (this.$$breadcrumb) {
      const { current } = this.$$breadcrumb;
      this.data = this.nodes.filter((v) => v.parent && v.parent.id === current.id);
      this.$$breadcrumb.renderBreadcrumb();
    } else {
      this.data = this.nodes.filter((v) => {
        return this._hasKeyword(v) && v.visbile && !(this.store.hideRoot && v.level === 0);
      });
    }
    update && this.vlist.update(this.data);
  }
  _hasKeyword(v) {
    if (!this.keyword)
      return true;
    let boo = this._checkFilter(v);
    if (!boo) {
      v.childNodes.forEach((node) => {
        if (!boo) {
          boo = this._hasKeyword(node);
        }
      });
    } else {
      v.parent && (v.parent.requireExpand = true);
    }
    return boo;
  }
  _checkFilter(v) {
    if (!this.keyword)
      return;
    if (typeof this.searchFilter === "function") {
      return this.searchFilter(this.keyword, v, v.data);
    }
    return v.data.name && v.data.name.includes(this.keyword);
  }
  filter(keyword = "", onlySearchLeaf) {
    this.keyword = keyword;
    this.store.onlySearchLeaf = onlySearchLeaf && !!keyword;
    this.store.isSearch = !!keyword;
    if (this.store.onlySearchLeaf) {
      const data = this.nodes.filter((v) => !v.childNodes.length && this._checkFilter(v) && !(this.store.hideRoot && v.level === 0));
      this.vlist.update(data);
      return data;
    }
    this._render(false);
    for (let i = 0, len = this.data.length; i < len; i++) {
      const v = this.data[i];
      if (v.requireExpand) {
        v.requireExpand = false;
        v.setExpand(true, true);
      }
    }
    this._render();
    return this.data;
  }
  getNodeById(id) {
    return this.store.getNodeById(id);
  }
  getCheckedNodes(...args) {
    return this.store.getCheckedNodes(...args);
  }
  setMaxValue(value = 0) {
    this.store.max = value;
  }
  scrollToIndex(index = 0) {
    this.vlist.scrollToIndex(index);
  }
  clearCheckedNodes() {
    const nodes = this.getCheckedNodes(true);
    nodes.forEach((node) => {
      node.setChecked(false);
    });
  }
}
var plugin = (VsTree) => {
  return (Vue, options = {}) => {
    Vue.component("vs-tree", {
      props: {
        data: Array | Object,
        options: Object,
        async: Boolean,
        animation: Boolean,
        draggable: Boolean,
        dropable: Boolean,
        hideRoot: Boolean,
        showCheckbox: Boolean,
        checkboxType: Object,
        showRadio: Boolean,
        radioType: String,
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
        breadcrumb: Object,
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
        maxHeight: String,
        minHeight: String,
        beforeCheck: Function,
        renderContent: Function,
        checkFilter: Function,
        searchFilter: Function,
        searchRender: Function,
        onDragstart: Function,
        onDragenter: Function,
        onDrop: Function
      },
      data() {
        return {
          tree: {}
        };
      },
      watch: {
        max(newVal = 0) {
          this.setMaxValue(newVal);
        },
        keyword(newVal) {
          this.filter(newVal);
        }
      },
      mounted() {
        this.$nextTick(() => {
          this._vsinit();
        });
      },
      methods: {
        _vsinit() {
          console.time("render:tree");
          this.tree.tree = new VsTree(this.$refs.tree, Object.assign({}, options, this.$props, __spreadProps(__spreadValues({}, this.options), {
            data: this.data,
            click: (event, node) => {
              this.$emit("click", event, node);
            },
            check: (event, node) => {
              this.$emit("check", event, node);
            },
            change: (node) => {
              this.$emit("change", node);
            },
            contextmenu: (event, node) => {
              this.$emit("node-contextmenu", event, node);
            },
            limitAlert: () => {
              this.$emit("limit-alert");
            }
          })));
          console.timeEnd("render:tree");
        },
        getNodeById(id) {
          return this.tree.tree.getNodeById(id);
        },
        getCheckedNodes() {
          return this.tree.tree.getCheckedNodes(...arguments);
        },
        filter(value) {
          return this.tree.tree.filter(value);
        },
        setMaxValue(value = 0) {
          this.tree.tree.setMaxValue(value);
        }
      },
      render(h) {
        return h("div", {
          ref: "tree"
        }, this.$slots.default);
      }
    });
  };
};
const version = version$1;
const install = plugin(Tree);
export { Tree as default, install, version };
