# vs-tree

> 项目改与: [element-ui](https://element.eleme.cn/#/zh-CN/component/tree);<br />
> 虚拟列表使用: [vue-virtual-scroll-list](https://github.com/tangbc/vue-virtual-scroll-list);

## 具有和element-ui tree组件所有功能另添加面包屑和虚拟列表

  简单易用同时满足pc和移动端的Tree结构需求：
  详情见: [使用说明](./examples/docs/tree.md).

### PC Tree
  ![pc](./examples/assets/images/pc.jpg)

### 面包屑
  ![mobile](./examples/assets/images/mobile.jpg)

### 安装

  `npm install vs-tree`

  或

  `yarn add vs-tree`

### 使用

  ```js
  import VsTree from 'vs-tree';
  import 'vs-tree/lib/style/index.css';

  Vue.use(VsTree);
  ```

  ```html
  <vs-tree :data="data"></vs-tree>
  ```

  ```js
  export default {
    data() {
      return {
        data: [
          {label: 'demo1', children: [
            {label: 'demo11'}
          ]},
          {label: 'demo2'}
        ]
      };
    }
  }
  ```