#vs-tree2.0

极简树组件【麻雀虽小，五脏俱全】

### Options

| Input            | Desc                                                 | Type                  | Default        |
| ---------------- | ---------------------------------------------------- | --------------------- | -------------- |
| el               | 选择器, 或 HTMLElement                               | string 或 HTMLElement |                |
| data             | 展示数据                                             | Object、 Array        |                |
| async            | 延时渲染                                             | Boolean               | false          |
| hideRoot         | 是否展示根节点                                       | Boolean               | false          |
| showLine         | 是否展示连接线                                       | Boolean               | false          |
| showIcon         | 是否显示图标                                         | Boolean               | false          |
| onlyShowLeafIcon | 是否仅显示叶子节点图标                               | Boolean               | false          |
| showCheckbox     | 是否显示复选框                                       | Boolean               | false          |
| showRadio        | 是否显示单选框，会覆盖复选框                         | Boolean               | false          |
| radioParentoOnly | 每个父节点下唯一                                     | Boolean               | false          |
| highlightCurrent | 是否高亮选中当前项                                   | Boolean               | false          |
| accordion        | 手风琴模式                                           | Boolean               | false          |
| animation        | 开启动画                                             | Boolean               | false          |
| draggable        | 开启拖拽                                             | Boolean               | false          |
| dropable         | 允许放置                                             | Boolean               | false          |
| nocheckParent    | 禁止父节点选中                                       | Boolean               | false          |
| sort             | 对选中列表排序                                       | Boolean               | false          |
| checkOnClickNode | 是否在点击节点的时候选中节点                         | Boolean               | false          |
| lazy             | 异步加载节点                                         | Boolean               | false          |
| strictLeaf       | 严格依赖isLeaf，不提供时如无子节点则不渲染展开图标   | Boolean               | false          |
| max              | 最大可选数量                                         | Number                | 0              |
| checkFilterLeaf  | 选中结果过滤掉叶子节点， 异步加载时需手需提供 isLeaf | Boolean               | false          |
| rootName         | 根节点名称，仅 data 为数组时有效，此时不会默认       | String                | null           |
| expandClass      | 展开收起图标class                                    | String                | vs-expand-icon |
| theme            | 皮肤风格,仅支持 'element'                            | String                | null           |
| breadcrumb       | 面包屑功能，只展示一层节点                           | Object                | null           |
| disabledKeys     | 禁止操作                                             | Array                 | null           |
| checkedKeys      | 默认选中                                             | Array                 | null           |
| expandKeys       | 默认展开                                             | Array                 | null           |
| expandLevel      | 默认展开级数, 0 不展开 -1 全部展开                   | Number                | 1              |
| indent           | 缩进                                                 | Number                | 10             |
| showCount        | 试图内显示节点数量                                   | Number                | 20             |
| itemHeight       | 单个节点高度                                         | Number                | 26             |


### breadcrumb


| options   | Desc                      | 默认                    |
| --------- | ------------------------- | ----------------------- |
| el        | Selector, HtmlElement     | 内部创建根节点          |
| icon      | string, ELement, Function | null                    |
| link      | string, ELement, Function | null                    |
| separator | string, ELement, Function | null                    |
| change    | Event                     | dom,breadcrumbs,current |

### 方法

`Tree` 内部使用了 Node 类型的对象来包装用户传入的数据，用来保存目前节点的状态。
`Tree` 拥有如下方法：

| Methods         | 说明                   | 参数                    |
| --------------- | ---------------------- | ----------------------- |
| getCheckedNodes | 获取选中节点           | -                       |
| getNodeById     | 根据 ID 获取 Node 节点 | id                      |
| setMaxValue     | 设置最大可选           | number                  |
| scrollToIndex   | 滚动到索引位置         | number                  |
| filter          | 过滤节点               | keyword, onlySearchLeaf |

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

| 事件名称 | 说明 | 回调参数 | 返回值 |
| -------- | ---- | -------- | ------ |｜
| click | 节点点击事件 | event, node | void ｜
| beforeCheck | 节点选择前触发 | node | true,false ｜
| check | 复选框被点击时触发 | event, node | void ｜
| change | 复选框改变时触发 | node | void ｜
| limitAlert | 超过 max 配置时触发 | - | void ｜
| renderContent | 自定义节点内容 | h,node | h() ｜
| load | lazy=true 时有效 | node, resolve | void ｜
| checkFilter | 过滤掉的节点不计入统计 | node | true, false ｜
| format | 格式化数据 | data | {name,children,isLeaf,icon} ｜
| contextmenu | 鼠标右键事件 | event, node | void ｜
| searchFilter | 搜索过滤 | keyword, node, data | node[] ｜
| searchRender | 搜索渲染 | node, cloneNode | Element ｜
| onDragstart | 开始拖拽 | e, node | void ｜
| onDragenter | 进入放置目标 | e, node, dragPos | void ｜
| onDrop | 放置目标 | e, node, dragPos | void ｜

> searchRender 返回的 Element 不会影响原有dom

#### renderContent

h: 生成简单 dom 节点，当前仅支持一下配置

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


## Vue use

```js
// main.js
import { install } from './assets/vs-tree/vs-tree'
import './assets/vs-tree/vs-tree.css'

Vue.use(install)
```

```vue
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