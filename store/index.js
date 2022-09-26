export const state = () => (
    {
        background: '#000000',
        selectedCountry: null,
    }
)

export const getters = {
    getBackground(state){
        return state.background
    },
    getSelectedCountry(state){
        return state.selectedCountry
    },
}

export const mutations = {
    setBackground(state, color){
        state.background = color
    },
    setSelectedCountry(state, country) {
        state.selectedCountry = country
    }
}