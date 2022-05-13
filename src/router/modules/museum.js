/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const museumRouter = {
  path: '/museum',
  component: Layout,
  redirect: '/museum/fish',
  name: 'Museum',
  meta: {
    title: '博物馆图鉴',
    icon: 'museum',
    roles: ['admin']
  },
  children: [
    {
      path: 'fish',
      component: () => import(/* webpackChunkName: "page-fish" */ '@/views/museum/fish'),
      name: 'Fish',
      meta: {
        title: '鱼类',
        icon: 'fish'
      }
    },
    {
      path: 'insect',
      component: () => import(/* webpackChunkName: "page-insect" */ '@/views/museum/insect'),
      name: 'Insect',
      meta: {
        title: '昆虫',
        icon: 'bug'
      }
    },
    {
      path: 'fossil',
      component: () => import(/* webpackChunkName: "page-fossil" */ '@/views/museum/fossil'),
      name: 'Fossil',
      meta: {
        title: '化石',
        icon: 'dragon'
      }
    },
    {
      path: 'artwork',
      component: () => import(/* webpackChunkName: "page-artwork" */ '@/views/museum/artwork'),
      name: 'Artwork',
      meta: {
        title: '艺术品',
        icon: 'art'
      }
    },
    {
      path: 'halobios',
      component: () => import(/* webpackChunkName: "page-halobios" */ '@/views/museum/halobios'),
      name: 'Halobios',
      meta: {
        title: '海洋生物',
        icon: 'sea'
      }
    }
  ]
}
export default museumRouter
