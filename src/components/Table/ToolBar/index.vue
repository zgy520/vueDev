<template>
    <div>
        <el-row class="rowStyle">
            <el-button type="primary" icon="el-icon-download" >模板</el-button>
            <el-button type="primary" icon="el-icon-upload">导入</el-button>
            <el-button type="primary" icon="el-icon-download">导出</el-button>
            <el-button type="primary" icon="el-icon-plus">新增</el-button>
            <el-button icon="el-icon-delete" type="danger">删除</el-button>
        </el-row>
        <el-row class="rowStyle" >
            <el-button v-for="btn in btnList" :key="btn.id"
                :type="btn.type" :icon="btn.icon" > {{ btn.name }}
            </el-button>
        </el-row>
    </div>
</template>
<script>
export default {
    name: 'ToobarBar',
    data() {
        return {
            btnList: [
                { id:"addBtn", name:"新增", type: "primary", icon: "el-icon-plus", handleEvent: "add()" },
                { id:"deleteBtn", name:"删除", type: "danger", icon: "el-icon-delete", handleEvent: "delete()" }
            ]
        }
    },
    methods: {
        add() {
            alert('点击新增了');
        },
        delete() {
            alert("点击删除了")
        }
    }
}
</script>

<style scoped>
    .rowStyle {
        margin-top: 5px;
        margin-bottom: 5px;
        float: right;
    }
</style>