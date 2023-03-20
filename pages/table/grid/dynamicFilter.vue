<template>
    <div>
        <div class="d-flex">
            <v-select
                label="Фильтр"
                v-model="sel_filter"
                :items="sel_filter_items"
                dense
                outlined
                hide-details
                class="mt-1"
                @change="onSelectFliter()"
                item-text="name"
                item-value="id"
            >
                <template #item="{ item }">
                    <div class="d-flex justify-space-between" style="width: 100%">
                        <div>{{ item.name }}</div>
                        <v-spacer />
                        <v-btn fab x-small color="green" @click.stop="editFilter(item)"><v-icon>edit</v-icon></v-btn>
                        <v-btn fab x-small color="red" @click.stop="deleteFilter(item)"><v-icon>delete</v-icon></v-btn>
                    </div>
                </template>
            </v-select>
            <v-btn fab small class="ma-1" color="primary" @click="showDialog()"><v-icon>mdi-filter</v-icon></v-btn>
        </div>

        <v-dialog v-model="dialogFilter" scrollable persistent max-width="1190px">
            <v-card v-if="dialogFilter && tableInfo" class="dynamic_filter">
                <v-card-title class="pa-0">
                    <v-toolbar dense elevation="0" color="primary" dark>
                        <v-toolbar-title class="white--text">{{ dialog_title }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="dialogFilter = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-toolbar>
                </v-card-title>

                <v-card-text class="pa-2">
                    <v-tabs v-model="tab" centered icons-and-text>
                        <v-tabs-slider color="pink"></v-tabs-slider>
                        <v-tab href="#tab-1">
                            Фильтр
                            <v-icon>mdi-phone</v-icon>
                        </v-tab>

                        <v-tab href="#tab-2">
                            Колонки
                            <v-icon>mdi-heart</v-icon>
                        </v-tab>
                    </v-tabs>

                    <v-text-field v-model="filter_name" v-if="filter_name" label="Наименование фильтра" outlined />

                    <v-tabs-items v-model="tab">
                        <v-tab-item value="tab-1" class="pt-2">
                            <div v-for="(flt, i) in tmp_filter" :key="i" class="d-flex mb-1">
                                <v-select
                                    label="поле"
                                    v-model="tmp_filter[i].field"
                                    dense
                                    outlined
                                    hide-details
                                    :items="Object.values(tableInfo.columns)"
                                    item-value="name"
                                    item-text="label"
                                />
                                <v-select
                                    label="сравнение"
                                    class="mx-2"
                                    v-model="tmp_filter[i].type"
                                    dense
                                    outlined
                                    hide-details
                                    :items="['=', '>', '<', 'like']"
                                    style="max-width: 200px"
                                />

                                <mdp-form-field
                                    v-if="tmp_filter[i].field"
                                    :options="{ ...tableInfo.columns[tmp_filter[i].field], dense: true, outlined: true, hideDetails: true }"
                                    name="value"
                                    v-model="tmp_filter[i].value"
                                    :row="tmp_filter[i]"
                                    style="max-width: 40%"
                                />

                                <v-btn fab x-small class="ma-1" color="red" @click="tmp_filter.splice(i, 1)"><v-icon>delete</v-icon></v-btn>
                            </div>

                            <v-divider />
                            <div class="d-flex justify-end">
                                <v-btn fab small class="ma-1" color="primary" @click="tmp_filter.push({ type: '=' })"><v-icon>add</v-icon></v-btn>
                            </div>
                        </v-tab-item>
                        <v-tab-item value="tab-2">
                            <Container @drop="onDrop" drag-handle-selector=".drag-handle">
                                <Draggable v-for="col in localColumns" :key="col.name" class="d-flex flex-wrap my-1 pa-1" style="background: #eee">
                                    <v-icon class="drag-handle">mdi-menu</v-icon>
                                    <v-checkbox v-model="col.hidden" dense hide-details class="mt-n1" :false-value="1" :true-value="0" />
                                    <div>
                                        {{ col.label }}
                                    </div>
                                </Draggable>
                            </Container>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card-text>

                <v-divider />
                <v-card-actions>
                    <v-btn color="red" @click="dialogFilter = false">Отмена</v-btn>
                    <v-spacer />
                    <v-btn color="green" v-if="tmp_filter.length > 0" @click="saveTmpFilter()">Сохранить</v-btn>
                    <v-spacer />
                    <v-btn color="green" @click="applyTmpFilter()">Применить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { Container, Draggable } from "vue-smooth-dnd";
export default {
    components: {
        Container,
        Draggable,
        "mdp-form-field": () => import("mapdap/form/FormField.vue"),
    },
    props: {
        tableInfo: { type: Object, default: null },
        filter: { type: Array, default: () => [] },
        columns: { type: Array, default: () => [] },
    },
    data() {
        return {
            tab: 0,
            dialog_title: "Настройки фильтра",
            sel_filter: [],
            sel_filter_items: [],
            tmp_filter: [],
            filter_name: "",
            dialogFilter: false,
            localColumns: [],
        };
    },
    computed: {},
    watch: {
        tableInfo() {
            this.loadFilters();
        },
    },

    mounted() {
        this.loadFilters();
    },

    methods: {
        loadFilters() {
            this.localColumns = this.columns.map((e) => {
                e.hidden = e.hidden ? 1 : 0;
                return e;
            });
            const filter = [{ field: "tablename", oper: "=", value: this.tableInfo.table }];
            this.$api("table", "common_table_filters", "get", { mini: true, filter }).then((data) => {
                this.sel_filter_items = data.rows;
            });
        },

        showDialog() {
            this.dialogFilter = true;
            this.dialog_title = "Новый фильтр";
        },

        saveTmpFilter() {
            if (this.tmp_filter.length == 0) return;
            if (!this.filter_name) {
                this.filter_name = prompt("Название фильтра", this.filter_name);
            }
            if (!this.filter_name) return;

            const finded = this.sel_filter_items.find((e) => e.name == this.filter_name);
            if (finded) {
                this.sel_filter = finded.id;
                finded.filter = JSON.parse(JSON.stringify(this.tmp_filter));
                finded.columns = JSON.parse(JSON.stringify(this.localColumns));
                this.$api("table", "common_table_filters", "edit", finded.id, finded);
            } else {
                const newFilter = {
                    tablename: this.tableInfo.table,
                    name: this.filter_name,
                    status: 2,
                    filter: JSON.parse(JSON.stringify(this.tmp_filter)),
                    columns: JSON.parse(JSON.stringify(this.localColumns)),
                };
                this.$api("table", "common_table_filters", "add", newFilter).then((data) => {
                    this.sel_filter_items.push(data.rows[0]);
                    this.sel_filter = data.rows[0].id;
                    this.dialogFilter = false;
                    this.setFilter(newFilter.filter);
                });
            }
        },
        applyTmpFilter() {
            this.dialogFilter = false;
            const filter = JSON.parse(JSON.stringify(this.tmp_filter));
            this.setFilter(filter);
            this.setColumns(this.localColumns);
        },

        editFilter(data) {
            //console.log(data);
            this.tmp_filter = JSON.parse(JSON.stringify(data.filter));
            this.filter_name = data.name;
            this.dialog_title = "Редактирование фильтра: " + data.name;
            this.dialogFilter = true;
        },
        deleteFilter(data) {
            this.sel_filter_items = this.sel_filter_items.filter((e) => e.id != data.id);
            this.$api("table", "common_table_filters", "delete", data.id, {});
        },

        onSelectFliter() {
            this.dialogFilter = false;
            const data = this.sel_filter_items.find((e) => e.id == this.sel_filter);
            if (!data) return;

            this.tmp_filter = JSON.parse(JSON.stringify(data.filter));
            this.localColumns = JSON.parse(JSON.stringify(data.columns));
            this.setFilter(this.tmp_filter);
            this.setColumns(this.localColumns);
        },

        setFilter(filter) {
            this.$emit("onFilter", filter);
        },
        setColumns(columns) {
            this.$emit("onColumns", columns);
        },

        onDrop(dropResult) {
            this.localColumns = this.applyDrag(this.localColumns, dropResult);
        },
        applyDrag(arr, dragResult) {
            const { removedIndex, addedIndex, payload } = dragResult;
            if (removedIndex === null && addedIndex === null) return arr;

            const result = [...arr];
            let itemToAdd = payload;

            if (removedIndex !== null) {
                itemToAdd = result.splice(removedIndex, 1)[0];
            }

            if (addedIndex !== null) {
                result.splice(addedIndex, 0, itemToAdd);
            }

            return result;
        },
    },
};
</script>

<style>
.dynamic_filter .v-tab {
    border: 1px solid #999;
    border-radius: 8px 8px 0 0;
    margin: 0 4px;
}
</style>
