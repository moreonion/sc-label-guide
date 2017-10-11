<template>
  <div>
    <vue-markdown>{{readme}}</vue-markdown>
  </div>
</template>

<script>
  import VueMarkdown from 'vue-markdown'
  // import readme from '../../sdk/README.md'

  export default {
    components: {
      'vue-markdown': VueMarkdown
    },
    data() {
      return {
        readme: '* dasdads'
      }
    }
  }
</script>

<style>

</style>
