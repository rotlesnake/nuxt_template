export default async ({ $axios, store, env, redirect, app }) => {

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

        if (response.status == 401) {
            redirect('/auth/login')
        }

        return response;
    });



    $axios.onError(error => {

        if (error.response.status == 401) {
            redirect('/auth/login')
        }

        return Promise.reject(error);
    });


}
