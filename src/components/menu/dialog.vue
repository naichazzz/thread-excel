<template>
  <div>
    <el-dialog title="菜单维护" :visible.sync="visible" :close-on-click-modal="false"
    @close="QualityDialogClose" v-if="visible">
        <el-form ref="form" :model="form" label-width="80px" class="left" :rules="rules" size="mini">
          <el-form-item label="上级菜单">
            <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
          </el-form-item>
          <el-form-item label="菜单类型">
            <el-radio-group v-model="form.menuType">
              <el-radio label="M">目录</el-radio>
              <el-radio label="C">菜单</el-radio>
              <el-radio label="F">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.menuType != 'F'" label="菜单图标">
            <el-popover
              placement="bottom-start"
              width="460"
              trigger="click"
              @show="$refs['iconSelect'].reset()"
            >
              <IconSelect ref="iconSelect" @selected="selected" />
              <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                <svg-icon
                  v-if="form.icon"
                  slot="prefix"
                  :icon-class="form.icon"
                  class="el-input__icon"
                  style="height: 32px;width: 16px;"
                />
                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-popover>
          </el-form-item>
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="form.menuName" size="mini" ></el-input>
          </el-form-item>
          <el-form-item label="路由地址" v-if="form.menuType != 'F'">
            <el-input v-model="form.path" size="mini" ></el-input>
          </el-form-item>
          <el-form-item label="组件路径" v-if="form.menuType == 'C'">
            <el-input v-model="form.component" size="mini" ></el-input>
          </el-form-item>
          <el-form-item label="权限标识">
            <el-input v-model="form.icon" size="mini" ></el-input>
          </el-form-item>
          <el-form-item label="菜单状态">
            <el-radio-group v-model="form.status">
              <el-radio :label='true'>显示</el-radio>
              <el-radio :label='false'>隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="QualityDialogClose">取 消</el-button>
        <el-button type="primary" @click="commitMenu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import "@/assets/css/dialogstyle.css"
  import IconSelect from "@/components/IconSelect";
  import {roleList} from "@/api/system/roleManager";
  import {menulist,addMenu,updateMenu} from "@/api/system/menu";
  // import the component
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  export default{
    components: { IconSelect,Treeselect},
    data(){
      return{
        activeName:'1',
        visible: false,
        options:[],
        form: {
            menuName: '',
            parentId:0,
            resource: '显示',
            path:'',
            component:'',
            menuType: "M",
            icon:'',
            status:true
          },
          form_role:{
            search:''
          },
        rules:{
          menuName :[{required: true, message: '请输入', trigger: 'blur'}],
        },
        roleData:[],
        multipleSelection:[],
        // 菜单表格树数据
        menuOptions: [],
        Curraction:0
      }
    },
    props:{
      QualityDialogFlag:{
                  default: false
              },
      formData:{
         type: Object
      },
      action:{
        default: 0
      }
    },
    created() {
      let data={}
      this.gotMenuList(data)
    },
    methods: {
            QualityDialogClose() {
                this.$emit("update:QualityDialogFlag", false);
                this.activeName='1'
            },
            // 新增、修改菜单
            commitMenu(){
              this.QualityDialogClose()
              let data={
                parentMenuId:this.form.parentId,
                menuType:this.form.menuType,
                menuName:this.form.menuName,
                path:this.form.path,
                component:this.form.component==''?'Layout':this.form.component,
                icon:this.form.icon,
                status:this.form.status
              }
              console.log(data)
              console.log(this.Curraction)
              // 新增
              if(this.Curraction==0){
                this.addNemu(data)
              }
              // 修改
              else if(this.Curraction==1){
                var id=this.form.id
                this.update(data,id)
              }

            },
            // 修改菜单
            update(data,id){
              updateMenu(data,id).then(res=>{
                console.log(res)
                if(res.code==200){
                  this.$message({
                    message: '修改菜单信息成功',
                    type: 'success'
                  });
                  this.getMemuList2()
                }
              })
            },
            // 新增菜单
            addNemu(data){
              addMenu(data).then(res=>{
                console.log(res)
                if(res.code==200){
                  this.$message({
                    message: '添加菜单信息成功',
                    type: 'success'
                  });
                  this.getMemuList2()
                }
                else{
                  this.$message({
                    message: res.message,
                    type: 'error'
                  });
                }
              })
            },
            // 重刷menu列表
            getMemuList2(){
              let data={}
              this.$emit('get-list',data)
            },
            // 取menu
            gotMenuList(data){
              menulist(data).then(res=>{
                console.log(res)
                this.menuOptions = [];
                const menu = { id: 0, menuName: '主类目', children: [] };
                menu.children = this.handleTree(res.data.menus, "id");
                this.menuOptions.push(menu);
                console.log(this.menuOptions)
              })
            },
            /** 转换菜单数据结构 */
            normalizer(node) {
              if (node.children && !node.children.length) {
                delete node.children;
              }
              return {
                id: node.id,
                label: node.menuName,
                children: node.children
              };
            },
            // 切换tab
            tabClick(e){
              console.log(e)
              if(e.label=='添加角色'){
                let data={
                  pageNum:1,
                  pageSize:100000,
                  roleName:''
                }
                this.getRoleList(data)
              }

            },
            // 获取角色列表
            getRoleList(data){
              roleList(data).then(res=>{
                console.log(res)
                this.roleData=res.data.list
                if(this.form.userRoleList!=''&&this.form.userRoleList){
                  var that=this
                  setTimeout(function(){

                    for(var i=0;i<that.form.userRoleList.length;i++){
                      that.roleData.forEach(row => {
                        console.log(row);
                        if (row.id == that.form.userRoleList[i].id) {
                          console.log(row);
                          that.$refs.roleList.toggleRowSelection(row, true);
                        }
                      });
                    }
                  },500)

                }
              })
            },
            handleSelectionChange(val) {
              this.multipleSelection = val;
              console.log(val)
            },
            onSubmit() {
              console.log('submit!');
            },
            // 选择图标
            selected(name) {
              this.form.icon = name;
            },
            searchRole(){
              console.log(this.form_role.search)
              if(!this.form_role.search){
                this.$message({
                  message: '请输入查找内容',
                });
                return
              }
              let data={
                pageNum:1,
                pageSize:100000,
                roleName:this.form_role.search
              }
              this.getRoleList(data)
            }
    },
    watch: {
        QualityDialogFlag() {
            this.visible = this.QualityDialogFlag;
        },
        formData(value){
          this.form=this.formData
        },
        action(value){
          this.Curraction=this.action
        }
    }
  }
</script>

<style scoped>
  .left{text-align: left;}
  .el-tabs__content{overflow: visible;}
</style>
