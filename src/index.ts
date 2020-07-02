import Vue from "vue";

// @ts-ignore: Unreachable code error
import App from "./app.vue";
import { optionOverwriteStrategies } from "./optionOverwriteStrategies";
optionOverwriteStrategies(Vue.config.optionMergeStrategies, ['mounted']);

new Vue({
  render: (h) => h(App),
  components: {
    App,
  },
}).$mount("#app");
