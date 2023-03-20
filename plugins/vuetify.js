import Vue from "vue";
import Vuetify from "vuetify";
import VuePageTransition from "vue-page-transition";
import ru from "vuetify/lib/locale/ru";

Vue.use(Vuetify);
Vue.use(VuePageTransition);

export default (ctx) => {
    const vTheme = localStorage.getItem("theme_is_dark") == "true";

    const vuetify = new Vuetify({
        icons: {
            iconfont: "mdi" || "md" || "fa",
        },
        lang: {
            locales: { ru },
            current: "ru",
        },
        theme: {
            dark: vTheme,
            options: {
                customProperties: true,
            },
            themes: {
                light: {
                    background: "#f6f7ff",
                    toolbar: "#fff",
                    primary: "#5faf2d",
                    secondary: "#C0C0C0",
                    accent: "#82B1FF",
                    error: "#FF5252",
                    info: "#2196F3",
                    success: "#4CAF50",
                    warning: "#FFC107",
                },
                dark: {
                    background: "#000",
                    toolbar: "#003E14",
                    primary: "#727272",
                    secondary: "#424242",
                    accent: "#a0a0a0",
                    error: "#FF5252",
                    info: "#2196F3",
                    success: "#4CAF50",
                    warning: "#FFC107",
                },
            },
        },
    });
    ctx.app.vuetify = vuetify;
    ctx.$vuetify = vuetify.framework;
};