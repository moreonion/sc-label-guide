<template>
  <el-row type="flex" algin="middle" class="legend-cont">
    <el-col :xs="8" :sm="5">
      <div class="eval-cont">
        <eval-circle value="3"></eval-circle><span>Good</span>
      </div>
    </el-col>
    <el-col :xs="8" :sm="5" class="test">
      <div class="eval-cont">
        <eval-circle value="2"></eval-circle><span>Mediocre</span>
      </div>
    </el-col>
    <el-col :xs="8" :sm="5" class="test">
      <div class="eval-cont">
        <eval-circle value="1"></eval-circle><span>Not Good</span>
      </div>
    </el-col>
    <el-col :xs="24" :sm="8">
      <span>How does the scoring work?</span><br>
      <a @click="onClick">Background Information</a>
    </el-col>
  </el-row>
</template>

<script>
import EvalCircle from './EvalCircle'

export default {
  components: {
    'eval-circle': EvalCircle
  },
  methods: {
    onClick: function () {
      this.$emit('click')
    }
  }
}
</script>

<style>
  .legend-cont {
    border-bottom: 1px solid #BCBEBF;
    border-top: 1px solid #BCBEBF;
    padding-top: 15px;
    padding-bottom: 15px;
    font-size: 10px;
  }

  .eval-cont {
    display: flex;
    align-items: center;
  }

  .eval-cont svg {
    margin-right: 5px;
  }

  a {
    color: #6DC051;
    cursor: pointer;
  }
</style>
