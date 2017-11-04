// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/bootstrap-3.3.7-dist/css/bootstrap.min.css'
import './assets/bootstrap-3.3.7-dist/js/bootstrap.min'
import axios from 'axios'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import moment from 'moment'
import store from './store/store'
import 'font-awesome/css/font-awesome.css'

import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)



Vue.use(MuseUI);

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.prototype.moment = moment;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {
    App
  }
});
