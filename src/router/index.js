import { createRouter, createWebHistory } from "vue-router";

// Lazy load components for better performance
const CryptoTable = () => import("../components/CryptoTable.vue");
const Wallet = () => import("../components/Wallet.vue");
const Trading = () => import("../components/Trading.vue");

const routes = [
  {
    path: "/",
    name: "Home",
    component: CryptoTable,
    meta: { title: "Crypto Dashboard - Home" },
  },
  {
    path: "/wallet",
    name: "Wallet",
    component: Wallet,
    meta: { title: "Crypto Dashboard - Wallet" },
  },
  {
    path: "/trading",
    name: "Trading",
    component: Trading,
    meta: { title: "Crypto Dashboard - Trading" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Update page title dynamically
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Crypto Dashboard";
  next();
});

export default router;
