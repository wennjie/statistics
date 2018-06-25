// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

// Vue.use(ElementUI);

import { Button, Select,Loading,Dialog,Tabs,Table,DatePicker,Checkbox,CheckboxGroup ,Pagination,OptionGroup,TableColumn,Radio,RadioButton,RadioGroup,Option} from 'element-ui';
Vue.use(Select)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Tabs)
Vue.use(Table)
Vue.use(DatePicker)
Vue.use(Checkbox)
Vue.use(Pagination)
Vue.use(OptionGroup)
Vue.use(TableColumn)
Vue.use(Radio)
Vue.use(RadioButton)
Vue.use(RadioGroup)
Vue.use(Option)
Vue.use(CheckboxGroup)
Vue.prototype.$loading = Loading.service;
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
