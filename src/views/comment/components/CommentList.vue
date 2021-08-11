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
      <el-table-column label="评论用户" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.uid.username }}
        </template>
      </el-table-column>
      <el-table-column label="评论内容" align="center" prop="content">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="评论时间" width="200" align="center" prop="created_time">
        <template slot-scope="scope">
          {{ scope.row.created_time | parseTime('{y}-{m}-{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column label="点赞数" width="100" align="center" prop="like">
        <template slot-scope="scope">
          {{ scope.row.like }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope.row._id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryInfo.page"
      :limit.sync="queryInfo.pageSize"
      :page-sizes="pageSize"
      @pagination="fetchData"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getComments, deleteComment } from '@/api/comment'

export default {
  name: 'CommentList',
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
        sortJson: { created_time: 1 },
        sort: ''
      },
      pageSize: [8, 10, 15],
      total: 0,
      emptyText: '没有相关数据',
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters(['userId'])
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
      this.listLoading = true
      if (param === 'refresh') {
        this.queryInfo.page = 1
      }
      getComments(this.type, this.queryInfo)
        .then(response => {
          this.list = response.data.list
          this.total = response.data.total || 0
          this.listLoading = false
        })
        .catch(err => this.$message.error(err.message))
    },
    handleDelete(id) {
      this.commonApi.deleteById(id, deleteComment, this.fetchData)
    },
    handelMultipleDelete() {
      this.commonApi.multipleDelete(this.multipleSelection, deleteComment, this.fetchData)
    }
  }
}
</script>
