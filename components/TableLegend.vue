<template>
  <el-row class="legend-cont">
    <el-col :xs="24" :sm="20">
      <el-row>
        <el-col :span="6">
          <div class="eval-cont">
            <eval-circle value="3"></eval-circle>
            <span class="eval-label">{{$t('Evaluation.Good')}}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="eval-cont">
            <eval-circle value="2"></eval-circle>
            <span class="eval-label">{{$t('Evaluation.Mediocre')}}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="eval-cont">
            <eval-circle value="1"></eval-circle>
            <span class="eval-label">{{$t('Evaluation.NotGood')}}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="eval-cont">
            <eval-circle value="0"></eval-circle>
            <span class="eval-label">{{$t('Evaluation.Unknown')}}</span>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <el-col :xs="24" :sm="4">
      <el-row>
        <el-col>
          <div class="bginfo-wrapper">
            <span>{{$t('Questions.Scoring')}}</span><br>
            <a :href="$t('background-link-url')">{{$t('Buttons.BackgroundInformation')}}</a>
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    onClick: function() {
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

  .bginfo-wrapper {
    margin-top: 0px;
    text-align: center;
  }

  @media screen and (max-width: 448px) {
    .eval-cont {
      flex-direction: column;
    }

    .eval-cont svg {
      margin-bottom: 5px;
    }

    .bginfo-wrapper {
      margin-top: 10px;
    }
  }

  @media screen and (min-width: 448px) {
    .eval-cont {
      flex-direction: row;
      justify-content: center;
    }

    .eval-cont svg {
      margin-right: 5px;
    }
  }

  @media screen and (min-width: 448px) and (max-width: 768px) {
    .bginfo-wrapper {
      margin-top: 10px;
    }
  }

  @media screen and (min-width: 768px) {
    .bginfo-wrapper {
      margin-top: 0px;
    }
  }

  a {
    color: #6DC051;
    cursor: pointer;
  }
</style>
