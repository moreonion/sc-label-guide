<template>
  <svg :height="height" :width="width">
    <circle :cx="cx" :cy="cy" :r="radius" :fill="color"/>
  </svg>
</template>

<script>
export default {
  props: ['width', 'height', 'radius', 'color'],
  computed: {
    cx: function () {
      return this.width / 2
    },
    cy: function () {
      return this.height / 2
    }
  }
}
</script>

<style>

</style>
