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
                     :data="companyData"
                     default-expand-all
                     :expand-on-click-node="false"
                     :props="defaultProps"
                    >
                        <template slot-scope="{ node, data }">
                            <div class="node-item">
                                <div :class="['node-item-label',{active:data.FGUID==guid}]" @click="data.FNType == 1&&queryCompanyInfo(data.FGUID)">
                                    <i :class="['iconfont',{'icon-Company':data.FNType == 1}]" ></i>
                                    <i :class="['iconfont',{'icon-Motorcade':data.FNType == 0}]" ></i>
                                    <span>{{data.FName}}</span>
                                </div>
                                <div class="r">
                                    <i v-if="data.FNType == 1"  class="iconfont icon-Startacompany" @click="beforeAddCompany(data)" :title="$t('company.addCompany')"></i>
                                    <i v-if="data.FNType == 1" class="iconfont icon-Addfleet" @click="beforeAddTeam(data)" :title="$t('addCarTeam')"></i>
                                    <i class="iconfont icon-Edit" @click="editNode(data)" :title="$t('edit')"></i>
                                    <i class="iconfont icon-Rubbish" @click="deleteNode(data)" :title="$t('delete')"></i>
                                </div>
                            </div>
                        </template>
                    </el-tree>
                </el-scrollbar>
            </div>
        </div>
        <div class="company-main height-100">
            <div class="company-main-default  height-100">
                <h5 class="title-icon">{{$t('companyDetail')}}</h5>
                <div class="company-detail">
                    <ul class="flex">
                        <li :style="{width:item.width}" v-for="(item,i) in $t('company.companyInfoLabel')" :key="i">
                            <span class="label">{{item.label}}：</span>{{companyInfo[item.prop]}}
                        </li>
                        <li class="describe flex">
                            <span class="label">{{$t('describe')}}：</span>
                            <div>
                                {{companyInfo.FDescribe}}
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="table-container" style="height:618px;">
                    <div class="flex table-container-header">
                        <el-input v-model="searchKey">
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
                            <el-table-column
                              type="index"
                              :label="$t('index')"
                              width="80">
                            </el-table-column>
                           <el-table-column
                             v-for="item in $t('company.tableLabel')"
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
                    </div>
                </div>
            </div>
            <div class="add-company  height-100" v-if="show">
                <h5 class="title-icon">{{addData.FGUID?$t('company.editCompany'):$t('company.addCompany')}}</h5>
                <div class="add-form">
                    <el-form :model="addData" inline ref="form">
                        <el-form-item :label="$t('companyName')" prop="FName"  :rules="[{ required: true, message: $t('input')}]">
                            <el-input  v-model="addData.FName">
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('companyCode')" prop="FCode"  :rules="[{ required: true, message: $t('input')}]">
                            <el-input  v-model="addData.FCode">
                            </el-input>
                        </el-form-item>
                        <br>
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
                        <el-form-item :label="$t('defaultGroupName')" prop="FGroupName" :rules="[{ required: true, message: $t('input')}]">
                            <el-input  v-model="addData.FGroupName" >
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('country')" prop="FCountry"  :rules="[{ required: true, message: $t('select')}]">
                            <el-select v-model="addData.FCountry"  filterable  :placeholder="$t('select')" >
                              <el-option v-for="list in countryList" :key="list.value" :label="list.label" :value="list.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="time-diff-select" :label="$t('diffTime')"  prop="FTimeDifferent" >
                            <el-select v-model="timeType"  filterable  :placeholder="$t('select')" >
                              <el-option :value="0" label="+"></el-option>
                              <el-option :value="1" label="-"></el-option>
                            </el-select>&nbsp;
                            <el-select v-model="hour"  filterable  :placeholder="$t('select')" >
                              <el-option v-for="(item,i) in 13" :value="i" :label="i" :key="i"></el-option>
                            </el-select>
                            :
                            <el-select v-model="minute"  filterable  :placeholder="$t('select')" >
                              <el-option :value="0" label="0"></el-option>
                              <el-option :value="30" label="30"></el-option>
                              <el-option :value="45" label="45"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('describe')" style="width:100%"  prop="FDescribe" >
                            <el-input type="textarea" v-model="addData.FDescribe">
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <div class="add-form-footer">
                        <el-button class="save" @click='addOrUpdateCompany()'>{{$t('save')}}</el-button>
                        <el-button class="cancle" @click='show = false'>{{$t('cancle')}}</el-button>
                    </div>
                </div>
            </div>
            <div class="add-company  height-100" v-if="show1">
                <h5 class="title-icon">{{addTeam.FGUID?$t('editCarTeam'):$t('addCarTeam')}}</h5>
                <div class="add-form">
                    <el-form :model="addTeam" inline ref="form">
                        <el-form-item :label="$t('carTeamName')" prop="FGroupName"  :rules="[{ required: true, message: $t('input')}]">
                            <el-input  v-model="addTeam.FGroupName">
                            </el-input>
                        </el-form-item>
<!--                         <el-form-item label="车队编码" prop="FCode"  :rules="[{ required: true, message: '请输入'}]">
                            <el-input  v-model="addTeam.FCode">
                            </el-input>
                        </el-form-item> -->
                        <br>
                        <el-form-item :label="$t('contact')" prop="FContacts"  :rules="[{ required: true, message: $t('input')}]">
                            <el-input  v-model="addTeam.FContacts">
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('telephone')" prop="FTelephone"  :rules="FTelephoneRule">
                            <el-input  v-model="addTeam.FTelephone">
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('email')" prop="FEMailAddress" >
                            <el-input  v-model="addTeam.FEMailAddress">
                            </el-input>
                        </el-form-item>
<!--                         <el-form-item label="描述" style="width:100%"  prop="FDescribe" >
                            <el-input type="textarea" v-model="addData.FDescribe">
                            </el-input>
                        </el-form-item> -->
                    </el-form>
                    <div class="add-form-footer">
                        <el-button class="save" @click='addOrUpdateTeam()'>{{$t('save')}}</el-button>
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
export default {
    mixins:[table],
    data(){
        return {
            show:false, //新增公司
            show1:false, //新增车队
    		countryList: [
    		    {value:'Angola',label:'安哥拉'},
				{value:'Afghanistan',label:'阿富汗'},
				{value:'Albania',label:'阿尔巴尼亚'},
				{value:'Algeria',label:'阿尔及利亚'},
				{value:'Andorra',label:'安道尔共和国'},
				{value:'Anguilla',label:'安圭拉岛'},
				{value:'Antigua and Barbuda',label:'安提瓜和巴布达'},
				{value:'Argentina',label:'阿根廷'},
				{value:'Armenia',label:'亚美尼亚'},
				{value:'Ascension',label:'阿森松'},
				{value:'Australia',label:'澳大利亚'},
				{value:'Austria',label:'奥地利'},
				{value:'Azerbaijan',label:'阿塞拜疆'},
				{value:'Bahamas',label:'巴哈马'},
				{value:'Bahrain',label:'巴林'},
				{value:'Bangladesh',label:'孟加拉国'},
				{value:'Barbados',label:'巴巴多斯'},
				{value:'Belarus',label:'白俄罗斯'},
				{value:'Belgium',label:'比利时'},
				{value:'Belize',label:'伯利兹'},
				{value:'Benin',label:'贝宁'},
				{value:'Bermuda Is',label:'百慕大群岛'},
				{value:'Bolivia',label:'玻利维亚'},
				{value:'Botswana',label:'博茨瓦纳'},
				{value:'Brazil',label:'巴西'},
				{value:'Brunei',label:'文莱'},
				{value:'Bulgaria',label:'保加利亚'},
				{value:'Burkina Faso',label:'布基纳法索'},
				{value:'Burma',label:'缅甸'},
				{value:'Burundi',label:'布隆迪'},
				{value:'Cameroon',label:'喀麦隆'},
				{value:'Canada',label:'加拿大'},
				{value:'Cayman Is',label:'开曼群岛'},
				{value:'Central African Republic',label:'中非共和国'},
				{value:'Chad',label:'乍得'},
				{value:'Chile',label:'智利'},
				{value:'China',label:'中国'},
				{value:'Colombia',label:'哥伦比亚'},
				{value:'Congo',label:'刚果'},
				{value:'Cook Is',label:'库克群岛'},
				{value:'Costa Rica',label:'哥斯达黎加'},
				{value:'Cuba',label:'古巴'},
				{value:'Cyprus',label:'塞浦路斯'},
				{value:'Czech Republic',label:'捷克'},
				{value:'Denmark',label:'丹麦'},
				{value:'Djibouti',label:'吉布提'},
				{value:'Dominica Rep',label:'多米尼加共和国'},
				{value:'Ecuador',label:'厄瓜多尔'},
				{value:'Egypt',label:'埃及'},
				{value:'EI Salvador',label:'萨尔瓦多'},
				{value:'Estonia',label:'爱沙尼亚'},
				{value:'Ethiopia',label:'埃塞俄比亚'},
				{value:'Fiji',label:'斐济'},
				{value:'Finland',label:'芬兰'},
				{value:'France',label:'法国'},
				{value:'French Guiana',label:'法属圭亚那'},
				{value:'French Polynesia',label:'法属玻利尼西亚'},
				{value:'Gabon',label:'加蓬'},
				{value:'Gambia',label:'冈比亚'},
				{value:'Georgia',label:'格鲁吉亚'},
				{value:'Germany',label:'德国'},
				{value:'Ghana',label:'加纳'},
				{value:'Gibraltar',label:'直布罗陀'},
				{value:'Greece',label:'希腊'},
				{value:'Grenada',label:'格林纳达'},
				{value:'Guam',label:'关岛'},
				{value:'Guatemala',label:'危地马拉'},
				{value:'Guinea',label:'几内亚'},
				{value:'Guyana',label:'圭亚那'},
				{value:'Haiti',label:'海地'},
				{value:'Honduras',label:'洪都拉斯'},
				{value:'Hungary',label:'匈牙利'},
				{value:'Iceland',label:'冰岛'},
				{value:'India',label:'印度'},
				{value:'Indonesia',label:'印度尼西亚'},
				{value:'Iran',label:'伊朗'},
				{value:'Iraq',label:'伊拉克'},
				{value:'Ireland',label:'爱尔兰'},
				{value:'Israel',label:'以色列'},
				{value:'Italy',label:'意大利'},
				{value:'Ivory Coast',label:'科特迪瓦'},
				{value:'Jamaica',label:'牙买加'},
				{value:'Japan',label:'日本'},
				{value:'Jordan',label:'约旦'},
				{value:'Kampuchea (Cambodia )',label:'柬埔寨'},
				{value:'Kazakstan',label:'哈萨克斯坦'},
				{value:'Kenya',label:'肯尼亚'},
				{value:'Korea',label:'韩国'},
				{value:'Kuwait',label:'科威特'},
				{value:'Kyrgyzstan',label:'吉尔吉斯坦'},
				{value:'Laos',label:'老挝'},
				{value:'Latvia',label:'拉脱维亚'},
				{value:'Lebanon',label:'黎巴嫩'},
				{value:'Lesotho',label:'莱索托'},
				{value:'Liberia',label:'利比里亚'},
				{value:'Libya',label:'利比亚'},
				{value:'Liechtenstein',label:'列支敦士登'},
				{value:'Lithuania',label:'立陶宛'},
				{value:'Luxembourg',label:'卢森堡'},
				{value:'Madagascar',label:'马达加斯加'},
				{value:'Malawi',label:'马拉维'},
				{value:'Malaysia',label:'马来西亚'},
				{value:'Maldives',label:'马尔代夫'},
				{value:'Mali',label:'马里'},
				{value:'Malta',label:'马耳他'},
				{value:'Mariana Is',label:'马里亚那群岛'},
				{value:'Martinique',label:'马提尼克'},
				{value:'Mauritius',label:'毛里求斯'},
				{value:'Mexico',label:'墨西哥'},
				{value:'Moldova',label:'摩尔多瓦'},
				{value:'Monaco',label:'摩纳哥'},
				{value:'Mongolia',label:'蒙古'},
				{value:'Montserrat Is',label:'蒙特塞拉特岛'},
				{value:'Morocco',label:'摩洛哥'},
				{value:'Mozambique',label:'莫桑比克'},
				{value:'Namibia',label:'纳米比亚'},
				{value:'Nauru',label:'瑙鲁'},
				{value:'Nepal',label:'尼泊尔'},
				{value:'Netheriands Antilles',label:'荷属安的列斯'},
				{value:'Netherlands',label:'荷兰'},
				{value:'New Zealand',label:'新西兰'},
				{value:'Nicaragua',label:'尼加拉瓜'},
				{value:'Niger',label:'尼日尔'},
				{value:'Nigeria',label:'尼日利亚'},
				{value:'North Korea',label:'朝鲜'},
				{value:'Norway',label:'挪威'},
				{value:'Oman',label:'阿曼'},
				{value:'Pakistan',label:'巴基斯坦'},
				{value:'Panama',label:'巴拿马'},
				{value:'Papua New Cuinea',label:'巴布亚新几内亚'},
				{value:'Paraguay',label:'巴拉圭'},
				{value:'Peru',label:'秘鲁'},
				{value:'Philippines',label:'菲律宾'},
				{value:'Poland',label:'波兰'},
				{value:'Portugal',label:'葡萄牙'},
				{value:'Puerto Rico',label:'波多黎各'},
				{value:'Qatar',label:'卡塔尔'},
				{value:'Reunion',label:'留尼旺'},
				{value:'Romania',label:'罗马尼亚'},
				{value:'Russia',label:'俄罗斯'},
				{value:'Saint Lueia',label:'圣卢西亚'},
				{value:'Saint Vincent',label:'圣文森特岛'},
				{value:'Samoa Eastern',label:'东萨摩亚(美)'},
				{value:'Samoa Western',label:'西萨摩亚'},
				{value:'San Marino',label:'圣马力诺'},
				{value:'Sao Tome and Principe',label:'圣多美和普林西比'},
				{value:'Saudi Arabia',label:'沙特阿拉伯'},
				{value:'Senegal',label:'塞内加尔'},
				{value:'Seychelles',label:'塞舌尔'},
				{value:'Sierra Leone',label:'塞拉利昂'},
				{value:'Singapore',label:'新加坡'},
				{value:'Slovakia',label:'斯洛伐克'},
				{value:'Slovenia',label:'斯洛文尼亚'},
				{value:'Solomon Is',label:'所罗门群岛'},
				{value:'Somali',label:'索马里'},
				{value:'South Africa',label:'南非'},
				{value:'Spain',label:'西班牙'},
				{value:'SriLanka',label:'斯里兰卡'},
				{value:'St.Lucia',label:'圣卢西亚'},
				{value:'St.Vincent',label:'圣文森特'},
				{value:'Sudan',label:'苏丹'},
				{value:'Suriname',label:'苏里南'},
				{value:'Swaziland',label:'斯威士兰'},
				{value:'Sweden',label:'瑞典'},
				{value:'Switzerland',label:'瑞士'},
				{value:'Syria',label:'叙利亚'},
				{value:'Tajikstan',label:'塔吉克斯坦'},
				{value:'Tanzania',label:'坦桑尼亚'},
				{value:'Thailand',label:'泰国'},
				{value:'Togo',label:'多哥'},
				{value:'Tonga',label:'汤加'},
				{value:'Trinidad and Tobago',label:'特立尼达和多巴哥'},
				{value:'Tunisia',label:'突尼斯'},
				{value:'Turkey',label:'土耳其'},
				{value:'Turkmenistan',label:'土库曼斯坦'},
				{value:'Uganda',label:'乌干达'},
				{value:'Ukraine',label:'乌克兰'},
				{value:'United Arab Emirates',label:'阿拉伯联合酋长国'},
				{value:'United Kiongdom',label:'英国'},
				{value:'United States of America',label:'美国'},
				{value:'Uruguay',label:'乌拉圭'},
				{value:'Uzbekistan',label:'乌兹别克斯坦'},
				{value:'Venezuela',label:'委内瑞拉'},
				{value:'Vietnam',label:'越南'},
				{value:'Yemen',label:'也门'},
				{value:'Yugoslavia',label:'南斯拉夫'},
				{value:'Zimbabwe',label:'津巴布韦'},
				{value:'Zaire',label:'扎伊尔'},
				{value:'Zambia',label:'赞比亚'}
    		],
            filterText:'',
            defaultProps:{
                children:'FChild',
                label:'FName'
            },
            companyData:[],
            companyInfo:{},
            queryType:1,
            searchKey:"",
            guid:"",
            timeType:0,
            hour:8,
            minute:0,
            currentCompany:{ //当前选中的公司
            },
            FTelephoneRule:[], //联系方式规则
            defaultAddData:{},
            addData:{
                FGUID:'',
                FName:'',
                FCode:'',
                FCountry:'',
                FDescribe:'',
                FContacts:'',
                FTelephone:'',
                FEMailAddress:'',
                FFatherAgentGUID:'',
                FTimeDifferent:'',
                FGroupName:''
            },
            defaultAddTeam:{},
            addTeam:{
                FGUID:'',
                FGroupName:'',
                FContacts:'',
                FTelephone:'',
                FEMailAddress:''
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
        this.queryCompanyTree()  
    },
    methods:{
        /**
         * 3.7.1 查询账户管理的公司及分组树
         */
        queryCompanyTree(){
            Common({
                FAction:'QuerySuperAdminAgentGroupTree'
            })
            .then((result) => {
                this.companyData = result.FObject
                if(this.companyData&&this.companyData[0]){
                    this.queryCompanyInfo(this.companyData[0].FGUID)
                }
            }).catch((err) => {
                
            });
        },
        queryCompanyInfo(guid){
            this.guid = guid
            this.querySuperAdminAgentByFGUID()
            this.queryData()
        },
        /**
         * 3.2.4 查询公司详情
         */
        querySuperAdminAgentByFGUID(guid = this.guid){
            return new Promise((resolve,reject) => {
                User({
                    FAction:'QuerySuperAdminAgentByFGUID',
                    FGUID:guid
                })
                .then((result) => {
                    this.companyInfo = result.FObject[0] || {}
                    resolve()
                }).catch((err) => {
                    reject(err)
                });
            })
        },
        /**
         * 3.2.3 查询当前公司的子公司列表
         */
        queryData(){
            User({
                FAction:'QuerySuperAdminAgentList',
                FAgentGUID:this.guid,
                FType:this.queryType
            })
            .then((result) => {
                this.tableData = result.FObject || []
            }).catch((err) => {
                
            });
        },
        /**
         * 
         */
        beforeAddCompany(data){
            this.addData = {...this.defaultAddData}
            this.currentCompany = data
            this.show1 = false
            this.show = true
        },
        /**
         * 新增或修改公司
         */
        async addOrUpdateCompany(){
            let action
            this.addData.FFatherAgentGUID = this.currentCompany.FGUID
            let s = this.hour*60*60+this.minute*60
            if(this.timeType == 0){
                this.addData.FTimeDifferent = s
            }else{
                this.addData.FTimeDifferent = -s
            }
            await new Promise(resolve => {
                 this.$refs.form.validate((valid) => {
                  if (valid) {
                      resolve()
                  } 
                });
            })
            if(this.addData.FGUID !==''){
                action = 'UpdateSuperAdminAgent'
            }else{
                action = 'AddSuperAdminAgent'
            }
            User({
                FAction:action,
                FT_SuperAdminAgent:this.addData
            },true)
            .then(result => {
                this.queryCompanyTree()
                this.show = false
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
        beforeAddTeam(data){
            this.addTeam = {...this.defaultAddTeam}
            this.currentCompany = data
            this.show = false
            this.show1 = true
        },
        /**
         * 新增修改车队
         */
        addOrUpdateTeam(){
            let action
            if(this.addTeam.FGUID !==''){
                action = 'UpdateAdminGroup'
            }else{
                action = 'AddAdminGroup'
            }
            User({
                FAction:action,
                FAgentGUID:this.currentCompany.FGUID,
                FT_Group:this.addTeam
            },true)
            .then(result => {
                this.queryCompanyTree()
                this.$message({
                    message:this.$t('success'),
                    type:'success',
                    duration:'500'
                })
            })
            .catch(err => {
                this.$message({
                    message:this.$t('error'),
                    type:'error',
                    duration:'500'
                })
            })   
        },
        /**
         * 编辑公司
         */
        async editCompany(guid){
            await this.querySuperAdminAgentByFGUID(guid)
            Object.keys(this.addData).forEach(key => {
                this.addData[key] = this.companyInfo[key]||''
            })
            this.show1 = false
            this.show = true
        },
        editTeam(guid){
            User({
                FAction:'QueryAdminGroup',
                FGUID:guid
            })
            .then((result) => {
                let data = result.FObject[0]
                Object.keys(this.addTeam).forEach(key => {
                    this.addTeam[key] = data[key]||''
                })
                this.show = false
                this.show1 = true
                
            }).catch((err) => {
                
            });
        },
        async editNode(data){
            if(data.FNType == 1){
                this.editCompany(data.FGUID)
            }else{
                this.editTeam(data.FGUID)
            }
        },
        async deleteNode(data){
            await this.beforeDelete()
            let action
            if(data.FNType == 1){
                action = 'DeleteSuperAdminAgentByFGUID'
            }else{
                action = 'DeleteAdminGroupByFGUID'
            }
            User({
                FAction:action,
                FGUID:data.FGUID
            })
            .then(result => {
                this.queryCompanyTree()
                this.$message({
                    message:this.$t('success'),
                    type:'success',
                    duration:'500'
                })
            })
            .catch(err =>  {
                this.$message({
                    message:this.$t('error'),
                    type:'error',
                    duration:'500'
                })
            })
        },
    }
}
</script>
<style lang="scss">

</style>