<template>
<v-slide-group
      show-arrows
    >
      <v-slide-item
        v-for="(photo, index) in photos"
        :key="index"
      >
            <v-card
              class="d-flex align-center mr-4"
              dark
              height="200"
            >
              <img height="200" :src="photo.getUrl()" alt="">
            </v-card>
      </v-slide-item>
    </v-slide-group>

</template>
<script>
export default {
    props: ['photos']
}
</script>