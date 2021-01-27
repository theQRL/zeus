<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <div style="padding : 16px">
      <ion-item>
      <ion-label position="floating">Bookmark name</ion-label>
      <ion-input v-model="contentText" ref="bookmarkInput"></ion-input>
      </ion-item>
    </div>
    <!-- ok -->
    <ion-button expand="block" color="primary" @click="this.$emit('modalSave', this.contentText)">
      <ion-icon :icon="checkmarkCircleOutline" slot="start"></ion-icon
      >OK</ion-button
    >
    <!-- cancel -->
    <ion-button expand="block" fill="outline" @click="this.$emit('modalCancel')">
      <ion-icon :icon="closeCircleOutline" slot="start"></ion-icon>
      CANCEL</ion-button
    >
  </ion-content>
</template>

<script>
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput
} from "@ionic/vue";
import { checkmarkCircleOutline, closeCircleOutline } from "ionicons/icons";
import { defineComponent } from "vue";
export default defineComponent({
  name: "NameBookmark",
  // inheritAttrs: false,
  props: {
    title: { type: String, default: "Zeus" },
    content: { type: String, default: "Bookmark "}
  },
  emits: ['modalCancel', 'modalSave'],
  created() {
    this.contentText = this.content
  },
  setup() {
    return {
      checkmarkCircleOutline, closeCircleOutline
    }
  },
  data() {
    return {
      contentText: null
    };
  },
  methods: {
    focusInput() {
      setTimeout(() => {
        this.$refs.bookmarkInput.$el.setFocus()
      },350);
    }
  },
  mounted() {
    this.focusInput();
  },
  components: { IonInput, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonItem, IonLabel }
});
</script>