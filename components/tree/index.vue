<template>
  <div>
    <k-breadcrumb :data="crumb" @change="onCrumbChange" />
    <div class="k-tree">
      <k-checkbox
        v-for="n of current.children"
        :key="n.key"
        :title="n.title"
        :value="n.isChecked"
        :disabled="n.isDisabled"
        :half-checked="n.isHalfChecked"
        @label-click="onLabelClick(n, $event)"
        @change="onClick(n, $event)"
      >
        <slot name="label" :node="n"></slot>
      </k-checkbox>
      <div class="k-tree__nodata" v-if="current.children && !current.children.length">
        <slot name="nodata" />
      </div>
    </div>
  </div>
</template>

<script>
import Tree from '../core';
import breadcrumb from '../breadcrumb';
import checkbox from '../checkbox';

export default {
  name: 'k-tree',
  components: {
    [checkbox.name]: checkbox,
    [breadcrumb.name]: breadcrumb
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => Object.create({})
    }
  },
  data() {
    return {
      tree: null,
      crumb: []
    };
  },
  computed: {
    current() {
      return this.crumb.length ? this.crumb[this.crumb.length - 1] : {};
    }
  },
  watch: {
    data() {
      this.init();
    }
  },
  methods: {
    init() {
      this.tree = new Tree(this.data, this.options);
      this.crumb = this.tree.rootData;
    },
    onClick(n) {
      n.isChecked = !n.isChecked;
      this.tree.update(n);
      this.$emit('change', n, this.tree);
      this.$emit('selected', this.tree.getCheckedNodeList());
    },
    onLabelClick(n, event) {
      event.stopPropagation();
      this.$emit('click', n);
      if (!n.isLeaf) {
        this.crumb.push(n);
      } else {
        this.onClick(n);
      }
    },
    onCrumbChange(item, index) {
      this.crumb.splice(index + 1);
    },
    popCrumb() {
      this.canPopCrumb && this.crumb.pop();
    }
  }
};
</script>

<style lang="less">
.k-tree {
  & ~ .k-tree {
    margin-top: 10px;
  }

  &__nodata {
    text-align: center;
  }
}

.k-checkbox {
  display: flex;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  user-select: none;

  &__icon {
    height: 1em;
    line-height: 1em;
    font-size: 20px;
    cursor: pointer;

    > i {
      display: block;
      width: 1em;
      height: 1em;
      border: 1px solid #c8c9cc;
      border-radius: 1em;
      box-sizing: border-box;

      &.isChecked {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAACGVBMVEUAAAAAAAAAAP8A//8AgIAAVaoAVf8zZv8zmf8kbdsrgOondusid+4iiO4khuckhvMjgOgbie0jhO0if+UhhO8egOkkg+kiguwhgOwhhOwgguwgf+gfgukegu4ef+ohguohgOohgesggegggewfgusfgesigu0hgeoiguwhgewgguoggeogf+ogguwggeohguwggewggOsggesggewggOogguwfgOohgeoggeogguwggesggewggesggewggOsggeshgeshgesggeoggesfgesggOsggesggesggesgguwfgewfgesggesgguwggesggeshgeshgeogguwggesggewfgeogguogguwfgeshgeshgewggesggusggesggewggeshgesmhOwmhesnhesohuwphewqh+wrh+wsh+wsiOwviewviuwwiuwwiu0xi+0yi+00jO01je03ju0+ku4/ku5WoPBaovBxr/Jyr/JzsPJ0sPJ1sfJ2svJ3svN4s/J4s/N5s/N6tPN7tPN7tfN8tfN9tfN9tvN+tvN/tvN/t/OAt/OBuPOBuPSCuPSDufSEuvSIvPSMvvWZxfahyvfD3frH4PrK4frO4/rV5/vW6PvX6PvZ6vzb6/ze7Pze7fzf7fzg7fzg7vzh7vzi7vzi7/zl8P3l8f3m8f3n8v3o8/3r9P3w9/7y+P7z+P78/f/9/v/+/v/+//////+Km5QsAAAAX3RSTlMAAQEBAgMDBQUHDA0PDxUVFhwdHh8iIzU2Njc4OTs8PT5NT09aW2Jjam1ub3h4kJWWl5ien5+rrK69vr7AwMHBw8TFyszNzdfY2tvc4ODh6Onq8PHx8/j6+/v7/Pz9/c8DsUAAAAMcSURBVEjHpZfpWxJRFMavW4qJiqKRu1lo5RqkRJGWawlRKaICXtoYU6SyTds0RS2zfbOVJSwrC5q/sJmxYHbv4PvtXJ7fc99nOOfccwDgUVJGTkFVXbOxx9F38lhzXVVBTkYSQJOsuLqpsx/S1N/ZVF0sQ0BTKwzmAcjRgNlQkboBml56wA4FZNeXpougKds0Figii0aVIgirTQ4oKodJzU8mZjdABO3LTuSB83RWFNiqy+Oyig4bRJKtQ8H2nN8GkdWWz3SepbOhwzZdFgOut0IJstbT/181lCh17P9WmaTCJlU0JzUOqbBD+z9TyyxQsixl/+pID+OQfr3Gyu3xwPZyqvYPIQMXrl7DooGB7A7FZlR29M7rV95oZC4h+lX1ACLrur8SCftivaUmGch1qOzdTxE8/DF2oJMDZTca654JhPHw8nTspFsJitAqwjXzFcfx4ORFWn0Ugd1o7NRnwrN/EqMf7gEaNM9BwvN7Jgs1oIUWnR0fPyPm2cU8PgLoBXXvzdvbI3yefaTnCYxdWuA0LfrwG/ctuDmeZ0nP7ybZLOwB9GoM4XjEP4fxep5wcesS9NGiZ4EIjq/MjzkRPFPwKVp0+VGIvGSR5tztXffs4vmOPeA4LXJ6Hq4SzgMLw9F7vd8EPFMfrIURDy+QzlcXPU6GZ14WHmUniXsxSFwVWvLQPAuwRJKw0tM5Nr9COA8uEUmMUZ4DNwVYuJdbGNicn3J+CZsW80wVBrck3Q/8xIVfnj/1kTUoyJIlydMM3F7S+a+1P2KeqWaQXMNtQ9gsYZhQ2Cd8L9WGQAlPAxyd85Hsssi9VAMEMgPPLyOzP3D8+y0RFh6WCTZ9z8ufay+uiDX9HcLPzbkbj59cP7/xc7Ophw6ka6U/sfu3xv+4n9geGysqpcKVW+IfaBo2M0pls4a4dnS4PZ89fipaB9HQwVYFd/hUNqINro1Knqk3IbMWBa7NTOAfuXcaNxrWjbuE1wSVVnxN0IqsCeSCohdeUA6KLiik0oRXozTEpayLuZR1IS5l1Doozy0k18HeoaFeI7EOFubKedfBv5k5VabuERiSAAAAAElFTkSuQmCC);
        background-size: cover;
        border: 0;
      }

      &.isDisabled {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAABuVBMVEUAAAAAAP8A//////+AgP+qqv+q///M///////b2//V6v/E2OvM3f/d7v/O5//b5//R6P/b7f/T7f/M5fbW5v/S6fjT6fjU5//Q4/rQ5/rV5/rR6P/R5PrS6fvU6fvQ5fvR5vvR5v/S5vvU5fzP5fnS5fzS6PzV6PzS5vzT6PzT5fzR5frU5/3T6P3T5vrR5vrS5fvT5vvT5fzR5/zR5vzS5vzS5frS5fzQ5frS5fzR5vvR5vvS5fvS5vvS5/vR5vvT5vvS5vvT5vzS5vvT5vvR5vvS5fvS5vvS5vrS5vrS5vvS5vrT5vvT5/zS5vzS5/zR5vrT5vzS5vrS5vvS5/zS5vzS5vvS5/vS5vvT5/vS5vvS5vvS5/vR5vvS5vvS5/zR5vvS5vvS5/vS5vvT5vvT5/vS5vvT5/vU5/vV5/vV6PvW6PvW6fvX6PvY6fvY6vvd7Pze7Pzi7/zj7/zj8Pzj8P3k7/3k8P3l8P3l8f3m8P3m8f3n8v3o8v3q9P7s9P3z+P70+f71+v73+v73+//4+/74+//5+/75+//5/P75/P/6/P76/P/6/f/7/f78/f/9/v/+//////+hqrt/AAAAZnRSTlMAAQEBAgMDBQUHDA0PDxUVFhwdHh8iIzU2NjY3ODk7PD09Pk1PT09aW2Jjamptbm94kJWWl5ienp+fq6yurr2+vsDAwcPExcrMzdfY2tvc3ODg4ejo6erw8fHz+Pr7+/v8/Pz9/f2PbemEAAAC2klEQVRIx6WX+1/SUBjGj6Ip5AUUDVPRJC3UCtGUVKLAUrQM0koREUQPw3VPY7luZoWXLrK/uO2gsME23tHz27sP38952M57Q0hGurqm9gGnL7C0sfLkgc850N5Up0Mw6a2OidlVLNLq7ITDqgegNb3ehQguUmTB21tTAjV0345hBcU83QYVtPrCWAirKDRmqVaE7cE4VlU8aJcndcYRDNBNo9yLb3GHIXDY3VLMmvwxDFLMbypAK1tnMFgzrZUSuMEdhcNRd6MEHg5jDQoPi7+vHWuUPf+9LUGtcNCSu5Njca1w3HV2U3tCWLNCPad55MFlyJPNMVusHHjdRnL/LhigXr6icoFXqA7WBSibfL/3lclFi118Mjki0HNTv7jMQb62OKpQ/SSU3fnJcZkf+QeT9cg8D/ScOspw3H4q/2TejDqjYM8cd/SOEuVHJ7oG9yxlMb6ORjV43paweBRNiaLEi+cJoGdB95A4oXb2vm1vAT0LqYWeiaLvGS7NbME881pC4mw85A9IMxTIM68NtCKKPgr0MUNDPBP4qSiiWYE+FDtPMsSzHMvbfigO6d1jQud+SjFKnskLm5L+QYY436VLeuZ1v/CSbBH6kKWzAe85s6/A8pek8HrSDHHOJvlzPxDPbxVYfKM4MSgmLThnaXXPJDHMjwofnjr/xB6oeSYpWe/G8vTJiapnUgyqZMpQ1rmq52wZQl2LWOZsgVbznC2ASO/FcvQfjvu9rcJiHxnMbOty9Je/J59ptaJ/WbndJN6w7GuqdLv5r0aHDC7tLfbW+bMG3aa5uT++mB8r+rXC/efKH2hGJNNQo7ZRylgwxPnhsL9giOPHx+k1GLo2bSoePs3jsMF13Cwz9VY0DEHgoYYK+ZH7SqDUsB64qrwmWFzqa4KrrVp1QfEoLyh3LhlK7De1fUqrUV8tcCmbky5lc8ClLLsONncM8uvg8ubmcsDnHOxoll8H/wEYHoM6KlPAiwAAAABJRU5ErkJggg==);
        background-size: cover;
        border: 0;
      }
    }
  }

  &__label {
    margin-left: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__half {
    .k-checkbox__icon i {
      display: flex;
      align-items: center;
      justify-content: center;
      &::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 10px;
        border: 1px solid #ddd;
      }
    }
  }
}

.k-tree {
  .k-checkbox {
    height: 50px;
    padding: 0 16px;
    background-color: white;
    font-size: 20px;
    border-bottom: 1px solid #eee;

    &__label {
      font-size: 16px;
    }
  }
}
</style>