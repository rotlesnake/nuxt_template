<template>
<v-app>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant || $store.state.screenWidth<800" :mini-variant-width="50" :clipped="clipped" :mobile-breakpoint="600" fixed app>

        <v-list class="pa-0 elevation-2" v-if="!clipped" color="toolbar">
            <v-list-item nuxt link to="/" exact>
                <v-list-item-content style="padding:7px;">
                    <v-img :src="require('@/assets/logo.png')" :height="50" :min-width="32" contain></v-img>
                </v-list-item-content>
            </v-list-item>
        </v-list>

        <v-list>
            <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" exact nuxt>
                <v-list-item-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title v-text="item.title" />
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="clipped" fixed app color="toolbar">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-btn icon @click.stop="miniVariant = !miniVariant">
            <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
        </v-btn>
        <v-btn icon @click.stop="clipped = !clipped">
            <v-icon>{{clipped?'mdi-minus':'mdi-view-compact-outline'}}</v-icon>
        </v-btn>
        <v-toolbar-title v-text="$store.state.appTitle" />
        <v-spacer />
        <v-btn icon @click.stop="rightDrawer = !rightDrawer">
            <v-icon>mdi-menu</v-icon>
        </v-btn>
    </v-app-bar>

    <v-main>
        <nuxt />
    </v-main>

    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
        <v-list>
            <v-list-item @click.native="right = !right">
                <v-list-item-action>
                    <v-icon light>
                        mdi-repeat
                    </v-icon>
                </v-list-item-action>
                <v-list-item-title>Switch drawer (click me)</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>

    <v-footer app>
        <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>

    <!-- ДИАЛОГ ОЖИДАНИЯ ЗАГРУЗКИ !-->
    <v-dialog v-model="$store.state.loader.visible" persistent width="300" :elevation="22" dark>
        <v-card class="pa-2">
            <v-card-text>{{$store.state.loader.text}}
                <v-progress-linear indeterminate color="white"></v-progress-linear>
            </v-card-text>
        </v-card>
    </v-dialog>

</v-app>
</template>

<script>
export default {
    data() {
        return {
            clipped: false,
            drawer: true,
            items: [{
                    icon: 'mdi-apps',
                    title: 'Welcome',
                    to: '/'
                },
                {
                    icon: 'mdi-chart-bubble',
                    title: 'Inspire',
                    to: '/inspire'
                },
                {icon: 'mdi-table', title: 'table users', to: '/table/users'},
                {icon: 'mdi-table', title: 'table roles', to: '/table/roles'},
            ],
            miniVariant: false,
            right: true,
            rightDrawer: false
        }
    },

    mounted() {
        this.$store.commit("SET_SCREEN_WIDTH", window.innerWidth);
        window.addEventListener('resize', () => {
            this.$store.commit("SET_SCREEN_WIDTH", window.innerWidth);
        });
    },


}
</script>
