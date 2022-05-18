const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  id: state => state.user.id,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  address: state => state.user.address,
  className: state => state.user.className,
  createTime: state => state.user.createtime,
  sex: state => state.user.sex,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
