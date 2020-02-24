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
                                    <i :class="['iconfont','icon-Company']" ></i>
                                    <!-- <i :class="['iconfont',{'icon-Motorcade':data.FNType == 0}]" ></i> -->
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
                <li :class="{active:activeIndex == 2}" @click="changeTab(2)">{{$t('under')}}{{$t('car')}}</li>
                <li :class="{active:activeIndex == 1}" @click="changeTab(1)">{{$t('all')}}{{$t('car')}}</li>
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
                               <i class="iconfont icon-Hint" @click="show1=true;queryAdminVehicleByFGUID(scoped.row)"></i>
                           </div>
                       </template>
                   </el-table-column>
                   <el-table-column
                     v-for="item in $t('carManage.tableLabel')"
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
            <el-dialog class="my-dialog" width="1260px" top="30px"  :close-on-click-modal="false" :modal="false" :visible.sync="show">
                <h4 class="title">
                    <span>{{addData.FGUID == ''?$t('add')+$t('car'):$t('edit')+$t('car')}}</span>
                </h4>
                <el-form :model="addData" inline ref="form" label-width="160px">
                    <h5 class="item-title">
                        <span>{{$t('carBasicInfo')}}</span>
                    </h5>
                    <!-- 车牌号 -->
                    <el-form-item :label="$t('vehicleName')" prop="FVehicleName"  :rules="[{ required: true, message: $t('input')}]">
                        <el-input v-model="addData.FVehicleName">
                        </el-input>
                    </el-form-item>
                    <!-- 车辆编码 -->
                    <el-form-item :label="$t('vehicleCode')" prop="FVehicleCode"  :rules="[{ required: true, message: $t('input')}]">
                        <el-input v-model="addData.FVehicleCode">
                        </el-input>
                    </el-form-item>
                    <!-- 车辆类型 -->
                    <el-form-item :label="$t('vehicleType')" prop="FVehicleTypeID"  :rules="[{ required: true, message: $t('input')}]">
                        <el-select v-model="addData.FVehicleTypeID">
                            <el-option v-for="item in vehicleTypeList" :key="item.FVehicleTypeID" :value="item.FVehicleTypeID" :label="item.FVehicleTypeName"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 发动机号 -->
                    <el-form-item :label="$t('FEngineNumber')" prop="FEngineNumber" >
                        <el-input v-model="addData.FEngineNumber">
                        </el-input>
                    </el-form-item>
                    <!-- 车架号 -->
                    <el-form-item :label="$t('FVIN')" prop="FVIN" >
                        <el-input v-model="addData.FVIN">
                        </el-input>
                    </el-form-item>
                    <!-- 座位数 -->
                    <el-form-item :label="$t('seatCount')" prop="FSeatCount">
                        <el-input type="number" v-model="addData.FSeatCount">
                        </el-input>
                    </el-form-item>
                    <!-- 载重 -->
                    <el-form-item :label="$t('FTonnage')+'(kg)'" prop="FTonnage" >
                        <el-input type="number" v-model="addData.FTonnage">
                        </el-input>
                    </el-form-item>
                    <!-- 车身颜色 -->
                    <el-form-item :label="$t('carColor')" prop="FColorRGB" >
                        <el-color-picker v-model="addData.FColorRGB"></el-color-picker>
                    </el-form-item>
                    <!-- 车辆图标 -->
                    <el-form-item  prop="FVehicleImgType" label-width="80px">
                        <el-select class="select-icon" v-model="addData.FVehicleImgType">
                            <i slot="prefix" :class="`car-icon ${addData.FVehicleImgType}`"></i>
                            <el-option v-for="item in iconList" :key="item" :value="`car-img${item}`">
                                <span :class="['car-icon',`car-img${item}`]"></span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 车身长度 -->
                    <el-form-item :label="$t('carLength')+'(m)'" prop="FLength" >
                        <el-input type="number" v-model="addData.FLength">
                        </el-input>
                    </el-form-item>
                    <!-- 燃油类型 -->
                    <el-form-item :label="$t('FFuelType')" prop="FFuelType" >
                        <el-select v-model="addData.FFuelType">
                            <el-option v-for="item in $t('fuelTypeList')" :key="item.value" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 保险公司 -->
                    <el-form-item :label="$t('FInsuCompany')" prop="FInsuCompany">
                        <el-input v-model="addData.FInsuCompany">
                        </el-input>
                    </el-form-item>
                    <!-- 保险日期 -->
                    <el-form-item :label="$t('FInsuDate')" prop="FInsuDate">
                         <el-date-picker
                          v-model="addData.FInsuDate"
                          type="date"
                          :placeholder="$t('select')">
                        </el-date-picker>
                    </el-form-item>
                    <!-- 车辆购买日期 -->
                    <el-form-item :label="$t('FPurchaseDate')" prop="FPurchaseDate">
                         <el-date-picker
                          v-model="addData.FPurchaseDate"
                          type="date"
                          :placeholder="$t('select')">
                        </el-date-picker>
                    </el-form-item>
                    <!-- 营运证号 -->
                    <el-form-item :label="$t('FOperPermNumber')" prop="FOperPermNumber" >
                        <el-input v-model="addData.FOperPermNumber">
                        </el-input>
                    </el-form-item>
                    <!-- 道路运输证号 -->
                    <el-form-item :label="$t('FRoadTranNumber')" prop="FRoadTranNumber" >
                        <el-input v-model="addData.FRoadTranNumber">
                        </el-input>
                    </el-form-item>
                    <!-- 道路运输证有效期 -->
                    <el-form-item :label="$t('FRoadTranDate')" prop="FRoadTranDate" >
                         <el-date-picker
                          v-model="addData.FRoadTranDate"
                          type="date"
                          :placeholder="$t('select')">
                        </el-date-picker>
                    </el-form-item>
                    <!-- 车辆技术登记有效期 -->
                    <el-form-item :label="$t('FTechRegDate')" prop="FTechRegDate" >
                         <el-date-picker
                          v-model="addData.FTechRegDate"
                          type="date"
                          :placeholder="$t('select')">
                        </el-date-picker>
                    </el-form-item>
                    <!-- 营运类型 -->
                    <el-form-item :label="$t('FOperateType')" prop="FOperateType" >
                        <el-select v-model="addData.FOperateType">
                            <el-option v-for="(item,key) in $t('operateObj')" :key="key" :value="key" :label="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 描述 -->
                    <el-form-item :label="$t('describe')" prop="FDescription" >
                        <el-input class="block" type="textarea" v-model="addData.FDescription">
                        </el-input>
                    </el-form-item>
                    <el-form-item :label="$t('carImage')">
                        <div class="thumb-img" v-if="file">
                            <div class="delete">
                                <i class="el-icon-delete" @click="fileList = [] "></i>
                            </div>
                            <img :src="baseUrl+file" alt="">
                        </div>
                        <el-upload
                          v-else
                          action='/Web/CarCloud_Common'
                          list-type="picture-card"
                          :limit = '1'
                          :multiple="false"
                          :show-file-list="false"
                          :before-upload="beforeUpload"
                          :http-request="uploadImg"
                          :on-success="uploadSuccess"
                         >
                            <p><i class="el-icon-plus"></i><br><span>上传(160*60)</span></p>
                        </el-upload>                
                    </el-form-item>
                    <h5 class="item-title">
                        <span>{{$t('bindingInfo')}}</span>
                    </h5>
                    <!-- 设备标识 -->
                    <el-form-item :label="$t('deviceID')" prop="FAssetGUID" >
                        <el-select v-model="addData.FAssetGUID" filterable>
                            <el-option v-for="item in deviceList" :key="item.FGUID" :value="item.FAssetID" :label="item.FAssetID"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 车队名称 -->
                    <el-form-item :label="$t('carTeamName')" prop="FGroupGUID" :rules="[{ required: true, message: $t('select')}]">
                        <el-select v-model="addData.FGroupGUID">
                            <el-option v-for="(item,key) in carTeamList" :key="key" :value="item.FGUID" :label="item.FGroupName"></el-option>
                        </el-select>
                    </el-form-item><br>
                    <!-- 主驾司机 -->
                    <el-form-item :label="$t('mainDriver')" prop="FMainDriverGUID" >
                        <el-select v-model="addData.FMainDriverGUID">
                            <el-option v-for="item in driverList" :key="item.FGUID" :value="item.FGUID" :label="item.FDriverName"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 副驾司机 -->
                    <el-form-item :label="$t('copilotDriver')" prop="FCopilotDriverGUID" >
                        <el-select v-model="addData.FCopilotDriverGUID">
                            <el-option v-for="item in driverList" :key="item.FGUID" :value="item.FGUID" :label="item.FDriverName"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="submit" slot="footer">
                    <el-button type="primary" @click="show =false">{{$t('cancle')}}</el-button>
                    <el-button type="primary" @click="addOrUpdate()">{{$t('submit')}}</el-button>
                </div>
            </el-dialog>
            <el-dialog class="my-dialog" width="1260px" top="30px" :modal="false" :visible.sync="show1">
                <h4 class="title"><span>{{$t('carDetail')}}</span></h4>
                <h5 class="item-title">
                    <span>{{$t('companyInfo')}}</span>
                </h5>
                <ul class="info">
                    <!-- 公司名称 -->
                    <li>
                        <span class="label">{{$t('companyName')}}</span>
                        <span class="value">{{carDetail.FAgentName||'--'}}</span>
                    </li>
                    <!-- 公司编码 -->
                    <li>
                        <span class="label">{{$t('companyCode')}}</span>
                        <span class="value">{{carDetail.FAgentCode||'--'}}</span>
                    </li>
                    <br>
                    <!-- 公司联系人 -->
                    <li>
                        <span class="label">{{$t('FAgentContacts')}}</span>
                        <span class="value">{{carDetail.FAgentContacts||'--'}}</span>
                    </li>
                    <!-- 公司联系电话 -->
                    <li>
                        <span class="label">{{$t('FAgentTelephone')}}</span>
                        <span class="value">{{carDetail.FAgentTelephone||'--'}}</span>
                    </li>
                    <!-- 公司联系电话 -->
                    <li>
                        <span class="label">{{$t('FAgentEMailAddress')}}</span>
                        <span class="value">{{carDetail.FAgentEMailAddress||'--'}}</span>
                    </li>
                </ul>
                <h5 class="item-title">
                    <span>{{$t('carTeamInfo')}}</span>
                </h5>
                <ul class="info">
                    <!-- 车队名称 -->
                    <li>
                        <span class="label">{{$t('carTeamName')}}</span>
                        <span class="value">{{carDetail.FGroupName||'--'}}</span>
                    </li><br>
                    <!-- 车队联系人 -->
                    <li>
                        <span class="label">{{$t('contact')}}</span>
                        <span class="value">{{carDetail.FGroupContacts||'--'}}</span>
                    </li>
                    <!-- 联系电话 -->
                    <li>
                        <span class="label">{{$t('telephone')}}</span>
                        <span class="value">{{carDetail.FGroupTelephone||'--'}}</span>
                    </li>
                    <!-- 联系邮箱 -->
                    <li>
                        <span class="label">{{$t('email')}}</span>
                        <span class="value">{{carDetail.FGroupEMailAddress||'--'}}</span>
                    </li>
                </ul>
                <h5 class="item-title">
                    <span>{{$t('carBasicInfo')}}</span>
                </h5>
                <div class="clearfix">
                    <ul class="info l"style="width:800px;">
                        <!-- 车牌号 -->
                        <li>
                            <span class="label">{{$t('vehicleName')}}</span>
                            <span class="value">{{carDetail.FVehicleName||'--'}}</span>
                        </li>
                        <!-- 车辆编码 -->
                        <li>
                            <span class="label">{{$t('vehicleCode')}}</span>
                            <span class="value">{{carDetail.FGroupContacts||'--'}}</span>
                        </li>
                        <!-- 发动机号 -->
                        <li>
                            <span class="label">{{$t('FEngineNumber')}}</span>
                            <span class="value">{{carDetail.FEngineNumber||'--'}}</span>
                        </li>
                        <!-- 车架号 -->
                        <li>
                            <span class="label">{{$t('FVIN')}}</span>
                            <span class="value">{{carDetail.FVIN||'--'}}</span>
                        </li>
                        <!-- 保险公司 -->
                        <li>
                            <span class="label">{{$t('FInsuCompany')}}</span>
                            <span class="value">{{carDetail.FInsuCompany||'--'}}</span>
                        </li>
                        <!-- 保险日期 -->
                        <li>
                            <span class="label">{{$t('FInsuDate')}}</span>
                            <span class="value">{{formatDate(carDetail.FInsuDate,'YYYY-MM-DD')||'--'}}</span>
                        </li>
                        <!-- 车辆购买日期 -->
                        <li>
                            <span class="label">{{$t('FPurchaseDate')}}</span>
                            <span class="value">{{formatDate(carDetail.FPurchaseDate,'YYYY-MM-DD')||'--'}}</span>
                        </li>
                        <!-- 营运证号 -->
                        <li>
                            <span class="label">{{$t('FOperPermNumber')}}</span>
                            <span class="value">{{carDetail.FOperPermNumber||'--'}}</span>
                        </li>
                        <!-- 道路运输证号 -->
                        <li>
                            <span class="label">{{$t('FRoadTranNumber')}}</span>
                            <span class="value">{{carDetail.FRoadTranNumber||'--'}}</span>
                        </li>
                        <!-- 道路运输证有效期 -->
                        <li>
                            <span class="label">{{$t('FRoadTranDate')}}</span>
                            <span class="value">{{formatDate(carDetail.FRoadTranDate,'YYYY-MM-DD')||'--'}}</span>
                        </li>
                        <!-- 车辆技术登记有效期 -->
                        <li>
                            <span class="label">{{$t('FTechRegDate')}}</span>
                            <span class="value">{{formatDate(carDetail.FTechRegDate,'YYYY-MM-DD')||'--'}}</span>
                        </li>
                        <!-- 运营类型 -->
                        <li>
                            <span class="label">{{$t('FOperateType')}}</span>
                            <span class="value">{{$t('operateObj')[carDetail.FOperateType]||$t('else')}}</span>
                        </li>
                    </ul>
                    <div class="car-image-box">
                        <div class="car-iamge-content">
                            <img v-if="carDetail.FImage" :src="baseUrl+carDetail.FImage" alt="">
                            <img v-else src="@/assets/images/no-image.jpg" alt="">
                        </div>
                        <ul class="car-params">
                            <li>
                                <span class="label">{{$t('carColor')}}</span>
                                <span class="color-bar" :style="{background:carDetail.FColorRGB}"></span>
                            </li>
                            <li>
                                <span class="label">{{$t('carLength')}}</span>
                                <span>{{carDetail.FLength||'--'}}M</span>
                            </li>
                            <li>
                                <span class="label">{{$t('carFTonnage')}}</span>
                                <span>{{carDetail.FTonnage||'--'}}KG</span>
                            </li>
                            <li>
                                <span class="label">{{$t('carIcon')}}</span>
                                <span :class="['car-icon',carDetail.FVehicleImgType||'car-img1']"></span>
                            </li>
                        </ul>
                    </div>
                </div>
                <h5 class="item-title">
                    <span>{{$t('deviceInfo')}}</span>
                </h5>
                <ul class="info">
                    <!-- 设备ID -->
                    <li>
                        <span class="label">{{$t('deviceID')}}</span>
                        <span class="value">{{carDetail.FAssetID||'--'}}</span>
                    </li>
                    <!-- 设备类型 -->
                    <li>
                        <span class="label">{{$t('deviceType')}}</span>
                        <span class="value">{{carDetail.FAssetTypeID||'--'}}</span>
                    </li><br>
                    <!-- SIM卡号 -->
                    <li>
                        <span class="label">{{$t('SIM')}}</span>
                        <span class="value">{{carDetail.FSIMNumber||'--'}}</span>
                    </li>
                    <!-- IMEI -->
                    <li>
                        <span class="label">IMEI</span>
                        <span class="value">{{carDetail.FIMEI||'--'}}</span>
                    </li>
                </ul>
                <h5 class="item-title">
                    <span>{{$t('driverInfo')}}</span>
                </h5>
                <ul class="info">
                    <!-- 主驾司机 -->
                    <li>
                        <span class="label">{{$t('mainDriver')}}</span>
                        <span class="value">{{carDetail.FMainDriverName||'--'}}</span>
                    </li>
                    <!-- 主驾司机电话 -->
                    <li>
                        <span class="label">{{$t('mainDriverTelephont')}}</span>
                        <span class="value">{{carDetail.FMainDrivePhone||'--'}}</span>
                    </li><br>
                    <!-- 副驾司机 -->
                    <li>
                        <span class="label">{{$t('copilotDriver')}}</span>
                        <span class="value">{{carDetail.FCopilotDriverName||'--'}}</span>
                    </li>
                    <!-- 副驾司机电话 -->
                    <li>
                        <span class="label">{{$t('copilotDriverTelephont')}}</span>
                        <span class="value">{{carDetail.FCopilotDriverPhone||'--'}}</span>
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
import axios from 'axios'
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
            vehicleTypeList:[], //车辆类型
            file:null,
            iconList:[1,2,3,4,5,6,7,8,9,10,11],
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
                FVehicleName:'',
                FVehicleCode:'',
                FAssetGUID:'',
                FVIN:'',
                FEngineNumber:'',
                FVehicleTypeID:'',
                FSeatCount:'',
                FTonnage:'',
                FColorRGB:'#ffffff',
                FLength:'',
                FFuelType:'',
                FInsuCompany:'',
                FInsuDate:'',
                FPurchaseDate:'',
                FOperPermNumber:'',
                FRoadTranNumber:'',
                FRoadTranDate:'',
                FTechRegDate:'',
                FDescription:'',
                FImage:'',
                FVehicleImgType:'car-img1',
                FAgentGUID:'',
                FGroupGUID:'',
                FOperateType:'',
                FMainDriverGUID:'',
                FCopilotDriverGUID:''
            },
            carDetail:{},
            deviceList:[],//设备列表
            carTeamList:[], //车队列表
            driverList:[],//司机列表
            baseUrl:process.env.NODE_ENV == 'development'?'http://39.108.194.238:56081':''
        }
    },
    created(){
        this.defaultAddData = {...this.addData}
        this.queryCompanyTree()
        this.queryAdminVehicleType()
        if (!window.FileReader) {
          console.error('Your browser does not support FileReader API!')
        }
        this.fileReader = new FileReader()  
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
                    this.$nextTick(() =>{
                        this.$refs.tree.setCurrentKey(this.guid)
                    })
                }
            }).catch((err) => {
                
            });
        },
        /**
         * 3.3.5 查询车辆列表
         */
        queryData(){
            User({
                FAction:'QueryAdminVehicleList',
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
         * 3.3.1 查询车辆类型
         */
        queryAdminVehicleType(){
            User({
                FAction:'QueryAdminVehicleType'
            })
            .then((result) => {
                this.vehicleTypeList = result.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 根据公司GUID查询设备列表
         */
        queryAdminAssetComboBox(){
            User({
                FAction:'QueryAdminAssetComboBox',
                FAgentGUID:this.addData.FAgentGUID
            })
            .then((result) => {
                this.deviceList = result.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 根据公司GUID查询车队
         */
        queryAdminGroupComboBox(){
            User({
                FAction:'QueryAdminGroupComboBox',
                FAgentGUID:this.addData.FAgentGUID
            })
            .then((result) => {
                this.carTeamList = result.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 根据公司GUID查询司机列表
         */
        queryAdminMainDriverComboBox(){
            User({
                FAction:'QueryAdminMainDriverComboBox',
                FAgentGUID:this.addData.FAgentGUID
            })
            .then((result) => {
                this.driverList = result.FObject
            }).catch((err) => {
                
            });
        },
        /**
         * 
         */
        beforeAdd(){
            this.addData = {...this.defaultAddData}
            this.addData.FAgentGUID = this.guid
            this.show = true
            this.queryAdminAssetComboBox()
            this.queryAdminGroupComboBox()
            this.queryAdminMainDriverComboBox()
        },
        /**
         * 编辑
         */
        async editRow(row){
            this.show = true
            await this.queryAdminVehicleByFGUID(row)
            Object.keys(this.addData).forEach(key => {
                this.addData[key] = this.carDetail[key]||''
            })
            this.queryAdminAssetComboBox()
            this.queryAdminGroupComboBox()
            this.queryAdminMainDriverComboBox()
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
                action = 'UpdateAdminVehicle'
            }else{
                action = 'AddAdminVehicle'
            }
            User({
                FAction:action,
                FT_AdminVehicle:this.addData
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
         * 3.3.4 查询车辆详情
         */
        queryAdminVehicleByFGUID(row){
            return new Promise((resolve,reject) => {
                User({
                    FAction:"QueryAdminVehicleByFGUID",
                    FGUID:row.FGUID
                })
                .then((result) => {
                    this.carDetail = result.FObject[0]||{}
                    resolve()
                }).catch((err) => {
                    this.carDetail = {}
                    reject()
                });
            })
        },
        beforeUpload (file) {
          const isLt5M = file.size < 5 * 1024 * 1024
          if (!isLt5M) {
            this.$message
            this.$message({
                message:'The max size is 5MB',
                type:'error',
                duration:'500'
            })
            return false
          }
        },
        uploadImg(options){
            let file = options.file
            let filename = file.name
            if (file) {
              this.fileReader.readAsDataURL(file)
            }
            this.fileReader.onload = () => {
              let base64Str = this.fileReader.result
              let config = {
                url: '/Web/CarCloud_Common',
                method: 'post',
                data: {
                  FAction:"UpLoadPicture",
                  FDirectory:`Vehicle/`,
                  FPicture: base64Str.split(',')[1],
                  FTokenID: localStorage.getItem('FToken')
                },
                timeout: 10000,
                onUploadProgress: function (progressEvent) {
                  // console.log(progressEvent)
                  progressEvent.percent = progressEvent.loaded / progressEvent.total * 100
                  options.onProgress(progressEvent, file)
                },
              }
              axios(config)
                .then(res => {
                  options.onSuccess(res, file)
                })
                .catch(err => {
                  options.onError(err)
                })
            }
        },
        uploadSuccess (res, file, fileList) {
          let data = res.data
          if(data.Result == 200){
              this.file = '/'+data.Message
          }
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
            this.deleteAdminVehicle(idStr) 
        },
        deleteRow(guid){
            this.deleteAdminVehicle(guid)
        },
        /**
         * 3.3.7 删除车辆
         * @parm {String} idStr 车辆ID
         */
        async deleteAdminVehicle(idStr){
            if(!idStr) return
            await this.beforeDelete()
            User({
                FAction:'DeleteAdminVehicle',
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
                FAction:'ExportAdminVehicleList',
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
$car-img:'../../assets/images/marker/';
.car-icon{
    display: inline-block;
    width: 18px;
    height: 18px;
}
.car-img1{
    background: url(#{$car-img}car-img1.png) no-repeat;
}
.car-img2{
    background: url(#{$car-img}car-img2.png) no-repeat;
}
.car-img3{
    background: url(#{$car-img}car-img3.png) no-repeat;
}
.car-img4{
    background: url(#{$car-img}car-img4.png) no-repeat;
}
.car-img5{
    background: url(#{$car-img}car-img5.png) no-repeat;
}
.car-img6{
    background: url(#{$car-img}car-img6.png) no-repeat;
}
.car-img7{
    background: url(#{$car-img}car-img7.png) no-repeat;
}
.car-img8{
    background: url(#{$car-img}car-img8.png) no-repeat;
}
.car-img9{
    background: url(#{$car-img}car-img9.png) no-repeat;
}
.car-img10{
    background: url(#{$car-img}car-img10.png) no-repeat;
}
.car-img11{
    background: url(#{$car-img}car-img11.png) no-repeat;
}
.my-dialog{
    .el-dialog{
        &__body{
            div.car-image-box{
                margin-left: 800px;
                .car-iamge-content{
                    width: 350px;
                    height: 180px;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .car-params{
                    margin-top: 10px;
                    li{
                        display: inline-block;
                        width: 50%;
                        text-align: left;
                        line-height: 50px;
                        .color-bar{
                            display: inline-block;
                            width:77px;
                            height:10px;
                            background:rgba(235,97,0,1);
                        }
                    }
                }
            }
        }
    }
}
</style>