<template>
  <el-row :gutter="10" type="flex" align="middle" class="legend-container">
    <el-col :xs="8" :sm="5">
      <div class="test">
        <eval-circle value="3"></eval-circle><span>Good</span>
      </div>
    </el-col>
    <el-col :xs="8" :sm="5" class="test">
      <div class="test">
        <eval-circle value="2"></eval-circle><span>Mediocre</span>
      </div>
    </el-col>
    <el-col :xs="8" :sm="5" class="test">
      <div class="test">
        <eval-circle value="1"></eval-circle><span>Not Good</span>
      </div>
    </el-col>
    <el-col :xs="24" :sm="8">
      <span>How does the scoring work?</span><br>
      <a>Background Information</a>
    </el-col>
  </el-row>
</template>

<script>
import EvalCircle from './EvalCircle'

export default {
  components: {
    'eval-circle': EvalCircle
  }
}
</script>

<style>
  .legend-container {
    border-bottom: 1px solid #BCBEBF;
    border-top: 1px solid #BCBEBF;
    padding-top: 20px;
    padding-bottom: 20px;
    font-size: 12px;
  }

  .test {
    display: flex;
    align-items: center;
  }

  .test svg {
    margin-right: 5px;
  }

  a {
    color: #6DC051;
    cursor: pointer;
  }
</style>
