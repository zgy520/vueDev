<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.value"
        placeholder="名称"
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
        <el-button icon="el-icon-delete" type="danger" @click="deleteList">删除</el-button>
    </el-row>
    <div>
      <el-table
        :data="filterList"
        highlight-current-row
        stripe
        @current-change="handleCurrentChange"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
        :default-sort="{prop: 'code', order: 'descending'}"
        class="table-margin"
        border
        :height="tableHeight">
        <el-table-column
          type="selection"
          header-align="center"
          width="55">
        </el-table-column>
        <el-table-column
          fixed
          sortable="custom"
          header-align="center"
          prop="code"
          label="按钮编码"
          min-width='10%' >
        </el-table-column>
        <el-table-column
          prop="name"
          sortable="custom"
          header-align="center"
          label="按钮名称"
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
        <el-form :model="updateButton" label-width="80px" label-position="left">
          <el-form-item label="按钮编码">
            <el-input v-model="updateButton.code" auto-complete="off" placeholder="按钮编码" />
          </el-form-item>
          <el-form-item label="按钮名称">
            <el-input v-model="updateButton.name" auto-complete="off" placeholder="按钮名称" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="updateButton.note" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注" auto-complete="off" />
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
import { getButtonList, updateButton, deleteButton, deleteListButton } from '@/api/button'
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'

// import ToobarBar from '@/components/Table/ToolBar'

const defaultButton = {
  code: '',
  value: '',
  paramType: 'BUSINESS',
  note: ''
}

const defaultupdateBtn = {
  paramType: 'BUSINESS',
  code: '',
  value: '',
  note: ''
}

export default {
  components: { Pagination },
  methods: {
    deleteRow(index, rows) {
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    getList() {
      getButtonList(this.listQuery).then(response => {
        this.filterList = response.data
        this.total = response.totalElements
      })
    },    
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    reset() {
      this.listQuery.value = ''
      this.listQuery.code = ''
      this.getList()
    },
    add() {
      this.dialogVisible = true
      this.updateButton = Object.assign({}, defaultupdateBtn)
      this.dialogType = 'new'
    },
    modifyRow(scope) {
      this.dialogVisible = true
      this.dialogType = 'edit'
      this.updateButton = deepClone(scope.row)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    async deleteData(scope) {
      await deleteButton(scope.row.id)

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
      await updateButton(this.updateButton)
      this.getList()
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
      await deleteListButton(idList)
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
        code: undefined
      },
      Button: Object.assign({}, defaultButton),
      updateButton: Object.assign({}, defaultupdateBtn),
      dialogVisible: false,
      dialogType: 'new',
      filterMethod(query, item) {
        // return item.pinyin.indexOf(query) > -1;
      }
    }
  },
  created() {
    this.getList()
  }
}

</script>
