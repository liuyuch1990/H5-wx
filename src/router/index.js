import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import {mapGetters, mapMutations} from "vuex";

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'login',
        meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        },
        component: () => import('../views/login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/register.vue')
    },
    {
        path: '/peopleHome',
        name: 'peopleHome',
        meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        },
        component: () => import('../views/peopleHome.vue')
    },
    {
        path: '/activityList',
        name: 'activityList',
        meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        },
        component: () => import('../views/activityList.vue')
    },
    {
        path: '/activitySign',
        name: 'activitySign',
        component: () => import('../views/activitySign.vue')
    },
    {
        path: '/retrieve',
        name: 'retrieve',
        component: () => import('../views/retrieve.vue')
    },
    {
        path: '/templateList',
        name: 'templateList',
        component: () => import('../views/templateList.vue')
    },
    {
        path: '/activePro',
        name: 'activePro',
        meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        },
        component: () => import('../views/activePro.vue')
    },
    {
        path: '/activeDev',
        name: 'activeDev',
        meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        },
        component: () => import('../views/activeDev.vue')
    },
    {
        path: '/userManage',
        name: 'userManage',
        meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        },
        component: () => import('../views/userManage.vue')
    },
    {
        path: '/payOut',
        name: 'payOut',
        meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        },
        component: () => import('../views/payOut.vue')
    },
    {
        path: '/addBar',
        name: 'addBar',
        meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        },
        component: () => import('../views/addBar.vue')
    },
    {
        path: '/approval',
        name: 'approval',
        meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        },
        component: () => import('../views/approval.vue')
    },
    {
        path: '/userMgr',
        name: 'userMgr',
        component: () => import('../views/userMgr.vue')
    },
    {
        path: '/bargainDev',
        name: 'bargainDev',
        component: () => import('../views/bargainDev.vue')
    },
    {
        path: '/bargainPro',
        name: 'bargainPro',
        component: () => import('../views/bargainPro.vue')
    },
    {
        path: '/map',
        name: 'map',
        component: () => import('../views/mapInit.vue')
    },
    {
        path: '/jizanDev',
        name: 'jizanDev',
        component: () => import('../views/jizanDev.vue')
    },
    {
        path: '/jizanPro',
        name: 'jizanPro',
        component: () => import('../views/jizanPro.vue')
    },
    {
        path: '/zhuliDev',
        name: 'zhuliDev',
        component: () => import('../views/zhuliDev.vue')
    },
    {
        path: '/zhuliPro',
        name: 'zhuliPro',
        component: () => import('../views/zhuliPro.vue')
    },
    {
        path: '/pingtuanDev',
        name: 'pingtuanDev',
        component: () => import('../views/pingtuanDev.vue')
    },
    {
        path: '/qianggouDev',
        name: 'qianggouDev',
        component: () => import('../views/qianggouDev.vue')
    },
    {
        path: '/qianggouPro',
        name: 'qianggouPro',
        component: () => import('../views/qianggouPro.vue')
    },
    {
        path: '/pingtuanPro',
        name: 'pingtuanPro',
        component: () => import('../views/pingtuanPro.vue')
    },
    {
        path: '/',
        nredirect: '/login'
    }
]

const router = new VueRouter({
    routes
})

async function login (password,mobile){
    let {data: res} = await router.app.$api.common.login({
        password: password,
        username: mobile
    });
    if (res.code === '0000') {
        console.log(res.msg)
        router.app.$store.commit('common/setUser', res.result.user);
    } else {
        console.log(res.msg)
    }
    return res;
}

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        let path = to.path;
        console.log('beforeEach获取当前的token是否存在  ' + router.app.$store.state.common.user)
        if (router.app.$store.state.common.user) {  // 通过vuex state获取当前的token是否存在
            if (new Date() > new Date(router.app.$store.state.common.user.expireTime)) {
                var user = router.app.$store.state.common.user;
                console.log('session expire------login again')
                login(user.password, user.mobile).then((res) => {
                    console.log(res);
                });
            }
            if (path === '/login') {
                next('/peopleHome')
            } else {
                next();
            }
        } else {
            if (path === '/login') {
                next();
            } else {
                next('/login')
            }
        }
    } else {
        next();
    }
});
export default router
