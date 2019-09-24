<template>
  <div>
    <div class="dashboard-editor-container">
      <div class="panel-group">
        <div class="card-panel-col">
          <div class="card-panel-icon-wrapper">
            <svg
              data-v-c8a70580
              data-v-48c369af
              aria-hidden="true"
              style="color: #40c9c6;"
              class="svg-icon"
            >
              <use data-v-c8a70580 xlink:href="#icon-peoples" />
            </svg>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">用户量</div>
            <div class="card-panel-num">{{userTotal | numeral("0,0")}}</div>
          </div>
        </div>
        <div class="card-panel-col">
          <div class="card-panel-icon-wrapper">
            <svg
              style="color: #36a3f7;"
              class="svg-icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1340"
            >
              <path
                d="M864.711111 1024H159.288889c-38.684444 0-68.266667-29.582222-68.266667-68.266667V204.8c0-38.684444 29.582222-68.266667 68.266667-68.266667h163.84v45.511111H159.288889c-13.653333 0-22.755556 9.102222-22.755556 22.755556v750.933333c0 13.653333 9.102222 22.755556 22.755556 22.755556h705.422222c13.653333 0 22.755556-9.102222 22.755556-22.755556V204.8c0-13.653333-9.102222-22.755556-22.755556-22.755556h-154.737778V136.533333H864.711111c38.684444 0 68.266667 29.582222 68.266667 68.266667v750.933333c0 38.684444-29.582222 68.266667-68.266667 68.266667z"
                p-id="1341"
              />
              <path
                d="M659.911111 273.066667H364.088889c-38.684444 0-68.266667-29.582222-68.266667-68.266667V136.533333c0-38.684444 29.582222-68.266667 68.266667-68.266666h22.755555c0-38.684444 29.582222-68.266667 68.266667-68.266667h113.777778c38.684444 0 68.266667 29.582222 68.266667 68.266667h22.755555c38.684444 0 68.266667 29.582222 68.266667 68.266666v68.266667c0 38.684444-29.582222 68.266667-68.266667 68.266667zM364.088889 113.777778c-13.653333 0-22.755556 9.102222-22.755556 22.755555v68.266667c0 13.653333 9.102222 22.755556 22.755556 22.755556h295.822222c13.653333 0 22.755556-9.102222 22.755556-22.755556V136.533333c0-13.653333-9.102222-22.755556-22.755556-22.755555h-68.266667V68.266667c0-13.653333-9.102222-22.755556-22.755555-22.755556h-113.777778c-13.653333 0-22.755556 9.102222-22.755555 22.755556v45.511111h-68.266667zM341.333333 455.111111h364.088889c13.653333 0 22.755556 9.102222 22.755556 22.755556s-9.102222 22.755556-22.755556 22.755555H341.333333c-13.653333 0-22.755556-9.102222-22.755555-22.755555s9.102222-22.755556 22.755555-22.755556z m0 159.288889h204.8c13.653333 0 22.755556 9.102222 22.755556 22.755556s-9.102222 22.755556-22.755556 22.755555h-204.8c-13.653333 0-22.755556-9.102222-22.755555-22.755555s9.102222-22.755556 22.755555-22.755556z"
                p-id="1342"
              />
            </svg>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">订单量</div>
            <div class="card-panel-num">{{orderTotal | numeral("0,0")}}</div>
          </div>
        </div>
        <div class="card-panel-col">
          <div class="card-panel-icon-wrapper">
            <svg
              data-v-c8a70580
              data-v-48c369af
              aria-hidden="true"
              style="color: #f4516c;"
              class="svg-icon"
            >
              <use data-v-c8a70580 xlink:href="#icon-money" />
            </svg>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">收购</div>
            <div class="card-panel-num">{{total | numeral}}</div>
          </div>
        </div>
        <div class="card-panel-col">
          <div class="card-panel-icon-wrapper">
            <svg
              data-v-c8a70580
              data-v-48c369af
              aria-hidden="true"
              style="color: #34bfa3;"
              class="svg-icon"
            >
              <use data-v-c8a70580 xlink:href="#icon-shopping" />
            </svg>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">出售</div>
            <div class="card-panel-num"></div>
          </div>
        </div>
      </div>
      <div class="content">
        <p class="prompt_p">一周数据图</p>
        <div class="seven_echarts" id="seven"></div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { constants } from "crypto";
import { async } from "q";
import { write } from "fs";
const ORDERURL = "/manage/order/";
const USERURL = "/manage/user?name=";
// vue文件中引入echarts工具
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/line");
// 以下的组件按需引入
require("echarts/lib/component/tooltip"); // tooltip组件
require("echarts/lib/component/title"); //  title组件
require("echarts/lib/component/legend"); // legend组件

function doHandleMonth(month) {
  var m = month;
  if (month.toString().length == 1) {
    m = "0" + month;
  }
  return m;
}

function getDay(day) {
  var today = new Date();
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetday_milliseconds); //注意，这行是关键代码

  var tYear = today.getFullYear();
  var tMonth = today.getMonth();
  var tDate = today.getDate();
  tMonth = doHandleMonth(tMonth + 1);
  tDate = doHandleMonth(tDate);
  return tYear + "-" + tMonth + "-" + tDate;
}

export default {
  name: "chart",
  data() {
    return {
      usersLoginDate: [],
      total: null,
      loginUsers: [],
      userTotal: null,
      orderTotal: null,
      seven_chart: null,
      month_chart: null,
      timeDate: [
        getDay(-6),
        getDay(-5),
        getDay(-4),
        getDay(-3),
        getDay(-2),
        getDay(-1),
        getDay(0)
      ],
      seven_option: {
        title: {
          // text: '未来一周气温变化',//感觉头部有点乱，没使用自带的标题
          // subtext: '纯属虚构'
          x: "left",
          align: "center"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: []
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            magicType: { type: ["line", "bar"] }, //柱状图和西和折线图切换
            restore: {}, //刷新
            saveAsImage: {} //将图表以折线图的形式展现
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: []
        },
        yAxis: {
          name: "",
          nameLocation: "",
          type: "value",
          axisLabel: {
            formatter: "{value} "
          }
        },
        series: [
          {
            name: "",
            type: "line",
            data: [],
            lineStyle: {
              //设置折线色颜色
              color: "red"
            },
            itemStyle: {
              //设置折线折点的颜色
              normal: {
                color: "red"
              }
            }
          },
          {
            name: "",
            type: "line",
            data: [],

            areaStyle: {},
            lineStyle: {
              //设置折线色颜色
              color: "#3f89ec"
            },
            itemStyle: {
              //设置折线折点的颜色
              normal: {
                color: "#3f89ec"
              }
            }
          }
        ]
      }
    };
  },
  mounted: function() {
    this.$http
      .get("/manage/user/create/statistic")
      .then(res => {
        this.usersLoginDate = res.data.data;
        let count = [];
        this.timeDate.forEach(d =>
          count.push(
            this.usersLoginDate.filter(
              u => moment(u.date).format("YYYY-MM-DD") === d
            )
          )
        );
        count.map(c =>
          c.length
            ? c.forEach(b => this.loginUsers.push(b.count))
            : this.loginUsers.push(c.length)
        );
        this.seven_option.legend.data = ["预计新增用户", "实际新增用户"];
        this.seven_option.xAxis.data = this.timeDate;
        this.seven_option.series[0].name = "预计新增用户";
        this.seven_option.series[0].data = [0, 1, 2, 2, 3, 4, 6];
        this.seven_option.series[1].name = "实际新增用户";
        this.seven_option.series[1].data = this.loginUsers;
        this.get_echarts();
      })
      .catch(response => {
        console.info(response);
      });
  },
  methods: {
    get_echarts: function() {
      this.seven_chart = this.echarts.init(document.getElementById("seven"));
      // 把配置和数据放这里
      this.seven_chart.setOption(this.seven_option);
    }
  },
  beforeDestroy() {
    if (!this.seven_chart) {
      return;
    }
    this.seven_chart.dispose();
    this.seven_chart = null;
  },
  async created() {
    await this.$http
      .get(ORDERURL+"?page="+1+"&pageSize="+5)
      .then(res => {
        this.orderTotal = res.data.data.total;
      })
      .catch(err => {
        console.error(err);
      });
    await this.$http
      .get(USERURL+"&page="+1+"&pageSize="+5)
      .then(res => {
        this.userTotal = res.data.data.total;
      })
      .catch(response => {
        console.info(response);
      });
    await this.$http
      .get("/manage/order/date")
      .then(res => {
        res.data.data.forEach(b => {
          this.total += b.total;
        });
      })
      .catch(response => {
        console.info(response);
      });
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/scss/chart.scss';
</style>