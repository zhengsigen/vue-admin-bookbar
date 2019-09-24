import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

// import menu from './modules/menu'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
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
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
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
    redirect: '/user/common',
    alwaysShow: true, // will always show the root menu
    name: 'user',
    meta: {
      title: '用户管理',
      icon: 'user',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [{
      path: 'common',
      // route level code-splitting
      // this generates a separate chunk (common.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "common" */ '@/views/user/common'),
      name: 'common',
      meta: {
        title: '普通用户',
        roles: ['admin', 'editor']
      }
    }, {
      path: 'management',
      // route level code-splitting
      // this generates a separate chunk (management.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "management" */ '@/views/user/management'),
      name: 'management',
      meta: {
        title: '管理员用户',
        roles: ['admin', 'editor']
      }
    }]
  }, {
    path: '/book',
    component: Layout,
    redirect: '/book/stackRoom',
    alwaysShow: true, // will always show the root menu
    name: 'book',
    meta: {
      title: '书籍管理',
      icon: 'documentation',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [{
      path: 'stackRoom',
      // route level code-splitting
      // this generates a separate chunk (stackRoom.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/book/stackRoom'),
      name: 'stackRoom',
      meta: {
        title: '书库',
        roles: ['admin', 'editor']
      }
    }, {
      path: 'category',
      // route level code-splitting
      // this generates a separate chunk (category.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "category" */ '@/views/book/category'),
      name: 'category',
      meta: {
        title: '分类',
        roles: ['admin', 'editor']
      }
    }, {
      path: 'collection',
      // route level code-splitting
      // this generates a separate chunk (category.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import( /* webpackChunkName: "category" */ '@/views/book/collection'),
      name: 'collection',
      meta: {
        title: '书单',
        roles: ['admin', 'editor']
      }
    }]
  }, {

    path: '/order',
    component: Layout,
    redirect: '/order/index',
    alwaysShow: true, // will always show the root menu
    name: 'order',
    meta: {
      title: '订单管理',
      icon: 'list',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [{
      path: 'index',
      // route level code-splitting
      // this generates a separate chunk (index.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "index" */ '@/views/order/index'),
      name: 'inedx',
      meta: {
        title: '订单',
        roles: ['admin', 'editor']
      }
    },
    {
      path: 'chart',
      // route level code-splitting
      // this generates a separate chunk (chart.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "chart" */ '@/views/order/chart'),
      name: 'chart',
      meta: {
        title: '图表',
        roles: ['admin', 'editor']
      }
    },
    {
      path: 'purchase',
      // route level code-splitting
      // this generates a separate chunk (purchase.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "purchase" */ '@/views/order/purchase'),
      name: 'chart',
      meta: {
        title: '买书订单',
        roles: ['admin', 'editor']
      }
    }]
  },
  {
      path: '/freight',
      component: Layout,
      children: [{
        path: 'index',
        // route level code-splitting
        // this generates a separate chunk (index.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "index" */ '@/views/freight/index'),
        name: 'freight',
        meta: {
          title: '运费',
          roles: ['admin', 'editor'],
          icon: 'money'
        }
      }]
    },
    {
      path: '/coupon',
      component: Layout,
      redirect: '/coupon/index',
      alwaysShow: true, // will always show the root menu
      name: 'coupon',
      meta: {
        title: '优惠券管理',
        icon: 'component',
        roles: ['admin', 'editor'] // you can set roles in root nav
      },
      children: [{
        path: 'index',
        // route level code-splitting
        // this generates a separate chunk (index.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "coupon" */ '@/views/coupon/index'),
        name: 'coupon',
        meta: {
          title: '优惠券',
          roles: ['admin', 'editor']
        }
      }, {
        path: 'rule',
        // route level code-splitting
        // this generates a separate chunk (rule.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "rule" */ '@/views/coupon/rule'),
        name: 'rule',
        meta: {
          title: '自动发送规则',
          roles: ['admin', 'editor']
        }
      }]
    },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
