(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.vsTree = {}));
}(this, (function (exports) { 'use strict';

  var version = "2.0.0";

  let setepId = 0;

  class Node {
    constructor(ops) {
      this.id = setepId++;
      this.checked = false;
      this.expanded = false;
      this.indeterminate = false;
      this.visbile = false;

      this.level = 0;
      this.childNodes = [];

      this.data = ops.data;
      this.store = ops.store;
      this.parent = ops.parent;

      if (this.store.expandKeys.includes(this.data.id)) {
        this.expanded = true;
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
      if (this.level > 1 && !(this.parent && this.parent.expanded)) {
        return this.visbile = false
      }
      this.visbile = true;
    }

    createNode() {
      if (this.dom) {
        this.checkboxNode && (this.checkboxNode.checked = this.checked);
        return this.dom;
      }
      const dom = document.createElement('div');
      dom.className = 'tree-node';

      dom.appendChild(this.createInner());
      if (this.store.renderContent) {
        dom.appendChild(this.createContent());
      }
      dom.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.store.highlightCurrent) {
          if (this.store.selectedCurrent) {
            this.store.selectedCurrent.dom.classList.remove('selected');
          }
          dom.classList.add('selected');
        }
        this.store.selectedCurrent = this;
        this.store.click(e, this);
      }, {
        passive: false
      });
      this.dom = dom;
      return dom
    }

    createInner() {
      const dom = document.createElement('div');
      // 当隐藏根节点时减少一级缩进
      const level = this.store.hideRoot ? -1 : 0;
      dom.style.paddingLeft = (this.level + level) * this.store.indent + 'px';
      dom.appendChild(this.childNodes && this.childNodes.length ? this.createExpand() : this.createExpandEmpty());
      this.store.showCheckbox && dom.appendChild(this.createCheckbox());
      dom.appendChild(this.createText());
      return dom
    }

    // 自定义内容
    createContent() {
      const tpl = this.store.renderContent(this);
      const content = document.createElement('div');
      content.innerHTML = tpl;
      const clickDom = content.querySelectorAll("[tree-click]");
      if (clickDom) {
        content.addEventListener('click', (e) => {
          e.stopPropagation();
          const attr = e.target.attributes['tree-click'];
          if (attr.value) {
            this.store.click(e, this, attr.value);
          }
        }, {
          passive: false
        });
      }    return content;
    }

    createExpandEmpty() {
      const dom = document.createElement('span');
      dom.className = 'expand-empty';
      return dom
    }

    createExpand() {
      const dom = document.createElement('span');
      dom.className = "expand";
      dom.innerText = "+";

      if (this.level < 1 || this.expanded) {
        dom.classList.add('expand-true');
        this.expanded = true;
        dom.innerText = "-";
      }

      dom.addEventListener('click', (e) => {
        e.stopPropagation();
        const expand = !dom.classList.contains('expand-true');
        dom.innerText = expand ? "-" : "+";
        dom.classList.toggle('expand-true');
        this.setExpand(expand);
      }, {
        passive: false
      });
      this.expandEl = dom;
      return dom;
    }

    createCheckbox() {
      const dom = document.createElement('label');
      dom.className = "vs-checkbox";
      const inner = document.createElement('span');
      inner.className = "vs-checkbox__inner";
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = this.checked;
      checkbox.className = 'vs-checkbox__original';

      dom.appendChild(checkbox);
      dom.appendChild(inner);

      // label 点击会出发两次
      dom.addEventListener('click', (e) => {
        e.stopPropagation();
      }, { passive: false });

      checkbox.addEventListener('click', (e) => {
        this.store.check(e, this);
      }, { passive: false });

      checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        const checked = e.target.checked;
        if (checked && this.store.max && this.store.checkMaxNodes(this)) {
          this.store.limitAlert();
          e.target.checked = false;
          return;
        }
        this.updateChecked(checked);
        this.updateCheckedParent(checked);
        this.store.change(this);
      });

      this.checkboxNode = checkbox;
      return dom;
    }

    createText() {
      const dom = document.createElement('span');
      dom.innerText = this.data.name;
      dom.className = 'name';
      return dom;
    }

    setData(data) {
      this.store.dataMap.set(data.id, this);
      this.data = data;
      this.childNodes = [];

      let children;
      if (this.level === 0 && this.data instanceof Node) {
        children = this.data;
      } else {
        children = this.data.children || [];
      }

      for (let i = 0, j = children.length; i < j; i++) {
        this.insertChild({ data: children[i] });
      }
    }

    insertChild(child) {
      if (!(child instanceof Node)) {
        Object.assign(child, {
          parent: this,
          store: this.store
        });
        child = new Node(child);
      }

      child.level = this.level + 1;

      this.childNodes.push(child);
    }

    updateExpand(expand) {
      if (this.childNodes.length) {
        this.childNodes.forEach(v => {
          if (expand && this.expanded) {
            v.visbile = true;
          } else {
            v.visbile = false;
          }
          v.updateExpand(expand);
        });
      }
    }

    updateChecked(check) {
      this.checked = check;
      this.sortId = Date.now();
      this.checkboxNode && (this.checkboxNode.checked = check);
      this.parent && (this.parent.indeterminate = false);
      this.dom && this.dom.classList.remove('is-indeterminate');
      if (this.childNodes.length) {
        this.childNodes.forEach(v => {
          v.updateChecked(check);
        });
      }
    }

    updateCheckedParent() {
      if (!this.parent) return;
      const allChecked = this.parent.childNodes.every(v => v.checked);
      const someChecked = this.parent.childNodes.some(v => v.checked || v.indeterminate);
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
    }

    // 设置是否选中
    setChecked(checked) {
      if (!this.store.showCheckbox) return;
      this.updateChecked(checked);
      this.updateCheckedParent(checked);
    }

    // 设置默认展开
    setExpand(expand) {
      this.expanded = expand;
      this.updateExpand(this.expanded);
      this.store.update();
    }
  }

  class TreeStore {
    constructor(options) {
      for (let option in options) {
        if (options.hasOwnProperty(option)) {
          this[option] = options[option];
        }
      }

      this.dataMap = new Map();

      this.root = new Node({
        data: this.data,
        store: this
      });
    }

    setData(val) {
      this.root.setData(val);
    }

    // 获取选中节点
    getCheckedNodes() {
      const nodes = this.nodes.filter(v => v.checked);
      if (this.sort) {
        return nodes.sort((a, b) => a.sortId - b.sortId).map(v => v.data)
      }
      return nodes.map(v => v.data)
    }

    // 验证是否已经选到最大
    checkMaxNodes(node) {
      const len = this.getCheckedNodes().length;
      if (len > this.max) {
        return true;
      }
      
      if(node.childNodes.length > this.max) {
        return true
      }
      return false
    }
  }

  /**
   * virtual list core calculating center
   */

  const DIRECTION_TYPE = {
    FRONT: 'FRONT', // scroll up or left
    BEHIND: 'BEHIND' // scroll down or right
  };
  const CALC_TYPE = {
    INIT: 'INIT',
    FIXED: 'FIXED',
    DYNAMIC: 'DYNAMIC'
  };
  const LEADING_BUFFER = 2;

  class Virtual {
    constructor (param, callUpdate) {
      this.init(param, callUpdate);
    }

    init (param, callUpdate) {
      // param data
      this.param = param;
      this.callUpdate = callUpdate;

      // size data
      this.sizes = new Map();
      this.firstRangeTotalSize = 0;
      this.firstRangeAverageSize = 0;
      this.lastCalcIndex = 0;
      this.fixedSizeValue = 0;
      this.calcType = CALC_TYPE.INIT;

      // scroll data
      this.offset = 0;
      this.direction = '';

      // range data
      this.range = Object.create(null);
      if (param) {
        this.checkRange(0, param.keeps - 1);
      }

      // benchmark test data
      // this.__bsearchCalls = 0
      // this.__getIndexOffsetCalls = 0
    }

    destroy () {
      this.init(null, null);
    }

    // return current render range
    getRange () {
      const range = Object.create(null);
      range.start = this.range.start;
      range.end = this.range.end;
      range.padFront = this.range.padFront;
      range.padBehind = this.range.padBehind;
      return range
    }

    isBehind () {
      return this.direction === DIRECTION_TYPE.BEHIND
    }

    isFront () {
      return this.direction === DIRECTION_TYPE.FRONT
    }

    // return start index offset
    getOffset (start) {
      return (start < 1 ? 0 : this.getIndexOffset(start)) + this.param.slotHeaderSize
    }

    updateParam (key, value) {
      if (this.param && (key in this.param)) {
        // if uniqueIds change, find out deleted id and remove from size map
        if (key === 'uniqueIds') {
          this.sizes.forEach((v, key) => {
            if (!value.includes(key)) {
              this.sizes.delete(key);
            }
          });
        }
        this.param[key] = value;
      }
    }

    // save each size map by id
    saveSize (id, size) {
      this.sizes.set(id, size);

      // we assume size type is fixed at the beginning and remember first size value
      // if there is no size value different from this at next comming saving
      // we think it's a fixed size list, otherwise is dynamic size list
      if (this.calcType === CALC_TYPE.INIT) {
        this.fixedSizeValue = size;
        this.calcType = CALC_TYPE.FIXED;
      } else if (this.calcType === CALC_TYPE.FIXED && this.fixedSizeValue !== size) {
        this.calcType = CALC_TYPE.DYNAMIC;
        // it's no use at all
        delete this.fixedSizeValue;
      }

      // calculate the average size only in the first range
      if (this.calcType !== CALC_TYPE.FIXED && typeof this.firstRangeTotalSize !== 'undefined') {
        if (this.sizes.size < Math.min(this.param.keeps, this.param.uniqueIds.length)) {
          this.firstRangeTotalSize = [...this.sizes.values()].reduce((acc, val) => acc + val, 0);
          this.firstRangeAverageSize = Math.round(this.firstRangeTotalSize / this.sizes.size);
        } else {
          // it's done using
          delete this.firstRangeTotalSize;
        }
      }
    }

    // in some special situation (e.g. length change) we need to update in a row
    // try goiong to render next range by a leading buffer according to current direction
    handleDataSourcesChange () {
      let start = this.range.start;

      if (this.isFront()) {
        start = start - LEADING_BUFFER;
      } else if (this.isBehind()) {
        start = start + LEADING_BUFFER;
      }

      start = Math.max(start, 0);

      this.updateRange(this.range.start, this.getEndByStart(start));
    }

    // when slot size change, we also need force update
    handleSlotSizeChange () {
      this.handleDataSourcesChange();
    }

    // calculating range on scroll
    handleScroll (offset) {
      this.direction = offset < this.offset ? DIRECTION_TYPE.FRONT : DIRECTION_TYPE.BEHIND;
      this.offset = offset;

      if (!this.param) {
        return
      }

      if (this.direction === DIRECTION_TYPE.FRONT) {
        this.handleFront();
      } else if (this.direction === DIRECTION_TYPE.BEHIND) {
        this.handleBehind();
      }
    }

    // ----------- public method end -----------

    handleFront () {
      const overs = this.getScrollOvers();
      // should not change range if start doesn't exceed overs
      if (overs > this.range.start) {
        return
      }

      // move up start by a buffer length, and make sure its safety
      const start = Math.max(overs - this.param.buffer, 0);
      this.checkRange(start, this.getEndByStart(start));
    }

    handleBehind () {
      const overs = this.getScrollOvers();
      // range should not change if scroll overs within buffer
      if (overs < this.range.start + this.param.buffer) {
        return
      }

      this.checkRange(overs, this.getEndByStart(overs));
    }

    // return the pass overs according to current scroll offset
    getScrollOvers () {
      // if slot header exist, we need subtract its size
      const offset = this.offset - this.param.slotHeaderSize;
      if (offset <= 0) {
        return 0
      }

      // if is fixed type, that can be easily
      if (this.isFixedType()) {
        return Math.floor(offset / this.fixedSizeValue)
      }

      let low = 0;
      let middle = 0;
      let middleOffset = 0;
      let high = this.param.uniqueIds.length;

      while (low <= high) {
        // this.__bsearchCalls++
        middle = low + Math.floor((high - low) / 2);
        middleOffset = this.getIndexOffset(middle);

        if (middleOffset === offset) {
          return middle
        } else if (middleOffset < offset) {
          low = middle + 1;
        } else if (middleOffset > offset) {
          high = middle - 1;
        }
      }

      return low > 0 ? --low : 0
    }

    // return a scroll offset from given index, can efficiency be improved more here?
    // although the call frequency is very high, its only a superposition of numbers
    getIndexOffset (givenIndex) {
      if (!givenIndex) {
        return 0
      }

      let offset = 0;
      let indexSize = 0;
      for (let index = 0; index < givenIndex; index++) {
        // this.__getIndexOffsetCalls++
        indexSize = this.sizes.get(this.param.uniqueIds[index]);
        offset = offset + (typeof indexSize === 'number' ? indexSize : this.getEstimateSize());
      }

      // remember last calculate index
      this.lastCalcIndex = Math.max(this.lastCalcIndex, givenIndex - 1);
      this.lastCalcIndex = Math.min(this.lastCalcIndex, this.getLastIndex());

      return offset
    }

    // is fixed size type
    isFixedType () {
      return this.calcType === CALC_TYPE.FIXED
    }

    // return the real last index
    getLastIndex () {
      return this.param.uniqueIds.length - 1
    }

    // in some conditions range is broke, we need correct it
    // and then decide whether need update to next range
    checkRange (start, end) {
      const keeps = this.param.keeps;
      const total = this.param.uniqueIds.length;

      // datas less than keeps, render all
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
    }

    // setting to a new range and rerender
    updateRange (start, end) {
      this.range.start = start;
      this.range.end = end;
      this.range.padFront = this.getPadFront();
      this.range.padBehind = this.getPadBehind();
      this.callUpdate(this.getRange());
    }

    // return end base on start
    getEndByStart (start) {
      const theoryEnd = start + this.param.keeps - 1;
      const truelyEnd = Math.min(theoryEnd, this.getLastIndex());
      return truelyEnd
    }

    // return total front offset
    getPadFront () {
      if (this.isFixedType()) {
        return this.fixedSizeValue * this.range.start
      } else {
        return this.getIndexOffset(this.range.start)
      }
    }

    // return total behind offset
    getPadBehind () {
      const end = this.range.end;
      const lastIndex = this.getLastIndex();

      if (this.isFixedType()) {
        return (lastIndex - end) * this.fixedSizeValue
      }

      // if it's all calculated, return the exactly offset
      if (this.lastCalcIndex === lastIndex) {
        return this.getIndexOffset(lastIndex) - this.getIndexOffset(end)
      } else {
        // if not, use a estimated value
        return (lastIndex - end) * this.getEstimateSize()
      }
    }

    // get the item estimate size
    getEstimateSize () {
      return this.isFixedType() ? this.fixedSizeValue : (this.firstRangeAverageSize || this.param.estimateSize)
    }
  }

  /**
   * virtual list default component
   */

  class Vlist {
    constructor(opts) {
      this.range = null;

      this.$el = opts.root;

      this.$el.style.maxHeight = '400px';
      this.$el.style.overflowY = 'auto';

      this.dataSources = opts.data;

      this.wrapper = document.createElement("div");
      this.$el.appendChild(this.wrapper);

      this.$el.addEventListener('scroll', this.onScroll.bind(this), {
        passive: false
      });

      this.keeps = opts.keeps || 20;

      this.estimateSize = opts.estimateSize || 26;

      this.dataKey = 'id';

      this.installVirtual();
    }

    // return current scroll offset
    getOffset() {
      const root = this.$el;
      return root ? Math.ceil(root.scrollTop) : 0
    }

    // return client viewport size
    getClientSize() {
      const root = this.$el;
      return root ? Math.ceil(root.clientHeight) : 0
    }

    // return all scroll size
    getScrollSize() {
      const root = this.$el;
      return root ? Math.ceil(root.scrollHeight) : 0
    }

    // ----------- public method end -----------

    installVirtual() {
      this.virtual = new Virtual({
        slotHeaderSize: 0,
        slotFooterSize: 0,
        keeps: this.keeps,
        estimateSize: this.estimateSize,
        buffer: Math.round(this.keeps / 3), // recommend for a third of keeps
        uniqueIds: this.getUniqueIdFromDataSources()
      }, this.onRangeChanged.bind(this));

      // sync initial range
      this.range = this.virtual.getRange();
      this.render();
    }

    getUniqueIdFromDataSources() {
      const { dataKey } = this;
      return this.dataSources.map((dataSource) => typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey])
    }

    // here is the rerendering entry
    onRangeChanged(range) {
      this.range = range;
      this.render();
    }

    onScroll(evt) {
      const offset = this.getOffset();
      const clientSize = this.getClientSize();
      const scrollSize = this.getScrollSize();

      // iOS scroll-spring-back behavior will make direction mistake
      if (offset < 0 || (offset + clientSize > scrollSize + 1) || !scrollSize) {
        return
      }

      this.virtual.handleScroll(offset);
    }

    getRenderSlots() {
      const { start, end } = this.range;
      const { dataSources, dataKey } = this;
      this.wrapper.innerHTML = '';
      for (let index = start; index <= end; index++) {
        const dataSource = dataSources[index];
        if (dataSource) {
          const uniqueKey = typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey];
          if (typeof uniqueKey === 'string' || typeof uniqueKey === 'number') {
            this.wrapper.appendChild(dataSource.createNode());
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
      this.wrapper.innerHTML = '';
      this.virtual.updateParam('uniqueIds', this.getUniqueIdFromDataSources());
      this.virtual.handleDataSourcesChange();
    }

    render() {
      const { padFront, padBehind } = this.range;

      const paddingStyle = `${padFront}px 0px ${padBehind}px`;

      this.wrapper.style.padding = paddingStyle;

      this.getRenderSlots();
    }
  }

  const noop = () => {};
  class Tree {
    constructor(selector, ops) {
      this.$options = ops;
      this.$el = document.querySelector(selector);

      if (!this.$el) {
        throw Error('请为组件提供根节点')
      }
      // 每一项的高度
      this.itemHeight = ops.itemHeight || 26;
      // 当前可见数量
      this.showCount = ops.showCount || 20;
      // 最大高度
      this.maxHeight = ops.maxHeight || '400px';
      // 唯一ID
      this.dataKey = ops.dataKey || 'id';
      // 当前可见项
      this.data = [];

      this.store = new TreeStore({
        data: ops.data,
        max: ops.max,
        sort: ops.sort || false,
        indent: ops.indent || 10,
        checkedKeys: ops.checkedKeys || [],
        expandKeys: ops.expandKeys || [],
        limitAlert: ops.limitAlert || noop,
        click: ops.click || noop,
        check: ops.check || noop, // 复选框被点击时出发
        change: ops.change || noop,
        highlightCurrent: ops.highlightCurrent || false,
        showCheckbox: ops.showCheckbox || false,
        renderContent: ops.renderContent || null,
        update: () => {
          this.createNode();
        },
      });

      this.store.setData(ops.data);

      this.root = this.store.root;

      this.nodes = this.getAllNodes(this.root);

      if (typeof ops.showRoot === "boolean" && !ops.showRoot) {
        this.store.hideRoot = true;
        // 跟节点创建dom
        this.root.createNode();
      }

      this.store.nodes = this.nodes;

      this.init();

      this.setDefaultChecked();
    }

    init() {
      this.vlist = new Vlist({
        root: this.$el,
        data: this.data,
        maxHeight: this.maxHeight,
        estimateSize: this.itemHeight,
        keeps: this.showCount,
      });
      this.createNode();
    }

    getAllNodes(node) {
      const nodes = [];
      const expand = (val) => {
        nodes.push(val);
        if (val.childNodes && val.childNodes.length) {
          val.childNodes.forEach(element => {
            expand(element);
          });
        }
      };
      expand(node);
      return nodes;
    }

    createNode() {
      this.data = this.nodes.filter(v => {
        // 过滤隐藏节点 ｜ 隐藏root节点
        return v.visbile && !(this.store.hideRoot && v.level === 0)
      });
      this.vlist.update(this.data);
    }

    // 设置默认选中
    setDefaultChecked() {
      this.store.checkedKeys.forEach(id => {
        this.getNodeById(id).setChecked(true);
      });
    }

    // 根据ID获取节点
    getNodeById(id) {
      return this.store.dataMap.get(id);
    }

    // 获取选中节点
    getCheckedNodes() {
      return this.store.getCheckedNodes();
    }

  }

  // 版本号
  const version$1 = version;

  exports.default = Tree;
  exports.version = version$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
