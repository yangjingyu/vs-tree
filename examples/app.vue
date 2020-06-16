<template>
  <div id="app" :class="{ 'is-component': isComponent }">
    <div class="main-cnt">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app',

    computed: {
      isComponent() {
        return /^component-/.test(this.$route.name || '');
      }
    }
  };
</script>
