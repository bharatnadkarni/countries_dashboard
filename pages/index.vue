<template>
  <v-row>

    <v-col v-if="$vuetify.breakpoint.smAndDown" cols="12" md="3" sm="12">
      <v-sheet class="no_background">
        <v-card outlined class="pa-4" elevation="3">
          <h1>Search</h1>
          <v-autocomplete
            outlined
            rounded
            dense
            v-model="mobileSearchSelect"
            :loading="mobileSearchLoading"
            :items="displayList"
            :search-input.sync="mockSearch"
            cache-items
            hide-no-data
            hide-details
            class="mobile_search mt-4"
            item-text="name"
            item-value="name"
            placeholder="Search"
          ></v-autocomplete>
        </v-card>
      </v-sheet>
    </v-col>

    <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="12" md="3" sm="12" class="">
      <v-sheet class="no_background">
        <v-card outlined class="pa-4 container_card" elevation="3">
          <h1>COUNTRIES LIST</h1>

          <v-text-field
            v-model="searchTerm"
            outlined
            rounded
            dense
            placeholder="Search"
            class="mt-4"
          >
          </v-text-field>

          <v-list
            rounded
            class="overflow-y-auto pa-0"
            max-height="500"
          >
            <v-list-item-group class="list_group">
              <template v-for="country in displayList">
                <v-list-item
                  :key="country.name"
                  @click="selectCountry(country.name)"
                >
                  <v-list-item-avatar>
                    <v-img :src="country.flags.png"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title
                      v-html="country.name"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      v-html="country.nativeName"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <!-- <v-divider
                v-if="index < displayList.length - 1"
                :key="index"
              ></v-divider> -->
              </template>
            </v-list-item-group>

            <v-skeleton-loader
              v-if="isMoreDataAvailable && !searching"
              v-intersect="loadNextPage"
              type="list-item-avatar-two-line@10"
            />

          </v-list>
        </v-card>
      </v-sheet>
    </v-col>
    <v-col cols="12" md="9" sm="12">
      <v-sheet class="no_background">
        <v-card outlined class="pa-4" :class="$vuetify.breakpoint.mdAndUp ? `container_card` : `` " elevation="3">
          <h1>COUNTRY DETAILS</h1>
          <CountryDetails :data="selectedCountry" />
        </v-card>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import list from '~/utils/list.json'
import single from '~/utils/single.json'
import CountryDetails from '~/components/CountryDetails.vue'

export default {
  components: { CountryDetails },
  data() {
    return {
      toggle: 0,
      mobileSearchLoading: null,
      mobileSearchSelect: null,
      mobileSearch: null,
      selectedCountry: null,
      searching: false,
      searchTerm: '',
      pageSize: 15,
      pageLoaded: 0,
      totalCount: 0,
      list: [],
      displayList: [],
      geojson: null,
      place: null,
    }
  },
  created() {
    this.selectedCountry = single[this.toggle]
  },
  mounted() {
    this.fetchData()
  },
  watch: {
    searchTerm() {
      if (this.searchTerm.length >= 3) {
        this.mockSearch(this.searchTerm)
        this.searching = true
      } else {
        this.pageLoaded = 0
        this.searching = false
      }
    },
  },
  computed: {
    isMoreDataAvailable() {
      console.log(Math.ceil(this.totalCount / this.pageSize) - 1)
      console.log(this.pageLoaded)
      return Math.ceil(this.totalCount / this.pageSize) - 1 > this.pageLoaded
    },
  },
  methods: {
    selectCountry(e) {
      this.toggle = 0 ? 1 : 0
      this.selectedCountry = single[1]
      console.log('SELECTED COUNTRY IS --- ', this.selectedCountry)
    },
    mockSearch(term) {
      const regex = new RegExp(term, 'i')
      this.displayList = this.list.filter((el) => el.name.match(regex))
    },
    fetchData() {
      this.list = list
      this.totalCount = this.list.length
      if(this.$vuetify.breakpoint.smAndDown){
        this.displayList = this.list
      }
    },
    loadNextPage(entries) {
      if (entries[0].isIntersecting && this.isMoreDataAvailable) {
        // The setTimeout function is just to mock the lag made for paginated api calls.
        console.log('Enters this')
        setTimeout(() => {
          console.log('Enters this too')
          const nextPage = this.pageLoaded + 1
          this.displayList = this.list.slice(0, this.pageSize * nextPage)
          console.log(this.displayList)
          this.pageLoaded = nextPage
        }, 500)
      }
    },
  },
}
</script>
