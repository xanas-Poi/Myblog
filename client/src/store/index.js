import Vue from "vue";
import Vuex from "vuex";
import article from "./modules/article";
import comments from "./modules/comments";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    article,
    comments
  }
});
