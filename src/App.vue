<template>
  <div>
    <k-tree :data="data" :options="options" @click="onClick" @change="onChange" @selected="onSelected">
      <template #label="{ node }">
        <span>{{node.title}}</span>
        <span v-if="!node.isLeaf">({{node.origin.departmentPCount}})</span>
      </template>
    </k-tree>
  </div>
</template>

<script>
import kTree from "./components/tree/index.vue";
import deptData from "./mock/departments.json";
import userData from "./mock/departments-users.json";

export default {
  name: "k-tree-demo",
  components: {
    kTree
  },
  data() {
    return {
      data: [],
      options: {
        rootId: -1
      }
    }
  },
  mounted() {
    deptData.forEach((d) => {
      d.key = d.departmentid;
      d.title = d.departmentname;
    });

    const users = userData.map(v => {
      v.parentid = v.did;
      v.title = v.name;
      v.isLeaf = true;
      v.key = `${v.uid}_${v.did}`
      return v;
    });

    this.data = deptData.concat(users);
  },
  methods: {
    onClick(node) {
      console.log(node);
      // 后勤部加人
      if(node.key === 100008 && !node.children.length) {
        node.isLoading = true;
        node.addChildren([{
          title: "后勤01",
          key: 10000801,
          isLeaf: true,
          parentid: 100008
        }, {
          title: "后勤02",
          key: 10000802,
          isLeaf: true,
          parentid: 100008
        }]);
      }
    },
    onChange(node) {
      console.log(node);
    },
    onSelected(selects) {
      console.log(selects, selects.length);
    }
  }
}
</script>