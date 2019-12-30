//cn.js
 
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
const cn = {
    layout:{
        'formName': '车联网云平台',
        menus:[
            {
                name:'监控中心',
                path:'/mointor',
                level:1,
                children:[
                    {
                        name:'实时监控',
                        path:'/monitor/',
                        level:2,
                    },
                    {
                        name:'历史轨迹',
                        path:'/monitor/history',
                        level:2,
                    },
                ]
            },
            {
                name:'GIS服务',
                path:'/GISService',
                level:1,
            },
            {
                name:'干线运输',
                path:'/traffic',
                level:1,
            },
            {
                name:'报警中心',
                path:'/alarmCenter',
                level:1,
            },
            {
                name:'事件消息',
                path:'/eventMessage',
                level:1,
            },
            {
                name:'报表服务',
                path:'/report',
                level:1,
            },
            {
                name:'配置中心',
                path:'/config',
                level:1,
            },
            {
                name:'指令中心',
                path:'/cmd',
                level:1,
            },
            {
                name:'管理中心',
                path:'/manage',
                level:1,
            },
            {
                name:'增值服务',
                path:'/extraService',
                level:1,
            },

        ],
    },
    ...zhLocale
}
 
export default cn