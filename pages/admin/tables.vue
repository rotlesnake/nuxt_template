<template>
    <section>
        <div class="pa-5">
            <v-btn class="mx-1" to="/admin">Главная</v-btn>
            <v-btn class="mx-1" to="/admin/modules">Модули</v-btn>
        </div>
        <div>
            <v-data-table
                dense
                multi-sort
                item-key="id"
                single-select
                v-model="selected"
                @click:row="onRowClick"
                :headers="columns"
                :items="rows"
                :loading="isLoading"
                loading-text="Загрузка..."
                class="elevation-4"
                :items-per-page="1000"
                :server-items-length="-1"
                group-by="module"
                :footer-props="{ 'items-per-page-options': [100, 500, 1000], 'show-current-page': true }"
                hide-default-footer
                @dblclick:row="dblClickRow"
            >
                <template v-slot:group.header="{ group, toggle, isOpen }">
                    <td colspan="9">
                        <v-btn icon @click.stop="toggle()"
                            ><v-icon>{{ isOpen ? "keyboard_arrow_down" : "keyboard_arrow_right" }}</v-icon></v-btn
                        >
                        {{ group }}
                        <div class="d-inline ml-4 caption grey--text">{{ modulesInfo[group] }}</div>
                    </td>
                </template>
                <template v-slot:group.summary>
                    <td colspan="9" style="height: 2px"></td>
                </template>

                <template v-slot:footer>
                    <v-divider />
                    <div class="py-3">
                        <v-tooltip top color="green">
                            <template v-slot:activator="{ on }">
                                <v-btn class="ml-4 mr-4" color="primary" fab small v-on="on" @click="showDialogAddModel()">
                                    <v-icon dark>add</v-icon>
                                </v-btn>
                            </template>
                            <span>Добавить модель</span>
                        </v-tooltip>

                        <v-tooltip top color="primary">
                            <template v-slot:activator="{ on }">
                                <v-btn class="mr-4" color="primary" fab small v-on="on" @click="showDialogEditModel()" :disabled="selected.length == 0">
                                    <v-icon dark>edit</v-icon>
                                </v-btn>
                            </template>
                            <span>Изменить модель</span>
                        </v-tooltip>

                        <v-tooltip top color="red">
                            <template v-slot:activator="{ on }">
                                <v-btn class="mr-4" color="red" fab small v-on="on" @click="showDialogDeleteModel()" :disabled="selected.length == 0">
                                    <v-icon dark>delete</v-icon>
                                </v-btn>
                            </template>
                            <span>Удалить модель</span>
                        </v-tooltip>
                    </div>
                </template>
            </v-data-table>

            <!-- dialog !-->
            <component
                :is="dialog"
                v-model="modules"
                :module="editModule"
                :model="editModel"
                :table="editTable"
                @close="
                    dialog = null;
                    reloadTable();
                "
            ></component>
        </div>
        <v-dialog v-model="show_table_info" v-if="selected[0]" width="unset" scrollable>
            <v-card>
                <v-toolbar dense>
                    {{ selected[0].module + "/" + selected[0].model + " [" + selected[0].table + "] - " + selected[0].name }} <v-spacer /><v-btn
                        color="red"
                        @click="show_table_info = false"
                        icon
                        ><v-icon>close</v-icon></v-btn
                    ></v-toolbar
                >
                <v-card-text style="margin-top: 20px">
                    <table class="if-table">
                        <tr>
                            <th>Имя</th>
                            <th>Тип</th>
                            <th>Описание</th>
                            <th>hidden</th>
                            <th>protected</th>
                        </tr>
                        <tr v-for="(row, i) in model_info.columns" :key="i">
                            <td>{{ row.name }}</td>
                            <td>{{ row.type }}</td>
                            <td>{{ row.label }}</td>
                            <td>{{ row.hidden }}</td>
                            <td>{{ row.protected }}</td>
                        </tr>
                    </table>
                    <v-expansion-panels multiple>
                        <v-expansion-panel>
                            <v-expansion-panel-header>Необработанные данные</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <pre>{{ model_info.columns }}</pre>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                    <v-spacer />
                </v-card-actions>
            </v-card>
        </v-dialog>
    </section>
</template>

<script>
export default {
    data() {
        return {
            show_table_info: false,
            isLoading: false,
            columns: [],
            rows: [],
            selected: [],

            dialog: null,
            modules: [],
            modulesInfo: {},
            editModule: "",
            editModel: "",
            editTable: "",
            model_info: {},
        };
    },
    mounted() {
        this.reloadTable();
    },

    methods: {
        loader(status) {
            this.$store.commit("SHOW_LOADER", status);
        },

        reloadTable() {
            this.isLoading = true;
            console.log("admin/database/tables");
            this.$axios
                .post("admin/database/tables", {})
                .then((response) => {
                    //console.log("admin/database/tables", response);
                    this.isLoading = false;
                    this.columns = Object.values(response.data.columns);
                    this.rows = response.data.rows.map((e, i) => {
                        e.id = i;
                        return e;
                    });

                    this.modules = [];
                    this.modulesInfo = {};
                    response.data.modules.forEach((e) => {
                        this.modules.push(e.name);
                        this.modulesInfo[e.name] = e.desc;
                    });
                })
                .catch((error) => {
                    this.isLoading = false;
                });
        }, //reloadTable

        onRowClick(row, isMultiple) {
            const index = this.rows.indexOf(row);
            row._selected_index = index;
            this.selected = [];
            this.selected.push(row);

            this.editModule = this.selected[0].module;
            this.editModel = this.selected[0].model;
            this.editTable = this.selected[0].table;
        },
        dblClickRow(evt, row) {
            this.isLoading = true;
            console.log(evt, row);
            this.$axios
                .post("table/" + row.item.table + "/get/info", {})
                .then((response) => {
                    console.log("admin/database/tables", response);
                    this.model_info = response.data.info;
                    this.show_table_info = true;
                    this.isLoading = false;
                })
                .catch((error) => {
                    this.isLoading = false;
                });
        },

        showDialogAddModel() {
            this.dialog = dialog_add_table;
        },
        showDialogEditModel() {
            this.dialog = dialog_edit_model;
        },
        showDialogDeleteModel() {
            this.dialog = dialog_delete_model;
        },
    }, //methods
};
</script>
