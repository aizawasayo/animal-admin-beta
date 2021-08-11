/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const optionRouter = {
  path: '/option',
  component: Layout,
  redirect: '/option/general',
  name: 'Option',
  meta: {
    title: '选项配置',
    icon: 'setting',
    roles: ['admin']
  },
  children: [
    {
      path: 'general',
      component: () => import(/* webpackChunkName: "page-option-general" */ '@/views/option/general'),
      name: 'GeneralSetting',
      meta: {
        title: '通用配置',
        icon: 'table',
        roles: ['admin']
      }
    },
    {
      path: 'islander',
      component: () => import(/* webpackChunkName: "page-option-islander" */ '@/views/option/islander'),
      name: 'IslanderSetting',
      meta: {
        title: '岛民配置',
        icon: 'people',
        roles: ['admin']
      }
    },
    {
      path: 'furniture',
      component: () => import(/* webpackChunkName: "page-option-furniture" */ '@/views/option/furniture'),
      name: 'FurnitureSetting',
      meta: {
        title: '家具配置',
        icon: 'furniture',
        roles: ['admin']
      }
    },
    {
      path: 'clothing',
      component: () => import(/* webpackChunkName: "page-option-clothing" */ '@/views/option/clothing'),
      name: 'ClothingSetting',
      meta: {
        title: '服饰配置',
        icon: 'theme',
        roles: ['admin']
      }
    },
    {
      path: 'fish',
      component: () => import(/* webpackChunkName: "page-option-fish" */ '@/views/option/fish'),
      name: 'FishSetting',
      meta: {
        title: '鱼类配置',
        icon: 'fish',
        roles: ['admin']
      }
    },
    {
      path: 'insect',
      component: () => import(/* webpackChunkName: "page-option-insect" */ '@/views/option/insect'),
      name: 'InsectSetting',
      meta: {
        title: '昆虫配置',
        icon: 'bug',
        roles: ['admin']
      }
    },
    {
      path: 'halobios',
      component: () => import(/* webpackChunkName: "page-option-halobios" */ '@/views/option/halobios'),
      name: 'HalobiosSetting',
      meta: {
        title: '海洋生物配置',
        icon: 'sea',
        roles: ['admin']
      }
    },
    {
      path: 'tool',
      component: () => import(/* webpackChunkName: "page-option-tool" */ '@/views/option/tool'),
      name: 'ToolSetting',
      meta: {
        title: '工具配置',
        icon: 'tool',
        roles: ['admin']
      }
    },
    {
      path: 'diy',
      component: () => import(/* webpackChunkName: "page-option-diy" */ '@/views/option/diyOption'),
      name: 'DiySetting',
      meta: {
        title: 'DIY配置',
        icon: 'book',
        roles: ['admin']
      }
    }
  ]
}
export default optionRouter
