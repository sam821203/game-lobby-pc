import { ref } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import layout from "@/layouts/default";
import { useStore } from "@/store/index";
const { useAnnouncement } = useStore();
const { setPromotionScrollTop } = useAnnouncement();

import { storeToRefs } from "pinia";
import i18n from "@/utils/i18n";
const { t } = i18n.global;
import { setUuid, removeUuid } from "@/utils/cookie";
// import { upgradeUserApi } from "@/api/user";
import { usectrlLogin } from "@/store/ctrlLogin";

const { useMessage, useAuth, useModal } = useStore();
const { openMsg } = useMessage();

const authStore = useAuth();
const { logout } = authStore;
const { token, userInfo } = storeToRefs(authStore);

const modalStore = useModal();
const { toggleModal, modalType } = modalStore;

const Uuid = ref(null);

const routes = [
  {
    path: "/",
    name: "home",
    component: layout,
    redirect: "/home",
    children: [
      {
        path: "home/:id?",
        name: "home",
        component: () => import("@/views/home/index"),
        meta: {
          auth: false,
          name: "首頁",
        },
      },
      {
        path: "gameLobby/:category/:studio?",
        name: "gameLobby",
        component: () => import("@/views/home/gameLobby"),
        meta: {
          auth: false,
          name: "遊戲房間",
        },
      },
    ],
  },
  {
    path: "/info",
    component: () => import("@/layouts/operation"),
    redirect: "/info/announcement",
    meta: {
      auth: true,
    },
    children: [
      {
        path: "announcement",
        name: "announcement",
        meta: {
          auth: false,
          name: "公告",
        },
        component: () => import("../views/operation/announcementView"),
      },
      {
        path: "announcementDetail",
        name: "announcementDetail",
        meta: {
          auth: false,
          name: "詳細公告",
        },
        component: () => import("../views/operation/announcementDetail"),
      },
      {
        path: "platformRule",
        name: "platformRule",
        meta: {
          auth: false,
          name: "平台規章",
        },
        component: () => import("../views/info/platformRule"),
      },
      {
        path: "aboutUs",
        meta: {
          auth: false,
          name: "關於我們",
        },
        redirect: { name: "Q&A" },
        component: () => import("../views/info/aboutUs"),
        children: [
          {
            path: "Q&A",
            name: "Q&A",
            meta: {
              auth: false,
              name: t("常見問題"),
            },
            component: () => import("../views/info/q&a"),
          },
          {
            path: "termOfService",
            name: "termOfService",
            meta: {
              auth: false,
              name: t("服務條款"),
            },
            component: () => import("../views/info/termOfService"),
          },
          {
            path: "privacyPolicy",
            name: "privacyPolicy",
            meta: {
              auth: false,
              name: t("隱私政策"),
            },
            component: () => import("../views/info/privacyPolicy"),
          },
          {
            path: "responsibleGaming",
            name: "responsibleGaming",
            meta: {
              auth: false,
              name: t("理性博彩"),
            },
            component: () => import("../views/info/responsibleGaming"),
          },
        ],
      },
      {
        path: "userInfo",
        name: "userInfo",
        meta: {
          auth: true,
          name: "我的",
        },
        component: () => import("../views/info/userInfo"),
      },
    ],
  },
  {
    path: "/operation",
    name: "operation",
    component: () => import("@/layouts/profileLayout"),
    meta: {
      auth: true,
    },
    children: [
      {
        path: "gameRecord",
        name: "gameRecord",
        meta: {
          auth: true,
          name: "投注紀錄",
        },
        component: () => import("../views/operation/gameRecord"),
      },
      {
        path: "friends",
        name: "friends",
        meta: {
          auth: true,
          name: "邀請好友",
        },
        component: () => import("../views/operation/friendsView"),
      },
      {
        path: "vip",
        name: "vip",
        meta: {
          auth: true,
          name: "VIP",
        },
        component: () => import("../views/operation/vip"),
      },
      {
        path: "tradeRecord",
        name: "tradeRecord",
        meta: {
          auth: true,
          name: "交易紀錄",
        },
        component: () =>
          import(
            /* webpackChunkName: "tradeRecord" */ "../views/operation/tradeRecord"
          ),
      },
    ],
  },
  {
    path: "/activity",
    name: "activity",
    component: () => import("@/layouts/operation"),
    redirect: "/activity/activityList",
    children: [
      {
        path: "activityList",
        name: "activityList",
        meta: {
          auth: false,
          name: t("活動"), //活動
        },
        component: () => import("../views/operation/activityList"),
      },
      {
        path: "detailpromotionActivity",
        name: "detailpromotionActivity",
        meta: {
          auth: false,
          name: t("詳細活動"),
        },
        component: () => import("../views/operation/detailpromotionActivity"),
      },
    ],
  },
  {
    path: "/gameRoom/:category/:studio?",
    name: "gameRoom",
    component: () => import("@/views/game"),
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: () => import("@/views/404"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(from, to) {
    // scrollBehavior() {
    if (
      !(
        (from.name == "detailpromotionActivity" && to.name == "activityList") ||
        (from.name == "activityList" && to.name == "detailpromotionActivity")
      )
    ) {
      setPromotionScrollTop(0);
    }
    // always scroll to top
    return { top: 0 };
  },
});

const authCheck = (to) => {
  const isAuth = to.meta.auth;
  if (isAuth && !token.value) {
    return true;
  }
};

const testPlayerValid = (to) => {
  return (
    userInfo.value.is_test &&
    (to.meta?.name?.includes("存款") ||
      to.meta?.name?.includes("提款") ||
      to.meta?.name?.includes("GCash"))
  );
};

const kick = (to) => {
  // 沒token登入需要token的頁面就踢掉
  const isAuth = to.meta.auth;
  if (isAuth && !token.value) {
    logout();
    // router.push("/auth/login");
    usectrlLogin().$patch({
      loginpageStatus: true,
    });
  }
};

const isLoginGuard = (to) =>
  token.value && (to.name === "login" || to.name === "register"); // 登入不能回登入註冊頁

const isLogin = (from) => {
  token.value && from.name === "login";
};

const isRegister = (to, from) => {
  if ((to.name === "register" || to.name === "login") && from.name !== "home") {
    return true;
  }
};

const isLogOut = (to, from) => {
  if ((to.name === "register" || to.name === "login") && from.name === "home") {
    return true;
  }
};

router.beforeEach((to, from, next) => {
  const loginGuard = isLoginGuard(to);
  if (loginGuard) {
    next({ name: from.name });
    return;
  }

  const unAuth = authCheck(to);
  if (unAuth) {
    openMsg({ content: t("registerFirst") }).then(() => {
      kick(to);
      next({ name: "home" });
    });

    return;
  }

  const isTestPlayer = testPlayerValid(to);
  if (isTestPlayer) {
    toggleModal(true);
    modalType("UpgradeAccount");

    return;
  }

  const getRegisterUuid = isRegister(to, from);
  if (getRegisterUuid) {
    const url = window.location.href;
    const segments = url.split("/");
    const lastSegment = segments.pop();
    if (lastSegment !== "home") {
      Uuid.value = lastSegment;
      setUuid(Uuid.value);
    }
  }

  const removeRegisterUuid = isLogOut(to, from);
  if (removeRegisterUuid) {
    removeUuid("uuid");
  }

  const removeLoginUuid = isLogin(to, from);
  if (removeLoginUuid) {
    removeUuid("uuid");
  }
  next();
});

export default router;
