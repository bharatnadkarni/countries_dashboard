import { shallowMount } from "@vue/test-utils"
import Index from "~/pages/index"
import Vuetify from 'vuetify'


describe('Testing Page Load', () => {
    test('Test the index page', async () => {
        let vuetify = new Vuetify()
        let wrapper = shallowMount(Index, {
            vuetify,
            mocks: {
                $store: {
                    state: {
                        selectedCountry: {}
                    }
            }
            }
        })
        expect(wrapper.vm).toBeTruthy()
    })
  })
  