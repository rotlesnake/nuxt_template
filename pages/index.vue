<template>
<v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
        <div class="text-center">
            <logo />
            <vuetify-logo />
        </div>
        <v-card>
            <v-card-title class="headline">Welcome to the Vuetify + Nuxt.js template</v-card-title>
            <v-card-text>
                <p>
                    Vuetify is a progressive Material Design component framework for
                    Vue.js. It was designed to empower developers to create amazing
                    applications.
                </p>
                <p>
                    For more information on Vuetify, check out the
                    <a href="https://vuetifyjs.com" target="_blank" rel="noopener noreferrer">documentation</a>.
                </p>
                <p>
                    If you have questions, please join the official
                    <a href="https://chat.vuetifyjs.com/" target="_blank" rel="noopener noreferrer" title="chat">discord</a>.
                </p>
                <p>
                    Find a bug? Report it on the github
                    <a href="https://github.com/vuetifyjs/vuetify/issues" target="_blank" rel="noopener noreferrer" title="contribute">issue board</a>.
                </p>
                <p>
                    Thank you for developing with Vuetify and I look forward to bringing
                    more exciting features in the future.
                </p>
                <div class="text-xs-right">
                    <em>
                        <small>&mdash; John Leider</small>
                    </em>
                </div>
                <hr class="my-3" />
                <a href="https://nuxtjs.org/" target="_blank" rel="noopener noreferrer">Nuxt Documentation</a>
                <br />
                <a href="https://github.com/nuxt/nuxt.js" target="_blank" rel="noopener noreferrer">Nuxt GitHub</a>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" nuxt to="/inspire">go to page</v-btn>
                <v-btn color="primary" @click="$store.commit('SET_APP_TITLE', 'asd')">set title</v-btn>
                <v-btn color="primary" @click="showLoader()">show loader</v-btn>
            </v-card-actions>
        </v-card>
    </v-flex>
</v-layout>
</template>

<script>
import Logo from "~/components/Logo.vue";
import VuetifyLogo from "~/components/VuetifyLogo.vue";

export default {
    components: {
        Logo,
        VuetifyLogo,
    },
    head() {
      return {
        title: "Home page"
      };
    },

    data() {
        return {

        };
    },
    mounted(){
        this.$store.commit("SET_APP_TITLE", "Главное меню");
    },  
    
    methods: {
        async showLoader(){
            const users = this.$table('user_posts');
            //let user = await users.modelInfo();
            let user = users.new();
            user.login = "1234";
            user.password = "1234";
            await user.save();
//            let user = await users.find(3);
            //await user.delete();
            return;

            this.$store.commit("SHOW_LOADER", true);
            setTimeout(()=>{
                this.$store.commit("SHOW_LOADER", false);
            },  3500);
        },
    },
};
</script>
