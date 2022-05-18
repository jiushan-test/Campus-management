import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  // 检查路由是否包含 meta 和 meta.roles 属性
  if (route.meta && route.meta.roles) {
    // 路由中的roles 如果有包含获取用户的roles中的role 返回true
    // 用户的角色roles中遍历是否包含在路由的roles中，有就可以访问
    // 判断 route.meta.roles 中是否包含用户角色 roles 中的任何一个权限，如果包含则返回 true，否则为 false
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    // 返回true 说明是该路由没有定义权限，所有人都可以访问
    // 如果路由没有 meta 或 meta.roles 属性，则视为该路由不需要进行权限控制，所有用户对该路由都具有访问权限
    // 比如最后的‘*’
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes - 异步加载的路由
 * @param roles 用户的角色，数组形式
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  // routes是一个对象数组
  // 遍历全部路由
  routes.forEach(route => {
    // 浅拷贝 tmp是asyncRoutes下的每一个路由
    // 对路由进行浅拷贝，注意 children 不会拷贝，因为不需要对 children 进行判断，所以可以使用浅拷贝
    const tmp = { ...route }
    // 如果hasPermission返回false 说明没有访问权限
    // 检查用户角色是否具备访问路由的权限
    if (hasPermission(roles, tmp)) {
      // 当路由具有访问权限时，判断路由是否具备 children 属性
      if (tmp.children) {
        // 当路由包含children 时，对children迭代调用 filterAsyncRoutes 方法
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      // 当路由具有访问权限时，将 tmp 保存到 res 中
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    // 将 routes 保存到 state 中的 addRoutes
    state.addRoutes = routes
    // 将 routes 集成到 src/router/index.js 的 constantRoutes 中
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // debugger
      // 访问对应roles的routes 会去过滤出对应角色的路由
      // if (roles.includes('admin')) {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // } else if (roles.includes('teacher')) {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // 将路由保存在vuex中
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
