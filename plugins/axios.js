export default async ({ $axios, store, env, redirect }) => {

    $axios.onRequest((request) => {
        request.headers.common['Content-Type'] = "application/json";

        if (store.state.auth.token) {
            const token = store.state.auth.token;
            request.headers.common['Authorization'] = `Bearer ${token}`;
            request.headers.common['token'] = token;
        }
        return request;
    });

    $axios.onResponse((response) => {
        if (store.state.dev.isDev===true && response.status > 200) {
            console.warn(response);
            store.commit("dev/ADD_ERROR", response);
        }

        if (response.status == 401) {
            redirect('/auth/login')
        }

        return response;
    });

    $axios.onError(error => {
        if (store.state.dev.isDev===true) {
            console.error(error);
            store.commit("dev/ADD_ERROR", error);
        }

        return Promise.reject(error);
    });


}
