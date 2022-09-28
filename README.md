# countries_dashboard

The countries dashboard project shows a list of countries and the country details. The following have been used to display various types of integrations and methodologies -

1. Google Places (Maps) API has been used to fetch the images for the country.
2. Google Charts (Geo Chart) has been used to point the location of the country on a map and also show a tooltip with the country's population.
3. There are 2 main components - CountryDetails and CountryList.
4. The CountryList component displays the list of countries in a paginated manner. Pagination has been simulated in this scenario as pagination is not available in the API. The component also has a search function to query a search endpoint to return partial matches.
5. Once a country is clicked in the CountryList, a state variable called selectedCountry is updated using a vuex mutation.
6. The CountryDetails API has a watcher on the state variable selectedCountry which watches for changes and updates the UI once the variable is mutated.

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

