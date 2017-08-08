export const moDialogVisibility = {
  methods: {
    updateVisible: function(val) {
      this.emitUpdate(val)
    },
    dismiss: function() {
      this.emitUpdate(false)
    },
    emitUpdate: function(val) {
      this.$emit('update:visible', val)
    }
  }
}
