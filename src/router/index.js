import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '@/views/Login/index.vue'
Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    component:Login
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Layout/Layout.vue'),
    children: [
      {
        path: '/monitor', //监控中心
        component: () => import('@/views/Layout/common.vue'),
        children: [
          {
            path: '*',
            component: () => import('@/views/Layout/common.vue'),
          }
        ]
      },
      {
        path: '/GISService', //GIS服务
        component: () => import('@/views/Layout/common.vue'),
      },
      {
        path: '/traffic', //干线运输
        component: () => import('@/views/Layout/common.vue'), 
      },
      {
        path: '/alarmCenter', //报警中心
        component: () => import('@/views/Layout/common.vue'),
      },
      {
        path: '/eventMessage', //事件消息
        component: () => import('@/views/Layout/common.vue'),
      },
      {
        path: '/report', //报表
        component: () => import('@/views/Layout/common.vue'),
      },
      {
        path: '/config', //配置中心
        component: () => import('@/views/Layout/common.vue'),
      },
      {
        path: '/cmd', //指令
        component: () => import('@/views/Layout/common.vue'),
      },
      {
        path: '/extraService', //增值服务
        component: () => import('@/views/Layout/common.vue'),
      },
      {
        path: '/manage', 
        name: 'manage',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '@/views/Layout/common.vue'),
        children: [
          {
            path: '/manage/company', //公司管理
            component:() => import('@/views/Manage/company.vue')
          },
          {
            path: '/manage/car', //车辆管理
            component: () => import('@/views/Manage/car.vue')
          },
          {
            path: '/manage/driver', //司机管理
            component: () => import('@/views/Manage/driver.vue')
          },
          {
            path: '/manage/device', //设备管理
            component: () => import('@/views/Manage/device.vue')
          },
          {
            path: '/manage/user', //用户管理
            component: () => import('@/views/Manage/user.vue')
          }
        ]
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
