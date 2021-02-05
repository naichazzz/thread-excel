<template>
  <el-dialog title="角色信息查看" :visible.sync="visible" :close-on-click-modal="false"
  @close="QualityDialogClose" width="60%">
      <el-table
          :data="tableData"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          border
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          
          <el-table-column
            prop="date"
            label="日期"
            sortable
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            sortable
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址">
          </el-table-column>
        </el-table>
  </el-dialog>
</template>

<script>
  import "@/assets/css/dialogstyle.css"
  export default{
    data(){
      return{
        visible:false,
        tableData: [{
                  id: 1,
                  date: '2016-05-02',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄'
                }, {
                  id: 2,
                  date: '2016-05-04',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1517 弄'
                }, {
                  id: 3,
                  date: '2016-05-01',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1519 弄',
                  children: [{
                      id: 31,
                      date: '2016-05-01',
                      name: '王小虎',
                      address: '上海市普陀区金沙江路 1519 弄'
                    }, {
                      id: 32,
                      date: '2016-05-01',
                      name: '王小虎',
                      address: '上海市普陀区金沙江路 1519 弄'
                  }]
                }, {
                  id: 4,
                  date: '2016-05-03',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1516 弄'
                }],
                tableData1: [{
                  id: 1,
                  date: '2016-05-02',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄'
                }, {
                  id: 2,
                  date: '2016-05-04',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1517 弄'
                }, {
                  id: 3,
                  date: '2016-05-01',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1519 弄',
                  hasChildren: true
                }, {
                  id: 4,
                  date: '2016-05-03',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1516 弄'
                }]
      }
    },
    methods: {
            QualityDialogClose() {
                this.$emit("update:QualityDialogFlag", false);
            },
    },
    props:{
      QualityDialogFlag:{
                  default: false
              },

    },
    watch: {
        QualityDialogFlag() {
            this.visible = this.QualityDialogFlag;
        },
    }
  }
</script>

<style>
</style>
