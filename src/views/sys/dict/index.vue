<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
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
          label="字典名称"
          min-width='10%' >
        </el-table-column>
        <el-table-column
          prop="code"
          sortable="custom"
          header-align="center"
          label="字典编码"
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
        <el-form :model="updateDict" label-width="80px" label-position="left">
          <el-form-item label="名称">
            <el-input v-model="updateDict.name" auto-complete="off" placeholder="名称" />
          </el-form-item>
          <el-form-item label="代码">
            <el-input v-model="updateDict.code" auto-complete="off" placeholder="代码" />
          </el-form-item>
          <el-form-item label="字典类型">
            <el-select v-model="updateDict.parentId" placeholder="请选择字典类型" style="width: 100%">
              <el-option
                v-for="item in supDictOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="updateDict.note" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注" auto-complete="off" />
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
import { getDictList, updateDict, deleteDict, deleteListDict, getAccountListByDictId, getSuperDictOptions, relateUser } from '@/api/dict'
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'

// import ToobarBar from '@/components/Table/ToolBar'

// const defaultDict = {
//   name: '',
//   code: '',
//   note: '',
//   parentId: '',
//   dictType: ''
// }

const defaultUpdateDict = {
  name: '',
  code: '',
  note: '',
  parentId: '',
  dictType: 'BUSINESS'
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
      getDictList(this.listQuery).then(response => {
        this.filterList = response.data
        this.total = response.totalElements
      })
    },
    getOtherList() {
      getSuperDictOptions().then(response => {
        this.supDictOptions = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    reset() {
      this.listQuery.name = ''
      this.listQuery.code = ''
      this.getList()
    },
    add() {
      this.dialogVisible = true
      console.log(defaultUpdateDict)
      this.updateDict = Object.assign({}, defaultUpdateDict)
      this.dialogType = 'new'
    },
    modifyRow(scope) {
      this.dialogVisible = true
      this.dialogType = 'edit'
      this.updateDict = deepClone(scope.row)
    },
    async relateUser(scope) {
      this.selectedDepartId = scope.row.id
      getAccountListByDictId(scope.row.id).then(response => {
        this.transferVisible = true
        var result = response.data
        this.userList = result
        this.selectedUserList = []
        var selectedArray = result.filter(function(user) {
          return user.selected === true
        })
        selectedArray.forEach(select => {
          this.selectedUserList.push(select.key)
        })
      })
    },
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
      if (direction === 'right') {
        movedKeys.forEach(item => {
          this.selectedUserList.push(item)
        })
      } else {
        movedKeys.forEach(item => {
          this.selectedUserList.splice(this.selectedUserList.indexOf(item), 1)
        })
      }
    },
    async deleteData(scope) {
      await deleteDict(scope.row.id)

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
      await updateDict(this.updateDict)
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
    async confirmRelateUser() {
      console.log(this.selectedDepartId + ':' + this.selectedUserList)
      await relateUser(this.selectedDepartId, this.selectedUserList)
      this.transferVisible = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    async deleteList() {
      var idList = []
      this.multipleSelection.forEach(element => {
        idList.push(element.id)
      })
      await deleteListDict(idList)
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
    },
    superDepartFormatter() {

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
      Dict: Object.assign({}, updateDict),
      updateDict: Object.assign({}, defaultUpdateDict),
      dialogVisible: false,
      transferVisible: false,
      dialogType: 'new',
      selectedDepartId: '',
      userList: [],
      selectedUserList: [],
      supDictOptions: [],
      filterMethod(query, item) {
        // return item.pinyin.indexOf(query) > -1;
      }
    }
  },
  created() {
    this.getList()
    this.getOtherList()
  }
}

</script>
