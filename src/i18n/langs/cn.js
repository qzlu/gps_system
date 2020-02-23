//cn.js
 
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import formatDate from '@/utils/formatDate.js'
const operate = {1:'自营',2:'租赁'}
const cn = {
    language:'中文',
    customerCase:'客户案例',
    about:'关于我们',
    appointmentExperience:'预约体验',
    rememberPassword: '记住密码',
    describe: '描述',
    userName:'用户名称',
    companyInfo: '公司信息',
    companyDetail: '公司详情',
    index: '序号',
    companyName: '公司名称',
    companyCode: '公司编码',
    contact: '联系人',
    telephone: '联系电话',
    email:'联系邮箱',
    defaultGroupName: '默认分组',
    country: '所属国家',
    addCarTeam:'新增车队',
    editCarTeam: '编辑车队',
    carTeamName:'车队名称',
    diffTime:'时差',
    success: '成功',
    error: '失败',
    save: '保存',
    cancle: '取消',
    submit:'确定',
    select: '请选择',
    input: '请输入',
    phoneErr: '请输入正确的电话号码',
    add:'新增',
    edit: '编辑',
    export: '导出',
    translate: '转移',
    imports: '批量导入',
    delete: '删除',
    downloadModule: '模块下载',
    basicInfo:'基本信息',
    all: '全部',
    under: '直属',
    car: '车辆',
    device: '设备',
    deviceDetail:'设备详情',
    underDevice: '直属设备',
    allDevice: '全部设备',
    underDriver: '直属司机',
    allDriver: '全部司机',
    deviceName: '设备名称',
    deviceInfo: '设备信息',
    deviceID: '设备ID',
    deviceType: '设备类型',
    SIM: 'SIM卡号',
    carBasicInfo: '车辆信息',
    bindingInfo:'绑定信息',
    vehicleName: '车牌号',
    vehicleCode: '车牌编码',
    deviceGUID: '设备标识',
    FVIN: '车架号',
    FEngineNumber: '发动机号',
    vehicleType: '车辆类型',
    seatCount: '座位数',
    FTonnage: '载重',
    carFTonnage:'车辆载重',
    carColor:'车身颜色',
    carLength: '车身长度',
    FFuelType: '燃油类型',
    manageCompany:'管理公司',
    expireTime: '到期时间',
    funcPermission: '功能权限',
    lockPermission: '开锁权限',
    downloadPermission: '资源下载',
    help: '帮助',
    appCode: 'App二维码',
    updatedLog: '更新日志',
    userExpirePermission: '用户过期控制',
    modulePermission: '模块权限',
    BSMenuSet: 'BS菜单设置',
    appMenuSet: 'APP菜单设置',
    changePassword: '修改密码',
    newPassword: '新密码',
    oldPassword: '旧密码',
    repeatPassword:'重复密码',
    repeatPasswordErr: '重复密码不一致',
    fuelTypeList: [{
        value: 1,
        label: '汽油'
    }, {
        value: 2,
        label: '柴油'
    },{
        value: 3,
        label: '电动'
    },{
        value: 4,
        label: '混动'
    }],
    FInsuCompany: '保险公司',
    FInsuDate: '保险日期',
    FPurchaseDate: '车辆购买日期',
    FOperPermNumber: '营运证号',
    FRoadTranNumber: '道路运输证号',
    FRoadTranDate: '道路运输证有效期',
    FTechRegDate: '车辆技术登记有效期',
    carImage: '车辆图片',
    carIcon: '车辆图标',
    FOperateType: '运营类型',
    operateObj: operate,
    mainDriver: '主驾司机',
    mainDriverTelephont: '主驾司机电话',
    copilotDriver: '副驾司机',
    copilotDriverTelephont: '副驾司机电话',
    carDetail: '车辆详情',
    FAgentContacts: '公司联系人',
    FAgentTelephone: '公司联系电话',
    FAgentEMailAddress: '公司联系邮箱',
    carTeamInfo: '车队信息',
    else: '其它',
    driverInfo: '司机信息',
    bindingCar: '绑定车辆',
    addDevice: '新增设备',
    editDevice: '编辑设备',
    driverDetail: '司机详情',
    mainVehicle:'主驾车辆',
    mainVehicleInfo: '主驾车辆信息',
    copilotVehicle: '副驾车辆',
    copilotVehicleInfo: '副驾车辆信息',
    driverName: '司机姓名',
    FDrivingType: '驾驶证类型',
    FDrivingNumber:'驾驶证号',
    FCreateTime: '创建时间',
    driverHeadImg: '司机头像',
    FFrontURL: '驾驶证正面图',
    FReverseURL: '驾驶证背面图',
    addDriver: '新增司机',
    editDriver: '编辑司机',
    remarks:'备注',
    layout: {
        'formName': '车联网云平台',
        'menus':[
            {
                FMenuName: '监控中心',
                path:'/monitor',
                level:1,
                children:[
                    {
                        FMenuName: '实时监控',
                        path:'/monitor/',
                        level:2,
                    },
                    {
                        FMenuName: '历史轨迹',
                        path:'/monitor/history',
                        level:2,
                    },
                ]
            },
            {
                FMenuName: 'GIS服务',
                path:'/GISService',
                level:1,
            },
            {
                FMenuName: '干线运输',
                path:'/traffic',
                level:1,
            },
            {
                FMenuName: '报警中心',
                path:'/alarmCenter',
                level:1,
            },
            {
                FMenuName: '事件消息',
                path:'/eventMessage',
                level:1,
            },
            {
                FMenuName: '报表服务',
                path:'/report',
                level:1,
            },
            {
                FMenuName: '配置中心',
                path:'/config',
                level:1,
            },
            {
                FMenuName: '指令中心',
                path:'/cmd',
                level:1,
            },
            {
                FMenuName: '管理中心',
                path:'/manage',
                level: 1,
                children: [{
                        FMenuName: '公司管理',
                        path: '/manage/company',
                        level: 2,
                    },
                    {
                        FMenuName: '车辆管理',
                        path: '/manage/car',
                        level: 2,
                    },
                    {
                        FMenuName: '司机管理',
                        path: '/manage/driver', 
                        level: 2,
                    },
                    {
                        FMenuName: '设备管理',
                        path: '/manage/device',
                        level: 2,
                    },
                    {
                        FMenuName: '用户管理',
                        path: '/manage/user',
                        level: 2,
                    },
                ]
            },
            {
                FMenuName: '增值服务',
                path:'/extraService',
                level:1,
            },

        ],
    },
    company: { //公司管理
        addCompany: "新增公司",
        editCompany:"编辑公司",
        companyInfoLabel: [{
                label: "公司名称",
                prop: 'FName',
                width: '33.3%'
            },
            {
                label: "公司编码",
                prop: 'FCode',
                width: '66.7%'
            },
            {
                label: "联系人",
                prop: 'FContacts',
                width: '33.3%'
            },
            {
                label: "联系电话",
                prop: 'FTelephone',
                width: '33.3%'
            },
            {
                label: "联系邮箱",
                prop: 'FEMailAddress',
                width: '33.3%'
            },
            {
                label: "所属国家",
                prop: 'FCountry',
                width: '33.3%'
            },
            {
                label: "时差",
                prop: 'FTimeDifferent',
                width: '33.3%'
            },
        ],
        typeList: [{
                type: 1,
                label: '全部'
            },
            {
                type: 2,
                label: '直属'
            }
        ],
        tableLabel: [{
                prop: 'FName',
                label: '公司名称',
                width: 200
            },
            {
                prop: 'FCode',
                label: '公司编码',
                width: 100
            },
            {
                prop: 'FContacts',
                label: '联系人',
                width: 100
            },
            {
                prop: 'FTelephone',
                label: '联系电话',
                width: 140
            },
            {
                prop: 'FEMailAddress',
                label: '邮箱',
                width: 220
            },
            {
                prop: 'FCountry',
                label: '所属国家',
            },
            {
                prop: 'FTimeDifferent',
                label: '时差',
                width: 80
            },
            {
                prop: 'FDescribe',
                label: '描述',
            },
            {
                prop: 'FCreateTime',
                label: '创建日期',
                formatter: row => formatDate(row.FCreateTime)
            }
        ],
    },
    carManage: { //车辆管理
        tableLabel: [
            {
                prop: 'FAgentName',
                label: '公司',
                width: 200
            },
            {
                prop: 'FGroupName',
                label: '分组',
                width: 100
            },
            {
                prop: 'FVehicleName',
                label: '车牌号',
                width: 100
            },
            {
                prop: 'FVehicleCode',
                label: '车辆编码',
                width: 140
            },
            {
                prop: 'FAssetID',
                label: '设备ID',
                width: 220
            },
            {
                prop: 'FMainDriverName',
                label: '主驾司机',
                width: 100
            },
            {
                prop: 'FCopilotDriverName',
                label: '副驾司机',
            },
            {
                prop: 'FOperateType',
                label: '营运类型',
                width: 100,
                formatter: row => operate[row.FOperateType]||'--'
            },
            {
                prop: 'FCreateTime',
                label: '创建日期',
                formatter: row => formatDate(row.FCreateTime)
            }
        ],
    },
    deviceManage: { //设备管理
        tableLabel: [{
                prop: 'FAgentName',
                label: '公司',
                width: 200
            },
/*             {
                prop: 'FGroupName',
                label: '分组',
                width: 100
            }, */
            {
                prop: 'FAssetID',
                label: '设备ID',
                width: 220
            },
            {
                prop: 'FAssetTypeName',
                label: '设备类型',
                width: 100
            },
            {
                prop: 'FSIMNumber',
                label: 'SIM卡号',
                width: 140
            },
            {
                prop: 'FIMEI',
                label: 'IMEI号',
                width: 140
            },
            {
                prop: 'FVehicleName',
                label: '车牌号',
            },
            {
                prop: 'FVehicleCode',
                label: '车辆编码',
                width: 140
            },
            {
                prop: 'FCreateTime',
                label: '注册时间',
                width: 200,
                formatter: row => formatDate(row.FCreateTime)
            }
        ],
    },
    driverManage: { //司机管理
        tableLabel: [{
                prop: 'FAgentName',
                label: '公司',
                width: 200
            },
            {
                prop: 'FDriverName',
                label: '司机姓名',
                width: 120
            },
            {
                prop: 'FPhoneNumber',
                label: '司机电话',
                width: 120
            },
            {
                prop: 'FMainVehicleName',
                label: '主驾车辆',
                width: 140
            },
            {
                prop: 'FCopilotVehicleName',
                label: '副驾车辆',
                width: 140
            },
            {
                prop: 'FDriverTypeName',
                label: '驾驶证类型',
            },
            {
                prop: 'FDrivingNumber',
                label: '驾驶证编号',
                width: 140
            },
            {
                prop: 'FDescription',
                label: '描述',
            }
        ],
    },
    userManage: { //用户管理
        tableLabel: [
            {
                prop: 'FAgentName',
                label: '管理公司',
                width: 200
            },
            {
                prop: 'FExpireTime',
                label: '到期时间',
                width: 200,
                formatter: row => formatDate(row.FExpireTime)
            },
            {
                prop: 'FContacts',
                label: '联系人',
                width: 140
            },
            {
                prop: 'FTelephone',
                label: '联系电话',
                width: 140
            },
            {
                prop: 'FEMailAddress',
                label: '联系邮箱',
            },
            {
                prop: 'FDescribe',
                label: '备注',
            }
        ],
        basicInfo: [{
            label: "用户名称",
            prop: 'FUserName',
            width: '33.3%'
        }, {
            label: "管理公司",
            prop: 'FAgentName',
            width: '33.3%'
        }, {
            label: "到期时间",
            prop: 'FExpireTime',
            width: '33.3%',
            formatter: formatDate
        }, {
            label: "联系人",
            prop: 'FContacts',
            width: '33.3%'
        }, {
            label: "联系电话",
            prop: 'FTelephone',
            width: '33.3%'
        }, {
            label: "联系邮箱",
            prop: 'FEMailAddress',
            width: '33.3%'
        }, {
            label: "备注",
            prop: 'FDescribe',
            width: '33.3%'
        }, ]
    },
    ...zhLocale
}
 
export default cn