#vs-tree2.0

极简树组件【麻雀虽小，五脏俱全】


### Options

| Input            | Desc                           | Type           | Default |
| ---------------- | ------------------------------ | -------------- | ------- |
| selector         | ID选择器                       | string         |         |
| data             | 展示数据                       | Object、 Array |         |
| showRoot         | 是否展示根节点                 | Boolean        | true    |
| showLine         | 是否展示连接线                 | Boolean        | false   |
| showCheckbox     | 是否显示复选框                 | Boolean        | false   |
| showRadio        | 是否显示单选框，会覆盖复选框   | Boolean        | false   |
| radioParentoOnly | 每个父节点下唯一               | Boolean        | false   |
| highlightCurrent | 是否高亮选中当前项             | Boolean        | false   |
| accordion        | 手风琴模式                     | Boolean        | false   |
| nocheckParent    | 禁止父节点选中                 | Boolean        | false   |
| sort             | 对选中列表排序                 | Boolean        | false   |
| checkOnClickNode | 是否在点击节点的时候选中节点   | Boolean        | false   |
| lazy             | 异步加载节点                   | Boolean        | false   |
| max              | 最大可选数量                   | Number         | 0       |
| rootName         | 根节点名称，仅data为数组时有效，此时不会默认 | String         | null    |
| disabledKeys     | 禁止操作                       | Array          | null    |
| checkedKeys      | 默认选中                       | Array          | null    |
| expandKeys       | 默认展开                       | Array          | null    |
| indent           | 缩进                           | Number         | 10      |
| showCount        | 试图内显示节点数量             | Number         | 20      |
| itemHeight       | 单个节点高度                   | Number         | 26      |


### 方法
`Tree` 内部使用了 Node 类型的对象来包装用户传入的数据，用来保存目前节点的状态。
`Tree` 拥有如下方法：

| Methods         | 说明               | 参数 |
| --------------- | ------------------ | ---- |
| getCheckedNodes | 获取选中节点       | -    |
| getNodeById     | 根据ID获取Node节点 | id   |

### Node方法
`Node` 拥有如下方法：

| Methods    | 说明         | 参数       |
| ---------- | ------------ | ---------- |
| setChecked | 设置是否选中 | true,false |
| remove     | 删除当前节点 | -          |
| append     | 追加节点     | data       |
| filter     | 过滤节点     | keyword    |

### Events
| 事件名称      | 说明               | 回调参数      |
| ------------- | ------------------ | ------------- |
| click         | 节点点击事件       | event, node   |
| check         | 复选框被点击时触发 | event, node   |
| change        | 复选框改变时触发   | node          |
| limitAlert    | 超过max配置时触发  | -             |
| renderContent | 自定义节点内容     | h,node        |
| load          | lazy=true时有效    | node, resolve |
| format        | 格式化数据         | data          |

#### renderContent

h: 生成简单dom节点，当前仅支持一下配置

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

目前仅支持，name、children、isLeaf

```js
format: function(data) {
  return {
    name: data.title,
    children: data.child,
    isLeaf: !data.child
  }
}
```