import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: [
    "primevue/resources/themes/mdc-dark-deeppurple/theme.css",
    "primevue/resources/primevue.css",
    "primeicons/primeicons.css",
  ],
  vite: {
    resolve: {
      dedupe: ["vue"],
    },
  },
  build: {
    transpile: ["primevue"],
  },
});
