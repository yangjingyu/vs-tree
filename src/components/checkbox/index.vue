<template>
  <div class="m-checkbox" :class="{ 'm-checkbox__half': halfChecked }">
    <div class="m-checkbox__icon" @click="onClick('change', $event)">
      <i :class="{ isChecked: value, isDisabled: disabled }"></i>
    </div>
    <span class="m-checkbox__label" @click="onClick('label-click', $event)">
      <slot>{{ title }}</slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'm-checkbox',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: Boolean,
    disabled: Boolean,
    title: String,
    halfChecked: Boolean,
  },
  methods: {
    onClick(type, e) {
      if (this.disabled) return;
      this.$emit(type, e);
    },
  },
};
</script>

<style lang="less" scoped>
.m-checkbox {
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
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAwFBMVEUAAAAggewqcOsfgewggewfgesgguwfgewggeoggewggesggesggewggOshguwggewfgeohgewhg+0jhOwihO4qf+shguwigukdh+0fgeshgeoggOogguoggOsggesfgOoggeofgushgeoggev///8qh+zg7fwwiu18tfPh7/zm8f1xr/KBuPR4s/N+tvNysPLy+P7X6Ps1je3V5/vL4vp2svPa6/ydyPeFu/Q+ku7r9P3o8/3D3fqMvvVaovBWoPCJuG7kAAAAI3RSTlMA/AY8v/Pg2q6W6cKeeGxOODYeFQ8MYiIczayf+M3Kq5Ba6iShFLoAAAI5SURBVEjHpZfplqIwEIUTVlkVBMW21wkRcdBxHO1l1vd/qzEcjsUWCM39J8fPe4OpSgq1KohmrmFpKr43dctwZ1GABCXJzp2OSUlYv3NkSQSdKiaQwJvKtA8PZQXIOq/IYRfr2SrpkGp7fHahYdIprC046NwgAjLmbexygkVgPFk22WjFWBF6FTV8V0RYq5r3HDKLJK+u2wBWhDYq/xEZqAWwnjYU1rzbnrTxUBivwwKWVTJYqlzUkUI+IUXK4Sn+DIynA43pxwetWsumKJtczr+3t08mW7WDRX33uzjeQG4HoWAiyl42cRy/woNJgHxdMPOWsT/28ET30QyL+W53Vzb9Rkvve4ZcwfUy3w1jQS6yxTKnV/Z7lSU2ssq/fzrR3swgC5ULan8+XxJu5q+0XlqoXBSv168ckp7MIBVhAkqZwZa2Zr75gjC6J6B3Fm8H3pzMAH8hoFOWMpMs6c4MsfXK8g47ZnOgnZnhhVnVBR7y5FnCzwyy6pskuSWHzByW2LA9IXlO0yIz+Dbk1guDIUVybmYoDChJ8GZQ+uc9r8EmCyXZ1gySPO7xyPGFZgBtqJG8h8UONMBG2+BlhgYIrbdO/4zjX2xfcWVJ3KafvB2Pb6eeps+zpn+z7B/tPG7GH3QoXA8/Yu1wzOE+5lohjbjQjL5KgZYP4vBD4wIZPWJB38cINeQ/YSH2yW+9Mj+LwM9z1K6X/sv6C+LKW3ePCWtvzIAyYjQaM5QJKvCLcRCrGhsH/fZx8D/BbX28oE1ohwAAAABJRU5ErkJggg==);
        background-size: cover;
        border: 0;
      }

      &.isDisabled {
        background-color: rgba(161, 160, 160, 0.1);
      }

      &.isChecked.isDisabled {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAhFBMVEUAAADS5/zU5/7b6//T5vzW6f7T5vzS5vzR5vzS5vzS5/zT5/zS5vvT6PvS5vvS5/vS5fvT5/zT5vzS5fvS5vrR5vvT5/zT6fjU5//S5vvT5vvQ5frR6P/T5/vS5vvU5/zS5fzS5vv////V6Pv6/P/j8P3l8f32+v/X6fvp8/7e7Pzs9P00m47gAAAAIXRSTlMA+w0G4B3BlTY96dquOvO+eGxOns2sYiIV8cSfFvHLWp+UKyRuAAAB5UlEQVRIx6WX23LqMAxFrTTOlUAuQLm1PXJCQnv+//86tGU2Kcg49XrDMwttSCxb6i6BTqo4CrdMWR7FVaID5chTUa5y4isoX5XFk4taRxlM+FlUP9KDdEEsQIvUmj5p5mxh3iSyuw6JrVC4FtRDzA7Eh3vu84xcZJo937p6CdduL/VN3SU7s/xVe4PMLsk3IzmG62LHo2fEE1nDTcKpcphc3KChqTLtgx85nfNk5unPPlrwH1h877Ga/iJT/VU4chba06nlC9G5dJE5u8dh6PlCdv7VJTm7nTEdcpdKBTP3usaYAQuzQOncue7ZPWIl16qgCW53bLFEhapcM19cUKlmQuaxy43aXX88nR5nBjsVMjgO+HIxMwjVlsFgTNe3DzKDrSIGnYEtZwYjuYdtyww5Y9DCxhIy38bOWbSxAHf8h+1YsOXMeFQNC7acGS9JxYItZ8brWZBki5mxMXTO9+13KTO2JJrB2D4j1UUzUCUJtuiiDak0Y8EWM6MBovWObakuWq/Y9Nv/nXm3uVRbjpuPvv9orceN/0Gngv30I/Zf4HO4+1wrfC40Plepg/8lDuhXcqz7qtUNekVO7gruFRu3K/NG3eft8WX9TYkke/uYsE98BxT/0ch/KLOOgy/ML6FlHPwE855l5y3sTzYAAAAASUVORK5CYII=);
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
    .m-checkbox__icon i {
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
</style>
