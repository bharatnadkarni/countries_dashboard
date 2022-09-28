<template>
  <Component :is="tag">
    <div id="map" ref="map"></div>
    <div v-if="show_error" class="empty_text mt-4">{{this.error_message}}</div>

    <v-row
      v-if="data && !show_error"
      class="details_row mt-4"
    >
      <v-col cols="12" sm="12" md="6" class="chart_holder">
        <div v-if="loading || chartLoading" class="progress_bar_holder">
          <v-progress-circular
            class="progress_bar"
            indeterminate
            size="30"
          ></v-progress-circular>
        </div>
        <div ref="chart" id="geo_chart"></div>
      </v-col>
      <v-col cols="12" sm="12" md="6" :class="$vuetify.breakpoint.mdAndUp ? `pa-8` : ``">
        <div class="property">
          <h4>NAME</h4>
          <v-skeleton-loader
            class="skel"
            v-if="loading"
            type="list-item-two-line"
          ></v-skeleton-loader>
          <div v-if="!loading">
            <p class="mt-2 common_name"><b>Common Name:</b> {{ data.name.common }}</p>
            <p>
              <b>Native Name:</b>
              {{ showNativeNames(data.name.nativeName) }}
            </p>
          </div>
        </div>
        <div class="property mt-4">
          <h4>FLAG</h4>
          <v-skeleton-loader
            class="skel mt-4"
            v-if="loading"
            type="button"
          ></v-skeleton-loader>
          <img v-if="!loading" class="flag mt-4" :src="data.flags.svg" />
        </div>
      </v-col>
    </v-row>

    <v-divider v-if="place && place.photos && !show_error"></v-divider>
    <v-row v-if="data && place && place.photos && !show_error" class="details_row">
      <v-col cols="12" sm="12" md="12">
        <div class="property">
          <h4>PHOTOS</h4>
          <v-row v-if="loading || photosLoading" class="mt-4">
            <v-col v-for="n in 4" :key="n" cols="12" md="3" sm="3">
              <v-skeleton-loader class="skel" type="image"></v-skeleton-loader>
            </v-col>
          </v-row>
          <ImageCarousel
            v-if="place && !loading && !photosLoading"
            class="mt-8"
            :photos="place.photos"
          />
        </div>
      </v-col>
    </v-row>

    <v-divider v-if="data && !show_error"></v-divider>
    <v-row v-if="data && !show_error" class="details_row">
      <v-col cols="12" sm="12" md="12">
        <div class="property">
          <h4>FACTS ABOUT {{ data.name.common }}</h4>
          <v-skeleton-loader
            class="skel"
            v-if="loading"
            type="list-item-two-line"
          ></v-skeleton-loader>
          <ol v-if="!loading" class="mt-4">
            <li>
              {{ data.capital[0] }} is the capital of
              {{ data.name.common }}
            </li>
            <li>
              {{ data.name.common }} is <span v-if="!data.unMember">not</span> a
              member of the United Nations
            </li>
            <li>
              {{ showLanguages(data.languages) }}
              {{ Object.keys(data.languages).length > 1 ? 'are' : 'is' }} the
              language{{
                Object.keys(data.languages).length > 1 ? 's' : ''
              }}
              spoken in {{ data.name.common }}
            </li>
            <li>
              {{ data.name.common }} is
              <span v-if="!data.landlocked">not</span> a landlocked country.
            </li>
          </ol>
        </div>
      </v-col>
    </v-row>
  </Component>
</template>
<script>
import ImageCarousel from '~/components/ImageCarousel.vue'
import * as Vibrant from 'node-vibrant'
export default {
  components: { ImageCarousel },
  props: {
    tag: {
      default: 'div',
      type: String,
    },
  },
  data() {
    return {
      show_error: false,
      error_message: null,
      data: null,
      place: null,
      loading: false,
      chartLoading: false,
      photosLoading: false,
    }
  },
  created() {},
  mounted() {
    this.handleLoadingEmit()
    this.handleWindowResize()
  },
  watch: {
    '$store.state.selectedCountry': function (newVal) {
      // Trigger UI update when the state variable changes.

      this.chartLoading = true
      this.data = newVal
      this.loading = false
      const clone = JSON.parse(JSON.stringify(this.data))
      if(Object.keys(clone).length !== 0){
        this.show_error = false
        this.pickColor(newVal.flags.png)
        this.getPlace()
      } else {
        this.show_error = true
        this.error_message = "Could not load country information."
      }
    },
  },

  methods: {
    showLanguages(data) {
      // Parses the Languages object to return a comma separated string

      return Object.keys(data)
        .map((key) => {
          return data[key]
        })
        .join(', ')
    },

    showNativeNames(data) {
      // Parses the nativeName object to return a comma separated string

      return Object.keys(data)
        .map((key) => {
          return data[key].official
        })
        .join(', ')
    },

    drawChart() {
      // Draws a Google Geochart and plots the capital of the country along with the population in a tooltip.

      const name = this.data.capital[0]
      const population = `Population: ${this.data.population.toLocaleString()}`
      const highlightColor = this.$store.getters.getBackground

      google.charts.load('current', {
        packages: ['geochart', 'corechart'],
        mapsApiKey: 'AIzaSyCCvN0wkrtBqyOAvF2NAmQlHDWrfMtxscg',
      })

      google.charts.setOnLoadCallback(() => {
        const chart = new google.visualization.GeoChart(
          document.getElementById('geo_chart')
        )

        const data = google.visualization.arrayToDataTable([
          ['Country', 'Population'],
          [name, population],
        ])

        const options = {
          datalessRegionColor: '#efefef',
          defaultColor: highlightColor,
          displayMode: 'markers',
        }
        chart.draw(data, options)
        this.chartLoading = false
      })
    },

    getPlace() {
      // Queries the Google Places API to get the Place Details for the the selected country. Only Photos are displayed.

      let place_id
      this.photosLoading = true

      const request = {
        query: this.data.name.common,
        fields: ['place_id'],
      }

      const service = new google.maps.places.PlacesService(this.$refs.map)

      service.findPlaceFromQuery(request, (results, status) => {

        // Fallback. If Places API isn't able to understand the country, fallback to the country's capital.
        if (!results) {
          const capitalRequest = {
            query: this.data.capital[0],
            fields: ['place_id'],
          }
          service.findPlaceFromQuery(capitalRequest, (results2, status) => {
            console.log(results2)
            place_id = results2[0].place_id
            this.getDetails(service, place_id)
          })
        } else {
          place_id = results[0].place_id
          this.getDetails(service, place_id)
        }
      })
    },

    getDetails(service, place_id) {
      // Get place details of the place_id.

      const request = {
        placeId: place_id,
        fields: ['photos'],
      }

      service.getDetails(request, (place, status) => {
        console.log('Place --- ', place)
        this.place = place
        this.photosLoading = false
      })
    },

    pickColor(path) {
      // Parses the country flag to generate a color palette. The most vibrant color is saved to the state for the background.

      Vibrant.from(path).getPalette((err, palette) => {
        this.$store.commit('setBackground', palette.Vibrant.hex)
        this.drawChart()
      })
    },

    handleLoadingEmit(){
      // loading = true is emited when any list item is clicked. handle this emit and set the loading variable to true.

      this.$nuxt.$on('loading', ($event) => {
        this.loading = $event
      })
    },

    handleWindowResize(){
      // Resize is necessary to handle the chart becuase it's a rendered SVG. SVG does not resize unless explicitly resized.
      // Width check has been used because on modern mobile browsers, the address bar hides upon scrolling this triggering the
      // window resize listener. We do not want this.

      let width = window.innerWidth
      window.addEventListener('resize', ()=>{
        const newWidth = window.innerWidth
        if(width !== newWidth){
          this.drawChart()
          width = newWidth
        }
        
      })
    }
  },
}
</script>