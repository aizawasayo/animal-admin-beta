/* Layout */
import Layout from '@/layout'
import Vue from 'vue'
import Router from 'vue-router'
/* Router Modules */
import archiveRouter from './modules/archive'
import guideRouter from './modules/guide'
import museumRouter from './modules/museum'
import optionRouter from './modules/option'

Vue.use(Router)

/**
// 当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
hidden: true // (默认 false)

//当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
redirect: 'noRedirect'

// 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
// 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
// 若你想不管路由下面的 children 声明的个数都显示你的根路由
// 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
alwaysShow: true

name: 'router-name' // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
meta: {
  roles: ['admin', 'editor'] // 设置该路由进入的权限，支持多个权限叠加
  title: 'title' // 设置该路由在侧边栏和面包屑中展示的名字
  icon: 'svg-name' // 设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
  noCache: true // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
  breadcrumb: false //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
  affix: true // 若果设置为true，它则会固定在tags-view中(默认 false)

  // 当路由设置了该属性，则会高亮相对应的侧边栏。
  // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
  // 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
  activeMenu: '/article/list'
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
        path: '/redirect/:path(.*)',
        component: () => import(/* webpackChunkName: "page-redirect" */ '@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "page-login" */ '@/views/login'),
    hidden: true
  },

  {
    path: '/auth-redirect',
    component: () => import(/* webpackChunkName: "page-auth" */ '@/views/login/auth-redirect'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "page-404" */ '@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard', // 重定向地址，在面包屑中点击会重定向去的地址
    children: [
      {
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "page-dashboard" */ '@/views/dashboard'),
        name: 'Home',
        meta: {
          title: '首页',
          icon: 'home'
        }
      }
    ]
  },
  {
    path: '/community',
    component: Layout,
    name: 'Community',
    redirect: '/community/turnip',
    meta: {
      title: '交流区',
      icon: 'example'
    },
    children: [
      {
        path: 'board',
        component: () => import(/* webpackChunkName: "page-board" */ '@/views/community/board'),
        name: 'Board',
        meta: {
          title: '森友墙',
          icon: 'board'
        }
      },
      {
        path: 'turnip',
        component: () => import(/* webpackChunkName: "page-turnip" */ '@/views/community/turnip'),
        name: 'Turnip',
        meta: {
          title: '菜市场',
          icon: 'rutabaga'
        }
      },
      {
        path: 'trade',
        component: () => import(/* webpackChunkName: "page-trade" */ '@/views/community/trade'),
        name: 'Trade',
        meta: {
          title: '交易区',
          icon: 'exchange'
        }
      }
    ]
  },
  {
    path: '/design',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "page-design" */ '@/views/design'),
        name: 'Design',
        meta: {
          title: '服装图案管理',
          icon: 'dashboard'
        }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "page-user" */ '@/views/user'),
        name: 'User',
        meta: {
          title: '用户管理',
          icon: 'user',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/islander',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "page-islander" */ '@/views/archive/islander'),
        name: 'Islander',
        meta: {
          title: '岛民',
          icon: 'people',
          roles: ['admin']
        }
      }
    ]
  },
  museumRouter,
  archiveRouter,
  guideRouter,
  {
    path: '/banner',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "page-banner" */ '@/views/banner'),
        name: 'Banner',
        meta: {
          title: '焦点图',
          icon: 'banner',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/comment',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "page-comment" */ '@/views/comment'),
        name: 'Comment',
        meta: {
          title: '评论管理',
          icon: 'message',
          roles: ['admin']
        }
      }
    ]
  },
  optionRouter,
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
