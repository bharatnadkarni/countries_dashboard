<template>
  <div>
    <div id="map" ref="map"></div>
    <v-row v-if="!data" class="mt-4">
      <v-col cols="12" sm="12" md="12">
        <div class="empty_text">
          Please select a country to see the details.
        </div>
      </v-col>
    </v-row>

    <v-row v-if="data" class="details_row mt-4 pa-8">
      <v-col cols="12" sm="12" md="6">
        <div id="geo_chart"></div>
      </v-col>
      <v-col class="pa-8" cols="12" sm="12" md="6">
        <div class="property">
          <h4>NAME</h4>
          <p class="mt-2">
            <b>Common Name:</b> {{ data.name.common }}
          </p>
          <p><b>Official Name:</b> {{ data.name.official }}</p>
          <p>
            <b>Native Name:</b>
            {{ showNativeNames(data.name.nativeName) }}
          </p>
        </div>
        <div class="property mt-4">
          <h4>FLAG</h4>
          <img class="flag mt-4" :src="data.flags.svg" />
        </div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row v-if="data" class="details_row pa-8">
      <v-col cols="12" sm="12" md="12">
        <div class="property">
          <h4>PHOTOS</h4>
          <ImageCarousel v-if="place" class="mt-8" :photos="place.photos" />
        </div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row v-if="data" class="details_row pa-8">
      <v-col cols="12" sm="12" md="12">
        <div class="property">
          <h4>FACTS ABOUT {{ data.name.common }}</h4>
          <ol class="mt-4">
            <li>
              {{ data.capital[0] }} is the capital of
              {{ data.name.common }}
            </li>
            <li>
              {{ data.name.common }} is
              <span v-if="!data.unMember">not</span> a member of the
              United Nations
            </li>
            <li>
              {{ showLanguages(data.languages) }} is/are the
              language/s spoken in {{ data.name.common }}
            </li>
            <li>
              {{ data.name.common }} is
              <span v-if="!data.landlocked">not</span> a landlocked
              country.
            </li>
          </ol>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import ImageCarousel from '~/components/ImageCarousel.vue'
import * as Vibrant from 'node-vibrant'
export default {
  components: { ImageCarousel },
  props: ['data'],
  data() {
    return {
      place: null,
    }
  },
  created() {},
  mounted() {
    this.pickColor(this.data.flags.png)
    this.getPlace()
  },
  watch: {
    data: function (newVal) {
      this.pickColor(newVal.flags.png)
      this.getPlace()
    },
  },
  methods: {
    showLanguages(data) {
      return Object.keys(data)
        .map((key) => {
          return data[key]
        })
        .join(', ')
    },
    showNativeNames(data) {
      return Object.keys(data)
        .map((key) => {
          return data[key].official
        })
        .join(', ')
    },

    drawChart() {

      let name = this.data.name.common
      let population = `Population: ${this.data.population.toLocaleString()}`
      google.charts.load('current', {
        packages: ['geochart', 'corechart'],
        mapsApiKey: 'AIzaSyCCvN0wkrtBqyOAvF2NAmQlHDWrfMtxscg',
      })
      google.charts.setOnLoadCallback(drawRegionsMap)

      let highlightColor = this.$store.getters.getBackground

      function drawRegionsMap() {
        const chart = new google.visualization.GeoChart(
          document.getElementById('geo_chart')
        )

        const data = google.visualization.arrayToDataTable([
          ['Country', 'Population'],
          [name, population],
        ])

        const options = {
          datalessRegionColor: '#efefef',
          defaultColor: highlightColor
        }
        chart.draw(data, options)
      }
    },

    getPlace() {
      const request = {
        query: this.data.name.common,
        fields: ['place_id'],
      }

      const service = new google.maps.places.PlacesService(this.$refs.map)

      service.findPlaceFromQuery(request, (results, status) => {
        console.log('PLACES API --- ', results)
        console.log(status)
        let place_id = results[0].place_id
        var request2 = {
          placeId: place_id,
        }
        service.getDetails(request2, (place, status) => {
          this.place = place
        })
      })
    },

    pickColor(path){
      Vibrant.from(path).getPalette((err, palette)=>{
        this.$store.commit('setBackground', palette.Vibrant.hex)
        this.drawChart()
      })
    }
  },
}
</script>