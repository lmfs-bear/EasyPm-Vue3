<template>
  <div class="app-container">
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
      <!--用户数据-->
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
          <el-form-item label="所属学年" prop="schoolYear">
            <el-select
              v-model="queryParams.schoolYear"
              placeholder="请选择学年"
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="dict in pm_school_year"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="审核状态"
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="(item, index) in statusOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程名称" prop="courseName">
            <el-input
              v-model="queryParams.courseName"
              placeholder="请输入课程名称"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="创建时间" style="width: 308px">
            <el-date-picker
              v-model="dateRange"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
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
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['pm:workload:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['pm:workload:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['pm:workload:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="document-checked"
              :disabled="multiple"
              @click="handleExamine"
              v-hasPermi="['pm:workload:examine']"
              >审核通过</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="document-delete"
              :disabled="multiple"
              @click="handleReject"
              v-hasPermi="['pm:workload:examine']"
              >审核不通过</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="Upload"
              @click="handleImport"
              v-hasPermi="['pm:workload:import']"
              >导入</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['pm:workload:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar
            v-model:showSearch="showSearch"
            @queryTable="getWorkList"
            :columns="columns"
          ></right-toolbar>
        </el-row>

        <el-table
          v-loading="loading"
          :data="workList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            label="姓名"
            align="center"
            key="teacherName"
            prop="teacherName"
            v-if="columns[0].visible"
            :show-overflow-tooltip="true"
          />
            <el-table-column
            label="工号"
            align="center"
            key="teacherCode"
            prop="teacherCode"
            v-if="true"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="课程名称"
            align="center"
            key="courseName"
            prop="courseName"
            v-if="columns[1].visible"
            width="160"
          />
          <el-table-column
            label="课程类型"
            align="center"
            key="type"
            prop="type"
            v-if="columns[2].visible"
            :show-overflow-tooltip="false"
          >
            <template #default="scope">
              <span v-if="scope.row.type === 10">本科课程</span>
              <span v-else-if="scope.row.type === 20">专业必修</span>
              <span v-else-if="scope.row.type === 30">专业选修</span>
              <span v-else-if="scope.row.type === 40">实践必修</span>
              <span v-else-if="scope.row.type === 50">专业实习</span>
              <span v-else-if="scope.row.type === 60">毕业实习与毕设</span>
              <span v-else-if="scope.row.type === 70">企业实践考核答辩</span>
              <span v-else-if="scope.row.type === 80">专业实习答辩</span>
              <span v-else-if="scope.row.type === 90">班主任</span>
              <span v-else-if="scope.row.type === 100">企业实践</span>
              <span v-else-if="scope.row.type === 110">研一指导</span>
              <span v-else-if="scope.row.type === 120">研二指导</span>
              <span v-else-if="scope.row.type === 130">研三指导</span>
              <span v-else>未知类型</span>
            </template>
          </el-table-column>
          <el-table-column
            label="理论学时"
            align="center"
            key="theoreticalHours"
            prop="theoreticalHours"
            v-if="columns[3].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="实验学时"
            align="center"
            key="experimentalHours"
            prop="experimentalHours"
            v-if="columns[4].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="总人数"
            align="center"
            key="studentNum"
            prop="studentNum"
            v-if="columns[5].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="净工作量"
            align="center"
            key="netWorkload"
            prop="netWorkload"
            v-if="columns[6].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="工作量"
            align="center"
            key="workload"
            prop="workload"
            v-if="columns[7].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="状态"
            align="center"
            key="status"
            prop="status"
            v-if="columns[8].visible"
          >
            <template #default="scope">
              <span v-if="scope.row.status === 10">未提交审核</span>
              <span v-else-if="scope.row.status === 20">已提交审核</span>
              <span v-else-if="scope.row.status === 30">待系主任审核</span>
              <span v-else-if="scope.row.status === 40">待教学办审核</span>
              <span v-else-if="scope.row.status === 50">审核通过✔</span>
              <span v-else-if="scope.row.status === 60">审核驳回✖</span>
              <span v-else>未知状态</span>
            </template>
          </el-table-column>
          <el-table-column
            label="所属学年"
            align="center"
            key="schoolYear"
            prop="schoolYear"
            v-if="columns[9].visible"
            :show-overflow-tooltip="false"
          >
            <template #default="scope">
              <span
                >{{ scope.row.schoolYear }}-{{
                  parseInt(scope.row.schoolYear) + 1
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            align="center"
            prop="timeCreate"
            v-if="columns[10].visible"
            width="160"
          >
            <template #default="scope">
              <span>{{ parseTime(scope.row.timeCreate) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template #default="scope">
              <el-tooltip content="编辑" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['pm:workload:edit']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="审核详情" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="View"
                  @click="handleView(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="审核通过" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="document-checked"
                  @click="handleExamine(scope.row)"
                  v-hasPermi="['pm:workload:examine']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="审核不通过" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="document-delete"
                  @click="handleReject(scope.row)"
                  v-hasPermi="['pm:workload:examine']"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                content="删除"
                placement="top"
                v-if="scope.row.userId !== 1"
              >
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['pm:workload:remove']"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.page"
          v-model:limit="queryParams.size"
          @pagination="getWorkList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改教学工作量配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form
        :model="form"
        :rules="rules"
        ref="teachingWorkRef"
        label-width="80px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="教师姓名" prop="teacherName">
              <el-select
                v-model="form.teacherName"
                @change="selectChangeParent"
                placeholder="请选择作者工号:姓名"
                filterable
                :disabled="!(form.id == undefined)"
              >
                <el-option
                  v-for="(user, index) in userSelect"
                  :key="index"
                  :label="`${user.userName}:${user.name}`"
                  :value="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教师工号" prop="teacherCode">
              <el-select
                v-model="form.teacherCode"
                @change="selectChangeParent"
                placeholder="请选择作者工号"
                filterable
                :disabled="!(form.id == undefined)"
              >
                <el-option
                  v-for="(user, index) in userSelect"
                  :key="index"
                  :label="`${user.userName}`"
                  :value="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="所属学年" prop="schoolYear">
              <el-select v-model="form.schoolYear" placeholder="请选择">
                <el-option
                  v-for="dict in pm_school_year"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程类型" prop="type">
              <el-select
                v-model="form.type"
                placeholder="请选择课程类型"
                filterable
              >
                <el-option
                  v-for="(item, index) in typeOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="课程名称" prop="courseName">
              <el-input
                v-model="form.courseName"
                placeholder="请输入课程名称"
                maxlength="60"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="理论学时" prop="theoreticalHours">
              <el-input-number
                v-model="form.theoreticalHours"
                placeholder="请输入理论学时"
                controls-position="right"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实验学时" prop="experimentalHours">
              <el-input-number
                v-model="form.experimentalHours"
                placeholder="请输入实验学时"
                controls-position="right"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="总人数" prop="studentNum">
              <el-input-number
                v-model="form.studentNum"
                placeholder="请输入总人数"
                controls-position="right"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="净工作量" prop="netWorkload">
              <el-input-number
                v-model="form.netWorkload"
                placeholder="为空则系统自动计算"
                controls-position="right"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="工作量" prop="workload">
              <el-input-number
                v-model="form.workload"
                placeholder="为空则系统自动计算"
                controls-position="right"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-select v-model="form.status" placeholder="请选择">
                <el-option
                  v-for="(item, index) in statusOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      v-model="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?schoolYear=' + upload.schoolYear"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <!-- <el-checkbox
                v-model="upload.updateSupport"
              />是否更新已经存在的数据 -->
              <el-select
                v-model="upload.schoolYear"
                placeholder="请指定学年（默认为当前学年）"
                clearable
                style="width: 240px"
              >
                <el-option
                  v-for="dict in pm_school_year"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </div>
            <div>
              <br />
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <!-- <div>
              <span> 请指定sheet名称以标识学年 示例：2022-2023</span>
            </div> -->
            <el-link
              type="primary"
              :underline="false"
              style="font-size: 14px; vertical-align: baseline"
              @click="importTemplate"
              >下载模板</el-link
            >
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 审核日志详细 -->
    <el-dialog title="审核详情" v-model="logOpen" width="700px" append-to-body>
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in logs"
          :key="index"
          :timestamp="parseTime(item.timeExamine)"
        >
          {{ item.showContent }}
        </el-timeline-item>
      </el-timeline>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="logOpen = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Workload">
import { getToken } from "@/utils/auth";
import {
  changeUserStatus,
  listUser,
  resetUserPwd,
  delUser,
  getUser,
  updateUser,
  addUser,
  deptTreeSelect,
} from "@/api/system/user";
import {
  listTeachingWork,
  getTeachingWork,
  addTeachingWork,
  updateTeachingWork,
  examine,
  delTeachingWork,
  getLog,
} from "@/api/performance/teachingWork";
import { get } from "@vueuse/core";

const router = useRouter();
const { proxy } = getCurrentInstance();
const userSelect = proxy.useUsers();
const { sys_normal_disable, sys_user_sex, pm_school_year } = proxy.useDict(
  "sys_normal_disable",
  "sys_user_sex",
  "pm_school_year"
);

const userList = ref([]);
const logs = ref([]);
const workList = ref([]);
const open = ref(false);
const logOpen = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const deptName = ref("");
const deptOptions = ref(undefined);
const initPassword = ref(undefined);
const postOptions = ref([]);
const roleOptions = ref([]);
/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  schoolYear: 2022,
  // 设置上传的请求头部
  headers: { Authorization: getToken() },
  // 上传的地址
  url:
    import.meta.env.VITE_APP_BASE_API + "/performance/teachingWork/importData",
});
// 列显隐信息
const columns = ref([
  { key: 0, label: `姓名`, visible: true },
  { key: 1, label: `课程名称`, visible: true },
  { key: 2, label: `课程类型`, visible: true },
  { key: 3, label: `理论学时`, visible: true },
  { key: 4, label: `实验学时`, visible: true },
  { key: 5, label: `总人数`, visible: true },
  { key: 6, label: `净工作量`, visible: true },
  { key: 7, label: `工作量`, visible: true },
  { key: 8, label: `状态`, visible: true },
  { key: 9, label: `所属学年`, visible: true },
  { key: 10, label: `创建时间`, visible: true },
]);

const data = reactive({
  form: {},
  logForm: [{}],
  queryParams: {
    page: 1,
    size: 10,
    teacherName: undefined,
    schoolYear: undefined,
    status: undefined,
    deptId: undefined,
  },
  rules: {
    teacherName: [
      { required: true, message: "教师姓名不能为空", trigger: "blur" },
    ],
    teacherCode: [
      { required: true, message: "教师工号不能为空", trigger: "blur" },
    ],
    type: [{ required: true, message: "课程类型不能为空", trigger: "blur" }],
    courseName: [
      { required: true, message: "课程名称不能为空", trigger: "blur" },
    ],
    schoolYear: [
      {
        required: true,
        message: "请选择学年",
        trigger: "change",
      },
    ],
    status: [
      {
        required: true,
        message: "请选择状态",
        trigger: "change",
      },
    ],
  },
  statusOptions: [
    {
      label: "未提交审核",
      value: 10,
    },
    {
      label: "待系主任审核",
      value: 30,
    },
    {
      label: "待教学办审核",
      value: 40,
    },
    {
      label: "审核通过",
      value: 50,
    },
    {
      label: "审核驳回",
      value: 60,
    },
  ],
  typeOptions: [
    {
      label: "本科课程",
      value: 10,
    },
    // {
    //   label: "专业必修",
    //   value: 20,
    // },
    // {
    //   label: "专业选修",
    //   value: 30,
    // },
    // {
    //   label: "实践必修",
    //   value: 40,
    // },
    {
      label: "专业实习",
      value: 50,
    },
    {
      label: "毕业实习与毕设",
      value: 60,
    },
    {
      label: "企业实践考核答辩",
      value: 70,
    },
    {
      label: "专业实习答辩",
      value: 80,
    },
    {
      label: "班主任",
      value: 90,
    },
    {
      label: "企业实践",
      value: 100,
    },
    {
      label: "研一指导",
      value: 110,
    },
    {
      label: "研二指导",
      value: 120,
    },
    {
      label: "研三指导",
      value: 130,
    },
  ],
});

const { queryParams, form, logForm, rules, statusOptions, typeOptions } =
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
/** 查询工作量明细列表 */
function getWorkList() {
  loading.value = true;
  listTeachingWork(proxy.addDateRange(queryParams.value, dateRange.value)).then(
    (res) => {
      loading.value = false;
      workList.value = res.data;
      total.value = res.total;
    }
  );
}
/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.deptId = data.id;
  handleQuery();
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.page = 1;
  getWorkList();
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
      return delTeachingWork(workIds);
    })
    .then(() => {
      getWorkList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "/performance/teachingWork/export",
    {
      ...queryParams.value,
    },
    `教学工作量明细版.xlsx`
  );
}
/** 更多操作 */
function handleCommand(command, row) {
  switch (command) {
    case "handleResetPwd":
      handleResetPwd(row);
      break;
    case "handleAuthRole":
      handleAuthRole(row);
      break;
    default:
      break;
  }
}
/** 跳转角色分配 */
function handleAuthRole(row) {
  const userId = row.userId;
  router.push("/system/user-auth/role/" + userId);
}
/** 重置密码按钮操作 */
function handleResetPwd(row) {
  proxy
    .$prompt('请输入"' + row.userName + '"的新密码', "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      closeOnClickModal: false,
      inputPattern: /^.{5,20}$/,
      inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
    })
    .then(({ value }) => {
      resetUserPwd(row.userId, value).then((response) => {
        proxy.$modal.msgSuccess("修改成功，新密码是：" + value);
      });
    })
    .catch(() => {});
}
/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 导入按钮操作 */
function handleImport() {
  upload.title = "教学工作量导入";
  upload.schoolYear = pm_school_year.value[0].value;
  upload.open = true;
}
/** 下载模板操作 */
function importTemplate() {
  proxy.download(
    "/performance/teachingWork/importTemplate",
    {},
    `教学工作量明细上传模板.xlsx`
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
  getWorkList();
};
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
}
/** 重置操作表单 */
function reset() {
  form.value = {
    id: undefined,
    teacherId: undefined,
    teacherName: undefined,
    deptId: undefined,
    courseName: undefined,
    type: undefined,
    theoreticalHours: undefined,
    experimentalHours: undefined,
    studentNum: undefined,
    netWorkload: undefined,
    workload: undefined,
    schoolYear: undefined,
    status: 10,
    remark: undefined,
  };
  proxy.resetForm("teachingWorkRef");
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
  title.value = "添加教学工作量明细";
}
/** 新增按钮操作 */
function handleLog() {
  reset();
  open.value = true;
  title.value = "添加教学工作量明细";
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value;
  getTeachingWork(id).then((response) => {
    form.value = response.data;
    postOptions.value = response.posts;
    roleOptions.value = response.roles;
    form.value.postIds = response.postIds;
    form.value.roleIds = response.roleIds;
    open.value = true;
    title.value = "修改教学工作量";
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
      getWorkList();
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
    .promptReject("是否确认驳回选中的数据项？驳回原因：", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputErrorMessage: "原因不能为空",
      inputValidator: (value) => {
        // 点击按钮时，对文本框里面的值进行验证
        if (!value) {
          return inputErrorMessage;
        }
      },
    })
    .then(function (value) {
      return examine(workIds, 20, value.value);
    })
    .then(() => {
      getWorkList();
      proxy.$modal.msgSuccess("操作成功");
    })
    .catch(() => {});
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["teachingWorkRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        updateTeachingWork(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getWorkList();
        });
      } else {
        addTeachingWork(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getWorkList();
        });
      }
    }
  });
}
function selectChangeParent(index) {
  form.value.teacherCode = userSelect.value[index].userName;
  form.value.teacherName = userSelect.value[index].name;
  form.value.deptId = userSelect.value[index].deptId;
}

function handleView(row) {
  resetLog();
  logs.value = undefined;
  const id = row.id;
  getLog(id).then((response) => {
    logs.value = response.data;
    if (response.data.length === 0) {
      logs.value = [{ "showContent": "当前数据无审核记录" }];
    }
    logOpen.value = true;
  });
}
getDeptTree();
getWorkList();
</script>
