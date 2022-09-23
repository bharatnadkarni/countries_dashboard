<template>
  <v-row justify="center" align="center">
    <h1>{{hello}}</h1>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  data(){
    return {
      hello: ""
    }
  },
  created(){
  },
  mounted(){
    this.hello = this.$services.helloWorld()
  }
}
</script>
