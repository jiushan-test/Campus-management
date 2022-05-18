import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration 进度条右侧小圆环隐藏

const whiteList = ['/login'] // no redirect whitelist 白名单

// 路由全局守卫 所有路由跳转之前都会执行此函数
router.beforeEach(async(to, from, next) => {
  // debugger
  // start progress bar 启动进度条
  NProgress.start()
  // console.log(to)
  // set page title 获取页面标题
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in 从cookie中获取token
  const hasToken = getToken()
  // console.log(hasToken)
  // 存在token 说明登录按钮按下或者进去界面了
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page 在地址栏中输入login 直接重定向到首页，也就是不会跳出去
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      // 判断用户的角色是否存在 从vuex中获取用户角色是在下面程序中获取
      // 属性界面 有cookie 没有roles 所以执行下面的获取用户角色生成动态路由，
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      // 如果用户角色存在，则直接访问 就是在后台界面的时候，
      if (hasRoles) {
        // 这里就是直接在地址栏输入地址，该用户有权限的路由会跳转 没有就是404
        next()
      } else {
        try {
          // get user info 异步获取用户的角色 后台界面刷新没有roles，所以异步获取
          // note: roles must be a object array! such as: ['admin'] or ,['admin','editor']
          const { roles } = await store.dispatch('user/getInfo')
          // roles 是获取的用户角色 根据用户角色，动态生成路由表
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)
          // console.log(router)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          // replace 进入页面之后不能回退到登录界面，也就是没有历史记录
          // 使用 replace 访问路由，不会在 history 中留下记录
          // console.log(to)
          // 注意这里用next()的话会失效界面处于白屏跳转不过去，因为是路由表没添加完成的情况
          // 所以这里需要重定向路径 这样就会再次进去到router.beforeEach这个钩子，这个时候在通过next()释放这个钩子
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          // 移除 Token 数据
          await store.dispatch('user/resetToken')
          // 显示错误提示
          Message.error(error || 'Has Error')
          // 重定向至登录页面
          next(`/login`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    // 如果访问的 URL 在白名单中，则直接访问
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // 如果访问的 URL 不在白名单中，则直接重定向到登录页面，并将首页地址 添加到 redirect 参数中
      next(`/login`)
      // 停止进度条
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
