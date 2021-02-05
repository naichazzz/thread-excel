<template>
  <div>
    <el-input
      data-cy="bas-screen-input"
      placeholder="请输入内容"
      v-model="screenGroupName"
      class="input-with-select"
      size="small"
      clearable
    >
      <el-select
        data-cy="bas-screen-select"
        v-model="selectType"
        slot="prepend"
        placeholder="请选择"
        style="width: 100px"
      >
        <el-option label="按组名" value="1"></el-option>
      </el-select>
      <el-button
        data-cy="bas-search-button"
        slot="append"
        icon="el-icon-search"
        @click="search"
      ></el-button>
    </el-input>
    <el-table
      data-cy="bas-data-table"
      :data="tableDataGroup"
      style="width: 100%"
      highlight-current-row
      :tree-props="{ children: 'childList', hasChildren: 'hasChildren' }"
      row-key="id"
      ref="groupList"
      tooltip-effect="dark"
      @select="select"
      @selection-change="handle_selectionChangeSingle"
      default-expand-all
      max-height="300px"
      v-loading="loading"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column
        prop="groupName"
        label="组名"
        width="180"
      ></el-table-column>
      <el-table-column prop="name" label="父组名" width="180"></el-table-column>
      <el-table-column prop="remark" label="描述"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { grouplist } from "@/api/system/group";
export default {
  name: "BaseGroup",
  data() {
    return {
      /**
       * 组名筛选
       */
      screenGroupName: "",
      selectType: "1",
      /** 组表 */
      tableDataGroup: [],
      groupId: 0,
      loading: false,
    };
  },
  props: {
    postGroupId: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    postGroupId(newValue, oldValue) {
      this.loading = true;
      this.groupId = newValue;
      this.updateDefaltGroup();
    },
  },
  created() {
    this.onloadGroup();
  },
  methods: {
    updateDefaltGroup() {
      this.$refs.groupList.clearSelection();
      this.findGroup(this.tableDataGroup);
    },
    // gotoGroup() {
    //   this.tableDataGroup.forEach(row => {
    //     if (row.id == 2) {
    //       console.log(row);
    //       this.$refs.groupList.toggleRowSelection(row, true);
    //     }
    //   });
    // }
    /**
     * 加载组数据
     */
    onloadGroup() {
      let par = {
        groupName: this.screenGroupName,
      };
      grouplist(par).then((res) => {
        console.log("========应答-组========");
        console.log(res);
        this.tableDataGroup = res.data;
      });
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件,确保只能选中一项数据
    select(selection, row) {
      if (selection.length == 0) {
        this.groupId = "";
      } else {
        this.$refs.groupList.clearSelection();
        this.$refs.groupList.toggleRowSelection(row, true);
        this.groupId = row.id;
      }
      this.$emit("changeGroupId", this.groupId);
    },
    // 当选择项发生变化时会触发该事件，进行赋值
    handle_selectionChangeSingle(row) {
      this.selectedList = row;
    },

    // 遍历查找默认组
    findGroup(group) {
      let that = this;
      setTimeout(function () {
        group.forEach((row) => {
          if (row.id == that.groupId) {
            that.$refs.groupList.toggleRowSelection(row, true);
          } else if (row.childList) {
            that.findGroup(row.childList);
          }
          that.loading = false;
        });
      }, 500);
    },
    // 搜索
    search() {
      let data = {
        groupName: this.screenGroupName,
      };
      let that = this;
      grouplist(data).then((res) => {
        console.log(res);
        that.tableDataGroup = res.data;
        this.updateDefaltGroup();
      });
    },
  },
};
</script>

<style></style>
