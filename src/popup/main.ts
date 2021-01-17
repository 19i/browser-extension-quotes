import Vue from 'vue';
import Vuetify, { UserVuetifyPreset } from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import App from './pages/App.vue';

const opts: UserVuetifyPreset = {
	icons: {
		iconfont: 'mdi'
	}
};
Vue.use(Vuetify);

window.onload = () => {
	new Vue({
		vuetify: new Vuetify(opts),
		render: (h) => h(App)
	}).$mount('#app');
};
