<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            prefix-icon="Search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="{ label: 'label', children: 'children' }"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="deptTreeRef"
            node-key="id"
            highlight-current
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--数据-->
      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryRef"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="教师姓名" prop="teacherName">
            <el-input
              v-model="queryParams.teacherName"
              placeholder="请输入教师姓名"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>

          <el-form-item label="所属年度" prop="annual">
            <el-select
              v-model="queryParams.annual"
              placeholder="请选择年度"
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="dict in pm_year"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['pm:patents:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar
            v-model:showSearch="showSearch"
            @queryTable="getList"
            :columns="columns"
          ></right-toolbar>
        </el-row>

        <el-table
          v-loading="loading"
          :data="list"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="selection" width="50" align="center" /> -->
          <el-table-column
            label="工号"
            align="center"
            key="teacherCode"
            prop="teacherCode"
            v-if="columns[0].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="姓名"
            align="center"
            key="teacherName"
            prop="teacherName"
            v-if="columns[1].visible"
          />
          <el-table-column label="工作量分值" align="center">
            <el-table-column
              label="教学工作量"
              align="center"
              key="teachingWork"
              prop="teachingWork"
              v-if="columns[2].visible"
              width="90"
            />
            <el-table-column
              label="教材出版"
              align="center"
              key="textbookPublication"
              prop="textbookPublication"
              v-if="columns[3].visible"
              width="80"
            />
            <el-table-column
              label="教研论文"
              align="center"
              key="educationThesis"
              prop="educationThesis"
              v-if="columns[4].visible"
              width="40"
            />
            <el-table-column
              label="本科生专利（著作权）授权"
              align="center"
              key="patent"
              prop="patent"
              v-if="columns[5].visible"
            />
            <el-table-column
              label="本科生参加学科竞赛获奖"
              align="center"
              key="academicCompetition"
              prop="academicCompetition"
              v-if="columns[6].visible"
            />
            <el-table-column
              label="本科生参加创新活动、技能竞赛获奖"
              align="center"
              key="innovationSkill"
              prop="innovationSkill"
              v-if="columns[7].visible"
            />
            <el-table-column
              label="本科生参加文艺、体育竞赛获奖"
              align="center"
              key="artSports"
              prop="artSports"
              v-if="columns[8].visible"
            />
            <el-table-column
              label="承办省级以上学科竞赛及获优秀组织奖"
              align="center"
              key="excellentOrganization"
              prop="excellentOrganization"
              v-if="columns[9].visible"
            />
          </el-table-column>
          <el-table-column
            label="总工作量"
            align="center"
            key="workload"
            prop="workload"
            v-if="columns[10].visible"
          />
           <el-table-column
            label="所属年度"
            align="center"
            key="annual"
            prop="annual"
          />
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.page"
          v-model:limit="queryParams.size"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <el-row>
      <br />
      <br />
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log" style="height: 556px">
          <template v-slot:header>
            <div class="clearfix">
              <span>绩效考核结果概览</span>
            </div>
          </template>
          <h3 style="font: 24px font-bold">选择年度</h3>
          <br />

          <el-select
            v-model="paras.annual"
            placeholder="请指定年度"
            clearable
            style="width: 160px"
            @change="annualChange"
          >
            <el-option
              v-for="dict in pm_year"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
          <el-button
            type="primary"
            icon="Search"
            @click="handleQuery2"
            style="margin-left: 20px"
            >搜索</el-button
          >
          <br />
          <br />

          <div class="head-container">
            <el-input
              v-model="deptName2"
              placeholder="请输入部门名称"
              clearable
              prefix-icon="Search"
              style="margin-bottom: 20px"
            />
          </div>
          <div class="head-container">
            <el-tree
              :data="deptOptions"
              :props="{ label: 'label', children: 'children' }"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="deptTreeRef"
              node-key="id"
              highlight-current
              default-expand-all
              @node-click="handleNodeClick2"
            />
          </div>
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
              <span>工作量完成情况分布图</span>
            </div>
          </template>
          <div
            ref="chart"
            style="width: 100%; height: 480px; margin: auto"
          ></div>
        </el-card>
      </el-col>
    </el-row>
    <br />
    <!-- <el-row :gutter="20">
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
    </el-row> -->
  </div>
</template>

<script setup name="User">
import * as echarts from "echarts";
const chart = ref();

import useUserStore from "@/store/modules/user";
import {
  getResult,
  listAnnualResult,
  findAnnualResult,
} from "@/api/performance/result";
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
  myChart.setOption({
    //此处为图表的数据
    title: {
      text: "工作量完成情况分布图",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "工作量分布",
        type: "pie",
        radius: "50%",
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
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        data: [
          { value: 356, name: "完成工作量低于80%的人数" },
          { value: 735, name: "完成工作量80%～90%的人数" },
          { value: 735, name: "完成工作量91%～99%的人数" },
          { value: 735, name: "完成工作量100%的人数" },
        ],
      },
    ],
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

import { getToken } from "@/utils/auth";
import { deptTreeSelect } from "@/api/system/user";
import {
  listPatents,
  getPatents,
  addPatents,
  updatePatents,
  examine,
  getLog,
  delPatents,
} from "@/api/performance/patents.js";
import { getCompetition } from "@/api/performance/academicCompetition.js";
import { get } from "@vueuse/core";

const router = useRouter();
const userSelect = proxy.useUsers();

const annual = undefined;
const deptId = undefined;
const list = ref([]);
const open = ref(false);
const logOpen = ref(false);
const logs = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const deptName = ref("");
const deptName2 = ref("");
const deptOptions = ref(undefined);
const initPassword = ref(undefined);
const postOptions = ref([]);
const roleOptions = ref([]);
const studentOptions = ref([]);
/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 年度
  annual: 0,
  // 设置上传的请求头部
  headers: { Authorization: getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/performance/patents/importData",
});
// 列显隐信息
const columns = ref([
  { key: 0, label: `学号`, visible: true },
  { key: 1, label: `学生姓名`, visible: true },
  { key: 2, label: `名称`, visible: true },
  { key: 3, label: `类型`, visible: true },
  { key: 4, label: `授权号`, visible: true },
  { key: 5, label: `获批时间`, visible: true },
  { key: 6, label: `第几发明人`, visible: true },
  { key: 7, label: `指导教师`, visible: true },
  { key: 8, label: `状态`, visible: true },
  { key: 9, label: `所属年度`, visible: true },
  { key: 10, label: `创建时间`, visible: true },
]);

const data = reactive({
  form: {},
  logForm: [{}],
  queryParams: {
    page: 1,
    size: 10,
    teacherName: undefined,
    annual: undefined,
    deptId: undefined,
  },
  paras: { annual: undefined, deptId: undefined },
  rules: {
    teacherName: [
      { required: true, message: "学生姓名不能为空", trigger: "blur" },
    ],
    teacherCode: [{ required: true, message: "学号不能为空", trigger: "blur" }],
    teacherName: [
      { required: true, message: "教师姓名不能为空", trigger: "blur" },
    ],
    teacherCode: [
      { required: true, message: "教师工号不能为空", trigger: "blur" },
    ],
    type: [{ required: true, message: "类别不能为空", trigger: "change" }],
    name: [{ required: true, message: "名称不能为空", trigger: "change" }],
    authorizationNum: [
      { required: true, message: "授权号不能为空", trigger: "change" },
    ],
    timeApproval: [
      { required: true, message: "获批时间不能为空", trigger: "change" },
    ],
    annual: [
      {
        required: true,
        message: "请选择年度",
        trigger: "change",
      },
    ],
  },
});

const { queryParams, form, paras, logForm, rules, statusOptions, typeOptions } =
  toRefs(data);

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watch(deptName, (val) => {
  proxy.$refs["deptTreeRef"].filter(val);
});
/** 查询部门下拉树结构 */
function getDeptTree() {
  deptTreeSelect().then((response) => {
    deptOptions.value = response.data;
  });
}
/** 查询明细列表 */
function getList() {
  loading.value = true;
  listAnnualResult(queryParams.value).then((res) => {
    loading.value = false;
    list.value = res.data;
    total.value = res.total;
  });
}
/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.deptId = data.id;
  handleQuery();
}
/** 节点单击事件 */
function handleNodeClick2(data) {
  paras.value.deptId = data.id;
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.page = 1;
  getList();
}
/** 搜索按钮操作 */
function handleQuery2() {
  findAnnualResult(paras.value).then((res) => {
    let myChart = echarts.init(chart.value);
    myChart.setOption({
      //此处为图表的数据
      title: {
        text: "工作量完成情况分布图",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "工作量分布",
          type: "pie",
          radius: "50%",
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
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          data: res.data,
        },
      ],
    });
  });
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  queryParams.value.deptId = undefined;
  proxy.$refs.deptTreeRef.setCurrentKey(null);
  handleQuery();
}
/** 删除按钮操作 */
function handleDelete(row) {
  const workIds = row.id || ids.value;
  proxy.$modal
    .confirm("是否确认删除数据项？")
    .then(function () {
      return delPatents(workIds);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "/performance/result/export",
    {
      ...queryParams.value,
    },
    `年度绩效考核统计表.xlsx`
  );
}
/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 导入按钮操作 */
function handleImport() {
  upload.title = "本科生专利（著作权）授权情况统计导入";
  upload.annual = pm_year.value[0].value;
  upload.open = true;
}
/** 下载模板操作 */
function importTemplate() {
  proxy.download(
    "/performance/patents/importTemplate",
    {},
    `本科生专利（著作权）授权情况上传模板.xlsx`
  );
}
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert(
    "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
      response.msg +
      "</div>",
    "导入结果",
    { dangerouslyUseHTMLString: true }
  );
  getList();
};
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
}
/** 重置操作表单 */
function reset() {
  form.value = {
    id: undefined,
    isbn: undefined,
    teacherName: undefined,
    teacherCode: undefined,
    name: undefined,
    type: undefined,
    authorizationNum: undefined,
    timeApproval: undefined,
    whichInventor: undefined,
    teacherName: undefined,
    teacherCode: undefined,
    status: 10,
    annual: undefined,
    workload: undefined,
  };
  proxy.resetForm("PatentsRef");
}
/** 重置操作表单 */
function resetLog() {
  logForm.value = [
    {
      id: undefined,
      showContent: undefined,
      timeExamine: undefined,
    },
  ];
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加本科生专利（著作权）授权情况";
  getCompetition().then((response) => {
    studentOptions.value = response.data.students;
  });
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value;
  getCompetition().then((response) => {
    studentOptions.value = response.data.students;
  });
  getPatents(id).then((response) => {
    form.value = response.data;
    postOptions.value = response.posts;
    roleOptions.value = response.roles;
    form.value.postIds = response.postIds;
    form.value.roleIds = response.roleIds;
    open.value = true;
    title.value = "修改本科生专利（著作权）授权情况";
    form.password = "";
  });
}
/** 审核通过按钮操作 */
function handleExamine(row) {
  var arr = [];
  if (row.id !== undefined) arr.push(row.id);
  const workIds = arr.length <= 0 ? ids.value : arr;
  proxy.$modal
    .confirm("是否确认审核通过选中的数据项？")
    .then(function () {
      return examine(workIds, 10);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("操作成功");
    })
    .catch(() => {});
}
/** 审核驳回按钮操作 */
function handleReject(row) {
  var arr = [];
  if (row.id !== undefined) arr.push(row.id);
  const workIds = arr.length <= 0 ? ids.value : arr;
  proxy.$modal
    .confirm("是否确认驳回选中的数据项？")
    .then(function () {
      return examine(workIds, 20);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("操作成功");
    })
    .catch(() => {});
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["PatentsRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        updatePatents(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPatents(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
function annualChange(annual) {
  paras.annual = annual;
}
getDeptTree();
getList();
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

