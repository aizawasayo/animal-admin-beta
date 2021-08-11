<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-input
              v-model="queryInfo.query"
              placeholder="请输入用户名关键字"
              class="input-with-select"
              clearable
              @clear="fetchData"
            >
              <el-button slot="append" icon="el-icon-search" @click="fetchData('refresh')"></el-button>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="openAddUser">添加用户</el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" class="flex-right">
        <!-- <el-select v-model="queryInfo.breed" clearable placeholder="筛选种族" style="margin-right: 10px" @change="fetchData('refresh')">
          <el-option v-for="item in breedList" :label="item.text" :value="item.value" />
        </el-select> -->
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
      <el-table-column align="center" label="头像" width="80">
        <template slot-scope="scope">
          <img v-if="scope.row.avatar" :src="apiUrl + scope.row.avatar" width="25" height="25" />
          <span v-else>未上传</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center" prop="username" sortable="custom" width="100">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center" prop="email" sortable="custom" width="200">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center" width="90">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="登岛日期" align="center" width="110" prop="startDate" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.startDate | parseTime('{y}-{m}-{d}') }}
        </template>
      </el-table-column>
      <el-table-column label="动森ID" align="center" prop="gameId" width="180">
        <template slot-scope="scope">
          {{ scope.row.gameId }}
        </template>
      </el-table-column>
      <el-table-column label="岛屿名称" align="center" prop="islandName">
        <template slot-scope="scope">
          {{ scope.row.islandName }}
        </template>
      </el-table-column>
      <el-table-column label="岛屿位置" width="100" align="center" column-key="position" :filters="positionList">
        <template slot-scope="scope">
          <span>{{ scope.row.position ? (scope.row.position === 'North' ? '北半球' : '南半球') : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="90" align="center" column-key="roles" :filters="roleList">
        <template slot-scope="scope">
          {{ scope.row.roles.includes('admin') ? '管理员' : '普通用户' }}
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
      <!-- <el-table-column label="个性签名" align="center">
        <template slot-scope="scope">
          {{ scope.row.signature }}
        </template>
      </el-table-column> -->
      <el-table-column class-name="status-col" label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.row._id)"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="handleDelete(scope.row._id, scope.row.roles)"
          ></el-button>
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
      title="添加用户"
      :visible.sync="dialogAddVisible"
      width="60%"
      :close-on-click-modal="false"
      @close="dialogAddClose"
    >
      <el-form ref="newUserRef" :inline="false" :model="newUser" :rules="newUserRules" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="名字" prop="username">
              <el-input v-if="newUser._id" v-model="newUser.username" disabled="" />
              <el-input v-else v-model="newUser.username" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="newUser.nickname" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="游戏ID" prop="gameId">
              <el-input v-model="newUser.gameId" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="岛屿名称" prop="islandName">
              <el-input v-model="newUser.islandName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="岛屿位置" prop="position">
              <el-radio-group v-model="newUser.position">
                <el-radio label="North">北半球</el-radio>
                <el-radio label="South">南半球</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登岛日期" prop="startDate">
              <el-date-picker
                v-model="newUser.startDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                :picker-options="datesOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="角色" prop="roles">
              <el-checkbox-group v-model="newUser.roles">
                <el-checkbox label="admin">管理员</el-checkbox>
                <el-checkbox label="normal">普通用户</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="state">
              <el-radio-group v-model="newUser.state">
                <el-radio :label="0">启用</el-radio>
                <el-radio :label="1">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="this.newUser._id" label="密码" prop="psw">
              <el-input v-model="newUser.password" type="password" show-password disabled />
            </el-form-item>
            <el-form-item v-else label="密码" prop="password">
              <el-input v-model="newUser.password" type="password" show-password />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="头像" prop="avatar">
              <upload-single v-model="newUser.avatar" drag />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="postUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers, addUser, getUser, editUser, deleteUser } from '@/api/user'
import { timestamp, parseTime, standardTime } from '@/utils'

export default {
  name: 'User',
  data() {
    const checkPass = (rule, value, callback) => {
      // 至少8个字符，至少1个大写字母，1个小写字母和1个数字,不能包含特殊字符（非数字字母）：
      // ^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$
      const reg = new RegExp(/^[a-zA-Z0-9]{8,16}$/)
      if (!value) {
        callback(new Error('密码不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('密码不符合规则'))
      } else {
        callback()
      }
    }
    return {
      list: null,
      listLoading: true,
      queryInfo: {
        query: '',
        page: 1, // 当前的页数
        pageSize: 10, // 当前每页显示多少条数据
        sortJson: {},
        sort: ''
      },
      total: 0,
      dialogAddVisible: false,
      emptyText: '没有相关数据',
      newUser: {
        username: '',
        nickname: '',
        email: '',
        gameId: '',
        islandName: '',
        position: '',
        startDate: null,
        password: '',
        avatar: '',
        roles: [],
        state: 0,
        signature: ''
      },
      stateList: [
        { text: '启用', value: 0 },
        { text: '禁用', value: 1 }
      ],
      positionList: [
        { text: '北半球', value: 'North' },
        { text: '南半球', value: 'South' }
      ],
      roleList: [
        { text: '管理员', value: 'admin' },
        { text: '普通用户', value: 'normal' }
      ],
      newUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
        ],
        gameId: [{ required: true, message: '请输入游戏ID', trigger: 'blur' }],
        password: [{ validator: checkPass, trigger: 'blur' }],
        roles: [{ required: true, message: '请选择用户角色', trigger: 'change' }]
      },
      multipleSelection: [],
      datesOptions: {
        disabledDate(date) {
          return date.getTime() > Date.now()
        }
      }
    }
  },
  computed: {},
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(param) {
      this.commonApi.getList(param, getUsers, this)
    },
    openAddUser() {
      this.dialogAddVisible = true
      this.$nextTick(function () {
        this.$refs['newUserRef'].resetFields()
      })
    },
    dialogAddClose() {
      this.$refs.newUserRef.resetFields()
      this.newUser.email = ''
      delete this.newUser._id
      delete this.newUser.__v
      delete this.newUser.psw
    },
    postUser() {
      this.$refs.newUserRef.validate(valid => {
        if (!valid) return this.$message.error('请修改有误的表单项')
        const timeString = parseTime(this.newUser.startDate)
        this.newUser.startDate = timestamp(timeString)
        if (this.newUser._id) {
          editUser(this.newUser._id, this.newUser)
            .then(res => {
              this.$message.success(res.message)
              this.dialogAddVisible = false
              this.fetchData()
            })
            .catch(err => {
              this.newUser.startDate = null
              this.$message.error(`修改失败，${err.message}！`)
            })
        } else {
          addUser(this.newUser)
            .then(res => {
              this.$message.success(res.message)
              this.dialogAddVisible = false
              this.queryInfo.page = 1
              this.fetchData()
            })
            .catch(err => {
              this.newUser.startDate = null
              this.$message.error(`添加失败，${err.message}！`)
            })
        }
      })
    },
    handleEdit(id) {
      if (this.$refs['newUserRef']) {
        this.$refs['newUserRef'].resetFields()
      }
      // 查询并编辑用户信息
      getUser(id)
        .then(res => {
          this.dialogAddVisible = true
          this.$nextTick(function () {
            this.newUser = res.data
            if (this.newUser.startDate) {
              this.newUser.startDate = standardTime(this.newUser.startDate)
            }
          })
        })
        .catch(err => this.$message.error(err.message))
    },
    handleDelete(id, roles) {
      if (roles && roles.includes('admin')) return this.$message.warning('不能删除管理员！')
      // 删除用户方法，可批量
      this.commonApi.deleteById(id, deleteUser, this.fetchData)
    },
    handelMultipleDelete() {
      // 批量删除岛民
      if (this.multipleSelection.length === 0) {
        return this.$message.warning('请先选中至少一条数据！')
      }
      let id = ''
      let flag = true
      this.multipleSelection.forEach(val => {
        if (val.roles.includes('admin')) {
          flag = false
        }
        id += val._id + ','
      })
      if (flag) {
        id = id.substring(0, id.length - 1)
        this.handleDelete(id)
      } else {
        this.$message.warning('没有权限删除管理员！')
      }
    }
  }
}
</script>
<style scoped></style>
