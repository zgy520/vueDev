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
          label="菜单名称"
          min-width='10%' >
        </el-table-column>
        <el-table-column
          prop="code"
          sortable="custom"
          header-align="center"
          label="菜单编码"
          min-width='10%'>
        </el-table-column>
        <el-table-column
          prop="url"
          sortable="custom"
          header-align="center"
          label="菜单地址"
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
              @click="relateButton(scope)"
              type="text"
              size="small">
              按钮
            </el-button>
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
        <el-form :model="updateMenu" label-width="80px" label-position="left">
          <el-form-item label="名称">
            <el-input v-model="updateMenu.name" auto-complete="off" placeholder="名称" />
          </el-form-item>
          <el-form-item label="代码">
            <el-input v-model="updateMenu.code" auto-complete="off" placeholder="代码" />
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="updateMenu.url" auto-complete="off" placeholder="访问地址" />
          </el-form-item>
          <el-form-item label="上级菜单">
            <el-select v-model="updateMenu.parentId" placeholder="请选择上级菜单" style="width: 100%">
              <el-option
                v-for="item in supMenuOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="updateMenu.note" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注" auto-complete="off" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
        </span>
      </el-dialog>
    </div>
    <div>
      <el-dialog title='设置按钮' :visible.sync="transferVisible" width="35%">
        <el-transfer
          filterable
          :titles="['可关联按钮', '已关联按钮']"
          filter-placeholder="请输入按钮"
          :value="selectedButtonList"
          @change="handleChange"
          :data="buttonList">
        </el-transfer>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="transferVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmRelateButton">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getMenuList, updateMenu, deleteMenu, deleteListMenu, getAccountListByMenuId, getMenuOptions, relateButton } from '@/api/menu'
import { getButtonListByMenuId } from '@/api/button'
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'

// import ToobarBar from '@/components/Table/ToolBar'

// const defaultMenu = {
//   name: '',
//   code: '',
//   note: '',
//   parentId: '',
//   dictType: ''
// }

const defaultUpdateMenu = {
  name: '',
  code: '',
  note: '',
  url: '',
  parentId: ''
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
      getMenuList(this.listQuery).then(response => {
        this.filterList = response.data
        this.total = response.totalElements
      })
    },
    getOtherList() {
      getMenuOptions().then(response => {
        this.supMenuOptions = response.data
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
    async relateButton(scope) {
      this.selectedMenuId = scope.row.id
      getButtonListByMenuId(scope.row.id).then(response => {
        this.transferVisible = true
        var result = response.data
        this.buttonList = result
        this.selectedButtonList = []
        var selectedArray = result.filter(function(button) {
          return button.selected === true
        })
        selectedArray.forEach(select => {
          this.selectedButtonList.push(select.key)
        })
      })
    },
    handleChange(value, direction, movedKeys) {
        console.log(value, direction, movedKeys);
        if(direction === 'right'){
            movedKeys.forEach(item => {
            this.selectedButtonList.push(item)
          })  
        }else {
          movedKeys.forEach(item => {
            this.selectedButtonList.splice(this.selectedButtonList.indexOf(item),1)
          }) 
        }
    },
    async confirmRelateButton() {
      console.log(this.selectedMenuId + ":" + this.selectedButtonList)
      await relateButton(this.selectedMenuId, this.selectedButtonList)
      this.transferVisible = false
    },
    add() {
      this.dialogVisible = true
      this.updateMenu = Object.assign({}, defaultUpdateMenu)
      this.dialogType = 'new'
    },
    modifyRow(scope) {
      this.dialogVisible = true
      this.dialogType = 'edit'
      this.updateMenu = deepClone(scope.row)
    },
    async deleteData(scope) {
      await deleteMenu(scope.row.id)

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
      await updateMenu(this.updateMenu)
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
      await deleteListMenu(idList)
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
      Menu: Object.assign({}, updateMenu),
      updateMenu: Object.assign({}, defaultUpdateMenu),
      dialogVisible: false,
      transferVisible: false,
      buttonList: [],
      selectedButtonList: [],
      selectedMenuId: '',
      dialogType: 'new',
      supMenuOptions: [],
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
