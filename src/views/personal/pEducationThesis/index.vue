<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryRef"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="论文名称" prop="thesisName">
            <el-input
              v-model="queryParams.thesisName"
              placeholder="请输入论文名称"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>

          <el-form-item label="所属年度" prop="annual">
            <el-select
              v-model="queryParams.schoolYear"
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

          <el-form-item label="作者类型" prop="authorType">
            <el-select
              v-model="queryParams.authorType"
              placeholder="请选择作者类型"
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="(item, index) in authorTypeOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择审核状态"
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
              v-hasPermi="['pm:pThesis:add']"
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
              v-hasPermi="['pm:pThesis:edit']"
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
              v-hasPermi="['pm:pThesis:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="document-add"
              :disabled="multiple"
              @click="handleExamine"
              v-hasPermi="['pm:pThesis:submit']"
              >提交审核</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="Upload"
              @click="handleImport"
              v-hasPermi="['pm:pThesis:import']"
              >导入</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['pm:pThesis:export']"
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
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            label="姓名"
            align="center"
            key="authorName"
            prop="authorName"
            v-if="columns[0].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="工号"
            align="center"
            key="authorCode"
            prop="authorCode"
            v-if="columns[1].visible"
          />
          <el-table-column
            label="作者类型"
            align="center"
            key="authorType"
            prop="authorType"
            v-if="columns[2].visible"
            :show-overflow-tooltip="false"
          >
            <template #default="scope">
              <span v-if="scope.row.authorType === 10">第一作者</span>
              <span v-else-if="scope.row.authorType === 20">通讯作者</span>
              <span v-else>未知类型</span>
            </template>
          </el-table-column>
          <el-table-column
            label="论文名称"
            align="center"
            key="thesisName"
            prop="thesisName"
            v-if="columns[3].visible"
            width="160"
          />
          <el-table-column
            label="期刊名称"
            align="center"
            key="journalName"
            prop="journalName"
            v-if="columns[4].visible"
            width="160"
          />
          <el-table-column
            label="刊号"
            align="center"
            key="issn"
            prop="issn"
            v-if="columns[5].visible"
          />
          <el-table-column
            label="期刊收录情况"
            align="center"
            key="journalInclusion"
            prop="journalInclusion"
            v-if="columns[6].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="发表时间"
            align="center"
            key="timePublish"
            prop="timePublish"
            v-if="columns[7].visible"
            :show-overflow-tooltip="true"
          >
            <template #default="scope">
              <span>{{ parseTime(scope.row.timePublish, "{y}-{m}") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="他引次数"
            align="center"
            key="otherCitations"
            prop="otherCitations"
            v-if="columns[8].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="是否联合行业发表"
            align="center"
            key="isJointIndustry"
            prop="isJointIndustry"
            v-if="columns[9].visible"
            :show-overflow-tooltip="true"
          >
            <template #default="scope">
              <span v-if="scope.row.isJointIndustry === 0">是</span>
              <span v-else-if="scope.row.isJointIndustry === 1">否</span>
            </template>
          </el-table-column>
          <el-table-column
            label="是否联合国际发表"
            align="center"
            key="isJointInternational"
            prop="isJointInternational"
            v-if="columns[10].visible"
            :show-overflow-tooltip="true"
          >
            <template #default="scope">
              <span v-if="scope.row.isJointInternational === 0">是</span>
              <span v-else-if="scope.row.isJointInternational === 1">否</span>
            </template>
          </el-table-column>
          <el-table-column
            label="是否是跨学科论文"
            align="center"
            key="isInterdiscipline"
            prop="isInterdiscipline"
            v-if="columns[11].visible"
            :show-overflow-tooltip="true"
          >
            <template #default="scope">
              <span v-if="scope.row.isInterdiscipline === 0">是</span>
              <span v-else-if="scope.row.isInterdiscipline === 1">否</span>
            </template>
          </el-table-column>
          <el-table-column
            label="工作量分值"
            align="center"
            key="workload"
            prop="workload"
            width="90"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="所属年度"
            align="center"
            key="annual"
            prop="annual"
            v-if="columns[12].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="状态"
            align="center"
            key="status"
            prop="status"
            v-if="columns[13].visible"
            width="100"
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
            label="创建时间"
            align="center"
            prop="timeCreate"
            v-if="columns[14].visible"
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
                  v-hasPermi="['pm:pThesis:edit']"
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
              <el-tooltip content="提交审核" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="document-checked"
                  @click="handleExamine(scope.row)"
                  v-hasPermi="['pm:pThesis:submit']"
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
                  v-hasPermi="['pm:pThesis:remove']"
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
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改发表教研论文统计配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form
        :model="form"
        :rules="rules"
        ref="EducationThesisRef"
        label-width="80px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="作者姓名" prop="authorName">
              <el-input
                v-model="form.authorName"
                placeholder="请输入作者姓名"
                maxlength="30"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者工号" prop="authorCode">
              <el-input
                v-model="form.authorCode"
                placeholder="请输入作者工号"
                maxlength="30"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="作者类型" prop="authorType">
              <el-select
                v-model="form.authorType"
                placeholder="请选择作者类型"
                filterable
              >
                <el-option
                  v-for="(item, index) in authorTypeOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核状态">
              <el-select
                v-model="form.status"
                placeholder="请选择状态"
                :disabled="true"
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
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="论文名称" prop="thesisName">
              <el-input
                v-model="form.thesisName"
                placeholder="请输入论文名称"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="期刊名称" prop="journalName">
              <el-input
                v-model="form.journalName"
                placeholder="请输入期刊名称"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="刊号" prop="issn">
              <el-input
                v-model="form.issn"
                placeholder="请输入刊号"
                maxlength="60"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item
              label="期刊收录情况"
              label-width="108"
              prop="journalInclusion"
            >
              <el-input
                v-model="form.journalInclusion"
                placeholder="请输入期刊收录情况"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发表时间" prop="timePublish">
              <el-date-picker
                v-model="form.timePublish"
                type="date"
                placeholder="选择日期"
                @change="dateChange"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="他引次数" prop="otherCitations">
              <el-input-number
                v-model="form.otherCitations"
                placeholder="请输入他引次数"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属年度" prop="annual">
              <el-select v-model="form.annual" placeholder="请选择年度">
                <el-option
                  v-for="dict in pm_year"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否联合行业发表" label-width="135">
              <el-radio-group v-model="form.isJointIndustry">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row> </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否联合国际发表" label-width="135">
              <el-radio-group v-model="form.isJointInternational">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否是跨学科论文" label-width="135">
              <el-radio-group v-model="form.isInterdiscipline">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
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
            </el-form-item> </el-col
        ></el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 数据导入对话框 -->
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
        :action="upload.url + '?annual=' + upload.annual"
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
              <span>所属年度：</span>
              <el-select
                v-model="upload.annual"
                placeholder="默认为当前年度"
                clearable
                style="width: 160px"
              >
                <el-option
                  v-for="dict in pm_year"
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
              <span> 请指定sheet名称以标识年度 示例：2022-2023</span>
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

<script setup name="User">
import { getToken } from "@/utils/auth";
import { deptTreeSelect } from "@/api/system/user";
import {
  listEducationThesis,
  getEducationThesis,
  addEducationThesis,
  updateEducationThesis,
  examine,
  getLog,
  submit,
  delEducationThesis,
} from "@/api/performance/educationThesis.js";
import { get } from "@vueuse/core";
import useUserStore from "@/store/modules/user";

const userStore = useUserStore();
const router = useRouter();
const { proxy } = getCurrentInstance();
const userSelect = proxy.useUsers();
const { sys_normal_disable, sys_user_sex, pm_year } = proxy.useDict(
  "sys_normal_disable",
  "sys_user_sex",
  "pm_year"
);

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
  // 年度
  annual: 0,
  // 设置上传的请求头部
  headers: { Authorization: getToken() },
  // 上传的地址
  url:
    import.meta.env.VITE_APP_BASE_API +
    "/performance/education_thesis/importData",
});
// 列显隐信息
const columns = ref([
  { key: 0, label: `姓名`, visible: true },
  { key: 1, label: `工号`, visible: true },
  { key: 2, label: `作者类型`, visible: true },
  { key: 3, label: `论文名称`, visible: true },
  { key: 4, label: `期刊名称`, visible: true },
  { key: 5, label: `刊号`, visible: true },
  { key: 6, label: `期刊收录情况`, visible: true },
  { key: 7, label: `发表时间`, visible: true },
  { key: 8, label: `他引次数`, visible: true },
  { key: 9, label: `是否联合行业发表`, visible: true },
  { key: 10, label: `是否联合国际发表`, visible: true },
  { key: 11, label: `是否是跨学科论文`, visible: true },
  { key: 12, label: `所属年度`, visible: true },
  { key: 13, label: `状态`, visible: true },
  { key: 14, label: `创建时间`, visible: true },
]);

const data = reactive({
  form: {},
  logForm: [{}],
  queryParams: {
    page: 1,
    size: 10,
    userCode: userStore.userName,
    annual: undefined,
    status: undefined,
    deptId: undefined,
  },
  rules: {
    authorName: [
      { required: true, message: "作者姓名不能为空", trigger: "blur" },
      {
        min: 2,
        max: 10,
        message: "作者姓名长度必须介于 2 和 10 之间",
        trigger: "blur",
      },
    ],
    authorCode: [
      { required: true, message: "作者工号不能为空", trigger: "blur" },
      {
        min: 5,
        max: 20,
        message: "作者工号长度必须介于 5 和 20 之间",
        trigger: "blur",
      },
    ],
    authorType: [
      { required: true, message: "作者类型不能为空", trigger: "change" },
    ],
    thesisName: [
      { required: true, message: "论文名称不能为空", trigger: "change" },
    ],
    annual: [
      {
        required: true,
        message: "请选择学年",
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
  authorTypeOptions: [
    {
      label: "第一作者",
      value: 10,
    },
    {
      label: "通讯作者",
      value: 20,
    },
  ],
  applicableLevels: [
    {
      label: "专科",
      value: 0,
    },
    {
      label: "本科",
      value: 10,
    },
    {
      label: "研究生",
      value: 20,
    },
  ],
});

const {
  queryParams,
  form,
  logForm,
  rules,
  statusOptions,
  authorTypeOptions,
  applicableLevels,
} = toRefs(data);

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
function getList() {
  loading.value = true;
  listEducationThesis(
    proxy.addDateRange(queryParams.value, dateRange.value)
  ).then((res) => {
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
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.page = 1;
  getList();
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
      return delEducationThesis(workIds);
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
    "/performance/education_thesis/export",
    {
      ...queryParams.value,
    },
    `发表教研论文统计表.xlsx`
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
  upload.title = "发表教研论文统计导入";
  upload.annual = pm_year.value[0].value;
  upload.open = true;
}
/** 下载模板操作 */
function importTemplate() {
  proxy.download(
    "/performance/education_thesis/importTemplate",
    {},
    `发表教研论文统计上传模板.xlsx`
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
    authorCode: userStore.userName,
    authorName: userStore.name,
    deptId: userStore.deptId,
    authorType: undefined,
    thesisName: undefined,
    journalName: undefined,
    issn: undefined,
    journalInclusion: undefined,
    timePublish: undefined,
    otherCitations: undefined,
    isJointIndustry: 1,
    isJointInternational: 1,
    isInterdiscipline: 1,
    status: 10,
    annual: undefined,
    workload: undefined,
  };
  proxy.resetForm("EducationThesisRef");
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
  title.value = "添加发表教研论文统计";
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value;
  getEducationThesis(id).then((response) => {
    form.value = response.data;
    postOptions.value = response.posts;
    roleOptions.value = response.roles;
    form.value.postIds = response.postIds;
    form.value.roleIds = response.roleIds;
    open.value = true;
    title.value = "修改发表教研论文统计";
    form.password = "";
  });
}
/** 提交审核按钮操作 */
function handleExamine(row) {
  var arr = [];
  if (row.id !== undefined) arr.push(row.id);
  const workIds = arr.length <= 0 ? ids.value : arr;
  proxy.$modal
    .confirm("是否确认提交审核选中的数据项？")
    .then(function () {
      return submit(workIds);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("操作成功");
    })
    .catch(() => {});
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["EducationThesisRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        updateEducationThesis(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEducationThesis(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
function selectChangeParent(index) {
  form.value.authorCode = userSelect.value[index].userName;
  form.value.authorName = userSelect.value[index].name;
  form.value.deptId = userSelect.value[index].deptId;
}
function handleView(row) {
  resetLog();
  logs.value = undefined;
  const id = row.id;
  getLog(id).then((response) => {
    logs.value = response.data;
    if (response.data.length === 0) {
      logs.value = [{ showContent: "当前数据无审核记录" }];
    }
    logOpen.value = true;
  });
}
getDeptTree();
getList();
</script>
