
import '@fortawesome/fontawesome-free/css/all.css'
import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);
const my_icons = {
  signup: 'mdiAccountAlert',
}

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
    values: my_icons,
  },
  theme: {
    themes: {
      light: {
        primary: '#009688',
        secondary: '#b0bec5',
        accent: '#8c9eff',
        error: '#b71c1c',
      },
    }
  },
});