<template>
    <section class="fancy-table" style="width: 100%; height: 100%">
        <fancy-grid-vue ref="grid" :config="gridConfig" v-if="tableName && gridConfig.visible" style="padding: 5px 0 0 5px"></fancy-grid-vue>
        <img v-else src="https://nabels.ru/upload/preload.gif" />
    </section>
</template>

<script>
import FancyGridVue from "fancy-grid-vue";
import Fancy from "fancygrid";
import "fancygrid/client/modules/paging.min";
import "fancygrid/client/modules/server-data.min";
import "fancygrid/client/modules/sort.min";
import "fancygrid/client/modules/grouping.min";
import "fancygrid/client/modules/filter.min";
import "fancygrid/client/modules/dom.min";
import "fancygrid/client/modules/menu.min";
import "fancygrid/client/modules/form.min";
import "fancygrid/client/modules/grid.min";
import "fancygrid/client/modules/i18n/ru";
import "fancygrid/client/fancy.min.css";

export default {
    layout: "admin",
    components: {
        FancyGridVue,
    },
    head() {
        return {
            title: "Редактор таблиц",
        };
    },

    data() {
        return {
            tableName: null,
            columns: [],
            rows: [],

            gridConfig: {
                visible: false,
                title: "Vue with FancyGrid",
                theme: "gray",
                width: 1200,
                height: 500,
                data: [],
                resizable: true,
                defaults: {
                    type: "string",
                    width: 100,
                    sortable: true,
                    editable: true,
                    resizable: true,
                    filter: {
                        header: true,
                        emptyText: "Поиск",
                    },
                },
                selModel: "rows",
                trackOver: true,
                columns: [],
            },
        };
    },
    mounted() {
        this.$store.commit("SET_APP_TITLE", "Редактор таблиц");
        this.tableName = this.$route.params.name;
        this.refresh();
    },
    computed: {},

    methods: {
        showLoader(display) {
            this.$store.commit("SHOW_LOADER", display);
        },
        async refresh() {
            this.showLoader(true);
            this.$api("table", this.tableName, "get").then(async (data) => {
                this.showLoader(false);
                this.columns = data.info.columns;
                this.rows = data.rows;
                this.gridConfig.title = data.info.name;
                this.gridConfig.data = data.rows;
                this.gridConfig.combos = {};
                this.gridConfig.columns = await Promise.all(
                    Object.keys(this.columns).map(async (fldName) => {
                        let editable = this.columns[fldName].protected ? false : true;
                        let type = "string";
                        let width = this.columns[fldName].width || 150;
                        let format = null;
                        let hidden = this.columns[fldName].hidden || false;
                        let multiSelect = this.columns[fldName].multiple || false;
                        let render = null;
                        let addonSettings = {};

                        if (this.columns[fldName].type == "date" || this.columns[fldName].type == "dateTime") {
                            type = "date";
                            width = 120;
                            format = { read: "d.m.Y", write: "d.m.Y", edit: "d.m.Y" };
                        }
                        if (this.columns[fldName].type == "images") {
                            type = "image";
                        }
                        //if (this.columns[fldName].type == "checkBox") type = "checkbox";
                        if (this.columns[fldName].type == "integer" || this.columns[fldName].type == "float" || this.columns[fldName].type == "decimal") type = "number";

                        if (this.columns[fldName].type == "select") {
                            type = "combo";
                            this.gridConfig.combos[fldName] = {};
                            for (let k in this.columns[fldName].items) {
                                this.gridConfig.combos[fldName][String(k)] = this.columns[fldName].items[k];
                            }
                            render = (obj) => {
                                obj.value = this.gridConfig.combos[fldName][String(obj.value)];
                                return obj;
                            };
                            //console.log(items);
                        }

                        if (this.columns[fldName].type == "linkTable") {
                            type = "combo";
                            this.gridConfig.combos[fldName] = [];
                            let responseData = await this.$api("table", this.columns[fldName].table, "get", { fast: true, mimi: true });
                            this.gridConfig.combos[fldName] = {};
                            responseData.rows.forEach((respRow) => {
                                this.gridConfig.combos[fldName][respRow.id] = respRow[this.columns[fldName].field];
                            });
                            render = (obj) => {
                                //console.log(obj);
                                obj.value = this.gridConfig.combos[fldName][String(obj.value)];
                                return obj;
                            };
                            addonSettings.data = responseData.rows;
                            addonSettings.displayKey = this.columns[fldName].field;
                            addonSettings.valueKey = "id";
                        }

                        return { type, index: fldName, title: this.columns[fldName].label, width, editable, format, hidden, multiSelect, render, ...addonSettings };
                    })
                );
                //console.log(this.$el, this.$el.getBoundingClientRect());
                this.gridConfig.width = this.$el.getBoundingClientRect().width - 10;
                this.gridConfig.height = this.$el.getBoundingClientRect().height - 10;
                this.gridConfig.visible = true;
                //console.log(this.gridConfig);
            });
        },
    }, //methods
};
</script>

<style></style>
