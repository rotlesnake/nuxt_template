export default function({ store, redirect, route }) {
    if (route.meta && route.meta.length>0) {
        if (route.meta[0].auth===false) return;
    }

    if (!store.state.auth.token) {
        store.commit("auth/USER_REMEMBER");
        if (!store.state.auth.token) {
            redirect('/auth/login')
        }
    }
}
