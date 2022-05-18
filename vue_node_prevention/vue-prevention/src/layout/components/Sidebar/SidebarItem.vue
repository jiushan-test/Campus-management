<template>
  <!-- hidden就是路由中的hidden属性 表示路由对应菜单隐藏  -->
  <div v-if="!item.hidden">
    <!-- 一个子路由或者没有路由 -->
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>
    <!-- el-menu-item 就是没有子菜单了 el-submenu还有子菜单 -->
    <!-- 多个子路由 -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <!-- 继续迭代此组件 循环组件 用不好会造成死循环-->
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    // 展示的路由是否有子路由 没有子路由或者只有一个子路由都是直接menu-item显示
    hasOneShowingChild(children = [], parent) {
      // debugger
      // console.log(parent)
      // showingChildren数组 包含返回true 的item
      const showingChildren = children.filter(item => {
        // 如果 children 中的路由包含 hidden 属性，则返回 false，过滤
        if (item.hidden) {
          return false
        } else {
          // 将子路由赋值给 onlyOneChild，用于只包含一个路由时展示
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // 如果过滤后，只包含展示一个路由，则返回 true
      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // 如果没有子路由需要展示，则将 onlyOneChild 的 path 设置空路由，覆盖原来的path
      // 并添加 noShowingChildren 属性，表示虽然有子路由，但是不需要展示子路由
      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }
      // 子路由大于1个的时候 submenu显示
      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
