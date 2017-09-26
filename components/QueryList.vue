<template>
  <div class="queryList">
    <div class="queryStr" :key="index" v-for="(qlItem, index) in queryList">
      <div class="queryItem">{{columnLabel(qlItem.left)}} </div> <div class="queryItem">{{opLabel(qlItem.op, lang)}} </div>
      <template v-if="isListOperator(qlItem.op)">
        <span :key="index" v-for="(val, index) in qlItem.right">
          <eval-circle v-if="columnIsRating(qlItem.left)" class="queryItem" :value="projectValue(qlItem.left, val)"></eval-circle>
          <div v-else class="queryItem"><el-tag type="gray">{{projectLabel(qlItem.left, val)}}</el-tag></div>
        </span>
      </template>
      <template v-else>
        <eval-circle v-if="columnIsRating(qlItem.left)" class="queryItem" :value="projectValue(qlItem.left, qlItem.right)"></eval-circle>
        <div v-else class="queryItem"><el-tag type="gray">{{projectLabel(qlItem.left, qlItem.right)}}</el-tag></div>
      </template>
    </div>
  </div>
</template>

<script>
import {moColumnHelpers} from '../lib/mixins/ColumnHelpers.js'

export default {
  mixins: [moColumnHelpers],
  props: ['queryList']
}
</script>

<style>
  .queryList {
    transform: scale(0.8);
    transform-origin: top left;
  }

  .queryStr {
    display: flex;
    align-items: center;
  }

  .queryItem {
    margin-top: 2px;
    margin-left: 2px;
    margin-right: 2px;
  }
</style>
