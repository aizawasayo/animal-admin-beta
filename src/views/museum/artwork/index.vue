<template>
  <div class="app-container">
    <el-row class="search-box" type="flex" justify="space-between">
      <el-col :span="16">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-input
              v-model="queryInfo.query"
              placeholder="请输入艺术品关键字"
              class="input-with-select"
              clearable
              @clear="fetchData"
              @keyup.enter.native="fetchData('refresh')"
            >
              <el-button slot="append" icon="el-icon-search" @click="fetchData('refresh')"></el-button>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="() => commonApi.openAddForm('artwork', this)">添加艺术品</el-button>
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
      <el-table-column label="价格" align="center" prop="price" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="英文名" align="center">
        <template slot-scope="scope">
          {{ scope.row.engName }}
        </template>
      </el-table-column>
      <el-table-column label="日文名" align="center">
        <template slot-scope="scope">
          {{ scope.row.jpnName | textFilter(5) }}
        </template>
      </el-table-column>
      <el-table-column label="真名" align="center">
        <template slot-scope="scope">
          {{ scope.row.realName }}
        </template>
      </el-table-column>
      <el-table-column label="售出价格" align="center">
        <template slot-scope="scope"> {{ scope.row.salePrice }}（赝品为0） </template>
      </el-table-column>
      <el-table-column label="占地面积" align="center">
        <template slot-scope="scope">
          {{ scope.row.size }}
        </template>
      </el-table-column>
      <el-table-column label="赝品特征" align="center">
        <template slot-scope="scope">
          {{ scope.row.fakeCharacter | textFilter(10) }}
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
      title="添加艺术品"
      :visible.sync="dialogAddVisible"
      width="60%"
      :close-on-click-modal="false"
      @close="() => commonApi.dialogAddClose('artwork', this)"
    >
      <el-form ref="newArtworkRef" :inline="false" :model="newArtwork" :rules="newArtworkRules" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input v-model="newArtwork.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="英文名" prop="engName">
              <el-input v-model="newArtwork.engName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日文名" prop="jpnName">
              <el-input v-model="newArtwork.jpnName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="真名" prop="realName">
              <el-input v-model="newArtwork.realName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="价格" prop="price">
              <el-input v-model.number="newArtwork.price" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="售出价格" prop="salePrice">
              <el-input v-model.number="newArtwork.salePrice" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="占地面积" prop="size" required>
              <el-select v-model="newArtwork.size" collapse-tags placeholder="请选择尺寸">
                <el-option v-for="item in sizeList" :key="item.value" :label="item.text" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="照片" prop="photoSrc">
              <upload-multi ref="upload" drag :list="newArtwork.photoSrc" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="赝品特征" prop="fakeCharacter">
              <el-input v-model="newArtwork.fakeCharacter" type="textarea" placeholder="请输入赝品特征" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="相关信息" prop="introduction">
              <el-input v-model="newArtwork.introduction" type="textarea" placeholder="请输入详细信息与描述" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="postArtwork">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getArtworkList, addArtwork, getArtwork, deleteArtwork } from '@/api/artwork'
import getOption from '@/utils/get-option'

export default {
  name: 'Artwork',
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
      newArtwork: {
        name: '',
        engName: '',
        jpnName: '',
        realName: '',
        price: 4980,
        salePrice: 1245,
        size: '',
        hasFake: null,
        fakeCharacter: '',
        introduction: '',
        photoSrc: []
      },
      sizeList: [],
      newArtworkRules: {
        name: [
          { required: true, message: '请输入服饰名', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ]
      },
      multipleSelection: []
    }
  },
  computed: {
    isSale() {
      const isSaleBl = this.newArtwork.orderType === '订购'
      return isSaleBl
    }
  },
  created() {
    this.fetchData()
    this.getOptions()
  },
  methods: {
    fetchData(param) {
      this.commonApi.getList(param, getArtworkList, this)
    },
    getOptions() {
      getOption('size', list => {
        this.sizeList = list
      })
    },
    postArtwork() {
      this.newArtwork.fakeCharacter ? (this.newArtwork.hasFake = true) : (this.newArtwork.hasFake = false)
      this.commonApi.postUploadForm('artwork', addArtwork, this)
    },
    handleEdit(id) {
      this.commonApi.openEditForm(id, 'artwork', getArtwork, this)
    },
    handleDelete(id) {
      this.commonApi.deleteById(id, deleteArtwork, this.fetchData)
    },
    handelMultipleDelete() {
      this.commonApi.multipleDelete(this.multipleSelection, deleteArtwork, this.fetchData)
    }
  }
}
</script>

<style scoped></style>
