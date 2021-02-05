<template>
  <section>
 <!--工具条-->

    <div style="text-align: center;margin-top: 20px;">
      <el-row :gutter="24">
        <el-col :span="10">
          <div style="font-weight: bold;margin-bottom:0;line-height: 24px; height: 24px; text-align: left;">搜索列表</div>
          <el-table
            ref="staffTable"
            height="350"
            v-loading="listLoading"
            :row-key="getRowKeys"
            :data="staffList"
            border
            fit
            highlight-current-row
            @selection-change="handleStaffChange"
          >
            <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
            <el-table-column :label="item.title" align="center" v-for="item in tableNow" prop="item.value" :key="item.value">

            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="4">
          <el-button @click="addStaff" type="primary" :disabled="!staffData.length" size="small" style="margin-top: 100%;">批量加入</el-button>
          <el-button
            @click="removeStaff"
            type="primary"
            :disabled="!selectedStaffData.length"
            size="small"
            style="margin-left: 0;margin-top: 10px;"
          >批量取消</el-button>
        </el-col>
        <el-col :span="10">
          <div style="font-weight: bold;margin-bottom:0;line-height: 24px; height: 24px; text-align: left;">已选列表</div>
          <el-table
            ref="selectedStaffTable"
            height="350"
            v-loading="listLoading"
            :row-key="getRowKeys2"
            :data="selectedStaffList"
            border
            fit
            highlight-current-row
            @selection-change="handleSelectedStaffChange"
          >
            <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
            <el-table-column :label="item.title" align="center" v-for="(item,index) in tableNow" prop="item.value" :key="item.value" v-if="index<2">

            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>

    <!-- <div style="text-align:center;margin:20px 0">
      <el-button type="primary" @click="submitForm('siteForm')">确定</el-button>
    </div> -->
  </section>
</template>


<script>
  export default {
     data() {
        return {
          delFormVisible:false,//删除列表
          delList:[],
          lists: JSON.parse(sessionStorage.getItem("lists"))
            ? JSON.parse(sessionStorage.getItem("lists"))
            : [],//这里是我因为新增的需要自己手动写，所以存在了本地，在另一个页面使用
          tradesList: [],
          tradeSonList: [],
          labelTypeList: [],
          secLabelList: [],
          ids: [],
          staffTemp: {},
          staffList: [],//左边表格
          selectedStaffList: [],//右边表格
          staffData: [],
          selectedStaffData: [],
          tableKey: 0,
          rowKey: "rowKey",
          listLoading: false,
          searchDate1: [-1, -1],
          remitDate: "",
          radioMusic: 1,
          remark: "",
          updateMusic: "",
          selectName: true,
          changeSecName: 0,
          pattern: 0,
          aisle: 0,
          siteForm: {
            itemModel: 0,
            types: 0
          },
          sels: [],
             };
      },
      props: ['tableNow'],
        methods: {
        //我看到elementUI上说这个是必须的，好像是这样的，不写就会报错，说RowKey有问题。。
          getRowKeys(row) {
            // 行数据的Key
            return row.id;
          },
          getRowKeys2(row) {
            // 行数据的Key
            return row.id;
          },
           // 获取搜索列表（左边表格数据）
          getList() {
            let para = {
              title: this.title,
              labelIdList: this.secLabelList,
              pageNo: 1,
              pageSize: this.pageSize
            };
            musicBeforeEditApi(para).then(res => {
              if (res.data.result == 0) {
                this.staffList = res.data.data.list;
                this.delList=[]
                // console.log(res.data);
              } else {
                Message.error(res.data.msg);
              }
            });
          },
          // 将左边表格选择项存入staffData中
          handleStaffChange(rows) {
            this.staffData = [];
            if (rows) {
              rows.forEach(row => {
                if (row) {
                  this.staffData.push(row);
                }
              });
            }
          },
          // 左边表格选择项移到右边
          addStaff() {
            setTimeout(() => {
              this.$refs["staffTable"].clearSelection();
              this.$refs["selectedStaffTable"].clearSelection();
            }, 0);
            let repeat = false;
            this.selectedStaffList.forEach(item => {
              if (
                this.staffData[0] &&
                item.musicUuid === this.staffData[0].musicUuid
              ) {
                repeat = true;
                Message.error("此音乐已添加");
                return;
              }
            });
            if (repeat === false) {
              this.staffData.forEach(item => {
                this.selectedStaffList.push(item);
              });
              for (let i = 0; i < this.staffList.length; i++) {
                for (let j = 0; j < this.staffData.length; j++) {
                  if (
                    this.staffList[i] &&
                    this.staffData[j] &&
                    this.staffList[i].musicUuid === this.staffData[j].musicUuid
                  ) {
                    this.staffList.splice(i, 1);
                  }
                }
              }
            }
          },
          // 右边表格选择项移到左边
          removeStaff() {
            setTimeout(() => {
              this.$refs["staffTable"].clearSelection();
              this.$refs["selectedStaffTable"].clearSelection();
            }, 0);
            this.selectedStaffData.forEach(item => {
              this.staffList.push(item);
            });
            for (let i = 0; i < this.selectedStaffList.length; i++) {
              for (let j = 0; j < this.selectedStaffData.length; j++) {
                if (
                  this.selectedStaffList[i] &&
                  this.selectedStaffData[j] &&
                  this.selectedStaffList[i].phone === this.selectedStaffData[j].phone
                ) {
                  this.selectedStaffList.splice(i, 1);
                }
              }
            }
          },
          // 将右边表格选择项存入selectedStaffData中
          handleSelectedStaffChange(rows) {
            this.selectedStaffData = [];
            if (rows) {
              rows.forEach(row => {
                if (row) {
                  this.selectedStaffData.push(row);
                }
              });
            }
          },
          // 提交（没有写提交功能，可不用）
          modifyStaff() {
            let isEmpty = false;
            this.selectedStaffList.forEach(item => {
              if (!item.staffTypeId) {
                this.$message({
                  message:'请选择类型'
                })
                isEmpty = true;
                return;
              }
            });
            if (isEmpty === false) {
              editStaff(this.selectedStaffList, this.deviceQuery.id).then(res => {
                this.staffListVisible = false;
                this.$notify({
                  title: "成功",
                  message: "修改成功",
                  type: "success",
                  duration: 2000
                });
              });
            }
          },
          // 删除列表
          handleToDelList() {
            this.delFormVisible=true
          },
          // 删除
          handleDel(index,row){
            this.delList.push(row)
            this.staffList.splice(index,1)
            // console.log(this.delList,this.staffList)
          },
          // 恢复
          handleRecover(index,row){
            this.staffList.push(row)
            this.delList.splice(index,1)
          },
          }

  }
</script>

<style>
</style>
