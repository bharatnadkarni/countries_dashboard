export const state = () => (
    {
        background: '#000000'
    }
)

export const getters = {
    getBackground(state){
        return state.background
    }
}

export const mutations = {
    setBackground(state, color){
        state.background = color
    }
}