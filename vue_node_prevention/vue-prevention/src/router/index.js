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
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
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
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        // 重定向组件 动态组件 *表示匹配0个或多个路由就是后面还有几个路由都可以匹配到
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    // 根路径
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 根据不同用户显示不同菜单的路由放在这里
  // 自己添加的组件放在这边 constantRoutes是每个用户都会加载的路由
  // icon 菜单图标 title是页面标题/侧边栏/面包屑标题
  // 管理员菜单
  {
    path: '/manage',
    component: Layout,
    redirect: '/manage/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/management/index'),
        name: 'Student',
        meta: { title: '人员管理', icon: 'peoples', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/addclass',
    component: Layout,
    redirect: '/addclass/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/addclass/index'),
        name: 'AddClass',
        meta: { title: '添加班级', icon: 'el-icon-plus', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/notices',
    component: Layout,
    redirect: '/notices/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/notices/index'),
        name: 'Notices',
        meta: { title: '发布通知', icon: 'message', roles: ['admin', 'teacher'] }
      }
    ]
  },
  // 教师界面
  {
    path: '/leave',
    component: Layout,
    redirect: '/leave/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/leave/index'),
        name: 'Leave',
        meta: { title: '请假管理', icon: 'el-icon-menu', roles: ['teacher'] }
      }
    ]
  },
  {
    path: '/healthView',
    component: Layout,
    redirect: '/healthView/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/healthView/index'),
        name: 'healthView',
        meta: { title: '健康查看', icon: 'table', roles: ['teacher'] }
      }
    ]
  },
  // 学生界面
  {
    path: '/mynotices',
    component: Layout,
    redirect: '/mynotices/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/mynotices/index'),
        name: 'MyNotices',
        meta: { title: '我的通知', icon: 'message', roles: ['student'] }
      }
    ]
  },
  {
    path: '/health',
    component: Layout,
    redirect: '/health/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/healthtable/index'),
        name: 'Health',
        meta: { title: '健康填报', icon: 'form', roles: ['student'] }
      }
    ]
  },
  {
    path: '/application',
    component: Layout,
    redirect: '/application/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/application/index'),
        name: 'Application',
        meta: { title: '请假申请', icon: 'edit', roles: ['student'] }
      }
    ]
  },
  {
    path: '/information',
    component: Layout,
    redirect: '/information/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/information/index'),
        name: 'Information',
        meta: { title: '个人信息', icon: 'user', roles: ['student', 'teacher'] }
      }
    ]
  },
  // 404 page must be placed at the end !!! 通配符表示没有匹配的路由则映射到404
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  // 滚动行为
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
console.log(router)
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  console.log(router)
  // 在退出登录时被调用
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
