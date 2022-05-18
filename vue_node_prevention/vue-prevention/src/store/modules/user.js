import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  introduction: '',
  name: '',
  avatar: '',
  id: Number,
  roles: [],
  address: '',
  className: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_INTRODUCTION: (state, introduction) => {
  //   state.introduction = introduction
  // },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, head) => {
    state.avatar = head
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_ADDRESS: (state, address) => {
    state.address = address
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_CLASS: (state, className) => {
    state.className = className
  },
  SET_CREATETIME: (state, createtime) => {
    state.createtime = createtime
  },
  SET_SEX: (state, sex) => {
    state.sex = sex
  }
}

const actions = {
  // user login 获取token
  login({ commit }, userInfo) {
    const { username, password, radio } = userInfo
    return new Promise((resolve, reject) => {
      // 发起post请求  这里返回的response是响应中的data 中有code data msg
      login({ username: username.trim(), password: password, type: radio }).then(response => {
        // 解构赋值
        const { data } = response
        // token放在vuex中 界面刷新token从cookie中获取
        commit('SET_TOKEN', data.token)
        // token放在cookie中
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info 刷新之后都会获取
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // vuex中传入token 通过query发送给后端获取用户信息
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        // console.log(response)
        const { roles, username, head, id, address, classes, introduction, createtime, sex } = data
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        const avatar = process.env.VUE_APP_BASE_API + '/file/' + head
        commit('SET_ROLES', roles)
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        commit('SET_ID', id)
        commit('SET_ADDRESS', address)
        commit('SET_CLASS', classes)
        commit('SET_CREATETIME', createtime)
        commit('SET_SEX', sex)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      // 退出登录不用发送请求
      try {
        // 清除vuex中的token
        commit('SET_TOKEN', '')
        // 清除vuex中的角色
        commit('SET_ROLES', [])
        // 清除cookie中的token
        removeToken()
        // 删除动态添加的路由
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      } catch (error) {
        reject(error)
      }
    })
  },

  setAvatar: ({ commit }, head) => {
    return commit('SET_AVATAR', head)
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }

  //   // dynamically modify permissions
  //   async changeRoles({ commit, dispatch }, role) {
  //     const token = role + '-token'

  //     commit('SET_TOKEN', token)
  //     setToken(token)

  //     const { roles } = await dispatch('getInfo')

  //     resetRouter()

  //     // generate accessible routes map based on roles
  //     const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
  //     // dynamically add accessible routes
  //     router.addRoutes(accessRoutes)

  //     // reset visited views and cached views
  //     dispatch('tagsView/delAllViews', null, { root: true })
  //   }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
