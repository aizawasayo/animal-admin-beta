/** When your routing table is too long, you can split it into small modules **/
import Layout from '@/layout'

const guideRouter = {
  path: '/guide',
  component: Layout,
  redirect: '/guide/index',
  children: [
    {
      path: 'index',
      component: () => import(/* webpackChunkName: "page-guide" */ '@/views/guide'),
      name: 'Guide',
      meta: {
        title: '攻略管理',
        icon: 'guide',
        roles: ['admin']
      }
    },
    {
      path: 'add',
      component: () => import(/* webpackChunkName: "page-guide-add" */ '@/views/guide/add'),
      name: 'GuideAdd',
      meta: {
        title: '新增攻略',
        icon: 'create',
        noCache: true,
        activeMenu: '/guide/index',
        roles: ['admin']
      },
      hidden: true
    },
    {
      path: 'edit/:id',
      component: () => import(/* webpackChunkName: "page-guide-edit" */ '@/views/guide/edit'),
      name: 'GuideEdit',
      meta: {
        title: '编辑攻略',
        noCache: true,
        activeMenu: '/guide/index',
        roles: ['admin']
      },
      hidden: true
    }
  ]
}
export default guideRouter
