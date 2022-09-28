import Services from "~/services/services.js"
import axios from 'axios'
const services = Services(axios)

describe('Testing Services', () => {
  test('Test the get countries api', async () => {
    const countries = await services.getCountries()
    expect(countries.length).toBe(250)
  })
  test('Test the search api to return a value', async () => {
    const searchResults = await services.searchCountries("swed")
    expect(searchResults).toBeTruthy()
    expect(searchResults[0].name.common).toBe("Sweden")
  })
  test('Test the get countries api to return a value', async () => {
    const singleCountry = await services.getSingleCountry("Sweden")
    expect(singleCountry).toBeTruthy()
    expect(singleCountry[0].name.common).toBe("Sweden")
  })
})
