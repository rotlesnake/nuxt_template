
export const state = () => ({
  isDev: true,
  errors: [],
})


// mutations
export const mutations = {
    ADD_ERROR(state, data) {
        state.errors.push(data);
    },    
    CLEAR_ERRORS(state) {
        state.errors  = [];
    },    
}//mutations


// actions
export const actions = {


}//actions