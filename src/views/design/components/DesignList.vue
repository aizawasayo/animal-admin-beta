<template>
  <div class="tabPane-container">
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
      <el-table-column align="center" label="照片" width="60" prop="photoSrc">
        <template slot-scope="scope">
          <img
            v-if="scope.row.photoSrc.length > 0 && scope.row.photoSrc[0].src"
            :src="apiUrl + scope.row.photoSrc[0].src"
            width="25"
            height="25"
          />
          <span v-else>未上传</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center" prop="name" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="介绍" align="center" prop="content">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="$emit('paneEdit', scope.row._id)"
          ></el-button>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDesignList, deleteDesign } from '@/api/design'

export default {
  name: 'DesignList',
  props: {
    type: {
      type: String,
      default: ''
    },
    queryKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      queryInfo: {
        query: this.queryKey,
        page: 1,
        pageSize: 10,
        type: this.type,
        sortJson: {},
        sort: ''
      },
      total: 0,
      emptyText: '没有相关数据',
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters(['userId', 'roles'])
  },
  watch: {
    queryKey(newVal) {
      this.queryInfo.query = newVal
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(param) {
      if (this.roles.length === 1 && this.roles.includes('normal')) {
        this.queryInfo.user = this.userId
      }
      this.commonApi.getList(param, getDesignList, this)
    },
    handleDelete(id) {
      this.commonApi.deleteById(id, deleteDesign, this.fetchData)
    },
    handelMultipleDelete() {
      this.commonApi.multipleDelete(this.multipleSelection, deleteDesign, this.fetchData)
    }
  }
}
</script>
