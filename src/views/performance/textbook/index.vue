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

          <el-form-item label="教材名称" prop="textbookName">
            <el-input
              v-model="queryParams.textbookName"
              placeholder="请输入教材名称"
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

          <el-form-item label="ISBN" prop="isbn">
            <el-input
              v-model="queryParams.isbn"
              placeholder="请输入ISBN"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
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
              v-hasPermi="['pm:thesis:add']"
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
              v-hasPermi="['pm:thesis:edit']"
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
              v-hasPermi="['pm:thesis:remove']"
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
              v-hasPermi="['pm:thesis:examine']"
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
              v-hasPermi="['pm:thesis:examine']"
              >审核不通过</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="Upload"
              @click="handleImport"
              v-hasPermi="['pm:thesis:import']"
              >导入</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['pm:thesis:export']"
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
            label="(副)主编"
            align="center"
            key="editor"
            prop="editor"
            v-if="columns[2].visible"
          />
          <el-table-column
            label="教材名称"
            align="center"
            key="textbookName"
            prop="textbookName"
            v-if="columns[3].visible"
            width="160"
          />
          <el-table-column
            label="ISBN"
            align="center"
            key="isbn"
            prop="isbn"
            v-if="columns[4].visible"
            width="160"
          />
          <el-table-column
            label="教材形式"
            align="center"
            key="textbookType"
            prop="textbookType"
            v-if="columns[5].visible"
            :show-overflow-tooltip="false"
          >
            <template #default="scope">
              <span v-if="scope.row.textbookType === 0">纸质</span>
              <span v-else-if="scope.row.textbookType === 10">电子</span>
              <span v-else>未知类型</span>
            </template>
          </el-table-column>
          <el-table-column
            label="适用层次"
            align="center"
            key="applicableLevel"
            prop="applicableLevel"
            v-if="columns[6].visible"
            :show-overflow-tooltip="false"
          >
            <template #default="scope">
              <span v-if="scope.row.applicableLevel === 0">专科</span>
              <span v-else-if="scope.row.applicableLevel === 10">本科</span>
              <span v-else>研究生</span>
            </template>
          </el-table-column>
          <el-table-column
            label="出版社"
            align="center"
            key="press"
            prop="press"
            v-if="columns[7].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="出版年月"
            align="center"
            prop="timePublish"
            v-if="columns[8].visible"
            width="80"
          >
            <template #default="scope">
              <span>{{ parseTime(scope.row.timePublish, "{y}-{m}") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="是否学校立项教材"
            align="center"
            key="isSchoolProject"
            prop="isSchoolProject"
            v-if="columns[9].visible"
            :show-overflow-tooltip="true"
          >
            <template #default="scope">
              <span v-if="scope.row.isSchoolProject === 0">是</span>
              <span v-else-if="scope.row.isSchoolProject === 1">否</span>
            </template>
          </el-table-column>
          <el-table-column
            label="获奖情况"
            align="center"
            key="awards"
            prop="awards"
            v-if="columns[10].visible"
            :show-overflow-tooltip="true"
          />

          <el-table-column
            label="获奖时间"
            align="center"
            prop="timeBeRewarded"
            v-if="columns[11].visible"
            width="80"
          >
            <template #default="scope">
              <span>{{
                parseTime(scope.row.timeBeRewarded, "{y}-{m}-{d}")
              }}</span>
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
            label="修订情况"
            align="center"
            key="revision"
            prop="revision"
            v-if="columns[12].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="所属年度"
            align="center"
            key="annual"
            prop="annual"
            v-if="columns[13].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="状态"
            align="center"
            key="status"
            prop="status"
            v-if="columns[14].visible"
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
            v-if="columns[15].visible"
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
                  v-hasPermi="['pm:thesis:edit']"
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
                  v-hasPermi="['pm:thesis:examine']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="审核不通过" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="document-delete"
                  @click="handleReject(scope.row)"
                  v-hasPermi="['pm:thesis:examine']"
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
                  v-hasPermi="['pm:thesis:remove']"
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

    <!-- 添加或修改教材出版统计配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form
        :model="form"
        :rules="rules"
        ref="TextbookRef"
        label-width="80px"
      >
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="作者姓名" prop="authorName">
              <el-input
                v-model="form.authorName"
                placeholder="请输入作者姓名"
                maxlength="30"
                :disabled="!(form.id == undefined)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者工号" prop="authorCode">
              <el-input
                v-model="form.authorCode"
                placeholder="请输入作者工号"
                maxlength="30"
                :disabled="!(form.id == undefined)"
              />
            </el-form-item>
          </el-col>
        </el-row> -->

        <el-row>
          <el-col :span="12">
            <el-form-item label="作者姓名" prop="authorName">
              <el-select
                v-model="form.authorName"
                @change="selectChangeParent"
                placeholder="请选择作者工号:姓名"
                :disabled="!(form.id == undefined)"
                filterable
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
            <el-form-item label="作者工号" prop="authorCode">
              <el-select
                v-model="form.authorCode"
                @change="selectChangeParent"
                placeholder="请选择作者工号"
                :disabled="!(form.id == undefined)"
                filterable
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
            <el-form-item label="教材形式" prop="textbookType">
              <el-select
                v-model="form.textbookType"
                placeholder="请选择教材形式"
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
          <el-col :span="12">
            <el-form-item label="适用层次" prop="applicableLevel">
              <el-select
                v-model="form.applicableLevel"
                placeholder="请选择适用层次"
                filterable
              >
                <el-option
                  v-for="(item, index) in applicableLevels"
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
            <el-form-item label="ISBN" prop="isbn">
              <el-input
                v-model="form.isbn"
                placeholder="请输入ISBN"
                maxlength="60"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="教材名称" prop="textbookName">
              <el-input
                v-model="form.textbookName"
                placeholder="请输入教材名称"
                maxlength="20"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主编/副主编" label-width="95" prop="editor">
              <el-input
                v-model="form.editor"
                placeholder="请输入主编/副主编"
                maxlength="15"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="出版社" prop="press">
              <el-input
                v-model="form.press"
                placeholder="请输入出版社"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版年月" prop="timePublish">
              <el-date-picker
                v-model="form.timePublish"
                type="date"
                placeholder="选择出版年月"
                @change="dateChange"
              >
              </el-date-picker>
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
            <el-form-item label="审核状态">
              <el-select v-model="form.status" placeholder="请选择状态" :disabled=true>
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
          <el-col :span="12">
            <el-form-item label="是否学校立项教材" label-width="135">
              <el-radio-group v-model="form.isSchoolProject">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获奖时间" prop="timeBeRewarded">
              <el-date-picker
                v-model="form.timeBeRewarded"
                type="date"
                placeholder="选择日期"
                @change="dateChange"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="获奖情况">
              <el-input
                v-model="form.awards"
                type="textarea"
                placeholder="请输入获奖情况"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="修订情况">
              <el-input
                v-model="form.revision"
                type="textarea"
                placeholder="请输入修订情况"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="再版情况">
              <el-input
                v-model="form.reprint"
                type="textarea"
                placeholder="请输入再版情况"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
  listTextbook,
  getTextbook,
  addTextbook,
  updateTextbook,
  examine,
  getLog,
  delTextbook,
} from "@/api/performance/textbook";
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
  // 年度
  annual: 0,
  // 设置上传的请求头部
  headers: { Authorization: getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/performance/textbook/importData",
});
// 列显隐信息
const columns = ref([
  { key: 0, label: `姓名`, visible: true },
  { key: 1, label: `工号`, visible: true },
  { key: 2, label: `主编`, visible: true },
  { key: 3, label: `教材名称`, visible: true },
  { key: 4, label: `ISBN`, visible: true },
  { key: 5, label: `教材形式`, visible: true },
  { key: 6, label: `适用层次`, visible: true },
  { key: 7, label: `出版社`, visible: true },
  { key: 8, label: `出版年月`, visible: true },
  { key: 9, label: `是否学习立项教材`, visible: true },
  { key: 10, label: `获奖情况`, visible: true },
  { key: 11, label: `获奖时间`, visible: true },
  { key: 12, label: `修订情况`, visible: true },
  { key: 13, label: `所属年度`, visible: true },
  { key: 14, label: `状态`, visible: true },
  { key: 15, label: `创建时间`, visible: true },
]);

const data = reactive({
  form: {},
  logForm: [{}],
  queryParams: {
    page: 1,
    size: 10,
    teacherName: undefined,
    // userCode: userStore.name,
    annual: undefined,
    status: undefined,
    deptId: undefined,
  },
  rules: {
    authorName: [
      { required: true, message: "教师姓名不能为空", trigger: "blur" },
    ],
    authorCode: [
      { required: true, message: "教师工号不能为空", trigger: "blur" },
    ],
    userCode: [
      { required: true, message: "作者工号不能为空", trigger: "blur" },
      {
        min: 5,
        max: 20,
        message: "作者工号长度必须介于 5 和 20 之间",
        trigger: "blur",
      },
    ],
    textbookType: [
      { required: true, message: "教材形式不能为空", trigger: "change" },
    ],
    applicableLevel: [
      { required: true, message: "适用层次不能为空", trigger: "change" },
    ],
    textbookName: [
      { required: true, message: "教材名称不能为空", trigger: "blur" },
    ],
    isbn: [{ required: true, message: "ISBN不能为空", trigger: "blur" }],
    annual: [
      {
        required: true,
        message: "请选择年度",
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
      label: "纸质",
      value: 0,
    },
    {
      label: "电子",
      value: 10,
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
  typeOptions,
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
function getWorkList() {
  loading.value = true;
  listTextbook(proxy.addDateRange(queryParams.value, dateRange.value)).then(
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
      return delTextbook(workIds);
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
    "/performance/textbook/export",
    {
      ...queryParams.value,
    },
    `教材出版统计表.xlsx`
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
  upload.title = "教材出版统计导入";
  upload.annual = pm_year.value[0].value;
  upload.open = true;
}
/** 下载模板操作 */
function importTemplate() {
  proxy.download(
    "/performance/textbook/importTemplate",
    {},
    `教材出版统计上传模板.xlsx`
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
    isbn: undefined,
    authorCode: undefined,
    authorName: undefined,
    deptId: undefined,
    textbookName: undefined,
    textbookType: undefined,
    applicableLevel: undefined,
    press: undefined,
    timePublish: undefined,
    isSchoolProject: 0,
    editor: undefined,
    awards: undefined,
    annual: undefined,
    timeBeRewarded: undefined,
    revision: undefined,
    reprint: undefined,
    status: 10,
    remark: undefined,
    workload: undefined,
  };
  proxy.resetForm("TextbookRef");
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
  title.value = "添加教材出版统计";
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value;
  getTextbook(id).then((response) => {
    form.value = response.data;
    postOptions.value = response.posts;
    roleOptions.value = response.roles;
    form.value.postIds = response.postIds;
    form.value.roleIds = response.roleIds;
    open.value = true;
    title.value = "修改教材出版统计";
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
    .confirm("是否确认驳回选中的数据项？")
    .then(function () {
      return examine(workIds, 20);
    })
    .then(() => {
      getWorkList();
      proxy.$modal.msgSuccess("操作成功");
    })
    .catch(() => {});
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["TextbookRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        updateTextbook(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getWorkList();
        });
      } else {
        addTextbook(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getWorkList();
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
getWorkList();
</script>
