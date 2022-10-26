<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" :clipped="clipped" :mobile-breakpoint="1200" width="300" fixed app>
            <v-list class="pa-0 elevation-2" v-if="!clipped" color="toolbar">
                <v-list-item nuxt link to="/" exact class="pa-0">
                    <v-list-item-content style="padding: 4px 0px; min-height: 64px">
                        <v-img :src="require('@/assets/logo.png')" :height="56" :min-width="32" contain></v-img>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <v-treeview
                class="left-menu"
                v-model="menu_item"
                :open="menu_opened"
                :items="menu_items"
                activatable
                item-key="id"
                open-on-click
                @input="menuClick"
            >
                <template v-slot:label="{ item, open }">
                    <v-list-item class="pa-0" :to="item.url" nuxt>
                        <v-icon left>
                            {{ item.icon }}
                        </v-icon>
                        <span class="body-2">{{ item.name }}</span>
                    </v-list-item>
                </template>
            </v-treeview>
        </v-navigation-drawer>

        <v-app-bar :clipped-left="clipped" fixed app :color="$store.state.isOffline ? 'toolbar_offline' : 'toolbar'" :dense="$store.state.screenWidth < 800">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

            <v-divider vertical inset />
            <v-toolbar-title class="ml-3" v-text="$store.state.appTitle" />
            <v-spacer />

            <v-divider class="mx-1" inset vertical></v-divider>
            <v-menu left bottom close-on-click>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                        <v-avatar v-if="$store.state.auth.user.photo && $store.state.auth.user.photo[0]" max-width="48" max-height="48">
                            <img :src="$store.state.auth.user.photo[0].src" />
                        </v-avatar>
                        <v-icon v-else large>mdi-account-cowboy-hat</v-icon>
                    </v-btn>
                </template>

                <v-card>
                    <v-list dense>
                        <v-list-item link to="/auth/profile">
                            <v-list-item-icon>
                                <v-icon>face</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Профиль</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider />
                        <v-list-item @click="changeTheme()">
                            <v-list-item-icon>
                                <v-icon>fa-cloud-sun</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Тема (день/ночь)</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider />

                        <v-list-item v-if="$store.state.auth.user.role_id == 1" link to="/table/users">
                            <v-list-item-icon>
                                <v-icon>mdi-star-circle</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title style="color: #77f">Пользователи системы</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item v-if="$store.state.auth.user.role_id == 1" link to="/table/roles">
                            <v-list-item-icon>
                                <v-icon>mdi-star-circle</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title style="color: #77f">Роли системы</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item v-if="$store.state.auth.user.role_id == 1" link to="/admin/menu">
                            <v-list-item-icon>
                                <v-icon>mdi-star-circle</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title style="color: #77f">Редактор меню</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-divider v-if="$store.state.auth.user.role_id == 1" />
                        <v-list-item v-if="$store.state.auth.user.role_id == 1" link to="/admin/app_acl">
                            <v-list-item-icon>
                                <v-icon>mdi-star-circle</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title style="color: #77f">APP acl</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item v-if="$store.state.auth.user.role_id == 1" link to="/admin/user_acl">
                            <v-list-item-icon>
                                <v-icon>mdi-star-circle</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title style="color: #77f">USER acl</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider v-if="$store.state.auth.user.role_id == 1" />

                        <v-list-item link to="/auth/login">
                            <v-list-item-icon>
                                <v-icon>power_settings_new</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Выход</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu>
        </v-app-bar>

        <v-main>
            <nuxt />
        </v-main>

        <!-- ДИАЛОГ ОЖИДАНИЯ ЗАГРУЗКИ !-->
        <v-dialog v-model="$store.state.loader.visible" persistent width="300" :elevation="22" dark>
            <v-card class="pa-2">
                <v-card-text>
                    {{ $store.state.loader.text }}
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
            appName: process.env.appName,
            clipped: false,
            drawer: true,

            menu_items: [],
            menu_item: [],
            menu_opened: [],
            miniVariant: false,
        };
    },

    watch: {
        "$vuetify.theme.isDark"() {
            this.$forceUpdate();
        },
    },

    computed: {
        subitemBackground() {
            return {
                background: this.$vuetify.theme.isDark ? "#222" : "#fff",
            };
        },
    },

    mounted() {
        this.$store.commit("SET_SCREEN_WIDTH", window.innerWidth);
        window.addEventListener("resize", () => {
            this.$store.commit("SET_SCREEN_WIDTH", window.innerWidth);
        });
        this.reloadMenu();
        this.$root.$on("reload_left_menu", () => {
            this.reloadMenu();
        });
    },

    methods: {
        changeTheme() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            this.$vuetify.theme.isDark = this.$vuetify.theme.dark;
            localStorage.setItem("theme_is_dark", this.$vuetify.theme.isDark);
        },
        reloadMenu() {
            this.$api("auth", "menu", "get", { type: 1 })
                .then((response) => {
                    this.menu_items = response.items;
                })
                .catch(() => {});
        },

        menuClick(e) {
            console.log(e);
        },
    },
};
</script>

<style>
.left-menu .v-treeview-node__root {
    padding: 0;
}
.left-menu button {
    width: 18px;
    height: 18px;
}

.left-menu .v-treeview-node__level {
    width: 15px;
}
.left-menu .v-treeview-node__content {
    margin-left: 2px;
}
</style>
