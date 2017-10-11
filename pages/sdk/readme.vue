<template>
  <el-card class="readme-cont">
    <vue-markdown :source="readme" :html="true"></vue-markdown>
  </el-card>
</template>

<script>
  import VueMarkdown from 'vue-markdown'
  import readme from '../../sdk/README.md'

  export default {
    components: {
      'vue-markdown': VueMarkdown
    },
    data() {
      return {
        readme
      }
    }
  }
</script>

<style>
  .readme-cont {
    max-width: 800px;
    margin: 0 auto;
    margin-top: 20px;
  }
</style>
