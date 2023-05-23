<template>
  <div class="app-container home">
    <!-- <el-row :gutter="20">
      <el-col :sm="24" :lg="24">
        <blockquote class="text-warning" style="font-size: 14px">
          领取阿里云通用云产品1888优惠券
          <br />
          <el-link
            href="https://www.aliyun.com/minisite/goods?userCode=brki8iof"
            type="primary"
            target="_blank"
            >https://www.aliyun.com/minisite/goods?userCode=brki8iof</el-link
          >
          <br />
          领取腾讯云通用云产品2860优惠券
          <br />
          <el-link
            href="https://cloud.tencent.com/redirect.php?redirect=1025&cps_key=198c8df2ed259157187173bc7f4f32fd&from=console"
            type="primary"
            target="_blank"
            >https://cloud.tencent.com/redirect.php?redirect=1025&cps_key=198c8df2ed259157187173bc7f4f32fd&from=console</el-link
          >
          <br />
          阿里云服务器折扣区
          <el-link href="http://aly.ruoyi.vip" type="primary" target="_blank"
            >>☛☛点我进入☚☚</el-link
          >
          &nbsp;&nbsp;&nbsp; 腾讯云服务器秒杀区
          <el-link href="http://txy.ruoyi.vip" type="primary" target="_blank"
            >>☛☛点我进入☚☚</el-link
          ><br />
          <h4 class="text-danger">
            云产品通用红包，可叠加官网常规优惠使用。(仅限新用户)
          </h4>
        </blockquote>

        <hr />
      </el-col>
    </el-row> -->
    <!-- <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>后台管理框架</h2>
        <p>
          一直想做一款后台管理系统，看了很多优秀的开源项目但是发现没有合适自己的。于是利用空闲休息时间开始自己写一套后台系统。如此有了FZU绩效管理系统，她可以用于所有的Web应用程序，如网站管理后台，网站会员中心，CMS，CRM，OA等等，当然，您也可以对她进行深度定制，以做出更强系统。所有前端后台代码封装过后十分精简易上手，出错概率低。同时支持移动客户端访问。系统会陆续更新一些实用功能。
        </p>
        <p>
          <b>当前版本:</b> <span>v{{ version }}</span>
        </p>
        <p>
          <el-tag type="danger">&yen;免费开源</el-tag>
        </p> -->
    <!-- <p>
          <el-button
            type="primary"
            icon="Cloudy"
            plain
            @click="goTarget('https://gitee.com/y_project/RuoYi-Vue')"
            >访问码云</el-button
          >
          <el-button
            icon="HomeFilled"
            plain
            @click="goTarget('http://ruoyi.vip')"
            >访问主页</el-button
          >
        </p> -->
    <!-- </el-col> -->

    <!-- <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>技术选型</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <h4>后端技术</h4>
            <ul>
              <li>SpringBoot</li>
              <li>Spring Security</li>
              <li>JWT</li>
              <li>MyBatis</li>
              <li>Druid</li>
              <li>Fastjson</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>前端技术</h4>
            <ul>
              <li>Vue</li>
              <li>Vuex</li>
              <li>Element-ui</li>
              <li>Axios</li>
              <li>Sass</li>
              <li>Quill</li>
              <li>...</li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row> -->
    <!-- <el-divider /> -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log" style="height: 557px">
          <template v-slot:header>
            <div class="clearfix">
              <span>绩效考核结果概览</span>
            </div>
          </template>
          <h3 style="font: 24px font-bold">选择年度</h3>
          <br />

          <el-select
            v-model="result.annual"
            placeholder="请指定年度"
            clearable
            style="width: 160px"
            @change="Search"
          >
            <el-option
              v-for="dict in pm_year"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
          <br />

          <br />
          <h3 style="font: 24px font-bold">绩效数据页</h3>
          <p>绩效数据概览</p>
          <br />

          <h3 style="font: 24px font-bold">
            <CountTo :startVal="0" :endVal="result.workload" :duration="2000" />
          </h3>
          <p>年度总工作量</p>
          <br />
          <h3 style="font: 24px font-bold">
            <CountTo
              prefix="$"
              :startVal="0"
              :endVal="result.sum"
              :duration="2000"
            />
          </h3>
          <p>绩效奖励金额</p>
          <br />

          <!-- <el-collapse accordion>
            <el-collapse-item title="2020-08-13 工作量分值+100">
              <ol>
                <li>表格工具栏右侧添加刷新&显隐查询组件</li>
                <li>后端支持CORS跨域请求</li>
                <li>代码生成支持选择上级菜单</li>
                <li>代码生成支持自定义路径</li>
                <li>代码生成支持复选框</li>
                <li>Excel导出导入支持dictType字典类型</li>
                <li>Excel支持分割字符串组内容</li>
                <li>验证码类型支持（数组计算、字符验证）</li>
                <li>升级vue-cli版本到4.4.4</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="2020-04-24 工作量分值+100">
              <ol>
                <li>若依前后端分离系统正式发布</li>
              </ol>
            </el-collapse-item>
          </el-collapse> -->
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12" :lg="16">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>工作量分布图</span>
            </div>
          </template>
          <div
            ref="chart"
            style="width: 100%; height: 480px; margin: auto"
          ></div>
        </el-card>
      </el-col>

      <!-- <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>捐赠支持</span>
            </div>
          </template>
          <div class="body">
            <img
              src="https://oscimg.oschina.net/oscnet/up-d6695f82666e5018f715c41cb7ee60d3b73.png"
              alt="donate"
              style="width: 100%"
            />
            <span style="display: inline-block; height: 30px; line-height: 30px"
              >你可以请作者喝杯咖啡表示鼓励</span
            >
          </div>
        </el-card>
      </el-col> -->
    </el-row>
    <br />
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="36" :lg="24">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>历年数据（工作量分值）</span>
            </div>
          </template>

          <div
            ref="chart1"
            style="width: 100%; height: 480px; margin: auto"
          ></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="User">
import * as echarts from "echarts";
const chart = ref();
const chart1 = ref();

import useUserStore from "@/store/modules/user";
import { getResult, getHistory } from "@/api/performance/result";
import { CountTo } from "vue3-count-to";
const userStore = useUserStore();

const { proxy } = getCurrentInstance();
const { sys_normal_disable, sys_user_sex, pm_year } = proxy.useDict(
  "sys_normal_disable",
  "sys_user_sex",
  "pm_year"
);

/*** 用户导入参数 */
const result = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  annual: undefined,
  workload: 1000,
  sum: 1000,
  // 上传的地址
  url:
    import.meta.env.VITE_APP_BASE_API + "/performance/teachingWork/importData",
});

onMounted(() => {
  console.log("我创建了");
  let myChart = echarts.init(chart.value);
  let myChart1 = echarts.init(chart1.value);
  myChart.setOption({
    //此处为图表的数据
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "1%",
      left: "center",
    },
    series: [
      {
        name: "工作量分布",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "教学工作量" },
          { value: 735, name: "教材出版" },
          { value: 580.2, name: "教研论文" },
          { value: 484, name: "本科生专利（著作权）授权" },
          { value: 300, name: "本科生参加学科竞赛获奖" },
          { value: 300, name: "本科生参加创新活动、技能竞赛获奖" },
          { value: 300, name: "本科生参加文艺、体育竞赛获奖" },
          { value: 300, name: "承办省级以上学科竞赛及获优秀组织奖" },
        ],
      },
    ],
  });
  getHistory().then((res) => {
    myChart1.setOption({
      //此处为图表的数据
      xAxis: {
        type: "category",
        data: res.data.xAxis,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: res.data.values,
          type: "line",
        },
      ],
    });
  });

  window.onresize = function () {
    myChart.resize();
  };
});

const version = ref("3.8.5");

function goTarget(url) {
  window.open(url, "__blank");
}

function Search(annual) {
  if (annual !== undefined && annual !== "") {
    getResult(annual).then((res) => {
      let myChart = echarts.init(chart.value);
      myChart.setOption({
        //此处为图表的数据
        tooltip: {
          trigger: "item",
        },
        legend: {
          bottom: "1%",
          left: "center",
        },
        series: [
          {
            name: "工作量分布",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: res.data.results,
          },
        ],
      });

      result.workload = res.data.workloadSum;
      result.sum = res.data.prize;
    });
  }
}
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  h3 {
    // margin:10px 0px 0px 0px ;
    margin: 0px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

