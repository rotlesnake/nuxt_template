<template>
<section class="ma-2 text-center">

	<login-logo />
	<LoginLogotip />

    <v-card max-width="500" class="ma-auto">
        <v-toolbar color="primary" dark flat>
            <v-toolbar-title>{{$t('auth.login')}}</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>

        <v-card-text class="mt-8">
            <v-form @keyup.native.enter="doLogin1()">
                <v-text-field required outlined :disabled="isLoading" name="login" label="Фамилия Имя пользователя" v-model="auth.login" prepend-inner-icon="person" type="text"></v-text-field>
                <v-text-field counter outlined :disabled="isLoading" name="password" label="Пароль" prepend-inner-icon="lock" v-model="auth.password" type="password"></v-text-field>
                <v-alert dense outlined v-if="message.length > 0" type="error">{{message}}</v-alert>
            </v-form>
        </v-card-text>

		<v-divider />
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" color="primary" @click="doLogin1()" :loading="isLoading">
                <v-icon left>vpn_key</v-icon>Войти
            </v-btn>
        </v-card-actions>
    </v-card>

</section>
</template>

<script>

export default {
	meta:{ auth: false },
	layout: "empty",
	
	components:{
		"LoginLogotip":()=>import('@/components/auth/LoginLogo.vue')
	},

    head() {
      return {
        title: "Авторизация"
      };
    },

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
    mounted(){
        if (this.$store.state.auth.token) { 
            this.$store.dispatch("auth/logout");
        }
        //this.$swal.loader();
        //this.$swal.close();
        //this.$swal.toast();
        setTimeout(()=>{ this.$i18n.locale = 'en'; },3500)
        setTimeout(()=>{ this.$i18n.locale = 'ru'; },9000)
    },

    methods: {
        doLogin1() {
            this.$swal.loader("Вход в систему");
            this.$store.dispatch("auth/login", this.auth).then(result => {
                this.$swal.close();
                this.$swal.toast("Добро пожаловать: "+result.user.login);
                this.$router.push("/");
            }).catch(e => {
                this.$swal.close();
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
