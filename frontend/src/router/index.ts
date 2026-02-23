import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import Localstorage from '@/utils/localstorage';
import { ElMessage } from 'element-plus';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import("@/views/public/LoginView.vue"),
    alias: "/login",
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("@/views/public/RegisterView.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/auth/DashBoardView.vue"),
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error/NotFoundView.vue"),
  },
  {
    path: "/chat/:chatId",
    name: "chat",
    component: () => import("@/views/auth/ChatView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

const allowList = [
  "/", 
  "/login", 
  "/signup", 
  "/404",
]
router.beforeEach((
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  document.title = to.name?.toString() || ""
  const token = Localstorage.getItem("accessToken", false, true)
  const isExist = to.matched.length == 1
  if (!isExist) {
    const redirect = token ? "/chat" : "/"
    return next("/404?redirect=" + redirect)
  }
  if (["/", "/login"].includes(to.path)) {
    if (token) {
      return next("/dashboard")
    }
    return next()
  }
  if (!allowList.includes(to.path)) {
    if (!token) {
      ElMessage.warning({
        message: "Please login first"
      })
      next("/login?redirect=" + to.path)
    }
    return next();
  }
  return next();
})

export default router;
