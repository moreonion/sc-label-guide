import EvalCircle from './EvalCircle.vue'

export const EvalDropdownItem = {
  components: {
    'eval-circle': EvalCircle
  },
  props: {
    item: {type: Object, required: true}
  },
  render(h) {
    return h('li', [
      h('eval-circle', {props: {value: this.item.value}})
    ])
  }
}
