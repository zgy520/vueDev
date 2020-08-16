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
          label="企业名称"
          min-width='10%' >
        </el-table-column>
        <el-table-column
          prop="shortName"
          sortable="custom"
          header-align="center"
          label="企业简称"
          min-width='10%'>
        </el-table-column>
        <el-table-column
          prop="code"
          sortable="custom"
          header-align="center"
          label="企业编码"
          min-width='10%'>
        </el-table-column>
        <el-table-column
          prop="phonePerson"
          sortable="custom"
          header-align="center"
          label="联系人"
          min-width='10%'>
        </el-table-column>
        <el-table-column
          prop="phoneNumber"
          sortable="custom"
          header-align="center"
          label="联系电话"
          min-width='10%'>
        </el-table-column>
        <el-table-column
          prop="phoneEmail"
          sortable="custom"
          header-align="center"
          label="联系方式"
          min-width='10%'>
        </el-table-column>
        <el-table-column
          prop="registerPerson"
          sortable="custom"
          header-align="center"
          label="注册人"
          min-width='10%'>
        </el-table-column>
        <el-table-column
          prop="identity"
          sortable="custom"
          header-align="center"
          label="信用号"
          min-width='10%'>
        </el-table-column>
        <el-table-column
          prop="initorDate"
          sortable="custom"
          header-align="center"
          label="成立日期"
          min-width='10%'>
        </el-table-column>
        <el-table-column
          prop="address"
          sortable="custom"
          header-align="center"
          label="注册地址"
          min-width='10%'>
        </el-table-column>
        <el-table-column
          prop="industryName"
          sortable="custom"
          header-align="center"
          label="所属行业"
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
        <el-form :model="updateEnterprise" label-width="80px" label-position="left">
          <el-form-item label="名称">
            <el-input v-model="updateEnterprise.name" auto-complete="off" placeholder="名称" />
          </el-form-item>
          <el-form-item label="简称">
            <el-input v-model="updateEnterprise.shortName" auto-complete="off" placeholder="简称" />
          </el-form-item>
          <el-form-item label="代码">
            <el-input v-model="updateEnterprise.code" auto-complete="off" placeholder="代码" />
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="updateEnterprise.phonePerson" auto-complete="off" placeholder="联系人" />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="updateEnterprise.phoneNumber" auto-complete="off" placeholder="联系电话" />
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="updateEnterprise.phoneEmail" auto-complete="off" placeholder="联系方式" />
          </el-form-item>
          <el-form-item label="注册人">
            <el-input v-model="updateEnterprise.registerPerson" auto-complete="off" placeholder="注册人" />
          </el-form-item>
          <el-form-item label="社会统一信用号">
            <el-input v-model="updateEnterprise.identity" auto-complete="off" placeholder="社会统一信用号" />
          </el-form-item>
          <el-form-item label="成立日期">
            <el-input v-model="updateEnterprise.initorDate" auto-complete="off" placeholder="成立日期" />
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="updateEnterprise.address" auto-complete="off" placeholder="地址" />
          </el-form-item>
          <el-form-item label="上级企业">
            <el-select v-model="updateEnterprise.parentId" placeholder="请选择上级企业" style="width: 100%">
              <el-option
                v-for="item in supEnterpriseOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属行业">
            <el-select v-model="updateEnterprise.industryId" placeholder="请选择上级行业" style="width: 100%">
              <el-option
                v-for="item in industryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="updateEnterprise.note" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注" auto-complete="off" />
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
import { getEnterpriseList, updateEnterprise, deleteEnterprise, deleteListEnterprise, getSuperEnterpriseOptions } from '@/api/enterprise'
import { getIndustryOptions } from '@/api/industry'
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'

// import ToobarBar from '@/components/Table/ToolBar'

// const defaultEnterprise = {
//   name: '',
//   code: '',
//   note: '',
//   parentId: '',
//   dictType: ''
// }

const defaultUpdateEnterprise = {
  name: '',
  code: '',
  note: '',
  shortName: '',
  industryId: '',
  phonePerson: '',
  phoneNumber: '',
  phoneEmail: '',
  registerPerson: '',
  identity: '',
  initorDate: '',
  address: '',
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
      getEnterpriseList(this.listQuery).then(response => {
        this.filterList = response.data
        this.total = response.totalElements
      })
    },
    getOtherList() {
      getSuperEnterpriseOptions().then(response => {
        this.supEnterpriseOptions = response.data
      })
      getIndustryOptions().then(response => {
          this.industryOptions = response.data
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
      this.updateEnterprise = Object.assign({}, defaultUpdateEnterprise)
      this.dialogType = 'new'
    },
    modifyRow(scope) {
      this.dialogVisible = true
      this.dialogType = 'edit'
      this.updateEnterprise = deepClone(scope.row)
    },
    async deleteData(scope) {
      await deleteEnterprise(scope.row.id)

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
      await updateEnterprise(this.updateEnterprise)
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
      await deleteListEnterprise(idList)
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
      industryOptions: [],
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
      Enterprise: Object.assign({}, updateEnterprise),
      updateEnterprise: Object.assign({}, defaultUpdateEnterprise),
      dialogVisible: false,
      dialogType: 'new',
      supEnterpriseOptions: []
    }
  },
  created() {
    this.getList()
    this.getOtherList()
  }
}

</script>
