import TreeStore from './tree-store'
import TreeNode from './tree-node'
import Vlist from '../virtual-list'
import Breadcrumb, { BreadcrumbOptions } from '../breadcrumb'
import { getDom, noop } from '../utils'

export interface DataItem {
  name: string;
  children: DataItem[];
  [key: string]: any;
}

export interface VirtualOptions {
  // 节点高度
  itemHeight: number
  // 展示条数
  showCount: number
  // 最大高度
  maxHeight: string
  // 最小高度
  minHeight: string
}
export interface TreeOptions {
  // 是否仅显示叶子节点图标
  onlyShowLeafIcon: boolean
  // 是否显示复选框
  showCheckbox: boolean
  // 父子节点关联关系
  checkboxType: { Y: string; N: string }
  // 新加入节点时自动继承父节点选中状态
  checkInherit: boolean
  // 新加入节点时自动继承父节点禁用状态
  disabledInherit: boolean
  // 是否显示单选框，会覆盖复选框
  showRadio: boolean
  // 是否高亮选中当前项
  highlightCurrent: boolean
  // 选中结果过滤掉叶子节点， 异步加载时需手需提供 isLeaf
  checkFilterLeaf: boolean
  // 过滤掉的节点不计入统计
  checkFilter: null
  // 手风琴模式
  accordion: boolean
  // 开启拖拽
  draggable: boolean
  // 允许放置
  dropable: boolean
  // 是否开启懒加载
  lazy: boolean
  // 是否开启排序
  sort: boolean
  // 缩进数量
  indent: number
  // 默认选中
  checkedKeys: never[]
  // 默认展开
  expandKeys: never[]
  // 禁止操作
  disabledKeys: never[]
  // 触发限制回调
  limitAlert: () => void
  // 点击回调
  click: () => void
  // 复选框被点击时触发
  check: () => void
  // 复选框改变时触发
  change: () => void
  // lazy=true 时有效 
  load: () => void
  // 鼠标右键事件
  contextmenu: null
  // 分组范围
  radioType: string
  // 自定义节点内容
  renderContent: null
  // 禁止父节点选中
  nocheckParent: boolean
  // 是否在点击节点的时候选中节点
  checkOnClickNode: boolean
  // 格式化数据
  format: null
  // 搜索渲染
  searchRender: null
  searchDisabledChecked: boolean
  // 展开收起图标class
  expandClass: string
  // 开始拖拽
  onDragstart: () => void
  // 进入放置目标
  onDragenter: () => void
  // 放置目标
  onDrop: () => void
  // 延时渲染
  async: any
  // 初始数据
  data: DataItem | DataItem[];
  // 最大选择数量
  max: number;
  // 根节点展示名称
  rootName: string;
  // 皮肤
  theme: string;
  // 是否显示根节点
  hideRoot: boolean
  // 最大高度
  maxHeight: string
  // 最小高度
  minHeight: string
  // 是否依赖isLeaf
  strictLeaf: boolean;
  // 是否开启动画
  animation: boolean;
  // 默认展开层级
  expandLevel: number;
  // 是否显示连接线
  showLine: boolean;
  // 是否展示icon
  showIcon: boolean
  // 面包屑
  breadcrumb: BreadcrumbOptions;
  // 虚拟列表参数
  virtual: VirtualOptions;
  // 过滤方法
  searchFilter: Function
  // 回调事件
  ready: Function
  // 节点选择前触发
  beforeCheck: Function
}
export default class Tree {
  // 根元素
  $el!: HTMLElement
  // 共有仓库
  store!: TreeStore
  // 虚拟列表
  vlist!: Vlist
  // 节点列表
  data: TreeNode[]
  // 边界正则
  interpolate: RegExp
  // 根节点数据
  rootData: DataItem
  // Node节点
  nodes: TreeNode[]
  // 节点高度
  itemHeight: number
  // 展示条数
  showCount: number
  // 最大高度
  maxHeight: string
  // 最小高度
  minHeight: string
  // 关键字
  keyword: string
  // 过滤方法
  searchFilter: Function
  // 回调事件
  ready: Function
  // 面包屑组件
  $$breadcrumb!: Breadcrumb
  
  constructor (selector: string | HTMLElement, ops: TreeOptions) {
    const dom = getDom(selector)
    if (dom instanceof HTMLElement) {
      dom.classList.add('vs-tree')
      this.$el = dom
    } else {
      throw Error('请为组件提供根节点')
    }

    const delimiters = ['#\\[\\[', '\\]\\]']

    const [open, close] = delimiters
    var interpolate = open + '([\\s\\S]+?)' + close
    this.interpolate = new RegExp(interpolate, 'igm')
    const slotsMap: any = {}
    const slots = this.$el.querySelectorAll('[tree-slot]')
    if (slots && slots.length) {
      slots.forEach((v: any) => {
        const name = v.attributes['tree-slot'].value
        const scope = v.attributes['tree-slot-scope'].value

        slotsMap[name] = {
          scope,
          node: v,
          interpolate: this.interpolate,
          text: (v as HTMLElement).innerText,
          inner: v.outerHTML
        }

        v.parentNode.removeChild(v)
      })
    }

    if (ops.theme) {
      this.$el.classList.add('vs-theme-' + ops.theme)
    }

    if (Array.isArray(ops.data)) {
      this.rootData = {
        _vsroot: true,
        name: ops.rootName || '---',
        children: ops.data
      }
      if (!ops.rootName) {
        ops.hideRoot = true
      }
    } else if (typeof ops.data === 'object') {
      this.rootData = ops.data
    } else {
      throw Error('参数data仅支持对象或数组！')
    }

    this.nodes = []
    const { showCount = 20, itemHeight = 26, maxHeight = '400px', minHeight = '0px' } = ops.virtual || {}
    // 每一项的高度
    this.itemHeight = itemHeight
    // 当前可见数量
    this.showCount = showCount
    // 最大高度
    this.maxHeight = ops.maxHeight || maxHeight
    // 最小高度
    this.minHeight = ops.minHeight || minHeight
    // 当前可见列表
    this.data = []
    // 关键字过滤
    this.keyword = ''
    // 过滤方法
    this.searchFilter = ops.searchFilter
    // 初始化回调
    this.ready = ops.ready || noop

    if (Object.prototype.toString.call(ops.breadcrumb) === '[object Object]') {
      this.$$breadcrumb = new Breadcrumb(ops.breadcrumb)
    }

    const start = () => {
      this.store = new TreeStore({
        data: this.rootData,
        max: ops.max,
        slots: slotsMap,
        async: ops.async,
        breadcrumb: this.$$breadcrumb || null,
        strictLeaf: ops.strictLeaf || false,
        showCount: this.showCount,
        itemHeight: this.itemHeight,
        hideRoot: ops.hideRoot || false,
        animation: ops.animation || false, // 动画
        expandLevel: typeof ops.expandLevel === 'number' ? ops.expandLevel : 1, // 默认展开1级节点
        beforeCheck: ops.beforeCheck || null,
        showLine: ops.showLine || false, // 是否显示连接线
        showIcon: ops.showIcon || false,
        onlyShowLeafIcon: ops.onlyShowLeafIcon || false,
        showCheckbox: ops.showCheckbox || false,
        checkboxType: ops.checkboxType || { Y: 'ps', N: 'ps' },
        checkInherit: ops.checkInherit || false, // 新加入节点时自动继承父节点选中状态
        disabledInherit: ops.disabledInherit || false, // 新加入节点时自动继承父节点禁用状态
        showRadio: ops.showRadio || false,
        highlightCurrent: ops.highlightCurrent || false,
        checkFilterLeaf: ops.checkFilterLeaf || false, // 过滤非叶子节点
        checkFilter: ops.checkFilter || null, // 过滤选中节点
        accordion: ops.accordion || false, // 手风琴模式
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
        check: ops.check || noop, // 复选框被点击时出发
        change: ops.change || noop,
        load: ops.load || noop,
        contextmenu: ops.contextmenu || null,
        radioParentoOnly: ops.radioType === 'level' ? 'level' : 'all', // 每个父节点下唯一，仅raido模式有效
        renderContent: ops.renderContent || null,
        nocheckParent: ops.nocheckParent || false, // 只允许叶子节点选中
        checkOnClickNode: ops.checkOnClickNode || false,
        format: ops.format || null,
        searchRender: ops.searchRender || null,
        searchDisabledChecked: ops.searchDisabledChecked || false,
        expandClass: ops.expandClass || 'vs-expand-icon',
        onDragstart: ops.onDragstart || noop,
        onDragenter: ops.onDragenter || noop,
        onDrop: ops.onDrop || noop,
        update: () => {
          this._render()
        },
        nodesChange: (nodes: TreeNode[]) => {
          this.nodes = nodes
          this.vlist && this._render()
        }
      })

      if (this.store.hideRoot) {
        // 根节点创建dom
        this.store.root.createNode()
      }

      this._init()

      // 设置默认选中
      this.store.setDefaultChecked()
    }

    start()
  }

  private _init (): void {
    this.vlist = new Vlist({
      root: this.$el,
      data: [],
      maxHeight: this.maxHeight,
      minHeight: this.minHeight,
      estimateSize: this.itemHeight,
      keeps: this.showCount
    })
    this._render()
    this.ready && this.ready(this)
  }

  private _render (update = true): void {
    if (this.$$breadcrumb) {
      const { current } = this.$$breadcrumb
      this.data = this.nodes.filter(v => v.parent && v.parent.id === current.id)
      this.$$breadcrumb.renderBreadcrumb()
    } else {
      this.data = this.nodes.filter(v => {
        // 过滤隐藏节点 ｜ 隐藏root节点
        return this._hasKeyword(v) && v.visbile && !(this.store.hideRoot && v.level === 0)
      })
    }
    update && this.vlist.update(this.data)
  }

  private _hasKeyword (v: any): boolean {
    if (!this.keyword) return true
    let boo = this._checkFilter(v)
    if (!boo) {
      v.childNodes.forEach((node: TreeNode) => {
        if (!boo) {
          boo = this._hasKeyword(node)
        }
      })
    } else {
      v.parent && (v.parent.requireExpand = true)
    }
    return boo
  }

  private _checkFilter (v: any): boolean {
    if (!this.keyword) return false
    if (typeof this.searchFilter === 'function') {
      return this.searchFilter(this.keyword, v, v.data)
    }
    return v.data.name && v.data.name.includes(this.keyword)
  }

  /**
   * @function filter
   * @memberof Tree
   * @desc 过滤节点
   * @param {?string} keyword 关键字
   * @param {?boolean} onlySearchLeaf 只搜索子节点
   * @param {?boolean} autoExpand 搜索结果是否展开
   * @return {TreeNode[]}
   */
  public filter (keyword = '', onlySearchLeaf = false, autoExpand = true): TreeNode[] {
    this.keyword = keyword

    this.store.onlySearchLeaf = onlySearchLeaf && !!keyword
    this.store.isSearch = !!keyword
    if (this.store.onlySearchLeaf) {
      const data = this.nodes.filter(v => !v.childNodes.length && this._checkFilter(v) && !(this.store.hideRoot && v.level === 0))
      this.vlist.update(data)
      return data
    }

    this._render(false)
    for (let i = 0, len = this.data.length; i < len; i++) {
      const v = this.data[i]
      if (v.requireExpand) {
        v.requireExpand = false
        if(autoExpand) {
          v.setExpand(true, true)
        }
      }
    }
    this._render()
    return this.data
  }

  /**
   * @function getNodeById
   * @memberof Tree
   * @desc 根据ID获取节点
   * @param {number|string} id 节点ID
   * @return {TreeNode}
   */
  public getNodeById (id: number|string): TreeNode {
    return this.store.getNodeById(id)
  }

  /**
   * @function getCheckedNodes
   * @memberof Tree
   * @desc 获取选中节点
   * @param {?boolean} isNode true 返回 TreeNode false 返回 DataItem
   * @return {(TreeNode|DataItem)[]}
   */
  public getCheckedNodes (isNode: boolean = false): any[] {
    return this.store.getCheckedNodes(isNode)
  }

  /**
   * @function setMaxValue
   * @memberof Tree
   * @desc 设置最大可选节点数量
   * @param {?number} value 可选数量
   * @return {void}
   */
  public setMaxValue (value = 0): void {
    this.store.max = value
  }

  /**
   * @function scrollToIndex
   * @memberof Tree
   * @desc 滚动到索引位置
   * @param {?number} index 滚动到node节点索引
   * @return {void}
   */
  public scrollToIndex (index = 0): void {
    this.vlist.scrollToIndex(index)
  }

  /**
   * @function clearCheckedNodes
   * @memberof Tree
   * @desc 清空选中元素
   * @return {void}
   */
  public clearCheckedNodes(): void {
    const nodes = this.getCheckedNodes(true)
    nodes.forEach(node => {
      node.setChecked(false)
    })
  }
}
