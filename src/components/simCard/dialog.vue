<template>
  <el-dialog
    title="SIM管理"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="dialogClose"
    center
  >
    <el-tabs
      v-model="activeTab"
      type="border-card"
      :before-leave="beforLeaveTab"
    >
      <el-tab-pane name="tabSim" :label="titleGroup.tab1">
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          style="text-align: left"
          label-width="80px"
        >
          <el-form-item label="SIM卡号" prop="simNumber">
            <el-input
              data-cy="sim-dia-sim-input"
              maxlength="20"
              v-model="form.simNumber"
              show-word-limit
              autocomplete="off"
              size="mini"
              :disabled="form.addOrModify === 'modify'"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="tabGroup" :label="titleGroup.tab2">
        <base-group :postGroupId="groupId" @changeGroupId="changeGroupId" />
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button
        data-cy="sim-dia-next-button"
        @click="handleNextStep"
        v-if="activeTab == 'tabSim'"
        type="primary"
        plain
      >
        下一步
      </el-button>
      <el-button
        data-cy="sim-dia-commit-button"
        type="primary"
        @click="handlerCommit"
        v-if="activeTab == 'tabGroup'"
      >
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import "@/assets/css/dialogstyle.css";
import BaseGroup from "../BaseGroup.vue";
export default {
  components: { BaseGroup },
  data() {
    return {
      /**
       * 当前弹出框可见性
       */
      visible: this.dialogVisible,
      /**
       * 激活的tab
       */
      activeTab: "tabSim",
      /**
       * 表单
       */
      form: {},
      groupId: 0,
      /**
       * 表单规则
       */
      rules: {
        simNumber: [{ required: true, message: "请输入", trigger: "blur" }]
      },
      titleGroup: {
        tab1: "添加SIM卡号",
        tab2: "添加所属组"
      }
    };
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },

    /**
     * 信息
     */
    postInfo: {
      /**
       * 新增还是修改
       */
      addOrModify: {
        type: String,
        default: "add",
        validator: function(value) {
          return ["add", "modify"].indexOf(value) !== -1;
        }
      },
      id: {
        type: String,
        default: ""
      },
      simNumber: {
        type: String,
        default: ""
      },
      gid: {
        type: Number,
        default: 0
      }
    }
  },
  watch: {
    dialogVisible(newValue, oldValue) {
      this.visible = newValue;
    },
    postInfo(newValue, oldValue) {
      if (this.postInfo.addOrModify == "add") {
        this.titleGroup = {
          tab1: "添加SIM卡号",
          tab2: "添加所属组"
        };
      } else {
        this.titleGroup = {
          tab1: "编辑SIM卡号",
          tab2: "编辑所属组"
        };
      }
      this.form = newValue;
      console.log(this.form);
    }
  },
  methods: {
    /**
     * 切换标签之前.
     */
    beforLeaveTab(activeName, oldActiveName) {
      let ret = true;
      switch (oldActiveName) {
        case "tabSim":
          this.$refs["form"].validate(valid => {
            if (!valid) {
              ret = false;
            } else {
              this.activeTab = activeName;
            }
          });
          break;
        default:
          break;
      }
      switch (activeName) {
        case "tabGroup":
          this.groupId = this.form.gid;
          console.log(this.groupId);
          break;
        default:
          break;
      }

      return ret;
    },
    /**
     * 点击下一步.
     */
    handleNextStep() {
      this.beforLeaveTab("tabGroup", "tabSim");
    },

    dialogClose() {
      this.activeTab = "tabSim";
      this.$emit("update:dialogVisible", false);
      this.groupId = 0;
    },
    /**
     * 表单验证
     */
    formVerification() {
      if (this.form.gid == "") {
        this.$message({
          message: "请选择所属组",
          type: "error"
        });
        return false;
      }
      return true;
    },
    changeGroupId(data) {
      this.form.gid = data;
      console.log(this.form.gid);
    },
    /**
     * 确定
     */
    handlerCommit() {
      if (!this.formVerification()) {
        return;
      }
      console.log(this.form);
      this.$emit("form-data", this.form);
      this.visible = false;
    }
  }
};
</script>
<style></style>
