<template>
    <div class="user-manage height-100 company">
        <div class="company-list l height-100">
            <div class="filter-box">
                <el-input v-model="filterText">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
            <div class="add-user" @click="addUser">
                <i class="el-icon-plus"></i>
            </div>  
            <div class="tree">
                <el-scrollbar>
                    <el-tree
                     :data="userData"
                     default-expand-all
                     highlight-current
                     :expand-on-click-node="false"
                     :props="defaultProps"
                     @node-click="nodeClick"
                    >
                        <template slot-scope="{ node, data }">
                            <div class="node-item">
                                <div class="node-item-label">
                                    <span>{{data.FUserName}}</span>
                                </div>
                                <div class="r">
                                    <i class="iconfont icon-Changethepassword" @click.stop="changePassword(node)"></i>
                                    <i v-if="node.level>1" class="iconfont icon-Edit" @click="editNode(data)" :title="$t('edit')"></i>
                                    <i v-if="node.level>1" class="iconfont icon-Rubbish" @click.stop="deleteNode(data)" :title="$t('delete')"></i>
                                </div>
                            </div>
                        </template>
                    </el-tree>
                </el-scrollbar>
            </div>
        </div>
        <div class="company-main height-100">
            <div class="company-main-default  height-100">
                <h5 class="title-icon">{{$t('basicInfo')}}</h5>
                <div class="company-detail" style="height:212px;">
                    <ul class="flex">
                        <li :style="{width:item.width}" v-for="(item,i) in $t('userManage.basicInfo')" :key="i">
                            <span class="label">{{item.label}}：</span>{{item.formatter?item.formatter(userInfo[item.prop]):userInfo[item.prop]}}
                        </li>
                    </ul>
                </div>
                <div class="table-container" style="height:618px;">
                    <div class="flex table-container-header">
                        <el-input v-model="searchKey" @change="queryData">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                        <el-select v-model="queryType" :placeholder="$t('select')" @change="queryData()">
                           <el-option
                             v-for="item in $t('company.typeList')"
                             :key="item.type"
                             :label="item.label"
                             :value="item.type">
                           </el-option>
                        </el-select>
                    </div>
                    <div class="table-container-main">
                        <el-table
                           :data="tableData"
                           style="width: 100%"
                           height="570"
                           header-row-class-name="el-table-header"
                           :row-class-name="tableRowClassName"
                           >
                           <el-table-column prop="RowNo" :label="$t('index')" width="80">
                           </el-table-column>
                           <el-table-column prop="FUserName" :label="$t('userName')" width="120">
                           </el-table-column>
                           <el-table-column label="用户状态" width="100">
                               <template slot-scope="scoped">
                                   <div class="column-operation">
                                      <el-switch
                                        v-model="scoped.row.FStatus"
                                        @change="updateAdminUserStatus(scoped.row)"
                                        active-text=""
                                        inactive-text="">
                                      </el-switch>
                                   </div>
                               </template>
                           </el-table-column>
                           <el-table-column
                             v-for="item in $t('userManage.tableLabel')"
                             :key="item.prop"
                             :prop="item.prop"
                             :width="item.width"
                             :label="item.label"
                             :sortable="item.sortble"
                             :formatter="item.formatter"
                             show-overflow-tooltip
                            >
                           </el-table-column>
                        </el-table>
                        <pagination @pageIndexChange='handleCurrentChange' :pageSize="10" :pageIndex='pageIndex' :total='total'></pagination>
                    </div>
                </div>
            </div>
            <!-- 新增修改用户 -->
            <div class="add-company add-user-box  height-100" v-if="show">
                <h5 class="title-icon">
                    {{$t('basicInfo')}}
                    <div class="btn-list">
                        <el-button type="primary"  @click='addOrUpdate()'>{{$t('save')}}</el-button>
                        <el-button type="primary"  @click='show = false'>{{$t('cancle')}}</el-button>
                    </div>
                </h5>
                <div class="add-form add-user-form">
                    <el-form :model="addData" inline ref="form">
                        <el-form-item :label="$t('userName')" prop="FUserName"  :rules="[{ required: true, message: $t('input')}]">
                            <el-input  v-model="addData.FUserName">
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('manageCompany')" prop="FAgentGUIDs" :rules="[{ required: true, message: $t('select')}]">
                            <el-select v-model="addData.FAgentGUIDs">
                                <el-option v-for="item in companyList" :key="item.FGUID" :value="item.FGUID" :label="item.FName"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('expireTime')" prop="FExpireTime" :rules="[{ required: true, message: $t('select')}]">
                             <el-date-picker
                              v-model="addData.FExpireTime"
                              type="date"
                              :placeholder="$t('select')">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item :label="$t('contact')" prop="FContacts"  :rules="[{ required: true, message: $t('input')}]">
                            <el-input  v-model="addData.FContacts">
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('telephone')" prop="FTelephone"  :rules="FTelephoneRule">
                            <el-input  v-model="addData.FTelephone">
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('email')" prop="FEMailAddress" >
                            <el-input  v-model="addData.FEMailAddress">
                            </el-input>
                        </el-form-item>
                        <el-form-item  :label="$t('remarks')" style="width:100%"  prop="FDescribe" >
                            <el-input class="describe" type="textarea" v-model="addData.FDescribe">
                            </el-input>
                        </el-form-item>
                        <h5 class="title-icon">{{$t('funcPermission')}}</h5>
                        <el-form-item :label="$t('lockPermission')" style="width:33.3%"  prop="FOpenLock">
                            <el-switch
                                v-model="addData.FOpenLock"
                                active-text=""
                                inactive-text="">
                            </el-switch>
                        </el-form-item>
                        <el-form-item :label="$t('downloadPermission')" style="width:33.3%"  prop="FDownLoad">
                            <el-switch
                                v-model="addData.FDownLoad"
                                active-text=""
                                inactive-text="">
                            </el-switch>
                        </el-form-item>
                        <el-form-item :label="$t('help')" style="width:33.3%"  prop="FHelp">
                            <el-switch
                                v-model="addData.FHelp"
                                active-text=""
                                inactive-text="">
                            </el-switch>
                        </el-form-item>
                        <el-form-item :label="$t('updatedLog')" style="width:33.3%"  prop="FSystemUpdate">
                            <el-switch
                                v-model="addData.FSystemUpdate"
                                active-text=""
                                inactive-text="">
                            </el-switch>
                        </el-form-item>
                        <el-form-item :label="$t('userExpirePermission')" style="width:33.3%"  prop="FUserExpControl">
                            <el-switch
                                v-model="addData.FUserExpControl"
                                active-text=""
                                inactive-text="">
                            </el-switch>
                        </el-form-item>
                    </el-form>
                    <h5 class="title-icon">{{$t('modulePermission')}}</h5>
                    <div class="menu-permission">
                        <div class="menu-tree-box">
                            <h6>{{$t('BSMenuSet')}}</h6>
                            <div class="menu-tree-content">
                                <el-scrollbar>
                                    <el-tree
                                        ref="menuTree"
                                        :data="webMenuData"
                                        :props="menuProps"
                                        node-key="FGUID"
                                        show-checkbox
                                        :default-checked-keys="checkedMenus"
                                    >
                                    </el-tree>
                                </el-scrollbar>
                            </div>
                        </div>
                        <div class="menu-tree-box">
                            <h6>{{$t('appMenuSet')}}</h6>
                            <div class="menu-tree-content">
                                <el-scrollbar>
                                    <el-tree
                                        ref='appTree'
                                        :data="appMenu"
                                        :props="menuProps"
                                        node-key="FGUID"
                                        show-checkbox
                                        :default-checked-keys="appCheckedMenus"
                                    >

                                    </el-tree>
                                </el-scrollbar>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 修改密码 -->
            <div class="add-company  height-100" v-if="show1">
                <div class="add-form height-100">
                    <h5 class="title-icon">{{$t('changePassword')}}</h5>
                    <el-form :model="changeFormData" inline ref="changeForm">
                        <el-form-item :label="$t('userName')" prop="FUserName">
                            <el-input readonly v-model="changeFormData.FUserName">
                            </el-input>
                        </el-form-item>
                        <br>
                        <el-form-item style="width:100%" v-if="changeNode.level == 1" :label="$t('oldPassword')" prop="FOldPassword"  :rules="[{ required: true, message: $t('input')}]">
                            <el-input type="password" show-password  v-model="changeFormData.FOldPassword">
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('newPassword')" prop="FPassword"  :rules="[{ required: true, message: $t('input')}]">
                            <el-input type="password" show-password  v-model="changeFormData.FPassword">
                            </el-input>
                        </el-form-item><br>
                        <el-form-item :label="$t('repeatPassword')" prop="repeatPassword" :rules="[{ required: true, message: $t('input')}]">
                            <el-input type="password" show-password  v-model="changeFormData.repeatPassword">
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <div class="add-form-footer" style="text-align:left;padding-left:100px;">
                        <el-button class="save" @click='submitChange'>{{$t('save')}}</el-button>
                        <el-button class="cancle" @click='show1 = false'>{{$t('cancle')}}</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {User,Common} from '@/request/api.js'
import table from '@/mixins/table.js' //表格混入数据
import formatDate from '@/utils/formatDate.js'
import './company.scss';
import Md5 from 'js-md5'
export default {
    mixins:[table],
    data(){
        return {
            show:false, //新增用户
            show1:false, //新增车队
            filterText:'',
            defaultProps:{
                children:'FChild',
                label:'FUserName'
            },
            userData:[],
            userInfo:{},
            queryType:1,
            searchKey:"",
            companyList:[],
            currentNode:{ //当前选中的节点
            },
            FTelephoneRule:[], //联系方式规则
            webMenuData:[],
            appMenu:[],
            menuProps:{
                label:'FMenuName'
            },
            checkedMenus:[],
            appCheckedMenus:[],
            defaultAddData:{},
            addData:{
                FGUID:'',
                FUserName:'',
                FPassword:'123456',
                FDescribe:'',
                FContacts:'',
                FTelephone:'',
                FEMailAddress:'',
                FExpireTime:'',
                FOpenLock:false,
                FDownLoad:false,
                FHelp:false,
                FSystemUpdate:false,
                FUserExpControl:false,
                FWebMenuGUIDs:'',
                FAppMenuGUIDs:'',
                FAgentGUIDs:''
            },
            changeNode:{},//修改密码的节点
            changeFormData:{ //修改密码
                FGUIDs:'',
                FUserName:'',
                FPassword:'',
                repeatPassword:'',
                FOldPassword:'',
            }
        }
    },
    created(){
        const phoneNumbre = (rule, value, callback) => {
            var isPhone = /^0?1[3|4|5|7|8][0-9]\d{8}$/;//手机号码
            var isMob= /^([0-9]{3,4}-)?[0-9]{7,8}$/;// 座机格式
            if(isMob.test(value)||isPhone.test(value)){
                callback();
            }
            else{
               callback(new Error(this.$t('phoneErr')));
            }
        }
        this.FTelephoneRule = {required: true, validator: phoneNumbre}
        this.defaultAddData = {...this.addData}
        this.defaultAddTeam = {...this.addTeam}
        this.queryAdminUserTree()  
        this.queryData()
        this.getMenus()
        this.queryCompanyTree()
    },
    methods:{
        /**
         * 3.7.6 查询用户树
         */
        queryAdminUserTree(){
            Common({
                FAction:'QueryAdminUserTree'
            })
            .then((result) => {
                this.userData = [result.FObject]
                if(this.userData&&this.userData[0]){
                    this.queryUserInfo(this.userData[0])
                }
            }).catch((err) => {
                console.log(err)
            });
        },
        getCompany(data) {
            data.forEach(item => {
                this.companyList.push(item)
                if(item.FChild){
                    this.getCompany(item.FChild)
                }
            })
        },
        /**
         * 3.7.1 查询账户管理的公司
         */
        queryCompanyTree(){
            Common({
                FAction:'QuerySuperAdminAgentTree',
            })
            .then((result) => {
                let data = result.FObject
                this.getCompany(data)
            }).catch((err) => {
                
            });
        },
        /**
         * 3.6.4 查询用户列表
         */
        queryData(){
            User({
                FAction:'QueryAdminUserList',
                FPageSize:10,
                FPageIndex:this.pageIndex,
                FType:this.queryType,
                FKey:this.searchKey
            })
            .then((result) => {
                this.total = result.FObject.Table&&result.FObject.Table[0]&&result.FObject.Table[0].FTotalCount
                this.tableData = result.FObject.Table1
                this.tableData.forEach(item => {
                    item.FStatus = Boolean(item.FStatus)
                })
                /**
                 * 删除操作时，当前页面无数据时跳到上一页
                 */
                if(this.tableData.length === 0&&this.pageIndex > 1){
                    --this.pageIndex
                    this.queryData()
                }
            }).catch((err) => {
                
            });
        },
        formatterMenu(arr,guid,result =[]){
            arr.forEach(item => {
                if(item.FParentGUID == guid){
                    result.push(item)
                    item.children = this.formatterMenu(arr,item.FGUID)
                }
            })
            return result
        },
        getMenus(){
            User({
                FAction:'QueryAdminMenuListByUserGUID'
            })
            .then(result => {
                let menus = result.FObject
                let webMenu = menus.filter(item => item.FSystemType == 1)
                let appMenu = menus.filter(item => item.FSystemType == 2) 
                this.webMenuData = this.formatterMenu(webMenu,null,[])
                this.appMenu = this.formatterMenu(appMenu,null,[])
                console.log(this.webMenuData)
            })
            .catch(err => {
                console.log(err)
            })
        },
        /**
         * 新增用户
         */
        addUser(){
            this.addData = {...this.defaultAddData}
            this.checkedMenus = []
            this.appCheckedMenus = []
            this.show1 = false
            this.show = true
        },
        /**
         * 转换功能权限
         * @param {Boolean}  type:true,Number to Boolean ; type:false, Boolean to Number 
         */
        translatePermission(type = true){   
            let keys = ['FOpenLock','FDownLoad','FHelp','FSystemUpdate','FUserExpControl']
            keys.forEach(item => {
                if(type){
                    this.addData[item] = Boolean(this.addData[item])
                }else{
                    this.addData[item] = Number(this.addData[item])
                }
            })
        },
        /**
         * 获取选中的菜单
         */
        getCheckedMenus(){
            let checkedMenus = this.$refs.menuTree.getCheckedKeys()
            let halfCheckedMenus = this.$refs.menuTree.getHalfCheckedKeys()
            let appCheckedMenus = this.$refs.appTree.getCheckedKeys()
            let appHalfCheckedMenus = this.$refs.appTree.getHalfCheckedKeys()
            this.addData.FWebMenuGUIDs = [...checkedMenus,...halfCheckedMenus].join(',')
            this.addData.FAppMenuGUIDs = [...appCheckedMenus,...appHalfCheckedMenus].join(',')
            console.log(this.addData)
        },
        /**
         * 新增或修改用户
         */
        async addOrUpdate(){
            let action
            this.translatePermission(false)
            this.getCheckedMenus()
            await new Promise(resolve => {
                 this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            if(this.addData.FGUID !==''){
                action = 'UpdateAdminUser'
            }else{
                action = 'AddAdminUser'
            }
            User({
                FAction:action,
                FT_AdminUser:this.addData
            },true)
            .then(result => {
                this.queryAdminUserTree()
                this.queryData()
                /* this.show = false */
                this.$message({
                    message:this.$t('success'),
                    type:'success',
                    duration:'500'
                })
            })
            .catch(err => {
                console.log(err)
                this.$message({
                    message:this.$t('error'),
                    type:'error',
                    duration:'500'
                })
            })   
        },
        async editNode(data){
            this.show1 = false
            this.show = true
            this.$nextTick(() => {
                this.$refs.menuTree.setCheckedKeys([])
                this.$refs.appTree.setCheckedKeys([])
            })
            await this.queryUserInfo(data)
            Object.keys(this.addData).forEach(key => {
                this.addData[key] = this.userInfo[key]||''
            })
            this.addData.FAgentGUIDs = this.userInfo.FAgentGUID
            this.addData.FPassword = '123456'
            this.translatePermission()
        },
        nodeClick(data){
            this.queryUserInfo(data)
        },
        /**
         * 3.2.4 查询用户详情
         */
        queryUserInfo(node){
            this.currentNode = node
            return new Promise((resolve,reject) => {
                User({
                    FAction:'QueryAdminUserByFGUID',
                    FGUID:this.currentNode.FGUID
                })
                .then((result) => {
                    let {Table,Table1} = result.FObject
                    this.userInfo = Table&&result.FObject.Table[0] || {}
                    if(Table1){
                        this.checkedMenus = Table1.filter(item => item.FSystemType == 1&&item.FMenuLevle != 1) 
                        .map(item => item.FGUID)
                        this.appCheckedMenus = Table1.filter(item => item.FSystemType == 2&&item.FMenuLevle != 1) 
                        .map(item => item.FGUID)
                    }
                    resolve()
                }).catch((err) => {
                    reject(err)
                });
            })
        },
        /**
         * 修改用户状态
         */
        updateAdminUserStatus(row){
            User({
                FAction:'UpdateAdminUserStatus',
                FGUIDs:row.FGUID,
                FStatus:Number(row.FStatus)
            })
            .then((result) => {
                
            }).catch((err) => {
                row.FStatus = !row.FStatus
            });
        },
        changePassword(node){
            this.changeNode = node
            this.show = false
            this.show1 = true
            this.changeFormData.FUserName = node.data.FUserName
            this.changeFormData.FGUIDs = node.data.FGUID
        },
        async submitChange(){
            await new Promise(resolve => {
                 this.$refs.changeForm.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            if(this.changeFormData.FPassword != this.changeFormData.repeatPassword){
                this.$message({
                    message:this.$t('repeatPasswordErr'),
                    type:'success',
                    duration:'500'
                })
                return
            }
            let changeFun
            if(this.changeNode.level == 1){
                changeFun = this.updateAdminLoginUserPassword
            }else{
                changeFun = this.updateAdminUserPassword
            }
            changeFun()
            .then((result) => {
                this.$message({
                    message:this.$t('success'),
                    type:'success',
                    duration:'500'
                })
            }).catch((err) => {
                this.$message({
                    message:this.$t('error'),
                    type:'error',
                    duration:'500'
                })
            });
        },
        /**
         * 3.6.9 修改子用户密码
         */
        updateAdminUserPassword(){
            return User({
                FAction:"UpdateAdminUserPassword",
                FGUIDs:this.changeFormData.FGUIDs,
                FPassword:Md5(this.changeFormData.FPassword)
            })
        },
        /**
         * 3.6.10 修改登陆用户密码
         */
        updateAdminLoginUserPassword(){
            return User({
                FAction:'UpdateAdminLoginUserPassword',
                FOldPassword:Md5(this.changeFormData.FOldPassword),
                FNewPassword:Md5(this.changeFormData.FPassword)
            })
        },
        async deleteNode(data){
            await this.beforeDelete()
            User({
                FAction:'DeleteAdminUser',
                FGUIDs:data.FGUID
            })
            .then(result => {
                this.show = false
                this.queryAdminUserTree()
                this.queryData()
                this.$message({
                    message:this.$t('success'),
                    type:'success',
                    duration:'500'
                })
            })
            .catch(err =>  {
                this.$message({
                    message:this.$t('err'),
                    type:'error',
                    duration:'500'
                })
            })
        }
    }
}
</script>
<style lang="scss">
.user-manage.company{
    .add-user{
        width:268px;
        height:48px;
        margin-left: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        background:rgba(0,133,141,0.2);
        border-radius:24px;
        cursor: pointer;
        i{
            font-size: 26px;
            color: #00858D
        }
        &:hover{
            background:#00858D;
            i{
                color: white;
            }
        }
    }
    .company-main{
        .add-company.add-user-box{
            .title-icon{
                /* margin-bottom: 26px; */
                position: relative;
                .btn-list{
                    position: absolute;
                    right:32px ;
                    .el-button{
                        width:120px;
                        height:34px;
                        line-height: 34px;
                        padding: 0 20px;
                        background:rgba(0,133,141,0.3);
                        border:1px solid rgba(0,255,255,1);
                        font-size: 16px;
                        color: white;
                        &:hover{
                            background: #00777D
                        }
                    }
                }
            }
            .add-form.add-user-form{
                height: 908px;
                overflow-y: auto;
                .el-form--inline{
                    /* padding-top: 0px; */
                    .el-form-item{
                        margin-bottom: 30px;
                        .describe.el-textarea{
                            .el-textarea__inner{
                                height: 90px;
                            }
                        }
                    }
                }
                .menu-permission{
                    padding: 30px 149px;
                    display: flex;
                    justify-content:space-between;
                    .menu-tree-box{
                        width: 580px;
                        height: 583px;
                        border-radius: 20px;
                        overflow: hidden;
                        background: #0A111E;
                        h6{
                            height: 48px;
                            line-height: 48px;
                            background: #00858D;
                            color: white;
                            font-size: 18px;
                        }
                        .menu-tree-content{
                            height: 535px;
                            .el-tree{
                                background: none;
                                color: white;
                                font-size: 16px;
                                &-node__content {
                                    height: 40px;
                                    .el-tree-node__expand-icon{
                                        font-size: 20px;
                                        color: #005562;
                                    }
                                    .el-tree-node__expand-icon.is-leaf{
                                        color: transparent;
                                    }
                                    &:hover {
                                        background: #00858d;
                                    }
                                }

                                .el-tree-node:focus>.el-tree-node__content {
                                    background: #00858d;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>