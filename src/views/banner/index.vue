<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-input
              v-model="queryInfo.query"
              placeholder="请输入标题关键字"
              class="input-with-select"
              clearable
              @clear="fetchData"
            >
              <el-button slot="append" icon="el-icon-search" @click="fetchData('new')"></el-button>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="() => commonApi.openAddForm('banner', this)">添加焦点图</el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" class="flex-right">
        <el-button type="danger" plain @click="handelMultipleDelete">批量删除</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
      :empty-text="emptyText"
      @selection-change="selection => commonApi.handleSelectionChange(selection, this)"
      @filter-change="filters => commonApi.filterChange(filters, this)"
      @sort-change="sortInfo => commonApi.sortChange(sortInfo, this)"
    >
      <el-table-column type="selection" width="40" :show-overflow-tooltip="true"> </el-table-column>
      <el-table-column align="center" label="序号" width="55">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片" width="80">
        <template slot-scope="scope">
          <img v-if="scope.row.avatar" :src="apiUrl + scope.row.avatar" width="25" height="25" />
          <span v-else>未上传</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="title" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="链接" align="center" prop="link" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.link }}
        </template>
      </el-table-column>
      <el-table-column label="发布日期" align="center" prop="created_time" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.created_time | parseTime('{y}-{m}-{d}') }}
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="90"
        align="center"
        prop="state"
        column-key="state"
        :filters="stateList"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.state === 0 ? '启用' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.row._id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope.row._id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryInfo.page"
      :limit.sync="queryInfo.pageSize"
      @pagination="fetchData"
    />
    <el-dialog
      title="添加焦点图"
      :visible.sync="dialogAddVisible"
      width="60%"
      :close-on-click-modal="false"
      @close="() => commonApi.dialogAddClose('banner', this)"
    >
      <el-form ref="newBannerRef" :inline="false" :model="newBanner" :rules="newBannerRules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题" prop="title">
              <el-input v-if="newBanner._id" v-model="newBanner.title" />
              <el-input v-else v-model="newBanner.title" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="链接" prop="link">
              <el-input v-model="newBanner.link" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="state">
              <el-radio-group v-model="newBanner.state">
                <el-radio :label="0">启用</el-radio>
                <el-radio :label="1">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图片" prop="avatar">
              <upload-single v-model="newBanner.avatar" dialog-width="60%" drag />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="postBanner">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBanners, addBanner, getBanner, deleteBanner } from '@/api/banner'

export default {
  name: 'Banner',
  data() {
    return {
      list: null,
      listLoading: true,
      queryInfo: {
        query: '',
        page: 1,
        pageSize: 10,
        sortJson: {},
        sort: ''
      },
      total: 0,
      dialogAddVisible: false,
      emptyText: '没有相关数据',
      newBanner: {
        title: '',
        link: '',
        avatar: '',
        state: 0
      },
      stateList: [
        { text: '启用', value: 0 },
        { text: '禁用', value: 1 }
      ],
      newBannerRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
        ]
      },
      multipleSelection: []
    }
  },
  computed: {},
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(param) {
      this.commonApi.getList(param, getBanners, this)
    },
    postBanner() {
      this.commonApi.postForm('banner', addBanner, this)
    },
    handleEdit(id) {
      this.commonApi.openEditForm(id, 'banner', getBanner, this)
    },
    handleDelete(id) {
      this.commonApi.deleteById(id, deleteBanner, this.fetchData)
    },
    handelMultipleDelete() {
      this.commonApi.multipleDelete(this.multipleSelection, deleteBanner, this.fetchData)
    }
  }
}
</script>
<style scoped></style>
