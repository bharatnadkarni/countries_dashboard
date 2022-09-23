import { mount, shallowMount } from '@vue/test-utils'
import Services from "~/services/services.js"
import axios from 'axios'
const services = Services(axios)

describe('Testing Services', () => {
  test('Test the get countries api to return status 200', async () => {
    const countries = await services.getCountries()
    expect(countries.status).toBe(200)
    expect(countries.data.length).toBe(250)
  })
  test('Test the search api to return a value', async () => {
    const searchResults = await services.searchCountries("swed")
    expect(searchResults).toBeTruthy()
    expect(searchResults.data.length).toBe(1)
    expect(searchResults.data[0].name).toBe("Sweden")
  })
  test('Test the get countries api to return a value', async () => {
    const singleCountry = await services.getSingleCountry("Sweden")
    expect(singleCountry).toBeTruthy()
    expect(singleCountry.data.length).toBe(1)
    expect(singleCountry.data[0].name).toBe("Sweden")
  })
})
