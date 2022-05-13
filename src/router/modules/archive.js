/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const archiveRouter = {
  path: '/archive',
  component: Layout,
  redirect: '/archive/furniture',
  name: 'Archive',
  meta: {
    title: '图鉴管理',
    icon: 'component',
    roles: ['admin']
  },
  children: [
    {
      path: 'furniture',
      component: () => import(/* webpackChunkName: "page-furniture" */ '@/views/archive/furniture'),
      name: 'Furniture',
      meta: {
        title: '家具',
        icon: 'fish'
      }
    },
    {
      path: 'clothing',
      component: () => import(/* webpackChunkName: "page-clothing" */ '@/views/archive/clothing'),
      name: 'Clothing',
      meta: {
        title: '服饰',
        icon: 'dress'
      }
    },
    {
      path: 'plant',
      component: () => import(/* webpackChunkName: "page-plant" */ '@/views/archive/plant'),
      name: 'Plant',
      meta: {
        title: '植物',
        icon: 'plant'
      }
    },
    {
      path: 'material',
      component: () => import(/* webpackChunkName: "page-material" */ '@/views/archive/material'),
      name: 'Material',
      meta: {
        title: '素材',
        icon: 'shell'
      }
    },
    {
      path: 'tool',
      component: () => import(/* webpackChunkName: "page-tool" */ '@/views/archive/tool'),
      name: 'Tool',
      meta: {
        title: '工具',
        icon: 'tool'
      }
    },
    {
      path: 'recipe',
      component: () => import(/* webpackChunkName: "page-recipe" */ '@/views/archive/recipe'),
      name: 'Recipe',
      meta: {
        title: 'DIY配方',
        icon: 'book'
      }
    },
    {
      path: 'record',
      component: () => import(/* webpackChunkName: "page-record" */ '@/views/archive/record'),
      name: 'Record',
      meta: {
        title: '唱片',
        icon: 'record'
      }
    }
  ]
}
export default archiveRouter
