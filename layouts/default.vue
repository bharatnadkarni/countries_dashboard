<template>
  <v-app>
    <v-app-bar v-if="$vuetify.breakpoint.smAndDown" :clipped-left="clipped" fixed app>
      <v-app-bar-title v-text="`Country Data`"></v-app-bar-title>
    </v-app-bar>
    <v-main :style="{background: $store.getters.getBackground}">
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
}
</script>
