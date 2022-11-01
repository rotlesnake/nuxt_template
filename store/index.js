
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


        downloadFile({ commit }, { path, postData, contentType, filename }) {
            return this.$axios.post(path, postData, { responseType: "arraybuffer" }).then((response) => {
                contentType = contentType || "application/octet-stream";
                filename = filename || "download_file.xlsx";
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
                link.remove();
                return response;
            });
        },

        openFile({ commit }, { path, postData, contentType }) {
            return this.$axios.post(path, postData, { responseType: "arraybuffer" }).then((response) => {
                contentType = contentType || "application/pdf";
                const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
                window.open(url, "", "width=900,height=600");
                return response;
            });
        }


}//actions
