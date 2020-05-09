<template>
  <ul class="k-breadcrumb">
    <li
      class="k-breadcrumb-item"
      v-for="(item, index) in data"
      :key="item[unid]"
      @click.stop="$emit('change', item, index)"
    >
      <a href="javascript://">{{ item[label] }}</a>
    </li>
  </ul>
</template>

<script>
export default {
  name: "k-breadcrumb",

  props: {
    label: {
      type: String,
      default: "title"
    },
    unid: {
      type: String,
      default: "key"
    },
    data: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style scoped lang="less">
.k-breadcrumb {
  padding: 0 0 0.4rem 1rem;
  line-height: 2rem;
  text-align: left;
  background: #fff;

  &-item {
    position: relative;
    display: inline-block;
    padding-right: 2rem;
    color: #999;
    font-weight: normal;
    font-size: 1.2rem;
    background-repeat: no-repeat;
    background-position: right 0.35rem;
    background-size: 1.2rem 1.2rem;

    &::after {
      position: absolute;
      top: 50%;
      right: 0.4rem;
      width: 20px;
      height: 20px;
      background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgNjQgNjQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDY0IDY0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6Izk5OTk5OTt9Cjwvc3R5bGU+CjxnPgoJPGc+CgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTQ1LjUsMzAuN0wyMS44LDdjLTAuNy0wLjctMS44LTAuNy0yLjQsMGwtMC44LDAuOGMtMC43LDAuNy0wLjcsMS44LDAsMi40TDQwLjMsMzJMMTguNSw1My43CgkJCWMtMC43LDAuNy0wLjcsMS44LDAsMi40bDAuOCwwLjhjMC43LDAuNywxLjgsMC43LDIuNCwwbDIzLjctMjMuN0M0NS44LDMzLDQ2LDMyLjUsNDYsMzJDNDYsMzEuNSw0NS44LDMxLDQ1LjUsMzAuN3oiLz4KCTwvZz4KPC9nPgo8L3N2Zz4K);
      background-size: 20px 20px;
      transform: translateY(-50%);
      content: "";
    }

    > a {
      color: #2081eb;
      text-decoration: none;
    }

    &:last-child {
      padding-right: 0;

      > a {
        color: #999;
      }

      &::after {
        display: none;
      }
    }
  }
}
</style>
