<template>
  <div>
    <el-select v-model="lang" disabled :placeholder="$t('Translations.Language')">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>

</template>

<script>
export default {
  props: ['lang'],
  data: () => ({
    options: [{label: 'English', value: 0}]
  })
}
</script>

<style>

</style>
