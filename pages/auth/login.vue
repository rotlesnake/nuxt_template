<template>
<v-layout>
    <v-card>
        <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Вход в систему</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>

        <v-card-text class="mt-8">
            <v-form @keyup.native.enter="doLogin()">
                <v-text-field required outlined :disabled="isLoading" name="login" label="Фамилия Имя пользователя" v-model="auth.login" prepend-inner-icon="person" type="text"></v-text-field>
                <v-text-field counter outlined :disabled="isLoading" name="password" label="Пароль" prepend-inner-icon="lock" v-model="auth.password" type="password"></v-text-field>
                <v-alert dense outlined v-if="message.length > 0" type="error">{{
            message
          }}</v-alert>
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" color="primary" @click="doLogin()" :loading="isLoading">
                <v-icon left>vpn_key</v-icon>Войти
            </v-btn>
        </v-card-actions>
    </v-card>
</v-layout>
</template>

<script>
export default {
    layout: "empty",

    data() {
        return {
            message: "",
            isLoading: false,
            auth: {
                login: "",
                password: ""
            }
        };
    },

    methods: {
        doLogin() {
            this.$store
                .dispatch("auth/login", this.auth).then(result => {
                    console.log("result", result);
                }).catch(e => {
                    this.message = e.message;
                });
        },

        async doLogin2() {
            try {
                const result = await this.$store.dispatch("auth/login", this.auth);
                console.log("result", result);
            } catch (e) {
                this.message = e.message;
            }
        }
    }
};
</script>
