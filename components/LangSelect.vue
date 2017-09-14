<template>
  <div>
    <el-select :value="lang" @input="langChange" :placeholder="$t('Translations.Language')">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>

</template>

<script>
import {_AVAILABLE_LANGUAGES_} from '../config/language'
import {_EVENTS_} from '../config/events'

export default {
  props: ['lang'],
  computed: {
    options: function() {
      return _AVAILABLE_LANGUAGES_.map(l => ({value: l, label: this.$i18n.t(`Languages.${l}`)}))
    }
  },
  methods: {
    langChange: function(language) {
      this.$emit(_EVENTS_.LangSelect.langChange, language)
    }
  }
}
</script>

<style>

</style>
