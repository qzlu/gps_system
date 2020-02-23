<template>
    <div class="height-100 company">
        <div class="company-list l height-100">
            <div class="filter-box">
                <el-input v-model="filterText">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>  
            <div class="tree">
                <el-scrollbar>
                    <el-tree
                     ref="tree"
                     :data="companyData"
                     default-expand-all
                     highlight-current
                     node-key="FGUID"
                     @node-click="handleNodeclick"
                     :expand-on-click-node="false"
                     :props="defaultProps"
                    >
                        <template slot-scope="{ node, data }">
                            <div class="node-item">
                                <div class="node-item-label">
                                    <i :class="['iconfont','icon-Company']" style="margin-right:4px;"></i>
                                    <span>{{data.FName}}</span>
                                </div>
                            </div>
                        </template>
                    </el-tree>
                </el-scrollbar>
            </div>
        </div>
        <div class="company-main height-100">
            <div class="operation-list">
                <el-button @click="beforeAdd"><i class="iconfont icon-New"></i>{{$t('add')}}</el-button>
                <el-button @click="deleteItems"><i class="iconfont icon-Rubbish"></i>{{$t('delete')}}</el-button>
                <el-input class="r filter-box" placeholder="" v-model="searchKey" @change="queryData()">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>   
            </div>
            <ul class="tab-header">
                <li :class="{active:activeIndex == 2}" @click="changeTab(2)">{{$t('underDriver')}}</li>
                <li :class="{active:activeIndex == 1}" @click="changeTab(1)">{{$t('allDriver')}}</li>
            </ul>
            <div class="tab-content">
                <el-table
                   :data="tableData"
                   style="width: 100%"
                   height="570"
                   header-row-class-name="el-table-header"
                   @selection-change="handleSelectionChange"
                   :row-class-name="tableRowClassName"
                   >
                    <el-table-column
                      type="selection"
                      width="55">
                    </el-table-column>
                   <el-table-column prop="RowNo" :label="$t('index')" width="80">
                   </el-table-column>
                   <el-table-column label="操作" width="100">
                       <template slot-scope="scoped">
                           <div class="column-operation">
                               <i class="iconfont icon-Edit" @click="editRow(scoped.row)"></i>
                               <i class="iconfont icon-Rubbish" @click="deleteRow(scoped.row.FGUID)"></i>
                               <i class="iconfont icon-Hint" @click="queryAdminDriverByFGUID(scoped.row)"></i>
                           </div>
                       </template>
                   </el-table-column>
                   <el-table-column
                     v-for="item in $t('driverManage.tableLabel')"
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
                <pagination @pageIndexChange='handleCurrentChange' :pageIndex='pageIndex' :total='total'></pagination>
            </div>
            <el-dialog class="my-dialog" width="1260px" :modal="false" :visible.sync="show">
                <h4 class="title">
                    <span>{{addData.FGUID == ''?$t('addDriver'):$t('editDriver')}}</span>
                </h4>
                <el-form :model="addData" inline ref="form" label-width="160px">
                    <h5 class="item-title">
                        <span>{{$t('driverInfo')}}</span>
                    </h5>
                    <!-- 司机姓名 -->
                    <el-form-item :label="$t('driverName')" prop="FDriverName"  :rules="[{ required: true, message: $t('input')}]">
                        <el-input v-model="addData.FDriverName">
                        </el-input>
                    </el-form-item>
                    <!-- 电话号码 -->
                    <el-form-item :label="$t('telephone')" prop="FPhoneNumber"  :rules="FTelephoneRule">
                        <el-input  v-model="addData.FPhoneNumber">
                        </el-input>
                    </el-form-item>
                    <!-- 驾驶证类型 -->
                    <el-form-item :label="$t('FDrivingType')" prop="FDrivingType" >
                        <el-select v-model="addData.FDrivingType">
                            <el-option v-for="item in driverTypeList" :key="item.FDriverTypeID" :value="item.FDriverTypeID" :label="item.FDriverTypeName"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 驾驶证号 -->
                    <el-form-item :label="$t('FDrivingNumber')" prop="FDrivingNumber"  >
                        <el-input v-model="addData.FDrivingNumber">
                        </el-input>
                    </el-form-item>
                    <!-- 主驾车辆 -->
                    <el-form-item :label="$t('mainVehicle')" prop="FMainVehicleGUID" >
                        <el-select v-model="addData.FMainVehicleGUID" filterable>
                            <el-option v-for="item in vehicleList" :key="item.FGUID" :value="item.FGUID" :label="item.FVehicleName"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 副驾车辆 -->
                    <el-form-item :label="$t('copilotVehicle')" prop="FCopilotVehicleGUID" >
                        <el-select v-model="addData.FCopilotVehicleGUID" filterable>
                            <el-option v-for="item in vehicleList" :key="item.FGUID" :value="item.FGUID" :label="item.FVehicleName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('driverHeadImg')">
                        <div class="thumb-img" v-if="file">
                            <div class="delete">
                                <i class="el-icon-delete" @click="fileList = [] "></i>
                            </div>
                            <img :src="'http://39.108.194.238:56081'+file" alt="">
                        </div>
                        <el-upload
                          v-else
                          action='/Web/CarCloud_Common'
                          list-type="picture-card"
                          :limit = '1'
                         >
                            <p><i class="el-icon-plus"></i><br><span>上传(160*60)</span></p>
                        </el-upload>                
                    </el-form-item>
                    <el-form-item :label="$t('FFrontURL')">
                        <div class="thumb-img" v-if="file">
                            <div class="delete">
                                <i class="el-icon-delete" @click="fileList = [] "></i>
                            </div>
                            <img :src="'http://39.108.194.238:56081'+file" alt="">
                        </div>
                        <el-upload
                          v-else
                          action='/Web/CarCloud_Common'
                          list-type="picture-card"
                          :limit = '1'
                         >
                            <p><i class="el-icon-plus"></i><br><span>上传(160*60)</span></p>
                        </el-upload>                
                    </el-form-item>
                    <el-form-item :label="$t('FReverseURL')">
                        <div class="thumb-img" v-if="file">
                            <div class="delete">
                                <i class="el-icon-delete" @click="fileList = [] "></i>
                            </div>
                            <img :src="'http://39.108.194.238:56081'+file" alt="">
                        </div>
                        <el-upload
                          v-else
                          list-type="picture-card"
                          action='/Web/CarCloud_Common'
                          :limit = '1'
                         >
                            <p><i class="el-icon-plus"></i><br><span>上传(160*60)</span></p>
                        </el-upload>                
                    </el-form-item>
                    <!-- 描述 -->
                    <el-form-item :label="$t('describe')" prop="FDescription" >
                        <el-input class="block" type="textarea" v-model="addData.FDescription">
                        </el-input>
                    </el-form-item>
                </el-form>
                <div class="submit" slot="footer">
                    <el-button type="primary" @click="show =false">{{$t('cancle')}}</el-button>
                    <el-button type="primary" @click="addOrUpdate()">{{$t('submit')}}</el-button>
                </div>
            </el-dialog>
            <el-dialog class="my-dialog" width="1260px" top="30px" :modal="false" :visible.sync="show1">
                <h4 class="title"><span>{{$t('driverDetail')}}</span></h4>
                <h5 class="item-title">
                    <span>{{$t('companyInfo')}}</span>
                </h5>
                <ul class="info">
                    <!-- 公司名称 -->
                    <li>
                        <span class="label">{{$t('companyName')}}</span>
                        <span class="value">{{driverDetail.FAgentName||'--'}}</span>
                    </li>
                    <!-- 公司编码 -->
                    <li>
                        <span class="label">{{$t('companyCode')}}</span>
                        <span class="value">{{driverDetail.FAgentCode||'--'}}</span>
                    </li>
                    <br>
                    <!-- 公司联系人 -->
                    <li>
                        <span class="label">{{$t('FAgentContacts')}}</span>
                        <span class="value">{{driverDetail.FAgentContacts||'--'}}</span>
                    </li>
                    <!-- 公司联系电话 -->
                    <li>
                        <span class="label">{{$t('FAgentTelephone')}}</span>
                        <span class="value">{{driverDetail.FAgentTelephone||'--'}}</span>
                    </li>
                    <!-- 公司联系电话 -->
                    <li>
                        <span class="label">{{$t('FAgentEMailAddress')}}</span>
                        <span class="value">{{driverDetail.FAgentEMailAddress||'--'}}</span>
                    </li>
                </ul>
                <h5 class="item-title">
                    <span>{{$t('driverInfo')}}</span>
                </h5>
                <div>
                    <ul class="driver-image-list">
                        <li>
                            <div>
                                <img v-if="driverDetail.FHeadURL" :src="driverDetail.FHeadURL" :alt="$t('driverHeadImg')">
                                <img v-else src="@/assets/images/no-image.jpg" alt="">
                            </div>
                            <p class="img-label">{{$t('driverHeadImg')}}</p>
                        </li>
                        <li>
                            <div>
                                <img v-if="driverDetail.FFrontURL" :src="driverDetail.FFrontURL" :alt="$t('FFrontURL')">
                                <img v-else src="@/assets/images/no-image.jpg" alt="">
                            </div>
                            <p class="img-label">{{$t('FFrontURL')}}</p>
                        </li>
                        <li>
                            <div>
                                <img v-if="driverDetail.FReverseURL" :src="driverDetail.FReverseURL" :alt="$t('FReverseURL')">
                                <img v-else src="@/assets/images/no-image.jpg" alt="">
                            </div>
                            <p class="img-label">{{$t('FReverseURL')}}</p>
                        </li>
                    </ul>
                    <ul class="info">
                        <!-- 司机姓名 -->
                        <li>
                            <span class="label">{{$t('driverName')}}</span>
                            <span class="value">{{driverDetail.FDriverName||'--'}}</span>
                        </li>
                        <!-- 司机电话 -->
                        <li>
                            <span class="label">{{$t('telephone')}}</span>
                            <span class="value">{{driverDetail.FPhoneNumber||'--'}}</span>
                        </li>
                        <!-- 创建时间 -->
                        <li>
                            <span class="label">{{$t('FCreateTime')}}</span>
                            <span class="value">{{formatDate(driverDetail.FCreateTime)||'--'}}</span>
                        </li>
                        <!-- 驾驶证类型 -->
                        <li>
                            <span class="label">{{$t('FDrivingType')}}</span>
                            <span class="value">{{driverDetail.FDriverTypeName||'--'}}</span>
                        </li>
                        <!-- 驾驶证编号 -->
                        <li>
                            <span class="label">{{$t('FOperPermNumber')}}</span>
                            <span class="value">{{driverDetail.FDrivingNumber||'--'}}</span>
                        </li>
                    </ul>
                </div>
                <h5 class="item-title">
                    <span>{{$t('mainVehicleInfo')}}</span>
                </h5>
                <ul class="info">
                    <!-- 车牌号 -->
                    <li>
                        <span class="label">{{$t('vehicleName')}}</span>
                        <span class="value">{{driverDetail.FMainVehicleName||'--'}}</span>
                    </li>
                    <!-- 车辆编码 -->
                    <li>
                        <span class="label">{{$t('vehicleCode')}}</span>
                        <span class="value">{{driverDetail.FMainVehicleCode||'--'}}</span>
                    </li>
                    <!-- 车架号 -->
                    <li>
                        <span class="label">{{$t('FVIN')}}</span>
                        <span class="value">{{driverDetail.FMainVIN||'--'}}</span>
                    </li>
                    <!-- 车辆类型 -->
                    <li>
                        <span class="label">{{$t('FVIN')}}</span>
                        <span class="value">{{driverDetail.FMainVehicleTypeName||'--'}}</span>
                    </li>
                </ul>
                <h5 class="item-title">
                    <span>{{$t('copilotVehicleInfo')}}</span>
                </h5>
                <ul class="info">
                    <!-- 车牌号 -->
                    <li>
                        <span class="label">{{$t('vehicleName')}}</span>
                        <span class="value">{{driverDetail.FCopilotVehicleName||'--'}}</span>
                    </li>
                    <!-- 车辆编码 -->
                    <li>
                        <span class="label">{{$t('vehicleCode')}}</span>
                        <span class="value">{{driverDetail.FCopilotVehicleCode||'--'}}</span>
                    </li>
                    <!-- 车架号 -->
                    <li>
                        <span class="label">{{$t('FVIN')}}</span>
                        <span class="value">{{driverDetail.FCopilotVIN||'--'}}</span>
                    </li>
                    <!-- 车辆类型 -->
                    <li>
                        <span class="label">{{$t('FVIN')}}</span>
                        <span class="value">{{driverDetail.FCopilotVehicleTypeName||'--'}}</span>
                    </li>
                </ul>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import {User,Common} from '@/request/api.js'
import table from '@/mixins/table.js' //表格混入数据
import formatDate from '@/utils/formatDate.js'
import './company.scss'
export default {
    mixins:[table],
    data(){
        return {
            show:false,
            show1:false,
            activeIndex:2,
            filterText:'',
            defaultProps:{
                children:'FChild',
                label:'FName'
            },
            driverTypeList:[], //车辆类型
            searchKey:"",
            guid:"",
            file:'',
            formatDate:formatDate,
            checkRows:[],
            companyData:[],
            currentCompany:{ //当前选中的公司
            },
            defaultAddData:{},
            addData:{
                FGUID:'',
                FHeadURL:'',
                FDriverName:'',
                FDrivingNumber:'',
                FDrivingType:'',
                FFrontURL:'',
                FReverseURL:'',
                FPhoneNumber:'',
                FDescription:'',
                FAgentGUID:'',
                FMainVehicleGUID:'',
                FCopilotVehicleGUID:'',
            },
            driverDetail:{},
            vehicleList:[],
            FTelephoneRule:[], //联系方式规则
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
        this.queryCompanyTree()  
    },
    methods:{
        /**
         * 3.7.1 查询账户管理的公司
         */
        queryCompanyTree(){
            Common({
                FAction:'QuerySuperAdminAgentTree',
            })
            .then((result) => {
                this.companyData = result.FObject
                if(this.companyData&&this.companyData[0]){
                    this.guid = this.companyData[0].FGUID
                    this.queryData()
                    this.queryAdminDriverType()
                    this.$nextTick(() =>{
                        this.$refs.tree.setCurrentKey(this.guid)
                    })
                }
            }).catch((err) => {
                
            });
        },
        /**
         * 3.3.5 查询司机列表
         */
        queryData(){
            User({
                FAction:'QueryAdminDriverList',
                FAgentGUID:this.guid,
                FIsAgent:1,
                FPageSize:this.pageSize,
                FPageIndex:this.pageIndex,
                FType:this.activeIndex,
                FKey:this.searchKey
            },true)
            .then((result) => {
                this.total = result.FObject.Table&&result.FObject.Table[0]&&result.FObject.Table[0].FTotalCount
                this.tableData = result.FObject.Table1
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
        handleNodeclick(data){
            this.guid = data.FGUID
            this.queryData()
        },
        /**
         * 切换选项卡
         */
        changeTab(index){
            this.activeIndex = index
            this.checkRows = []
            this.queryData()
        },
        /**
         * 3.5.1 查询证件类型
         */
        queryAdminDriverType(){
            User({
                FAction:'QueryAdminDriverType',
                FAgentGUID:this.guid 
            })
            .then((result) => {
                this.driverTypeList = result.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 查询车辆列表
         */
        queryVehicleList(){
            User({
                FAction:'QueryAdminVehicleList',
                FAgentGUID:this.guid,
                FIsAgent:1,
                FPageSize:1000,
                FPageIndex:1,
                FType:1,
                FKey:''
            })
            .then((result) => {
                this.vehicleList = result.FObject.Table1
            }).catch((err) => {
                
            });
        },
        /**
         * 
         */
        beforeAdd(data){
            this.addData = {...this.defaultAddData}
            this.addData.FAgentGUID = this.guid
            this.queryVehicleList()
            this.show = true
        },
        /**
         * 编辑
         */
        async editRow(row){
            Object.keys(this.addData).forEach(key => {
                this.addData[key] = row[key]||''
            })
            this.show = true
        },
        /**
         * 新增或修改
         */
        async addOrUpdate(){
            let action
            await new Promise(resolve => {
                 this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            if(this.addData.FGUID !==''){
                action = 'UpdateAdminDriver'
            }else{
                action = 'AddAdminDriver'
            }
            User({
                FAction:action,
                FT_AdminDriver:this.addData
            },true)
            .then(result => {
                this.show = false
                this.queryData()
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
        /**
         * 3.5.7 查询司机详情
         */
        queryAdminDriverByFGUID(row){
            this.show1 = true
            User({
                FAction:"QueryAdminDriverByFGUID",
                FGUID:row.FGUID
            })
            .then((result) => {
                this.driverDetail = result.FObject[0]||{}
            }).catch((err) => {
                this.driverDetail = {}
            });
        },
        handleSelectionChange(rows){
            this.checkRows = rows
        },
        deleteItems(){
            if(this.checkRows.length == 0){
                this.$message({
                    message:this.$t('select'),
                    type:'warning',
                    duration:'500'
                })
                return
            }
            let idStr = this.checkRows.map(item => item.FGUID).join(',')
            this.deleteAdminDriver(idStr) 
        },
        deleteRow(guid){
            this.deleteAdminDriver(guid)
        },
        /**
         * 3.3.7 删除司机
         * @parm {String} idStr 司机ID
         */
        async deleteAdminDriver(idStr){
            if(!idStr) return
            await this.beforeDelete()
            User({
                FAction:'DeleteAdminDriver',
                FGUIDs:idStr
            })
            .then((result) => {
                this.queryData()
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
        exportFile(){
            let diffTime = new Date().getTimezoneOffset()*60
            let languageType = localStorage.lang == 'en'?2:1
            User({ 
                FAction:'ExportAdminDriverList',
                FAgentGUID:this.guid,
                FIsAgent:1,
                FKey:this.searchKey,
                FType:this.activeIndex,
                FLanguage:languageType,
                FTimeDifferent:diffTime
            })
            .then((result) => {
                console.log(result)
            }).catch((err) => {
                
            });
        }
    }
}
</script>
<style lang="scss">
.my-dialog{
    .el-dialog{
        .driver-image-list{
            display: flex;
            justify-content: space-between;
            padding: 0 20px 20px;
            li{
                >div{
                    width:280px;
                    height:178px;
                    border:1px solid rgba(0,255,255,1);
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .img-label{
                    font-size:14px;
                    font-family:Microsoft YaHei;
                    font-weight:400;
                    color:rgba(255,255,255,1);
                    line-height:40px;
                }
            }
        }
    }
}
</style>