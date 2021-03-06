import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as Vant from 'vant';
import 'vant/lib/index.css';
import '@/assets/animate.css';
import 'amfe-flexible/index.js';
import Api from './api/index.js';
import {getQueryString} from "@/util";
Vue.use(Vant);
Vue.use(Api);

Vue.config.productionTip = false
import { mapMutations } from 'vuex'
import Router from 'vue-router'
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    let hash = getQueryString('hash');
    this.setCode(getQueryString('code'))
    let params = {};
    if(!!decodeURIComponent(location.search)){
      decodeURIComponent(location.search).split("?")[1].split('&').forEach((e) => {	
        let key = e.split('=')[0]	
        params[key] = e.split('=')[1]	
      })
    }
    if(hash != null){
      this.$router.push({path: hash, query: params})
    }
  },
  methods: {
    ...mapMutations('common', {
      'setCode': 'setCode'
    })
  }
}).$mount('#app')
