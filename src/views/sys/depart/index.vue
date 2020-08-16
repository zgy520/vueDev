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
        <el-button icon="el-icon-delete" type="danger" @click="deleteList">删除</el-button>
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
          prop="name"
          label="部门名称"
          min-width='10%' >
        </el-table-column>
        <el-table-column
          prop="code"
          sortable="custom"
          header-align="center"
          label="编码"
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
              @click="relateUser(scope)"
              type="text"
              size="small">
              用户
            </el-button>
            <el-button
              @click="relatePost(scope)"
              type="text"
              size="small">
              岗位
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
        <el-form :model="updateDepart" label-width="80px" label-position="left">
          <el-form-item label="名称">
            <el-input v-model="updateDepart.name" auto-complete="off" placeholder="部门名称" />
          </el-form-item>
          <el-form-item label="代码">
            <el-input v-model="updateDepart.code" auto-complete="off" placeholder="部门代码" />
          </el-form-item>
          <el-form-item label="上级部门">
            <el-select v-model="updateDepart.parentId" placeholder="请选择上级部门" style="width: 100%">
              <el-option
                v-for="item in supDepartOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属企业">
            <el-select v-model="updateDepart.enterpriseId" placeholder="请选择所属企业" style="width: 100%">
              <el-option
                v-for="item in enterpriseList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="updateDepart.note" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注" auto-complete="off" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
        </span>
      </el-dialog>
    </div>
    <div>
      <el-dialog title='设置用户' :visible.sync="transferVisible" width="35%">
        <el-transfer
          filterable
          :titles="['可关联用户', '已关联用户']"
          filter-placeholder="请输入用户名"
          :value="selectedUserList"
          @change="handleChange"
          :data="userList">
        </el-transfer>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="transferVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmRelateUser">确认</el-button>
        </span>
      </el-dialog>
      <el-dialog title='设置岗位' :visible.sync="postTransferVisible" width="35%">
        <el-transfer
          filterable
          :titles="['可关联岗位', '已关联岗位']"
          filter-placeholder="请输入岗位名称"
          :value="selectedPostList"
          @change="handlePostChange"
          :data="postList">
        </el-transfer>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="postTransferVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmRelatePost">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getDepartList, updateDepart, deleteDepart, deleteListDepart, getAccountListByDepartId, getPostListByDepartId, getSuperDepartOptions, relateUser, relatePost } from '@/api/depart'
import { getEnterpriseOptions } from '@/api/enterprise'
import { getSelectList } from '@/api/account'
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'

// import ToobarBar from '@/components/Table/ToolBar'

const defaultDepart = {
  name: '',
  code: '',
  note: '',
  parentId: '',
  enterpriseId: ''
}

const defaultUpdateDepart = {
  name: '',
  code: '',
  note: '',
  parentId: '',
  enterpriseId: ''
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
      getDepartList(this.listQuery).then(response => {
        this.filterList = response.data
        this.total = response.totalElements
      })
    },
    getOtherList() {
      getSuperDepartOptions().then(response => {
        this.supDepartOptions = response.data
      })
      getEnterpriseOptions().then(response => {
        this.enterpriseList = response.data
      })
    },
    getUserList() {
      getSelectList().then(response => {
        this.userList = response.data
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
      console.log(defaultUpdateDepart)
      this.updateDepart = Object.assign({}, defaultUpdateDepart)
      this.dialogType = 'new'
    },
    modifyRow(scope) {
      this.dialogVisible = true
      this.dialogType = 'edit'
      this.updateDepart = deepClone(scope.row)
    },
    async relateUser(scope) {
      this.selectedDepartId = scope.row.id
      getAccountListByDepartId(scope.row.id).then(response => {
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
    async relatePost(scope) {
      this.selectedDepartId = scope.row.id
      getPostListByDepartId(scope.row.id).then(response => {
        this.postTransferVisible = true
        var result = response.data
        this.postList = result
        this.selectedPostList = []
        var selectedArray = result.filter(function(user) {
          return user.selected === true
        })
        selectedArray.forEach(select => {
          this.selectedPostList.push(select.key)
        })
      })
    },
    handleChange(value, direction, movedKeys) {
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
    handlePostChange(value, direction, movedKeys) {
      if (direction === 'right') {
        movedKeys.forEach(item => {
          this.selectedPostList.push(item)
        })
      } else {
        movedKeys.forEach(item => {
          this.selectedPostList.splice(this.selectedPostList.indexOf(item), 1)
        })
      }
    },
    async deleteData(scope) {
      await deleteDepart(scope.row.id)

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
      await updateDepart(this.updateDepart)
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
    async confirmRelateUser() {
      console.log(this.selectedDepartId + ':' + this.selectedUserList)
      await relateUser(this.selectedDepartId, this.selectedUserList)
      this.transferVisible = false
    },
    async confirmRelatePost() {
      console.log(this.selectedDepartId + ':' + this.selectedPostList)
      await relatePost(this.selectedDepartId, this.selectedPostList)
      this.postTransferVisible = false
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
      await deleteListDepart(idList)
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
      Depart: Object.assign({}, defaultDepart),
      updateDepart: Object.assign({}, defaultUpdateDepart),
      dialogVisible: false,
      transferVisible: false,
      postTransferVisible: false,
      dialogType: 'new',
      selectedDepartId: '',
      userList: [],
      postList: [],
      selectedUserList: [],
      selectedPostList: [],
      supDepartOptions: [],
      enterpriseList: [],
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
