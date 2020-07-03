import Vue from "vue";
import VueRouter from "vue-router";

// @ts-ignore: Unreachable code error
import Home from "./pages/home.vue";
// @ts-ignore: Unreachable code error
import About from "./pages/about.vue";
// @ts-ignore: Unreachable code error
import App from "./app.vue";


Vue.use(VueRouter);
import { OptionOverwriteStrategies } from "./optionOverwriteStrategies";
Vue.use(OptionOverwriteStrategies, ["created"]);

Vue.use(VueRouter);

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
];
new Vue({
  router: new VueRouter({
    routes,
  }),
  render: (h) => h(App),
  components: {
    App,
  },
}).$mount("#app");
