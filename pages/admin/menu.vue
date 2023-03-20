<template>
    <v-container id="menu-tree">
        <v-card class="mx-auto elevation-8">
            <v-card-title>
                <v-btn @click="openEditDialog({ id: 0 }, 'add')"
                    >Добавить пункт</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn icon @click="reloadMenu()">
                    <v-icon>cached</v-icon>
                </v-btn>
            </v-card-title>

            <v-divider></v-divider>
            <v-card-text>
                <el-tree
                    :data="menu_items"
                    node-key="id"
                    empty-text="Меню нет"
                    default-expand-all
                    draggable
                    @node-drop="saveTreeMenu"
                    :allow-drop="allowDrop"
                    :allow-drag="allowDrag"
                >
                    <template #default="{ node, data }">
                        <span class="custom-tree-node">
                            <div @dblclick="openEditDialog(data, 'edit')">
                                <i :class="'mdi ' + data.icon"></i>
                                <span class="el-tree-node__label">{{
                                    data.name
                                }}</span>
                            </div>
                            <div class="mb-1">
                                <el-button
                                    icon="el-icon-plus"
                                    circle
                                    size="mini"
                                    type="success"
                                    @click.stop="openEditDialog(data, 'add')"
                                ></el-button>
                                <el-button
                                    icon="el-icon-edit"
                                    circle
                                    size="mini"
                                    type="primary"
                                    @click.stop="openEditDialog(data, 'edit')"
                                ></el-button>
                                <el-button
                                    icon="el-icon-delete"
                                    circle
                                    size="mini"
                                    type="danger"
                                    @click.stop="openEditDialog(data, 'delete')"
                                ></el-button>
                            </div>
                        </span>
                    </template>
                </el-tree>
            </v-card-text>
        </v-card>

        <!-- Диалог изменения пункта !-->
        <v-dialog
            v-model="editDialog.active"
            scrollable
            persistent
            max-width="990px"
        >
            <v-card>
                <v-toolbar dense color="primary" elevation="0">
                    <v-toolbar-title class="white--text"
                        >Элемент дерева</v-toolbar-title
                    >
                    <v-spacer></v-spacer>
                    <v-btn icon dark @click="editDialog.active = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <div class="mt-4">
                        <v-text-field
                            type="text"
                            label="Наименование пункта меню"
                            v-model="editDialog.item.name"
                            outlined
                        />
                        <v-text-field
                            type="text"
                            label="Иконка"
                            placeholder="mdi-home"
                            v-model="editDialog.item.icon"
                            outlined
                        />
                        <v-text-field
                            type="text"
                            label="URL ссылка"
                            v-model="editDialog.item.url"
                            outlined
                        />
                        <form-field
                            :options="columns.roles"
                            name="roles"
                            v-model="editDialog.item.roles"
                            :row="editDialog.item"
                        />
                        <form-field
                            :options="columns.app_access"
                            name="app_access"
                            v-model="editDialog.item.app_access"
                            :row="editDialog.item"
                        />
                    </div>
                    <div class="mt-4 d-flex jc-center">
                        <v-btn
                            @click.stop="saveItem()"
                            v-if="editDialog.action == 'delete'"
                            color="red"
                            >Удалить</v-btn
                        >
                        <v-btn @click.stop="saveItem()" v-else color="primary"
                            >Сохранить</v-btn
                        >
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- ------------------------ !-->
    </v-container>
</template>

<script>
export default {
    components: {
        "table-editor": () => import("mapdap/table/Table"),
        "form-field": () => import("mapdap/form/FormField.vue"),
    },
    head() {
        return {
            title: "Меню системы",
        };
    },

    data() {
        return {
            menu_type: 1,
            menu_items: [],
            columns: [],
            editDialog: { active: false, action: "", item: {} },
        };
    },
    mounted() {
        this.$store.commit("SET_APP_TITLE", "Меню системы");
        this.reloadMenu();
    },
    computed: {},

    methods: {
        showLoader(display) {
            this.$store.commit("SHOW_LOADER", display);
        },

        reloadMenu() {
            this.showLoader(true);
            this.$api("auth", "menu", "get", { type: this.menu_type })
                .then((response) => {
                    this.showLoader(false);
                    this.menu_items = response.items;
                    this.columns = response.columns;
                    this.columns.roles.outlined = true;
                    this.columns.roles.name = "roles";
                    this.columns.roles.dense = true;
                    this.columns.app_access.outlined = true;
                    this.columns.app_access.name = "app_access";
                    this.columns.app_access.dense = true;
                })
                .catch(() => {
                    this.showLoader(false);
                });
        },

        allowDrop(draggingNode, dropNode, type) {
            return true;
        },
        allowDrag(draggingNode) {
            return true;
        },

        findMaxId() {
            let maxId = 0;
            const cb = (e) => {
                if (e.id > maxId) maxId = e.id;
                if (e.children) e.children.forEach(cb);
            };
            this.menu_items.forEach(cb);
            return maxId + 1;
        },

        openEditDialog(item, action) {
            this.editDialog.action = action;
            this.editDialog.item = JSON.parse(JSON.stringify(item));
            if (this.editDialog.action == "add") {
                this.editDialog.item.server_id = 0;
                this.editDialog.item.children = [];
                this.editDialog.item.name = "";
                this.editDialog.item.roles = [];
                this.editDialog.item.url = "";
                this.editDialog.item.icon = "";
                this.editDialog.item.app_access = [];
            }
            this.editDialog.active = true;
        },

        saveItem() {
            this.editDialog.active = false;
            let item = this.editDialog.item;
            if (!item.roles.find((e) => e == 1)) item.roles.push(1);

            if (this.editDialog.action == "add") {
                if (this.editDialog.item.id == 0) {
                    item.id = this.findMaxId();
                    this.menu_items.push(item);
                } else {
                    const cb = (e, i, o) => {
                        if (e.id == item.id) {
                            if (!e.children) e.children = [];
                            item.id = this.findMaxId();
                            e.children.push(item);
                            return e;
                        }
                        if (e.children) e.children = e.children.map(cb);
                        return e;
                    };
                    this.menu_items = this.menu_items.map(cb);
                }
            }

            if (this.editDialog.action == "edit") {
                const cb = (e) => {
                    if (e.id == item.id) {
                        e = item;
                        return e;
                    }
                    if (e.children) e.children = e.children.map(cb);
                    return e;
                };
                this.menu_items = this.menu_items.map(cb);
            }

            if (this.editDialog.action == "delete") {
                const cb = (e) => {
                    if (e.id == item.id) return false;
                    if (e.children) e.children = e.children.filter(cb);
                    return true;
                };
                this.menu_items = this.menu_items.filter(cb);
                if (item.server_id > 0)
                    this.$api("auth", "menu", "delete", { id: item.server_id });
            }
            this.saveTreeMenu();
        },

        saveTreeMenu() {
            this.$api("auth", "menu", "set", {
                type: this.menu_type,
                menu: this.menu_items,
            })
                .then((response) => {
                    this.menu_items = response.items;
                    this.$root.$emit("reload_left_menu");
                })
                .catch(() => {});
        },
    }, //methods
};
</script>

<style>
#menu-tree .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 4px;
    border-bottom: 1px dashed #ccc;
    font-size: 18px;
}

#menu-tree .el-tree-node__label {
    padding: 0 8px;
    font-size: 18px;
}

#menu-tree .el-tree-node__content {
    height: 38px;
}
</style>
