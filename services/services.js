import constants from "~/utils/constants.json"
export default ($axios) => {
    return {
        helloWorld(){
            return constants.HELLO_WORLD
        },
        async getCountries(){
            try {
                const response = await $axios.get(constants.ALL_COUNTRIES)
                return response
            } catch (error) {
                return null
            }
        },
        async searchCountries(term){
            try {
                const response = await $axios.get(`${constants.COUNTRY_SEARCH}/${term}?fields=name,flags`)
                return response
            } catch (error) {
                return null
            }
        },
        async getSingleCountry(name){
            try {
                const response = await $axios.get(`${constants.SINGLE_COUNTRY}/${name}?fullText=true`)
                return response
            } catch (error) {
                return null
            }
        }
    }
}