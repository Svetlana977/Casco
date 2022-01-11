import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';
import moment from 'moment';


moment().format();

Vue.config.productionTip = false
Vue.use(VueFilterDateFormat);


new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
