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
                    editable: false,
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
                        let editable = false;
                        let type = "string";
                        let width = this.columns[fldName].width || 150;
                        let format = null;
                        let hidden = this.columns[fldName].hidden || false;
                        let cls = "";

                        if (this.columns[fldName].type == "images") {
                            cls = "image-cell";
                            width = 80;
                        }

                        let render = (obj) => {
                            if (this.columns[fldName].type == "date" || this.columns[fldName].type == "dateTime") {
                                obj.value = obj.data[fldName + "_text"];
                            }
                            if (this.columns[fldName].type == "select") {
                                obj.value = this.columns[fldName].items[obj.value];
                            }
                            if (this.columns[fldName].type == "linkTable") {
                                obj.value = obj.data[fldName + "_text"];
                            }
                            if (this.columns[fldName].type == "images") {
                                let itm = obj.data[fldName] ? obj.data[fldName][0] : null;
                                obj.value = itm ? itm.src : "";
                                if (obj.value) obj.value = "<img src='" + obj.value + "' style='height:31px;'>";
                            }
                            return obj;
                        };
                        return { type, index: fldName, title: this.columns[fldName].label, width, editable, format, hidden, render, cls };
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

<style>
.image-cell .fancy-grid-cell-inner {
    padding: 0;
    margin: 0;
    text-align: center;
}
</style>
