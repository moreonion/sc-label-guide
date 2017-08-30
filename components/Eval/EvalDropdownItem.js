export const EvalDropdownItem = {
  functional: true,
  props: {
    item: {type: Object, required: true}
  },
  render(h, ctx) {
    const item = ctx.props.item
    return h('li', ctx.data, [
      h('eval-circle', {props: {value: item.value}})
    ])
  }
}

