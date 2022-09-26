<template>
  <v-row>
    <v-col cols="12" md="3" sm="12" class="">
      <v-sheet class="no_background">
        <v-card outlined class="pa-4 container_card" elevation="3">
          <h1>LIST OF COUNTRIES</h1>
          <country-list />
        </v-card>
      </v-sheet>
    </v-col>
    <v-col cols="12" md="9" sm="12">
      <v-sheet class="no_background">
        <v-card
          outlined
          class="pa-4"
          :class="$vuetify.breakpoint.mdAndUp ? `container_card` : ``"
          elevation="3"
        >
          <h1>COUNTRY DETAILS</h1>
          <div v-if="!$store.state.selectedCountry" class="empty_text mt-4">
            Please select a country to see the details.
          </div>
          <country-details />
        </v-card>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import CountryDetails from '~/components/CountryDetails.vue'
import CountryList from '~/components/CountryList.vue'

export default {
  title: 'List Of Countries',
  components: { CountryDetails, CountryList },
}
</script>
