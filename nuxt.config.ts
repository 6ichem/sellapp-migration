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

  app: {
    head: {
      title: "Sell.app Migration",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
      charset: "utf-8",
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
});
