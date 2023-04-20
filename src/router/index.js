import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '仪表板',
    children: [{
      path: 'dashboard',
      name: '仪表板',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '仪表板', icon: 'dashboard' }
    }]
  },

  {
    path: '/meta_data',
    component: Layout,
    name: '源数据',
    meta: { title: '源数据', icon: 'el-icon-collection' },
    children: [
      {
        path: 'enterprise',
        component: () => import('@/views/meta_data/enterprise/index'), // Parent router-view
        name: '企业数据',
        meta: { title: '企业数据', icon: 'el-icon-s-data' },
        children: [
          {
            path: 'house',
            component: () => import('@/views/meta_data/enterprise/house'),
            name: '房源',
            meta: { title: '房源', icon: 'el-icon-s-grid' }
          },
          {
            path: 'enterprise',
            component: () => import('@/views/meta_data/enterprise/customer'),
            name: '客源',
            meta: { title: '客源', icon: 'el-icon-s-grid' }
          },
          {
            path: 'house_follow',
            component: () => import('@/views/meta_data/enterprise/house_follow'),
            name: '房源跟进',
            meta: { title: '房源跟进', icon: 'el-icon-s-grid' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/meta_data/menu2/index'),
        name: '暂未完成',
        meta: { title: '暂未完成', icon: 'el-icon-s-data' }
      }
    ]
  },

  {
    path: '/transfer',
    component: Layout,
    name: '清洗配置',
    meta: { title: '清洗配置', icon: 'el-icon-s-operation' },
    children: [
      {
        path: 'enterprise_basic',
        name: '企业信息',
        component: () => import('@/views/transfer/enterprise_basic'),
        meta: { title: '企业信息', icon: 'el-icon-set-up' }
      },
      {
        path: 'tree',
        name: '暂未完成',
        component: () => import('@/views/tree/index'),
        meta: { title: '暂未完成', icon: 'el-icon-set-up' }
      }
    ]
  },

  {
    path: '/taskInfo',
    component: Layout,
    name: '任务管理',
    meta: { title: '任务管理', icon: 'el-icon-timer' }
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
