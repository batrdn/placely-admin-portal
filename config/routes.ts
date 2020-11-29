export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/published',
    name: 'published',
    icon: 'check-circle',
    component: './published/Published',
  },
  {
    name: 'unpublished',
    icon: 'form',
    path: '/unpublished',
    component: './unpublished/Unpublished',
  },
  {
    path: '/',
    redirect: '/published',
  },
  {
    component: './404',
  },
];
