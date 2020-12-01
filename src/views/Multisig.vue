<template>
  <ion-list v-if="info !== null">
    <ion-list-header color="tertiary"> {{ info.multi_sig_detail.length }} MULTISIG ADDRESSES </ion-list-header>
    <ion-item-group v-for="t in info.multi_sig_detail" :key="t.balance">
      <ion-item lines="none">
        <ion-label @click="this.router.push(`/a/${t.address }`)" class="addr">{{ t.address }}</ion-label>
        <ion-note slot="end" color="secondary">{{ parseInt(t.balance) / 10e8 }} Quanta </ion-note>
      </ion-item>
    </ion-item-group>
  </ion-list>
</template>

<script lang="js">
import { IonListHeader, IonLabel, IonNote, IonItem, IonItemGroup, IonList } from '@ionic/vue'
import { useRouter } from 'vue-router'
// import { checkmarkCircleOutline } from 'ionicons/icons'
// import validateAddress from '@theqrl/validate-qrl-address'
import axios from 'axios'
import helpers from '@theqrl/explorer-helpers'
import API from '../API'
import state from '../store'

// import { ref, computed, watch } from 'vue';

export default {
  name: 'Multisig',
  components: {
    IonListHeader,
    IonLabel,
    IonNote,
    IonItem,
    IonItemGroup,
    IonList
  },
  props: ['id'],
  data() {
    return {
      sharedState: state,
      // id: this.$parent.route.params.id,
      info: null,
      error: null
    }
  },
  beforeMount() {
    this.apiCall()
  },
  setup() {
    const router = useRouter()
    return { router };
  },
  methods: {
    apiCall() {
      const network = this.sharedState.network
      if (network === 'offline') {
        this.error = { message: 'Offline' }
        return
      }
      console.log('Fetching from: ' + network)
      console.log('id for multisig is ' + this.id)
      axios
        .post(`${API}/grpc/${network}/GetMultiSigAddressesByAddress`, {
          address: this.id, 
          item_per_page: 100, // eslint-disable-line
          page_number: 1, }, // eslint-disable-line
        )
        .then(response => {
          console.log(response)
          if (response.data.code === 3) {
            this.error = { message: response.data.details }
          } else {
            this.info = helpers.multisig(response.data)
          }
        })
        .catch(error => (this.error = error))
    },
  },
  watch: {
    'sharedState.network': async function (oldState, newState) {
      console.log(`Network changed ${oldState} -> ${newState} -- refresh explorer view`);
      this.info = null
      this.error = null
      this.apiCall()
    }
  },
}
</script>

<style scoped>
ion-label.md:not(.addr) {
  color: #fff;
}
.addr {
  color: #9DA3A5;
  transition: opacity 0.3s ease-in-out, color 0.3s ease-in-out;
  cursor: pointer;
}
.addr:hover {
  color: var(--ion-color-primary);
}
</style>
