import { mount, shallowMount } from '@vue/test-utils'
import flushPromises from "flush-promises";
import CountryDetails from "~/components/CountryDetails"
import CountryList from "~/components/CountryList"
const countryData = require("../utils/single.json")
import Vuetify from 'vuetify'
import Services from "~/services/services.js"
import axios from 'axios'
const services = Services(axios)

describe('Testing individual components', ()=> {

    test('CountryDetails component test', async ()=> {
        let vuetify = new Vuetify()

        const wrapper = shallowMount(CountryDetails, {
            vuetify,
            mocks: {
                $nuxt: {
                    $on: jest.fn().mockResolvedValue(Promise.resolve({}))
                }
            }
        })
        expect(wrapper.vm).toBeTruthy()

        const data = countryData[0]
        await wrapper.setData({
            data: data,
            loading: false
        })

        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.find(".common_name").text()).toEqual("Common Name: Sweden");

    })

    test('CountryList component test', async ()=> {
        let vuetify = new Vuetify()

        const wrapper = shallowMount(CountryList, {
            vuetify,
            mocks: {
                $services: services,
                $nuxt: {
                    $emit: jest.fn().mockResolvedValue(Promise.resolve({}))
                }
            }
        })
        expect(wrapper.vm).toBeTruthy()
    })


})
