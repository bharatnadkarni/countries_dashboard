import constants from "~/utils/constants.json"
export default ($axios) => {
    return {
        helloWorld(){
            return constants.HELLO_WORLD
        },
        async getCountries(){
            try {
                const response = await $axios.get(constants.ALL_COUNTRIES)
                return response.data
            } catch (error) {
                return []
            }
        },
        async searchCountries(term){
            try {
                const response = await $axios.get(`${constants.COUNTRY_SEARCH}/${term}?fields=name,flags`)
                return response.data
            } catch (error) {
                return []
            }
        },
        async getSingleCountry(name){
            try {
                const response = await $axios.get(`${constants.SINGLE_COUNTRY}/${name}`)
                return response.data
            } catch (error) {
                return {}
            }
        }
    }
}