<template>
    <v-container id="page-user-acl" v-if="$store.state.auth.user.role_id == 1">
        <table-editor ref="table" tableName="users" @dblSelect="openDialogUserAcl()">
            <template #footer>
                <v-btn color="green" class="mx-2" small @click="openDialogUserAcl()"> <v-icon left dark>add</v-icon> Назначить функционал </v-btn>
            </template>
        </table-editor>

        <v-dialog v-model="dialog" scrollable persistent max-width="990px">
            <v-card>
                <v-card-title class="pa-0">
                    <v-toolbar dense color="primary" elevation="0" dark>
                        <v-toolbar-title class="white--text mr-4">Назначенный функционал</v-toolbar-title>
                        <v-text-field v-model="search" label="Поиск..." dark dense flat solo-inverted hide-details clearable clear-icon="mdi-close-circle-outline"></v-text-field>
                        <v-spacer></v-spacer>
                        <div class="mt-1">
                            <v-checkbox label="Исключить модели" v-model="exclude_tables" @click="doFilter()"></v-checkbox>
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn icon dark @click="dialog = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-toolbar>
                </v-card-title>

                <v-card-text>
                    <v-treeview v-model="selectedAcl" :items="curAclItems" :search="search" :open.sync="open" open-on-click dense selectable>
                        <template v-slot:label="{ item }">
                            <v-icon v-if="item.parent_id == 0">mdi-home</v-icon>
                            <v-icon v-if="item.parent_id > 0 && item.children && item.children.length > 0">mdi-folder</v-icon>
                            <v-icon v-if="(item.parent_id > 0 && !item.children) || (item.children && item.children.length == 0)">mdi-star</v-icon>

                            {{ item.name }}
                            <span v-if="(item.parent_id > 0 && !item.children) || (item.children && item.children.length == 0)">({{ item.slug }})</span>
                        </template>
                    </v-treeview>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                    <v-btn color="red" @click="dialog = false">Закрыть</v-btn>
                    <v-spacer />
                    <v-btn color="green" @click="saveAcl">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
export default {
    components: {
        "table-editor": () => import("mapdap/table/Table"),
    },
    head() {
        return {
            title: "USER ACL",
        };
    },

    data() {
        return {
            appAclItems: [],
            curAclItems: [],
            open: [],
            selectedAcl: [],
            search: null,
            dialog: false,
            exclude_tables: false,
        };
    },

    mounted() {
        this.$store.commit("SET_APP_TITLE", "USER ACL");
        if (this.$store.state.auth.user.role_id != 1) return;

        setTimeout(() => {
            this.loadAppAcl();
        }, 3000);
    },

    methods: {
        showLoader(display) {
            this.$store.commit("SHOW_LOADER", display);
        },

        openDialogUserAcl() {
            if (this.$refs.table.selected.length == 0) return;
            this.dialog = true;
            this.selectedAcl = [];
            //console.log(this.$refs.table.selected);
            this.showLoader(true);
            this.$api("table", "user_access", "get", { mini: true, filter: [{ field: "user_id", oper: "=", value: this.$refs.table.selected[0].id }] })
                .then((response) => {
                    this.showLoader(false);
                    this.selectedAcl = response.rows.map((e) => e.app_access_id);
                })
                .catch(() => {
                    this.showLoader(false);
                });
        },

        loadAppAcl() {
            this.$api("table", "tree", "app_access_list", "get", {})
                .then((response) => {
                    this.appAclItems = response.rows;
                    this.curAclItems = JSON.parse(JSON.stringify(this.appAclItems));
                })
                .catch(() => {
                    this.showLoader(false);
                });
        },

        doFilter() {
            this.curAclItems = JSON.parse(JSON.stringify(this.appAclItems));
            if (this.exclude_tables) {
                const filterFunc = (e) => {
                    let rez = true;
                    if (e.name.substr(0, 6) == "Модель") rez = false;
                    if (e.children) e.children = e.children.filter(filterFunc);
                    return rez;
                };
                this.curAclItems = this.curAclItems.filter(filterFunc);
                this.curAclItems = this.curAclItems.filter((e) => e.name.substr(0, 6) == "Модуль" && e.children && e.children.length > 0);
            }
        },

        saveAcl() {
            this.showLoader(true);
            this.$api("auth", "acl", "update", { user_id: this.$refs.table.selected[0].id, acl: this.selectedAcl })
                .then((response) => {
                    this.showLoader(false);
                    this.dialog = false;
                })
                .catch(() => {
                    this.showLoader(false);
                });
        },
    }, //methods
};
</script>

<style></style>
