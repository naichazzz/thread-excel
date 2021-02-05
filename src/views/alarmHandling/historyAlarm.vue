<template>
  <div class="realTime">
    <el-divider content-position="left">历史报警</el-divider>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column fixed prop="date" label="车牌号"> </el-table-column>

      <el-table-column prop="province" label="企业名称"> </el-table-column>

      <el-table-column prop="zip" label="报警类型"> </el-table-column>
      <el-table-column prop="city" label="报警时间"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            icon="el-icon-edit"
            @click="dialogTableVisible = true"
            >处理</el-button
          >

          <el-button
            @click="handleClick(scope.row)"
            type="text"
            size="small"
            icon="el-icon-view"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="query.pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="query.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="pagination-box"
    >
    </el-pagination>

    <el-dialog title="报警处理" :visible.sync="dialogTableVisible">
      <div class="topTit">
        <span>吉A1111</span>
        <span>超速报警</span>
        <span>2020-01-01 11:11:11</span>
        <span>吉林省长春市前进大街与繁荣路交叉口</span>
      </div>

      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="处理方式">
          <el-select v-model="form.treatmentMethod" placeholder="请选择">
            <el-option label="车辆监听" value="1"></el-option>
            <el-option label="拍照" value="2"></el-option>
            <el-option label="下发信息" value="3"></el-option>
            <el-option label="关闭报警" value="4"></el-option>
            <el-option label="不做处理" value="5"></el-option>
            <el-option label="将来处理" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码" v-if="form.treatmentMethod == '1'">
          <el-input v-model="form.phoneNumber"> </el-input>
        </el-form-item>
        <el-form-item label="通道" v-if="form.treatmentMethod == '2'">
          <el-select v-model="form.passageway" placeholder="请选择">
            <el-option label="全部" value="0"></el-option>
            <el-option label="通道1" value="1"></el-option>
            <el-option label="通道2" value="2"></el-option>
            <el-option label="通道" value="3"></el-option>
            <el-option label="通道4" value="4"></el-option>
            <el-option label="通道5" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分辨率" v-if="form.treatmentMethod == '2'">
          <el-select v-model="form.resolvingPower" placeholder="请选择">
            <el-option label="最低分辨率" value="1"></el-option>
            <el-option label="320*240" value="2"></el-option>
            <el-option label="640*480" value="3"></el-option>
            <el-option label="800*600" value="4"></el-option>
            <el-option label="1024*768" value="5"></el-option>
            <el-option label="176*144" value="6"></el-option>
            <el-option label="352*288" value="7"></el-option>
            <el-option label="704*288" value="8"></el-option>
            <el-option label="704*576" value="9"></el-option>
            <el-option label="最高分辨率" value="10"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调度信息" v-if="form.treatmentMethod == '3'">
          <el-input type="textarea" :rows="2" v-model="form.info"> </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" v-if="form.treatmentMethod == '1'"
            >监听</el-button
          >
          <el-button type="primary" v-if="form.treatmentMethod == '2'"
            >拍照</el-button
          >
          <el-button type="primary" v-if="form.treatmentMethod == '3'"
            >发送</el-button
          >
          <el-button
            type="primary"
            v-if="
              form.treatmentMethod == '4' ||
              form.treatmentMethod == '5' ||
              form.treatmentMethod == '6'
            "
            >关闭报警</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 10,
        select3: "",
        value2: "",
      },
      total: 100,
      input3: "",
      select2: "1",
      select3: "1",
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1517 弄",
          zip: 200333,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1519 弄",
          zip: 200333,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1516 弄",
          zip: 200333,
        },
      ],
      dialogTableVisible: false,
      form: {
        treatmentMethod: "1",
        phoneNumber: "",
        passageway: "0",
        resolvingPower: "1",
        info: "",
      },
      multipleSelection: [],
    };
  },

  methods: {
    onload() {},
    reset() {},
    handleSizeChange(val) {
      this.query.pageNum = 1;
      this.query.pageSize = val;
      this.onload();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.onload();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>

<style>
.topRow .el-select > .el-input {
  width: 90px;
}
.topRow .input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.topRow .selectContainer .el-select > .el-input {
  width: 80%;
}
.topRow .el-date-editor {
  right: 6%;
}
.font12 {
  font-size: 12px;
  float: left;
  width: 20%;
  text-align: left;
  line-height: 28px;
}
.realTime .el-row {
  margin-bottom: 20px;
}
.realTime .el-row:last-child {
  margin-bottom: 0;
}
.realTime .topTit {
  margin-bottom: 40px;
}
.realTime .topTit span {
  margin-right: 15px;
}
</style>
