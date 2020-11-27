<template>
  <div>TOKENS<br>{{info}}</div>
</template>

<script lang="js">
// import { IonGrid, IonIcon, IonCol, IonRow, IonSegment, IonSegmentButton, IonButtons, IonButton, IonSpinner, IonLabel, IonItem, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue'
import { useRouter, useRoute } from 'vue-router'
// import { checkmarkCircleOutline } from 'ionicons/icons'
// import validateAddress from '@theqrl/validate-qrl-address'
import axios from 'axios'
import helpers from '@theqrl/explorer-helpers'
import API from '../API'
import state from '../store'

// import { ref, computed, watch } from 'vue';

export default {
  name: 'Tokens',
  components: {
    // IonGrid,
    // IonIcon,
    // IonCol,
    // IonRow,
    // IonButtons,
    // // IonButton,
    // IonContent,
    // IonHeader,
    // IonMenuButton,
    // IonPage,
    // IonTitle,
    // IonToolbar,
    // IonSpinner,
    // IonSegment,
    // IonSegmentButton,
    // IonLabel,
    // IonItem
  },
  props: ['id'],
  data() {
    const route = useRoute()
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
      console.log('id for tokens is ' + this.id)
      axios
        .post(`${API}/grpc/${network}/GetTokensByAddress`, {
          address: this.id, 
          item_per_page: 100, // eslint-disable-line
          page_number: 1, }, // eslint-disable-line
        )
        .then(response => {
          console.log(response)
          if (response.data.code === 3) {
            this.error = { message: response.data.details }
          } else {
            this.info = helpers.tokens(response.data)
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

</style>
