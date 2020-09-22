
export const state = () => ({
  data: null,
  appTitle: process.env.appName,
  screenWidth: 1024,
  loader: {text:'Загрузка...', visible:false},
})


// mutations
export const mutations = {

  SET_APP_TITLE(state, title) {
    state.appTitle = title;
  },

  SET_SCREEN_WIDTH(state, width) {
    state.screenWidth = width;
  },

  SHOW_LOADER(state, payload) {
    let status = payload.status || false;
    let text = payload.text || 'Загрузка...';
    if (payload) status = true;
    state.loader = { visible:status, text:text };
  },

}//mutations


// actions
export const actions = {



}//actions