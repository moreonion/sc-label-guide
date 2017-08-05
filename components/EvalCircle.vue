<template>
  <crcl width="30" height="30" radius="15" :color="color"></crcl>
</template>

<script>
import Crcl from './Crcl.vue'

const _RED_ = '#FA6265'
const _ORANGE_ = '#FED46A'
const _GREEN_ = '#6DC051'

export default {
  components: {
    'crcl': Crcl
  },
  props: ['value'],
  computed: {
    color: function () {
      if (this.value <= 1) {
        return _RED_
      } else if (this.value <= 2) {
        return _ORANGE_
      } else {
        return _GREEN_
      }
    }
  }
}
</script>

<style>

</style>
