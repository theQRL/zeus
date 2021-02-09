<template>
  <div style="width: max-content;">
    <ion-chip color="primary" @click="openModal">
      <ion-icon :ios="bookmarkOutline" :md="bookmarkSharp"></ion-icon>
      <ion-label v-if="isOutline()">Create</ion-label><ion-label v-else>{{name}}</ion-label>
      <ion-icon v-if="!isOutline()" :ios="closeCircle" :md="closeCircle"></ion-icon>
    </ion-chip>
  </div>
  <ion-modal
      :is-open="modalIsOpen"
      @onDidDismiss="modalIsOpen = false"
    >
    <NameBookmark
      :content='this.name'
      title='Bookmark page'
      @modalSave="handleSave"
      @modalCancel="handleCancel"
    ></NameBookmark>
  </ion-modal>
</template>

<script lang="js">
import { IonChip, IonLabel, IonIcon, IonModal } from '@ionic/vue'
import NameBookmark from './NameBookmark.vue'
import { useRoute } from 'vue-router'
import { bookmarkSharp, bookmarkOutline, closeCircle } from 'ionicons/icons'
import state from '../store'
import { Plugins } from '@capacitor/core'
const { Storage } = Plugins;
export default {
  inheritAttrs: false,
  name: 'Bookmark',
  components: { IonChip, IonLabel, IonIcon, NameBookmark, IonModal },
  setup() {
    return {
      bookmarkSharp, bookmarkOutline, closeCircle
    }
  },
  methods: {
    openModal() {
      if (this.bookmarked) {
        this.bookmarked = false
        this.name = 'Bookmark'
        const updatedBookmarks = []
        this.sharedState.bookmarks.forEach(element => {
          if (element.url !== this.$route.path) {
            updatedBookmarks.push({ url: element.url, name: element.name })
          }
        })
        this.sharedState.bookmarks = updatedBookmarks
      } else {
        this.modalIsOpen = true
      }
    },
    isOutline() {
      if (this.bookmarked) {
        return false
      }
      return true
    },
    handleSave(params) {
      this.modalIsOpen = false
      this.bookmarked = true
      console.log('Saved with: ' + params)
      this.name = params
      this.sharedState.bookmarks.push({url: this.$route.path, name: params})
      Storage.set({
        key: 'bookmarks',
        value: JSON.stringify(this.sharedState.bookmarks)
      });
    },
    handleCancel() {
      this.modalIsOpen = false
    }
  },
  data() {
    let bookmarked = false
    let name = 'Bookmark'
    const route = useRoute()
    state.bookmarks.forEach(element => {
      if (element.url === route.path) {
        bookmarked = true
        name = element.name
      }
    })
    return {
      sharedState: state,
      modalIsOpen: false,
      name,
      bookmarked,
    }
  },
  watch: {
    '$route': function() {
      let bookmarked = false
      let name = 'Bookmark'
      console.log(this.$route.path)
      state.bookmarks.forEach(element => {
        if (element.url === this.$route.path) {
          bookmarked = true
          name = element.name
        }
      })
      this.bookmarked = bookmarked
      this.name = name
    }
  }
}
</script>
<style scoped>
  ion-chip {
    background: black;
  }
</style>