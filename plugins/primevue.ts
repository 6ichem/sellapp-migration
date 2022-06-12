import { defineNuxtPlugin } from "#app";
import PrimeVue from "primevue/config";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import ProgressSpinner from "primevue/progressspinner";
import Message from "primevue/message";
import InputSwitch from "primevue/inputswitch";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: true });
  nuxtApp.vueApp.component("Card", Card);
  nuxtApp.vueApp.component("Button", Button);
  nuxtApp.vueApp.component("InputText", InputText);
  nuxtApp.vueApp.component("ProgressSpinner", ProgressSpinner);
  nuxtApp.vueApp.component("Message", Message);
  nuxtApp.vueApp.component("InputSwitch", InputSwitch);
});
