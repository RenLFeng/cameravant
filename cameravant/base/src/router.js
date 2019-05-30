import Vue from 'vue';
import Router from 'vue-router';
import qrcode from './view/device/myQrcode';

Vue.use(Router);

const routes = [
  {
    path: '*',
    redirect: '/device'
  },
  {
    name: 'user',
    component: () => import('./view/user'),
    meta: {
      title: '会员中心'
    }
  },
  {
    name: 'cart',
    component: () => import('./view/cart'),
    meta: {
      title: '购物车'
    }
  },
  {
    name: 'goods',
    component: () => import('./view/goods'),
    meta: {
      title: '商品详情'
    }
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import('./view/demo'),
    meta: {
      title: '客流演示'
    }
  },
  {
    path: '/device',
    name: 'device',
    component: () => import('./view/device'),
    meta: {
      title: '客流分析'
    }
  },
  {
    path: '/deviceList',
    name: 'deviceList',
    component: () => import('./view/device/deviceList'),
    meta: {
      title: '设备列表'
    }
  },
  {
    path: '/deviceSearch',
    name: 'deviceSearch',
    component: () => import('./view/device/deviceSearch'),
    meta: {
      title: '设备列表'
    }
  },
  {
    path: '/deviceAdd',
    name: 'deviceAdd',
    component: () => import('./view/device/deviceAdd'),
    meta: {
      title: '设备添加'
    }
  },
  {
    path: '/shareAccount',
    name: 'shareAccount',
    component: () => import('./view/device/shareAccount'),
    meta: {
      title: '账号共享'
    }
  },
  {
    path: '/myQrcode',
    name: 'myQrcode',
    component: () => import('./view/device/myQrcode'),
    meta: {
      title: '我的二维码'
    }
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: resolve => require(['./view/feedback/feedback.vue'], resolve),
    meta:{
      title:'使用反馈'
    }
  },
  {
    path: '/myFeedback',
    name: 'myFeedback',
    component: resolve => require(['./view/feedback/myFeedback.vue'], resolve),
    meta:{
      title:'我的反馈'
    }
  },
  {
    path: '/userAdd',
    name: 'userAdd',
    component: () => import('./view/users/userAdd'),
    meta: {
      title: '用户添加'
    }
  },
  {
    path: '/userAuth',
    name: 'userAuth',
    component: () => import('./view/users/userAuth'),
    meta: {
      title: 'PC访问授权'
    }
  },
  {
    path: '/userList',
    name: 'userList',
    component: () => import('./view/users/userList'),
    meta: {
      title: '用户列表'
    }
  },
  {
    path: '/checkWork',
    name: 'checkWork',
    component: () => import('./view/checkwork'),
    meta: {
      title: '考勤分析'
    }
  },
  {
    path: '/sqList',
    name: 'sqList',
    component: () => import('./view/users/sqList'),
    meta: {
      title: '授权列表'
    }
  },
  {
    path: '/clientInfo',
    name: 'clientInfo',
    component: () => import('./view/users/clientInfo'),
    meta: {
      title: '客户信息'
    }
  },
];

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
});

const router = new Router({ routes });

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export {
  router
};
