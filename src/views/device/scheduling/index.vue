<template>
  <div style="height: calc(80vh + 4px); overflow: auto">
    <div class="title">
      <div><input id="title-btn-left" type="button" value="<" class="title-btn-hover" @click="lastMonthCalender()" />
      </div>
      <div class="show_year_month">
        <div>
          <label id="showMonth" style="font-weight: bold">{{ showMonth }}<span style="font-size:18px;font-weight: normal"> 月 </span></label>
        </div>
        <div>
          <label id="showYear">{{ showYear }}年{{ showMonth }}月排班表</label>
        </div>
      </div>
      <div><input id="title-btn-right" type="button" value=">" class="title-btn-hover" @click="nextMonthCalender()" /></div>
    </div>
    <div class="table">
      <div class="tableRow">
        <div class="tbTitle">周一</div>
        <div class="tbTitle">周二</div>
        <div class="tbTitle">周三</div>
        <div class="tbTitle">周四</div>
        <div class="tbTitle">周五</div>
        <div class="tbTitle">周六</div>
        <div class="tbTitle">周日</div>
      </div>
      <div v-for="(weekArr,r) in showMonthCalender" :key="'r_'+r" class="tableRow">
        <div v-for="(dayObj,c) in weekArr" :key="'c_'+r+'_'+c" :class="dayObj.cssClass" :style="{background:dayObj.dataTimeStr<todayStr?'rgba(166, 204, 173, 0.5)':''}" @click="toEdit(dayObj)">
          <div style="width:100%;height:96px;display:flex">
            <div class="left">
              <div class="day">{{ dayObj.day }}</div>
              <div v-if="dayObj.zjNum" class="count">值机:<span>{{ dayObj.zjNum }}</span></div>
              <div v-if="dayObj.jsNum" class="count">技术:<span>{{ dayObj.jsNum }}</span></div>
              <div v-if="dayObj.ex && dayObj.ex.length" class="text-line" style="background-color: rgba(0,200,200,0.05);">
                <div class="label" style="background-color: rgba(0,0,0,0.5);color: #CDC0B0">备</div>
                <div class="roll" :title="dayObj.ex">{{ dayObj.ex }}</div>
              </div>
            </div>
            <div v-if="dayObj.zjNum || dayObj.jsNum" class="right">
              <div v-if="dayObj.lb && dayObj.lb.length" class="text-line" style="background-color: rgba(200,0,0,0.05);">
                <div class="label" style="background-color: rgba(0,0,0,0.2);color: #434343">轮班</div>
                <div class="roll" :title="dayObj.lb">{{ dayObj.lb }}</div>
              </div>
              <div v-if="dayObj.bb && dayObj.bb.length" class="text-line" style="background-color: rgba(200,200,0,0.05);">
                <div class="label" style="background-color: rgba(0,0,0,0.4);color: #e3e3e3">白班</div>
                <div class="roll" :title="dayObj.bb">{{ dayObj.bb }}</div>
              </div>
              <div v-if="dayObj.yb && dayObj.yb.length" class="text-line" style="background-color: rgba(0,0,200,0.05);">
                <div class="label" style="background-color: rgba(0,0,0,0.6);color: #a3a3a3">夜班</div>
                <div class="roll" :title="dayObj.yb">{{ dayObj.yb }}</div>
              </div>
            </div>
            <div v-else class="right" style="text-align:center;padding-top:10px">当日无排班</div>
          </div>
        </div>
      </div>
    </div>
    <edit-page ref="editPage" />
  </div>
</template>

<script>
import editPage from './edit'

export default {
  components: { editPage },
  data() {
    return {
      // 底部输入框中的年月
      inputYear: '',
      inputMonth: '',
      // 一个月的日历
      showMonthCalender: [],
      // 头部中间的年月
      showMonth: '',
      showYear: '',
      todayStr: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      const now = new Date()
      this.todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`
      this.updateWebPage()
    })
  },
  methods: {
    toEdit(item) {
      this.$refs.editPage.loadData(item)
    },
    // 计算日期对应周几
    dateMapWeekDay(year, month, date) {
      const weekDay = new Date(year, month, date).getDay()
      return weekDay === 0 ? 7 : weekDay
    },
    // 一个月有多少天
    monthDays(year, month) {
      if (month < 0) { return new Date(year - 1, 12, 0).getDate() } else { return new Date(year, month + 1, 0).getDate() }
    },
    // 实际生成日历
    produceMonthCalender(lastMonthDays, curMonthDays, firstWeekOfDay, lastWeekDay, currentDay) {
      const createCalender = []
      // 上一个月显示几天
      let prev = firstWeekOfDay - 1
      // 从上个月的几号开始显示
      let prevDay = lastMonthDays - prev + 1
      // 下个月从1号开始显示
      let nextDay = 1
      let day = 1
      const month = Number(this.showMonth)
      const year = Number(this.showYear)
      for (let curRow = 0; curRow < 6; curRow++) {
        const weekTempArr = []
        for (let weekDay = 1; weekDay <= 7; weekDay++) {
          const dayObj = {}
          if (prev > 0) { // 显示上个月日期
            dayObj.cssClass = 'prev'
            dayObj.month = month - 1
            if (dayObj.month === 0) {
              dayObj.month = 12
              dayObj.year = year - 1
            } else {
              dayObj.year = year
            }
            dayObj.day = prevDay
            prev--
            prevDay++
          } else {
            // 显示当月日期
            if (day <= curMonthDays) {
              if (currentDay === day) {
                dayObj.cssClass = 'curDay'
              } else {
                dayObj.cssClass = ''
              }
              dayObj.day = day
              dayObj.month = month
              dayObj.year = year
              day++
            } else { // 显示下个月日期
              dayObj.cssClass = 'next'
              dayObj.month = month + 1
              if (dayObj.month === 13) {
                dayObj.month = 1
                dayObj.year = year + 1
              } else {
                dayObj.year = year
              }
              dayObj.day = nextDay
              nextDay++
            }
            if (weekDay >= 6) {
              dayObj.cssClass += ' weekend'
            }
          }
          dayObj.month = ('0' + dayObj.month).substr(-2)
          dayObj.day = ('0' + dayObj.day).substr(-2)
          dayObj.cssClass += ' tableCell'
          dayObj.dataTimeStr = `${dayObj.year}-${dayObj.month}-${dayObj.day}`
          weekTempArr.push(dayObj)
        }
        createCalender.push(weekTempArr)
      }

      this.$post({
        url: this.$urlPath.showClassesList,
        data: {
          startDate: createCalender[0][0].year + '-' + createCalender[0][0].month + '-' + createCalender[0][0].day,
          endDate: createCalender[5][6].year + '-' + createCalender[5][6].month + '-' + createCalender[5][6].day
        }
      }).then((res) => {
        const classesList = res.classesList || []
        for (let curRow = 0; curRow < 6; curRow++) {
          for (let weekDay = 0; weekDay < 7; weekDay++) {
            const dayObj = createCalender[curRow][weekDay]
            for (let i = 0; i < classesList.length; i++) {
              if (dayObj.dataTimeStr === classesList[i].datetime) {
                dayObj.lb = [classesList[i].operatorOne, classesList[i].operatorTwo, classesList[i].operatorThree].join(',')
                dayObj.bb = [classesList[i].operatorDay, classesList[i].technicianDay].join(',')
                dayObj.yb = classesList[i].technicianNight
                dayObj.ex = classesList[i].technicianReady
                dayObj.zjNum = 0
                if (classesList[i].operatorOne) {
                  dayObj.zjNum += classesList[i].operatorOne.split(',').length
                }
                if (classesList[i].operatorTwo) {
                  dayObj.zjNum += classesList[i].operatorTwo.split(',').length
                }
                if (classesList[i].operatorThree) {
                  dayObj.zjNum += classesList[i].operatorThree.split(',').length
                }
                if (classesList[i].operatorDay) {
                  dayObj.zjNum += classesList[i].operatorDay.split(',').length
                }
                dayObj.jsNum = 0
                if (classesList[i].technicianDay) {
                  dayObj.jsNum += classesList[i].technicianDay.split(',').length
                }
                if (classesList[i].technicianNight) {
                  dayObj.jsNum += classesList[i].technicianNight.split(',').length
                }
                if (classesList[i].technicianReady) {
                  dayObj.jsNum += classesList[i].technicianReady.split(',').length
                }
                dayObj.resData = classesList[i]
                break
              }
            }
          }
        }
        this.showMonthCalender = createCalender
      }).catch((error) => {
        this.$errorMsg(error || '接口调用失败，未知异常')
      })
    },
    // 生成指定年，月的日历
    monthCalender(year, month) {
      const lastMonthDays = this.monthDays(year, month - 1)
      const monthDays = this.monthDays(year, month)
      const weekOfDay = this.dateMapWeekDay(year, month, 1)
      const lastWeekDay = this.dateMapWeekDay(year, month, monthDays)
      // 如果是当前年月就标记今天
      let currentDay = -1
      const nowDate = new Date()
      if (year === nowDate.getFullYear() && month === nowDate.getMonth()) {
        currentDay = nowDate.getDate()
      }
      this.produceMonthCalender(lastMonthDays, monthDays, weekOfDay, lastWeekDay, currentDay)
    },
    // 生成上个月日历
    lastMonthCalender() {
      const curYear = Number(this.inputYear)
      const lastMonth = Number(this.inputMonth) - 1 - 1// -1是本月对应js中的月份===>实际是1月，在js中表示1月：0，再-1才是上一个月
      if (lastMonth >= 0) {
        this.updateWebPage(curYear, lastMonth + 1)
      } else {
        this.updateWebPage(curYear - 1, 12)
      }
    },
    // 生成下个月日历
    nextMonthCalender() {
      const curYear = Number(this.inputYear)
      const nextMonth = Number(this.inputMonth)// 已经是curMonth + 1
      if (nextMonth > 11) {
        this.updateWebPage(curYear + 1, 1)
      } else {
        this.updateWebPage(curYear, nextMonth + 1)
      }
    },
    // 更新页面的数据
    updateWebPage(year, month) {
      console.log(year, month)
      if (year === undefined || year === null) {
        year = new Date().getFullYear()
        month = new Date().getMonth() + 1
      }
      this.inputYear = year + ''
      this.inputMonth = ('0' + month).substr(-2)
      this.showYear = year + ''
      this.showMonth = ('0' + month).substr(-2)
      this.monthCalender(year, month - 1)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#title-btn-left, #title-btn-right {
  margin: 20px 0;
  padding: 0 15px;
  font-size: 40px;
  border: 0;
  background: rgb(251, 250, 250);
}

.show_year_month {
  /* margin: 10px 0px 10px 0px; */
  display: flex;
  flex-direction: column;
}

#showMonth {
  font-size: 52px;
  color: forestgreen;
}

#showYear {
  font-size: 16px;
  color: darkseagreen;
}

.title-btn-hover:hover, .title-btn-hover:active {
  cursor: pointer;
}

.title {
  width: 100%;
  padding: 0 15px 80px 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: rgb(250, 250, 250);
  text-align: center;
  font-size: 18px;
  height: 60px;
}

.cal {
  background: rgb(230, 224, 224);
  border: 1px;
  width: 30px;
  font-size: 20px;
  text-align: center;
  margin: 0;
  padding: 0;
}

.cal:hover {
  cursor: pointer;
}

.cal:active {
  cursor: default;
}

.inp {
  width: 100px;
  font-size: 20px;
  text-align: center;
  margin: 0;
  background: rgb(250, 250, 250);
  border-color: rgb(174, 177, 177);
  border: 1px;
}

.table {
  display: table;
  width: 100%;
  background: #fafafa;
  padding: 0 5px;
}

.tableRow {
  display: table-row;
  background-color: snow;
}

.tableCell {
  display: table-cell;
  border: 1px solid rgba(100, 100, 100, 0.1);
  width: 14%;
  background: rgba(169, 169, 169, 0.3);
  cursor: pointer;
  .left {
    width: 30%;
    text-align: center;
    .day {
      font-size: 36px;
      font-weight: bolder;
      padding-top: 10px;
    }
    .count {
      font-size: 12px;
      transform: scale(0.83);
      opacity: 0.7;
      span {
        font-weight: bold;
      }
    }
    .text-line {
      font-size: 12px;
      display: flex;
      justify-content: space-evenly;
      width: 100%;
      height: 15px;
      line-height: 15px;
      overflow: hidden;
      text-align: center;
      .label {
        padding: 0 1px;
      }
      .roll {
        padding: 0 1px;
        opacity: 0.8;
      }
      .roll:hover {
        background-color: rgba(0,0,0,0.3);
      }
    }
  }
  .right {
    width: 70%;
    font-size:12px;
    padding: 3px;
    .text-line {
      display: flex;
      width: 100%;
      height: 30px;
      line-height: 15px;
      overflow: hidden;
      .label {
        width: 20px;
        text-align: center;
      }
      .roll {
        width: 110px;
        padding: 0 5px;
        opacity: 0.8;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
      }
      .roll:hover {
        background-color: rgba(0,0,0,0.3);
      }
    }
  }
}
.tableCell:hover {
  color: rgb(255, 255, 255) !important;
  background: rgba(234, 153, 30, 0.5) !important;
  opacity: 1 !important;
}

.tbTitle {
  display: table-cell;
  border: 1px solid rgba(100, 100, 100, 0.1);
  text-align: center;
  background: #f4f4f5;
  height: 20px;
}

.planCell {
  background: rgba(166, 204, 173, 0.3)
}

.container {
  padding: 0;
  margin: 0;
  top: 40px;
  left: 40px;
  display: flex;
  width: 50%;
  box-shadow: 10px 10px 5px #935f5f;
}

.calender-footer {
  padding: 10px;
  margin: 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  /* justify-content: flex-end */
  justify-content: space-between;
  background: rgb(250, 250, 250);
}

.prev, .next {
  //color: rgb(120, 121, 120, 0.7);
  //background-color: rgb(234, 153, 30, 0.1);
  opacity: 0.4;
}

.curDay {
  background: rgba(166, 204, 173, 0.9);
  .left {
    color: green;
  }
}
.weekend {
  .day {
    color: rgba(139, 26, 26, 0.7) !important;
  }
}
.weekend:hover {
  .day {
    color: rgb(255, 255, 255) !important;
  }
}

.button-group {
  margin: 0;
  padding: 0;
  display: flex;
}

.cal-footer-time {
  font-size: 20px;
  text-align: start;
  font-family: sans-serif;
}
.fbListBox {
  width: 100%;
  height: 34px;
  padding-left: 10px;
  padding-right: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}
.fbListBox::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
