<template>
  <el-card class="readme-cont">
    <vue-markdown :source="readme"></vue-markdown>
  </el-card>
</template>

<script>
  import VueMarkdown from 'vue-markdown'
  import readme from '../../sdk/README.md'

  export default {
    head() {
      return {
        script: [
          {type: 'text/javascript', src: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/prism.min.js'}
        ],
        link: [
          {rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/themes/prism.min.css'},
          {rel: 'stylesheet', href: 'https://unpkg.com/katex@0.6.0/dist/katex.min.css'}
        ]
      }
    },
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
    margin-bottom: 20px;
  }
</style>
