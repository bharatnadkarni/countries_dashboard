<template>
  <Component :is="tag">
    <v-slide-group v-if="$vuetify.breakpoint.mdAndUp" show-arrows>
      <v-slide-item v-for="(photo, index) in photos" :key="index">
        <v-card class="d-flex align-center mr-4" dark height="200">
          <img height="200" :src="photo.getUrl()" alt="" />
        </v-card>
      </v-slide-item>
    </v-slide-group>
    <v-carousel v-if="$vuetify.breakpoint.smAndDown" hide-delimiters>
      <v-carousel-item
        v-for="(photo,i) in photos"
        :key="i"
        :src="photo.getUrl()"
      ></v-carousel-item>
    </v-carousel>
  </Component>
</template>
<script>
export default {
  props: {
    photos: [],
    tag: {
      default: 'div',
      type: String,
    },
  },
}
</script>