/* global QRLLIB */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

import { QRLLIBmodule } from 'qrllib/build/offline-libjsqrl'; // eslint-disable-line

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

const waitForQRLLIB = (callBack: () => any) => {
  setTimeout(() => {
    // Test the QRLLIB object has the str2bin function.
    // This is sufficient to tell us QRLLIB has loaded.
    if (typeof QRLLIB.str2bin === 'function') {
      callBack();
    } else {
      return waitForQRLLIB(callBack);
    }
    return false;
  }, 50);
};

const app = createApp(App)
  .use(IonicVue)
  .use(router)

async function startup() {
  await QRLLIBmodule
  waitForQRLLIB(() => {
    router.isReady().then(() => {
      app.mount('#app');
    });
  });
}

startup()
