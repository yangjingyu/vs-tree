#vs-tree2.0

极简树组件【麻雀虽小，五脏俱全】


### Options

| Input            | Desc                         | Type    | Default |
| ---------------- | ---------------------------- | ------- | ------- |
| selector         | ID选择器                     | string  |         |
| data             | 展示数据                     | Object  |         |
| showRoot         | 是否展示根节点               | Boolean | true    |
| showCheckbox     | 是否显示复选框               | Boolean | false   |
| highlightCurrent | 是否高亮选中当前项           | Boolean | false   |
| nocheckParent    | 禁止父节点选中               | Boolean | false   |
| sort             | 对选中列表排序               | Boolean | false   |
| checkOnClickNode | 是否在点击节点的时候选中节点 | Boolean | false   |
| max              | 最大可选数量                 | Number  | 0       |
| disabledKeys     | 禁止操作                     | Array   | null    |
| checkedKeys      | 默认选中                     | Array   | null    |
| expandKeys       | 默认展开                     | Array   | null    |
| indent           | 缩进                         | Number  | 10      |
| showCount        | 试图内显示节点数量           | Number  | 20      |
| itemHeight       | 单个节点高度                 | Number  | 26      |


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

### Events
| 事件名称      | 说明               | 回调参数          |
| ------------- | ------------------ | ----------------- |
| click         | 节点点击事件       | event, node, type |
| check         | 复选框被点击时触发 | event, node       |
| change        | 复选框改变时触发   | node              |
| limitAlert    | 超过max配置时触发  | -                 |
| renderContent | 自定义节点内容     | h,node            |


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
            id: 999999,
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