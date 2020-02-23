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
                <el-button><i class="iconfont icon-Transfer"></i>{{$t('translate')}}</el-button>
                <el-button @click="exportFile"><i class="iconfont icon-Export"></i>{{$t('export')}}</el-button>
                <el-button><i class="iconfont icon-Import"></i>{{$t('imports')}}</el-button>
                <el-button><i class="iconfont icon-Download"></i>{{$t('downloadModule')}}</el-button>
                <el-input class="r filter-box" placeholder="" v-model="searchKey" @change="queryData()">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>   
            </div>
            <ul class="tab-header">
                <li :class="{active:activeIndex == 2}" @click="changeTab(2)">{{$t('underDevice')}}</li>
                <li :class="{active:activeIndex == 1}" @click="changeTab(1)">{{$t('allDevice')}}</li>
            </ul>
            <div class="tab-content">
                <el-table
                   :data="tableData"
                   style="width: 100%"
                   height="770"
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
                               <i class="iconfont icon-Hint" @click="queryAdminAssetByFGUID(scoped.row)"></i>
                           </div>
                       </template>
                   </el-table-column>
                   <el-table-column
                     v-for="item in $t('deviceManage.tableLabel')"
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
            <el-dialog class="my-dialog" width="1260px" top="30px" :modal="false" :close-on-click-modal="false" :visible.sync="show">
                <h4 class="title">
                    <span>{{addData.FGUID == ''?$t('addDevice'):$t('editDevice')}}</span>
                </h4>
                <el-form  :model="addData" inline ref="form" label-width="160px">
                    <h5 class="item-title">
                        <span>{{$t('carBasicInfo')}}</span>
                    </h5>
                    <!-- 设备ID -->
                    <el-form-item :label="$t('deviceID')" prop="FAssetID"  :rules="[{ required: true, message: $t('input')}]">
                        <el-input v-model="addData.FAssetID">
                        </el-input>
                    </el-form-item>
                    <!-- 设备类型 -->
                    <el-form-item :label="$t('deviceType')" prop="FAssetTypeID"  :rules="[{ required: true, message: $t('select')}]">
                        <el-select v-model="addData.FAssetTypeID" filterable>
                            <el-option v-for="item in deviceTypeList" :key="item.FAssetTypeID" :value="item.FAssetTypeID" :label="item.FAssetTypeName"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- SIM卡号 -->
                    <el-form-item :label="$t('SIM')" prop="FSIMNumber"  :rules="[{ required: true, message: $t('input')}]">
                        <el-input v-model="addData.FSIMNumber">
                        </el-input>
                    </el-form-item>
                    <!-- IMEI号 -->
                    <el-form-item :label="$t('IMEI')" prop="FIMEI"  :rules="[{ required: true, message: $t('input')}]">
                        <el-input v-model="addData.FIMEI">
                        </el-input>
                    </el-form-item>
                    <!-- 车辆名称 -->
                    <el-form-item :label="$t('bindingCar')" prop="FVehicleGUID" >
                        <el-select v-model="addData.FVehicleGUID" filterable>
                            <el-option v-for="item in vehicleList" :key="item.FGUID" :value="item.FGUID" :label="item.FVehicleName"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 描述 -->
                    <el-form-item :label="$t('describe')" prop="FDescription" >
                        <el-input class="block" type="textarea" v-model="addData.FDescription">
                        </el-input>
                    </el-form-item>
                </el-form>
                <div class="submit" slot="footer">
                    <el-button type="primary" @click="show =false">{{$t('cancle')}}</el-button>
                    <el-button type="primary"  @click="addOrUpdate()">{{$t('submit')}}</el-button>
                </div>
            </el-dialog>
            <el-dialog class="my-dialog" width="1260px" top="30px" :modal="false" :visible.sync="show1">
                <h4 class="title"><span>{{$t('deviceDetail')}}</span></h4>
                <h5 class="item-title">
                    <span>{{$t('companyInfo')}}</span>
                </h5>
                <ul class="info">
                    <!-- 公司名称 -->
                    <li>
                        <span class="label">{{$t('companyName')}}</span>
                        <span class="value">{{deviceDetail.FAgentName||'--'}}</span>
                    </li>
                    <!-- 公司编码 -->
                    <li>
                        <span class="label">{{$t('companyCode')}}</span>
                        <span class="value">{{deviceDetail.FAgentCode||'--'}}</span>
                    </li>
                    <br>
                    <!-- 公司联系人 -->
                    <li>
                        <span class="label">{{$t('FAgentContacts')}}</span>
                        <span class="value">{{deviceDetail.FAgentContacts||'--'}}</span>
                    </li>
                    <!-- 公司联系电话 -->
                    <li>
                        <span class="label">{{$t('FAgentTelephone')}}</span>
                        <span class="value">{{deviceDetail.FAgentTelephone||'--'}}</span>
                    </li>
                    <!-- 公司联系电话 -->
                    <li>
                        <span class="label">{{$t('FAgentEMailAddress')}}</span>
                        <span class="value">{{deviceDetail.FAgentEMailAddress||'--'}}</span>
                    </li>
                </ul>
                <h5 class="item-title">
                    <span>{{$t('deviceInfo')}}</span>
                </h5>
                <ul class="info">
                    <!-- 设备ID -->
                    <li>
                        <span class="label">{{$t('deviceID')}}</span>
                        <span class="value">{{deviceDetail.FAssetID||'--'}}</span>
                    </li>
                    <!-- 设备类型 -->
                    <li>
                        <span class="label">{{$t('deviceType')}}</span>
                        <span class="value">{{deviceDetail.FAssetTypeName||'--'}}</span>
                    </li><br>
                    <!-- SIM卡号 -->
                    <li>
                        <span class="label">{{$t('SIM')}}</span>
                        <span class="value">{{deviceDetail.FSIMNumber||'--'}}</span>
                    </li>
                    <!-- IMEI -->
                    <li>
                        <span class="label">IMEI</span>
                        <span class="value">{{deviceDetail.FIMEI||'--'}}</span>
                    </li>
                </ul>
                <h5 class="item-title">
                    <span>{{$t('carBasicInfo')}}</span>
                </h5>
                <div class="clearfix">
                    <ul class="info">
                        <!-- 车牌号 -->
                        <li>
                            <span class="label">{{$t('vehicleName')}}</span>
                            <span class="value">{{deviceDetail.FVehicleName||'--'}}</span>
                        </li>
                        <!-- 车辆编码 -->
                        <li>
                            <span class="label">{{$t('vehicleCode')}}</span>
                            <span class="value">{{deviceDetail.FGroupContacts||'--'}}</span>
                        </li>
                        <!-- 车架号 -->
                        <li>
                            <span class="label">{{$t('FVIN')}}</span>
                            <span class="value">{{deviceDetail.FVIN||'--'}}</span>
                        </li>
                        <!-- 运营类型 -->
                        <li>
                            <span class="label">{{$t('FOperateType')}}</span>
                            <span class="value">{{$t('operateObj')[deviceDetail.FOperateType]||$t('else')}}</span>
                        </li>
                    </ul>
                </div>
                <h5 class="item-title">
                    <span>{{$t('driverInfo')}}</span>
                </h5>
                <ul class="info">
                    <!-- 主驾司机 -->
                    <li>
                        <span class="label">{{$t('mainDriver')}}</span>
                        <span class="value">{{deviceDetail.FMainDriverName||'--'}}</span>
                    </li>
                    <!-- 主驾司机电话 -->
                    <li>
                        <span class="label">{{$t('mainDriverTelephont')}}</span>
                        <span class="value">{{deviceDetail.FMainDrivePhone||'--'}}</span>
                    </li><br>
                    <!-- 副驾司机 -->
                    <li>
                        <span class="label">{{$t('copilotDriver')}}</span>
                        <span class="value">{{deviceDetail.FCopilotDriverName||'--'}}</span>
                    </li>
                    <!-- 副驾司机电话 -->
                    <li>
                        <span class="label">{{$t('copilotDriverTelephont')}}</span>
                        <span class="value">{{deviceDetail.FCopilotDriverPhone||'--'}}</span>
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
            deviceTypeList:[], //设备类型
            searchKey:"",
            guid:"",
            formatDate:formatDate,
            checkRows:[],
            companyData:[],
            currentCompany:{ //当前选中的公司
            },
            defaultAddData:{},
            addData:{
                FGUID:'',
                FVehicleGUID:'',
                FAssetID:'',
                FAssetTypeID:'',
                FSIMNumber:'',
                FIMEI:'',
                FDescription:'',
                FAgentGUID:'',
            },
            deviceDetail:{},
            vehicleList:[]
        }
    },
    created(){
        this.defaultAddData = {...this.addData}
        this.queryCompanyTree()
    },
    methods:{
        /**
         * 3.7.1 查询账户管理的公司树
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
                    this.$nextTick(() =>{
                        this.$refs.tree.setCurrentKey(this.guid)
                    })
                }
            }).catch((err) => {
                
            });
        },
        /**
         * 3.4.4 查询终端列表 
         */
        queryData(){
            User({
                FAction:'QueryAdminAssetList',
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
         * 3.3.1 查询设备类型
         */
        queryAdminAssetType(){
            User({
                FAction:'QueryAdminAssetType',
                FAgentGUID: this.guid
            })
            .then((result) => {
                this.deviceTypeList = result.FObject
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
            this.show = true
            this.queryAdminAssetType()
            this.queryVehicleList()
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
                action = 'UpdateAdminAsset'
            }else{
                action = 'AddAdminAsset'
            }
            User({
                FAction:action,
                FT_AdminAsset:this.addData
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
                cosole.log(err)
                this.$message({
                    message:this.$t('error'),
                    type:'error',
                    duration:'500'
                })
            })   
        },
        /**
         * 3.3.7 查询设备详情
         */
        queryAdminAssetByFGUID(row){
            this.show1 = true
            User({
                FAction:"QueryAdminAssetByFGUID",
                FGUID:row.FGUID
            })
            .then((result) => {
                this.deviceDetail = result.FObject[0]||{}
            }).catch((err) => {
                this.deviceDetail = {}
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
            this.deleteAdminAsset(idStr) 
        },
        deleteRow(guid){
            this.deleteAdminAsset(guid)
        },
        /**
         * 3.3.6 删除设备
         * @parm {String} idStr 设备ID
         */
        async deleteAdminAsset(idStr){
            if(!idStr) return
            await this.beforeDelete()
            User({
                FAction:'DeleteAdminAsset',
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
                FAction:'ExportAdminAssetList',
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
</style>