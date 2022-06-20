<template>
    <v-layout id="login" class="hide-overflow">
        <v-img width="100vw" height="100vh" style="position:absolute; left:0; top:0; z-index:0;" :src="require('@/assets/login_bg.jpg')" />
        <div class="d-flex text-center justify-center align-center" style="width:100%; height:100vh; z-index:1;">
            <v-form @keyup.native.enter="doLogin()" class="" style="width:420px; padding:16px; background:rgba(70,90,120, 0.6); border-radius:8px; text-align:center">
                <img src="@/assets/logo.png" style="height:48px; filter: contrast(100%) brightness(100%); float:left" />
                <div style="clear:both" />
                <h1 class="display-1 mb-4 mt-4 white--text">ВХОД В СИСТЕМУ</h1>
                <v-text-field
                    required
                    outlined
                    :disabled="isLoading"
                    name="login"
                    label="Логин"
                    placeholder="Логин"
                    prepend-inner-icon="person"
                    v-model="auth.login"
                    type="text"
                    dark
                    class="v-label--active"
                ></v-text-field>
                <v-text-field
                    counter
                    outlined
                    :disabled="isLoading"
                    name="password"
                    label="Пароль"
                    placeholder="Пароль"
                    prepend-inner-icon="lock"
                    v-model="auth.password"
                    type="password"
                    dark
                    class="v-label--active"
                ></v-text-field>
                <v-alert dark dense outlined v-if="message.length > 0" type="error">{{ message }}</v-alert>

                <v-spacer></v-spacer>
                <v-btn outlined block color="white" @click="doLogin()" :loading="isLoading" x-large dark> <v-icon left>vpn_key</v-icon>Войти </v-btn>
            </v-form>
        </div>
    </v-layout>
</template>

<script>
export default {
    meta: { auth: false },
    layout: "empty",

    components: {},

    head() {
        return {
            title: "Авторизация",
        };
    },

    data() {
        return {
            message: "",
            isLoading: false,
            auth: {
                login: "",
                password: "",
                password2: "",
            },
        };
    },
    async mounted() {
        this.$store.dispatch("auth/logout");
        this.$store.commit("SHOW_LOADER", false);
    },

    methods: {
        doLogin() {
            this.$store.commit("SHOW_LOADER", true);
            this.$store
                .dispatch("auth/login", this.auth)
                .then(async (result) => {
                    this.$store.commit("SHOW_LOADER", false);
                    //this.$swal.toast("Добро пожаловать: " + result.user.login);
                    this.$router.push("/");
                })
                .catch(async (e) => {
                    this.$store.commit("SHOW_LOADER", false);
                    this.message = e.message;
                });
        },

        doRegister() {
            this.$store.commit("SHOW_LOADER", true);
            this.$store
                .dispatch("auth/register", this.auth)
                .then((result) => {
                    this.$store.commit("SHOW_LOADER", false);
                    this.auth.password = "";
                    this.auth.password2 = "";
                    this.screen = "login";
                    this.message = "";
                    this.$swal.toast("Регистрация выполнена. Войдите в систему.");
                })
                .catch((e) => {
                    this.$store.commit("SHOW_LOADER", false);
                    this.message = e.message;
                });
        },
        changeTheme() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            this.$vuetify.theme.isDark = this.$vuetify.theme.dark;
            this.imageTheme = "";
            if (this.$vuetify.theme.isDark) this.imageTheme = "n";
            localStorage.setItem("theme_is_dark", this.$vuetify.theme.isDark);
        },
    }, //methods
};
</script>
