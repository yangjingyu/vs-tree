# vs-tree2.0

极简树组件, 无任何依赖【麻雀虽小，五脏俱全】

## 浏览器支持

| ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Latest ✔                                                                           | Latest ✔                                                                                 | Latest ✔                                                                                    | Latest ✔                                                                              | Latest ✔                                                                                 |

## 功能点

* [x] 基础树组件
* [x] 层级面包屑
* [x] 复选框
* [x] 单选框
* [x] 异步加载数据
* [x] 虚拟列表
* [x] 拖拽节点
* [x] 手风琴
* [x] 树内搜索
* [x] 自定义图标
* [x] 连接线
* [x] 最大可选
* [x] 节点右键事件
* [x] 自定义格式化数据
* [x] 支持Vue组件

## DEMO

[跳转到DEMO](https://yangjingyu.github.io/vs-tree/public/index.html)

## 安装

```shell
npm install vs-tree
```

或

```shell
yarn add vs-tree
```

## use

```html
<div id="tree"></div>
```

```js
import vsTree from 'vs-tree'
import 'vs-tree/dist/vs-tree.css'

const tree = new vsTree('#tree', {
  data: {id: 1, name: 'tree1', children: []} // [{id, name}, {id, name, children}]
});
```

---

直接引入js

```html
<link rel="stylesheet" href="../dist/vs-tree.css">
<div id="tree"></div>
<script src="../dist/vs-tree.js"></script>
```

```js
const tree = new vsTree.default('#tree', {
  data: {id: 1, name: 'tree1', children: []} // [{id, name}, {id, name, children}]
});
```

---

支持浏览器模块

```html
<script type="module">
import vsTree from '../dist/vs-tree.esm.browser.js'
const tree = new vsTree('#tree', {
  data: {id: 1, name: 'tree1', children: []} // [{id, name}, {id, name, children}]
});
</script>
```

## Vue2.x use

```js
// main.js
import { install } from 'vs-tree'
import 'vs-tree/dist/vs-tree.css'

Vue.use(install)
```

```html
<template>
  <div id="app">
    <vs-tree :data="data"></vs-tree>
  </div>
</template>

<script>
var id = 1000
function add(parentId, name) {
  const list = []
  for (var i = 0; i < 10; i++) {
    list.push({ id: '100' + id++, name: name + i, parentId: parentId })
  }
  return list
}
const data = {
  id: '1', name: 'zhangsan', parentId: '-1', children: [
    { id: '100', name: 'wangwu', parentId: '1', children: add('100', 'wangwu') },
    { id: '101', name: 'zhaoliu', parentId: '1', children: add('101', 'zhaoliu') },
    { id: '102', name: 'huahua', parentId: '1' },
    { id: '103', name: 'oo-1', parentId: '1' },
    { id: '104', name: 'oo-2', parentId: '1' },
    { id: '105', name: 'oo-3', parentId: '1' },
    { id: '106', name: 'oo-4', parentId: '1' },
    { id: '107', name: 'oo-5', parentId: '1' },
    { id: '108', name: 'oo-6', parentId: '1' },
    { id: '109', name: 'oo-7', parentId: '1' },
    { id: '110', name: 'oo-8', parentId: '1' },
    { id: '111', name: 'oo-9', parentId: '1' },
  ]
}
export default {
  name: 'App',
  data () {
    return {
      data: data
    }
  },

}
</script>
```

### Options

| Input            | Desc                                                 | Type                  | Default             |
| ---------------- | ---------------------------------------------------- | --------------------- | ------------------- |
| el               | 选择器, 或 HTMLElement                               | string 或 HTMLElement |                     |
| data             | 展示数据                                             | Object、 Array        |                     |
| async            | 延时渲染                                             | Boolean               | false               |
| hideRoot         | 是否展示根节点                                       | Boolean               | false               |
| showLine         | 是否展示连接线                                       | Boolean               | false               |
| showIcon         | 是否显示图标                                         | Boolean               | false               |
| onlyShowLeafIcon | 是否仅显示叶子节点图标                               | Boolean               | false               |
| showCheckbox     | 是否显示复选框                                       | Boolean               | false               |
| checkboxType     | 父子节点关联关系                                     | Object                | checkboxTypeOptions |
| checkInherit     | 新加入节点时自动继承父节点选中状态                   | Boolean               | false               |
| showRadio        | 是否显示单选框，会覆盖复选框                         | Boolean               | false               |
| radioType        | 分组范围                                             | String                | 'all'               |
| disabledInherit  | 新加入节点时自动继承父节点禁用状态                   | Boolean               | false               |
| highlightCurrent | 是否高亮选中当前项                                   | Boolean               | false               |
| accordion        | 手风琴模式                                           | Boolean               | false               |
| animation        | 开启动画                                             | Boolean               | false               |
| draggable        | 开启拖拽                                             | Boolean               | false               |
| dropable         | 允许放置                                             | Boolean               | false               |
| nocheckParent    | 禁止父节点选中                                       | Boolean               | false               |
| sort             | 对选中列表排序                                       | Boolean               | false               |
| checkOnClickNode | 是否在点击节点的时候选中节点                         | Boolean               | false               |
| lazy             | 异步加载节点                                         | Boolean               | false               |
| strictLeaf       | 严格依赖isLeaf，不提供时如无子节点则不渲染展开图标   | Boolean               | false               |
| max              | 最大可选数量                                         | Number                | 0                   |
| checkFilterLeaf  | 选中结果过滤掉叶子节点， 异步加载时需手需提供 isLeaf | Boolean               | false               |
| rootName         | 根节点名称，仅 data 为数组时有效，此时不会默认       | String                | null                |
| expandClass      | 展开收起图标class                                    | String                | vs-expand-icon      |
| theme            | 皮肤风格,仅支持 'element'                            | String                | null                |
| breadcrumb       | 面包屑功能，只展示一层节点                           | Object                | null                |
| disabledKeys     | 禁止操作                                             | Array                 | null                |
| checkedKeys      | 默认选中                                             | Array                 | null                |
| expandKeys       | 默认展开                                             | Array                 | null                |
| expandLevel      | 默认展开级数, 0 不展开 -1 全部展开                   | Number                | 1                   |
| indent           | 缩进                                                 | Number                | 10                  |
| virtual          | 虚拟列表配置信息                                     | Object                | virtualOptions      |
| maxHeight        | 组件最大高度                                         | String、Number        | 400px               |
| minHeight        | 组件最大高度                                         | String、Number        | 0px                 |

### checkboxTypeOptions

| options | Desc         | 默认 |
| ------- | ------------ | ---- |
| Y       | 勾选后情况   | 'ps' |
| N       | 取消勾选情况 | 'ps' |

> p 表示操作影响父节点
> s 表示操作影响子节点

### radioType

> all 表示全局范围内分组
> level 表示每级节点内分组

### virtualOptions

| options    | Desc                 | 默认 |
| ---------- | -------------------- | ---- |
| showCount  | 视图内展示多少条数据 | 20   |
| itemHeight | 每条的高度           | 26   |

### breadcrumb


| options   | Desc                      | 默认                 |
| --------- | ------------------------- | -------------------- |
| el        | Selector, HtmlElement     | 内部创建根节点       |
| icon      | string, ELement, Function | null                 |
| link      | string, ELement, Function | null                 |
| separator | string, ELement, Function | null                 |
| change    | Event                     | dom, node[], current |

### 方法

`Tree` 内部使用了 Node 类型的对象来包装用户传入的数据，用来保存目前节点的状态。
`Tree` 拥有如下方法：

| Methods           | 说明                   | 参数                    |
| ----------------- | ---------------------- | ----------------------- |
| getCheckedNodes   | 获取选中节点           | -                       |
| getNodeById       | 根据 ID 获取 Node 节点 | id                      |
| setMaxValue       | 设置最大可选           | number                  |
| scrollToIndex     | 滚动到索引位置         | number                  |
| clearCheckedNodes | 清除选中节点           | -                       |
| filter            | 过滤节点               | keyword, onlySearchLeaf |

> onlySearchLeaf 只过滤叶子节点

### Node 方法

`Node` 拥有如下方法：

| Methods     | 说明         | 参数       |
| ----------- | ------------ | ---------- |
| setChecked  | 设置是否选中 | true,false |
| setDisabled | 设置禁止操作 | true,false |
| remove      | 删除当前节点 | -          |
| append      | 追加节点     | data       |

### Events

| 事件名称      | 说明                   | 回调参数            | 返回值                      |
| ------------- | ---------------------- | ------------------- | --------------------------- |
| click         | 节点点击事件           | event, node         | void                        |
| beforeCheck   | 节点选择前触发         | node                | true,false                  |
| check         | 复选框被点击时触发     | event, node         | void                        |
| change        | 复选框改变时触发       | [ node ]                | void                        |
| limitAlert    | 超过 max 配置时触发    | -                   | void                        |
| renderContent | 自定义节点内容         | h,node              | h() 或 Dom                  |
| load          | lazy=true 时有效       | node, resolve       | void                        |
| checkFilter   | 过滤掉的节点不计入统计 | node                | true, false                 |
| format        | 格式化数据             | data                | {name,children,isLeaf,icon} |
| contextmenu   | 鼠标右键事件           | event, node         | void                        |
| searchFilter  | 搜索过滤               | keyword, node, data | node[]                      |
| searchRender  | 搜索渲染               | node, cloneNode     | Element                     |
| onDragstart   | 开始拖拽               | e, node             | void                        |
| onDragenter   | 进入放置目标           | e, node, dragPos    | void                        |
| onDrop        | 放置目标               | e, node, dragPos    | void                        |

> searchRender 返回的 Element 不会影响原有dom

#### renderContent

h: 生成简单 dom 节点，当前仅支持以下配置

```js
renderContent: function (h, node) {
  return h("div", {
    className: "tree-action",
    children: [
      h("a", {
        text: 'append',
        click: function (e, node) {
          node.append({
            id: id++,
            name: 'append'
          })
        }
      }),
      h("a", {
        text: 'remove',
        click: function (e, node) {
          node.remove()
        }
      })
    ]
  })
}
```
或

```js
renderContent: function(h, node) {
  const append = document.createElement('a')
  append.innerText = 'append'
  dom.appendChild(append)
  append.onclick = () => {
    node.append({
      id: id++,
      name: 'append'
    })
  }
  return append
}
```

### load

resolve 异步加载完成后回调

```js
lazy: true,
load: function (node, resolve) {
  setTimeout(() => {
    resolve([{
      id: id++,
      name: '新叶子节点' + id,
      isLeaf: true
    }])
  }, 1000)
}
```

### format

目前仅支持，id, name、children、isLeaf、icon、extra

```js
format: function(data) {
  return {
    name: data.title,
    children: data.child,
    isLeaf: !data.child,
    icon: 'custom-icon' || document.createElement
  }
}
```


## Tips

1. maxHeight 高度变大后 `showCount` 也要相应变大，不然滑动到底部后数据展示不全，会出现空白.
2. minHeight 可以配置最小高度，当 minHeight 和 maxHeight 配置相同的高度时，可以固定高度
3. 如果发现vs-tree组件不显示数据渲染结果为空，则在vs-tree组件上加v-if="list.length > 0" 判断下等数据加载完毕后进行渲染
4. itemHeight 是用于内部计算，dom元素真是高度需要用css指定
5. lazy为true时需手动添加isLeaf标识

## License

[MIT License](https://github.com/yangjingyu/vs-tree/blob/master/LICENSE).

## QQ交流群(860150548)

<img src="./public/static/qq-group.jpg" width="200" height= "350" alt="860150548" />
