<template>
    <v-container id="page-app-acl">
        <v-card>
            <v-sheet class="pa-4 primary lighten-2">
                <v-text-field
                    v-model="search"
                    label="Поиск..."
                    dark
                    flat
                    solo-inverted
                    hide-details
                    clearable
                    clear-icon="mdi-close-circle-outline"
                ></v-text-field>
            </v-sheet>
            <v-card-text>
                <v-treeview :items="items" :search="search" :open.sync="open" open-on-click>
                    <template v-slot:label="{ item }">
                        <v-icon v-if="item.parent_id == 0">mdi-home</v-icon>
                        <v-icon v-if="item.parent_id > 0 && item.children && item.children.length > 0">mdi-folder</v-icon>
                        <v-icon v-if="(item.parent_id > 0 && !item.children) || (item.children && item.children.length == 0)">mdi-star</v-icon>

                        {{ item.name }}
                        <span v-if="(item.parent_id > 0 && !item.children) || (item.children && item.children.length == 0)">({{ item.slug }})</span>
                    </template>
                </v-treeview>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
export default {
    components: {},
    head() {
        return {
            title: "APP ACL",
        };
    },

    data() {
        return {
            items: [],
            open: [],
            search: null,
        };
    },

    mounted() {
        this.$store.commit("SET_APP_TITLE", "APP ACL");
        this.reload();
    },

    methods: {
        showLoader(display) {
            this.$store.commit("SHOW_LOADER", display);
        },

        reload() {
            this.showLoader(true);
            this.$api("table", "tree", "app_access_list", "get", {})
                .then((response) => {
                    this.showLoader(false);
                    this.items = response.rows;
                })
                .catch(() => {
                    this.showLoader(false);
                });
        },
    }, //methods
};
</script>

<style></style>
