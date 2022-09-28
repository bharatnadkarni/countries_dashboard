<template>
  <Component :is="tag">

    <div v-if="show_error" class="empty_text mt-4">{{error_message}}</div>

    <div v-if="$vuetify.breakpoint.smAndDown && !show_error" id="mobileList">
      <v-autocomplete
        outlined
        rounded
        dense
        :items="displayList"
        :search-input.sync="performSearch"
        cache-items
        hide-no-data
        hide-details
        class="mobile_search mt-4"
        item-text="name.common"
        item-value="name.common"
        placeholder="Search"
        @change="selectCountry"
      ></v-autocomplete>
    </div>

    <div v-if="$vuetify.breakpoint.mdAndUp && !show_error" id="desktopList">
      <v-text-field
        v-model="searchTerm"
        outlined
        rounded
        dense
        placeholder="Search"
        class="mt-4"
      >
      </v-text-field>

      <v-list rounded class="overflow-y-auto pa-0" max-height="500">
        <v-list-item-group class="list_group">
          <template v-for="country in displayList">
            <v-list-item
              :key="country.name.common"
              @click="selectCountry(country.name.common)"
            >
              <v-list-item-avatar>
                <v-img :src="country.flags.png"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  v-html="country.name.common"
                ></v-list-item-title>
                <v-list-item-subtitle
                  v-html="getNativeName(country)"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item-group>

        <v-skeleton-loader
          v-if="isMoreDataAvailable && !searching"
          v-intersect="loadNextPage"
          type="list-item-avatar-two-line@10"
        />
      </v-list>
    </div>
  </Component>
</template>
<script>
export default {
  title: 'Country List',
  props: {
    tag: {
      default: 'div',
      type: String,
    },
  },
  data() {
    return {
      searching: false,
      show_error: false,
      error_message: "Could not load country data.",
      searchTerm: '',
      displayList: [],
      list: [],
      pageSize: 15,
      pageLoaded: 0,
      totalCount: 0,
    }
  },
  async mounted() {
    await this.fetchData()
  },
  watch: {
    searchTerm() {
      //  Watching the search term to fire the performSearch api when the number of characters is 3 or more.

      if (this.searchTerm.length >= 3) {
        this.performSearch(this.searchTerm)
        this.searching = true
      } else {
        this.pageLoaded = 0
        this.searching = false
      }
    },
  },
  computed: {
    isMoreDataAvailable() {
    // A Computed function to check if the list has more info to load. Returning false removes the intersection observer from the
    // DOM so that no more pagination functions are called.
    
      return Math.ceil(this.totalCount / this.pageSize) - 1 > this.pageLoaded
    },
  },
  methods: {
    getNativeName(country) {
     // Parser function

      return Object.keys(country.name.nativeName).map((key) => {
        return country.name.nativeName[key].official
      })[0]
    },

    async performSearch(term) {
      //  Calling the search API

      const response = await this.$services.searchCountries(term)
      this.displayList = response
      
    },

    async fetchData() {
      //  Calling the list of countries api

      const response = await this.$services.getCountries()
      this.list = response
      if (this.$vuetify.breakpoint.smAndDown) {
        this.displayList = this.list
      }
      if(this.list.length > 0) {
        this.totalCount = this.list.length
      } else {
        this.show_error = true
      }
    },

    loadNextPage(entries) {
      //Pagination function fired upon the intersection observer being triggered to Lazy Load the list. 

      if (entries[0].isIntersecting && this.isMoreDataAvailable) {
        // The setTimeout function is just to simulate the lag made by an api calls.

        setTimeout(() => {
          const nextPage = this.pageLoaded + 1
          this.displayList = this.list.slice(0, this.pageSize * nextPage)
          this.pageLoaded = nextPage
        }, 250)
      }
    },

    async selectCountry(e) {
      // Function fired when a country is selected. Sets the state variable to the selected country and emits a loading = true

      if (e) {
        let selectedCountry;
        this.$nuxt.$emit('loading', true)
        const response = await this.$services.getSingleCountry(e)
        if(Object.keys(response).length === 0) {
            selectedCountry = {}
        } else {
            selectedCountry = response.filter((el) => {
            return el.name.common == e
            })[0]
        }
        
        this.$store.commit('setSelectedCountry', selectedCountry)
      }
    },
  },
}
</script>