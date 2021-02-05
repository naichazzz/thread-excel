<template>
  <div>
    <el-dialog
      title="终端类型维护"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @close="QualityDialogClose"
    >
      <el-form
        data-cy="typ-data-table"
        ref="form"
        :model="form"
        label-width="120px"
        class="left"
        :rules="rules"
        size="mini"
      >
        <el-form-item label="终端名称" prop="name">
          <el-input data-cy="typ-name-input" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="设备制造商省ID" prop="manufacturerProvinceId">
          <el-input data-cy="typ-manufacturerProvinceId-input" v-model="form.manufacturerProvinceId"></el-input>
        </el-form-item>
        <el-form-item label="设备制造商市ID" prop="manufacturerCityId">
          <el-input data-cy="typ-manufacturerCityId-input" v-model="form.manufacturerCityId"></el-input>
        </el-form-item>
        <el-form-item label="制造商ID" prop="manufacturerId">
          <el-input data-cy="typ-manufacturerId-input" v-model="form.manufacturerId"></el-input>
        </el-form-item>
        <el-form-item label="终端型号" prop="model">
          <el-input data-cy="typ-model-input" v-model="form.model"></el-input>
        </el-form-item>
        <el-form-item label="厂家编码" prop="factoryId">
          <el-input data-cy="typ-factoryId-input" v-model="form.factoryId"></el-input>
        </el-form-item>
        <el-form-item label="型号编码" prop="modelId">
          <el-input data-cy="typ-modelId-input" v-model="form.modelId"></el-input>
        </el-form-item>
        <el-form-item label="通讯类型" prop="communicationType">
          <el-select data-cy="typ-communicationType-select" v-model="form.communicationType" placeholder="请选择">
            <el-option label="TCP" value="TCP"></el-option>
            <el-option label="UDP" value="UDP"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button data-cy="typ-cancel-button" @click="QualityDialogClose">取 消</el-button>
        <el-button data-cy="typ-sure-button" type="primary" @click="addInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/css/dialogstyle.css";
import { addList, editList } from "@/api/system/terminalType.js";
export default {
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入终端名称", trigger: "blur" }],
        manufacturerProvinceId: [
          { required: true, message: "请输入设备制造商省ID", trigger: "blur" },
        ],
        manufacturerCityId: [
          { required: true, message: "请输入设备制造商市ID", trigger: "blur" },
        ],
        manufacturerId: [
          { required: true, message: "请输入制造商ID", trigger: "blur" },
        ],
        model: [{ required: true, message: "请输入终端型号", trigger: "blur" }],
        factoryId: [
          { required: true, message: "请输入厂家编码", trigger: "blur" },
        ],
        modelId: [
          { required: true, message: "请输入型号编码", trigger: "blur" },
        ],
        communicationType: [
          { required: true, message: "请输入通讯类型", trigger: "blur" },
        ],
      },
      form: {
        name: "",
        manufacturerProvinceId: "",
        manufacturerCityId: "",
        manufacturerId: "",
        model: "",
        factoryId: "",
        modelId: "",
        communicationType: "1",
      },
      visible: false
    };
  },
  props: {
    QualityDialogFlag: {
      default: "false",
    },
    rowInfo: {
      default: {},
    },
  },
  watch: {
    QualityDialogFlag() {
      this.visible = this.QualityDialogFlag;
    },
    rowInfo(newVal) {
      if (this.rowInfo != null) {
        this.form = this.rowInfo;
      } else {
        this.form = {};
      }
      return newVal;
    },
  },
  methods: {
    addInfo() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.rowInfo != null) {
            editList(this.form).then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "修改终端类型成功",
                });
              } else {
                this.$message({
                  message: res.message,
                  type: "error",
                });
              }

              this.QualityDialogClose();
            });
          } else {
            addList(this.form).then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "新增终端类型成功",
                });
              } else {
                this.$message({
                  message: res.message,
                  type: "error",
                });
              }
              this.QualityDialogClose();
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    QualityDialogClose() {
      this.$emit("QualityDialogFlagC", false);
    },
  },
};
</script>

<style scoped>
.left {
  text-align: left;
}
</style>
