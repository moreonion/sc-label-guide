<template>
  <crcl width="20" height="20" radius="10" :color="color"></crcl>
</template>

<script>
import Crcl from './Crcl.vue'

const _GRAY_ = '#AAA'
const _RED_ = '#FA6265'
const _ORANGE_ = '#FED46A'
const _GREEN_ = '#6DC051'

export default {
  components: {
    'crcl': Crcl
  },
  props: ['value'],
  computed: {
    color: function() {
      if(this.value === null) {
        return _GRAY_
      } else if(this.value < 33) {
        return _RED_
      } else if(this.value < 55) {
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
