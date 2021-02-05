<template>
  <div>
    <div class="tableBox">
      <div class="titleLine">
        <el-divider direction="vertical"></el-divider>
        <span>车辆信息列表</span>
      </div>
      <el-table
        data-cy="com-data-table"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        :header-cell-style="{ color: '#606266' }"
        stripe
      >
        <el-table-column prop="numberPlate" label="车牌号"></el-table-column>
        <el-table-column prop="simNumber" label="SIM卡号"></el-table-column>
        <el-table-column prop="chassisNumber" label="VIN"></el-table-column>
        <el-table-column prop="groupName" label="企业名称"></el-table-column>
        <el-table-column prop="terminalType" label="终端类型"></el-table-column>
        <el-table-column
          prop="terminalNumber"
          label="终端号码"
        ></el-table-column>
        <el-table-column prop="onlineStatus" label="在线状态"></el-table-column>
        <el-table-column prop="type" label="车辆类型"></el-table-column>
        <el-table-column
          prop="communicationType"
          label="通讯类型"
        ></el-table-column>
      </el-table>
    </div>

    <el-pagination
      @size-change="handlePageSizeChange"
      @current-change="handleCurrentPageChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalData.length"
      class="pagination-box"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  name: "CommonTable",
  props: {
    /** 所有车辆 */
    totalData: {
      type: Array
    }
  },
  watch: {
    totalData() {
      this.updateTable(true);
    }
  },
  methods: {
    /**
     * 更新表格
     */
    updateTable(isReset) {
      if (isReset) {
        this.currentPage = 1;
      }
      let start = (this.currentPage - 1) * this.pageSize;
      let end = this.currentPage * this.pageSize;
      console.log("start:" + start + ";end:" + end);
      this.tableData = this.totalData.slice(start, end);
    },
    /**
     * 每页显示条数改变
     */
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.updateTable(false);
    },
    /**
     * 当前页改变
     */
    handleCurrentPageChange(currentPage) {
      this.currentPage = currentPage;
      this.updateTable(false);
    }
  },
  data() {
    return {
      /** 车辆列表 */
      tableData: [],
      /** 当前页码 */
      currentPage: 1,
      /** 每页显示条数 */
      pageSize: 10,
      /** 在线状态列表 */
      onlineStatusList: []
    };
  },
  mounted(){
    if(this.$store.state.carInfo.carInfo!=''){
      this.tableData=this.$store.state.carInfo.carInfo
    }
  }
};
</script>
<style scoped></style>
