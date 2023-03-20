<template>
    <v-menu left bottom close-on-click>
        <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
                <v-avatar v-if="$store.state.auth.user.photo && $store.state.auth.user.photo.length" width="40" height="40">
                    <img :src="$store.state.auth.user.photo[0].src" />
                </v-avatar>
                <v-icon v-else>face</v-icon>
            </v-btn>
        </template>

        <v-card>
            <v-list dense>
                <template v-for="(item, i) in myMenu">
                    <v-divider v-if="item.divider" :key="i" />
                    <v-list-item v-else-if="item.to" link :to="item.to" :key="i">
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.name }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-else link @click="call(item.function)" :key="i">
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.name }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>
            </v-list>
        </v-card>
    </v-menu>
</template>

<script>
export default {
    props: { layout: { type: String, default: "" }, type: { type: Number, default: 0 } },
    data() {
        return {
            menu_data: [
                { name: "Главное меню", icon: "home", to: "/" },
                { divider: true },
                { name: "Профиль", icon: "face", to: "/auth/profile" },
                { divider: true },
                { name: "Тема (день/ночь)", icon: "fa-cloud-sun", function: "changeTheme" },
                { divider: true },
                { name: "Пользователи системы", icon: "people_alt", to: `/table/users?layout=${this.layout}`, admin: true },
                { name: "Роли системы", icon: "manage_accounts", to: `/table/roles?layout=${this.layout}`, admin: true },
                { name: "Права доступа", icon: "mdi-account-details-outline", to: `/admin/user_acl?layout=${this.layout}`, admin: true },
                { name: "Редактор меню", icon: "account_tree", to: `/admin/menu?type=${this.type}&layout=${this.layout}`, admin: true },
                { divider: true, admin: true },
                { name: "Модули", icon: "mdi-view-module", to: "/admin/modules", admin: true },
                { name: "База данных", icon: "mdi-database", to: "/admin/tables", admin: true },
                { divider: true, admin: true },
                { name: "Зайти под другим", icon: "person_add", to: "/auth/login" },
                { name: "Выход", icon: "logout", to: "/auth/logout" },
            ],
        };
    },
    computed: {
        myMenu() {
            return this.menu_data.filter((e) => this.$store.state.auth.user.role_id == 1 || !e.admin);
        },
    },
    methods: {
        changeTheme() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            this.$vuetify.theme.isDark = this.$vuetify.theme.dark;
            localStorage.setItem("theme_is_dark", this.$vuetify.theme.isDark);
        },
        call(func) {
            this[func].apply(this, {});
        },
    },
};
</script>
