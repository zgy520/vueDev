<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="名称"
        style="width: 200px"
        class="filter-item" />
      <el-input
        v-model="listQuery.loginName"
        placeholder="登录名称"
        style="width: 200px"
        class="filter-item"></el-input>
      <el-input
        v-model="listQuery.departName"
        placeholder="部门名称"
        style="width: 200px"
        class="filter-item"></el-input>
      <el-input
        v-model="listQuery.postName"
        placeholder="岗位名称"
        style="width: 200px"
        class="filter-item"></el-input>
      <el-input
        v-model="listQuery.roleName"
        placeholder="角色名称"
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
        <el-button type="primary" icon="el-icon-plus" @click="addUser">新增</el-button>
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
        :default-sort="{prop: 'expiredDate', order: 'descending'}"
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
          label="姓名"
          min-width='10%' >
        </el-table-column>
        <el-table-column
          prop="loginName"
          sortable="custom"
          header-align="center"
          label="登录名"
          min-width='10%'>
        </el-table-column>
        <el-table-column
          prop="email"
          show-overflow-tooltip
          header-align="center"
          sortable="custom"
          label="邮箱"
          min-width='10%'>
        </el-table-column>
        <el-table-column
          prop="departName"
          sortable
          header-align="center"
          label="部门"
          min-width="10%"
        ></el-table-column>
        <el-table-column
          prop="postList"
          sortable
          header-align="center"
          label="所属岗位"
          show-overflow-tooltip
          min-width="10%"
          :formatter="postFormatter"
        ></el-table-column>
        <el-table-column
          prop="roleList"
          sortable
          header-align="center"
          label="所属角色"
          show-overflow-tooltip
          min-width="10%"
          :formatter="roleFormatter"
        ></el-table-column>
        <el-table-column
          prop="expiredDate"
          sortable
          header-align="center"
          label="到期时间"
          min-width='15%'
        ></el-table-column>
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
        <el-form :model="updateAccount" label-width="80px" label-position="left">
          <el-form-item label="用户名称">
            <el-input v-model="updateAccount.name" auto-complete="off" placeholder="用户名称" />
          </el-form-item>
          <el-form-item label="登录名称">
            <el-input v-model="updateAccount.loginName" auto-complete="off" placeholder="登录名称" />
          </el-form-item>
          <el-form-item label="Email">
            <el-input v-model="updateAccount.email" auto-complete="off" placeholder="email" />
          </el-form-item>
          <el-form-item label="所属部门">
            <el-select v-model="updateAccount.departId" placeholder="请选择部门" style="width: 100%">
              <el-option
                v-for="item in departOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属岗位">
            <el-select v-model="updateAccount.postIdList" multiple placeholder="请选择岗位" style="width: 100%">
              <el-option
                v-for="item in postOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属角色">
            <el-select v-model="updateAccount.roleIdList" multiple placeholder="请选择角色" style="width: 100%">
              <el-option
                v-for="item in roleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="updateAccount.note" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注" auto-complete="off" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmUser">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getAccountList, updateUser, deleteUser, deleteListUser } from '@/api/account'
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'
import { getDepartOptions } from '@/api/depart'
import { getPostOptions } from '@/api/post'
import { getRoleOptions } from '@/api/role'

// import ToobarBar from '@/components/Table/ToolBar'

const defaultAccount = {
  name: '',
  loginName: '',
  email: '',
  note: ''
}

const defaultUpdateAccount = {
  name: '',
  loginName: '',
  email: '',
  departId: '',
  roleIdList: [],
  postIdList: [],
  note: ''
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
      getAccountList(this.listQuery).then(response => {
        this.filterList = response.data
        this.total = response.totalElements
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    reset() {
      this.listQuery.name = ''
      this.listQuery.loginName = ''
      this.listQuery.departName = ''
      this.listQuery.postName = ''
      this.listQuery.roleName = ''
      this.getList()
    },
    addUser() {
      this.dialogVisible = true
      this.updateAccount = Object.assign({}, defaultUpdateAccount)
      this.dialogType = 'new'
    },
    modifyRow(scope) {
      this.dialogVisible = true
      this.dialogType = 'edit'
      this.updateAccount = deepClone(scope.row)
    },
    async deleteData(scope) {
      await deleteUser(scope.row.id)

      this.$notify({
        title: '成功',
        dangerouslyUseHTMLString: true,
        position: 'bottom-right',
        message: '删除成功',
        type: 'success'
      })
      this.getList()
    },
    async confirmUser() {
      await updateUser(this.updateAccount)
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
    roleFormatter(row, column) {
      return row.roleList.toString(',')
    },
    postFormatter(row, column) {
      return row.postList.toString(',')
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
      await deleteListUser(idList)
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
      if (sortable.prop === 'departName') {
        sortable.prop = 'departmentAccounts.department.name'
      } else if (sortable.prop === 'roleList') {
        sortable.prop = 'roleSet.name'
      } else if (sortable.prop === 'postList') {
        sortable.prop = 'postSet.name'
      }
      this.listQuery.sort = sortable.prop + ',' + (sortable.order === 'descending' ? 'DESC' : 'ASC')
      this.getList()
    },
    getOtherList() {
      getDepartOptions().then(response => {
        this.departOptions = response.data
      })
      getPostOptions().then(response => {
        this.postOptions = response.data
      })
      getRoleOptions().then(response => {
        this.roleOptions = response.data
      })
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
        sort: 'expiredDate',
        name: undefined,
        loginName: undefined,
        departName: undefined,
        postName: undefined,
        roleName: undefined
      },
      departOptions: [],
      roleOptions: [],
      postOptions: [],
      account: Object.assign({}, defaultAccount),
      updateAccount: Object.assign({}, defaultUpdateAccount),
      dialogVisible: false,
      dialogType: 'new',
      multipleSelection: []
    }
  },
  created() {
    this.getList()
    this.getOtherList()
  }
}

</script>
