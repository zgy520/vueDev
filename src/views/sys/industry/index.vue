<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="名称"
        style="width: 200px"
        class="filter-item" />
      <el-input
        v-model="listQuery.shortName"
        placeholder="简称"
        style="width: 200px"
        class="filter-item" />
      <el-input
        v-model="listQuery.code"
        placeholder="编码"
        style="width: 200px"
        class="filter-item"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" type="reset" icon="el-icon-reset" @click="reset">
        重置
      </el-button>
    </div>
    <el-row class="btn-container">
        <el-button type="primary" icon="el-icon-download" >模板</el-button>
        <el-button type="primary" icon="el-icon-upload">导入</el-button>
        <el-button type="primary" icon="el-icon-download">导出</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        <!-- <el-button icon="el-icon-delete" type="danger" @click="deleteList">删除</el-button> -->
    </el-row>
    <div>
      <el-table
        :data="filterList"
        highlight-current-row
        stripe
        :tree-props="{children: 'children'}"
        row-key="id"
        class="table-margin"
        border
        default-expand-all
        :height="tableHeight">
        <!-- <el-table-column
          type="selection"
          header-align="center"
          width="55"> -->
        <!-- </el-table-column> -->
        <el-table-column
          fixed
          sortable="custom"
          header-align="center"
          prop="name"
          label="行业名称"
          min-width='10%' >
        </el-table-column>
        <el-table-column
          prop="shortName"
          sortable="custom"
          header-align="center"
          label="行业简称"
          min-width='10%'>
        </el-table-column>
        <el-table-column
          prop="code"
          sortable="custom"
          header-align="center"
          label="行业编码"
          min-width='10%'>
        </el-table-column>
        <el-table-column
          prop="note"
          header-align="center"
          label="备注"
          min-width="15%"
        ></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          header-align="center"
          align="center"
          min-width="20%">
          <template slot-scope="scope">
            <el-button
              @click="modifyRow(scope)"
              type="text"
              size="small">
              编辑
            </el-button>
            <el-button
              @click="deleteData(scope)"
              type="text"
              size="small">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination ="getList" />
    </div>
    <div>
      <el-dialog :title="dialogType === 'edit'?'编辑':'新增'" :visible.sync="dialogVisible" width="30%">
        <el-form :model="updateIndustry" label-width="80px" label-position="left">
          <el-form-item label="名称">
            <el-input v-model="updateIndustry.name" auto-complete="off" placeholder="名称" />
          </el-form-item>
          <el-form-item label="简称">
            <el-input v-model="updateIndustry.shortName" auto-complete="off" placeholder="简称" />
          </el-form-item>
          <el-form-item label="代码">
            <el-input v-model="updateIndustry.code" auto-complete="off" placeholder="代码" />
          </el-form-item>
          <el-form-item label="上级行业">
            <el-select v-model="updateIndustry.parentId" placeholder="请选择上级行业" style="width: 100%">
              <el-option
                v-for="item in supIndustryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="updateIndustry.note" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注" auto-complete="off" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getIndustryList, updateIndustry, deleteIndustry, deleteListIndustry, getIndustryOptions } from '@/api/industry'
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'

// import ToobarBar from '@/components/Table/ToolBar'

// const defaultIndustry = {
//   name: '',
//   code: '',
//   note: '',
//   parentId: '',
//   dictType: ''
// }

const defaultUpdateIndustry = {
  name: '',
  code: '',
  note: '',
  shortName: '',
  parentId: ''
}

export default {
  components: { Pagination },
  methods: {
    deleteRow(index, rows) {
      console.log('xx')
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    getList() {
      getIndustryList(this.listQuery).then(response => {
        this.filterList = response.data
        this.total = response.totalElements
      })
    },
    getOtherList() {
      getIndustryOptions().then(response => {
        this.supIndustryOptions = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    reset() {
      this.listQuery.name = ''
      this.listQuery.code = ''
      this.listQuery.shortName = ''
      this.getList()
    },
    add() {
      this.dialogVisible = true
      this.updateIndustry = Object.assign({}, defaultUpdateIndustry)
      this.dialogType = 'new'
    },
    modifyRow(scope) {
      this.dialogVisible = true
      this.dialogType = 'edit'
      this.updateIndustry = deepClone(scope.row)
    },    
    async deleteData(scope) {
      await deleteIndustry(scope.row.id)

      this.$notify({
        title: '成功',
        dangerouslyUseHTMLString: true,
        position: 'bottom-right',
        message: '删除成功',
        type: 'success'
      })
      this.getList()
    },
    async confirm() {
      await updateIndustry(this.updateIndustry)
      this.getList()
      this.getOtherList()
      this.dialogVisible = false
      this.$notify({
        title: '成功',
        dangerouslyUseHTMLString: true,
        position: 'bottom-right',
        message: '更新成功',
        type: 'success'
      })
    },        
    async deleteList() {
      var idList = []
      this.multipleSelection.forEach(element => {
        idList.push(element.id)
      })
      await deleteListIndustry(idList)
      this.getList()
      this.$notify({
        title: '成功',
        dangerouslyUseHTMLString: true,
        position: 'bottom-right',
        message: '删除成功',
        type: 'success'
      })
    },
    handleSortChange(sortable) {
      this.listQuery.sort = sortable.prop + ',' + (sortable.order === 'descending' ? 'DESC' : 'ASC')
      this.getList()
    }
  },
  data() {
    return {
      currentRow: null,
      filterList: [],
      tableHeight: window.innerHeight - 300,
      total: 8,
      listQuery: {
        page: 1,
        size: 10,
        sort: 'code',
        name: undefined,
        code: undefined,
        shortName: undefined
      },
      Industry: Object.assign({}, updateIndustry),
      updateIndustry: Object.assign({}, defaultUpdateIndustry),
      dialogVisible: false,
      dialogType: 'new',
      supIndustryOptions: [],
    }
  },
  created() {
    this.getList()
    this.getOtherList()
  }
}

</script>
