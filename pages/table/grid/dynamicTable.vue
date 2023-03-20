<template>
    <section id="table-editor" v-if="tableName">
        <dynamic-filter
            v-if="tableInfo && allColumns"
            :tableInfo="tableInfo"
            :filter="currentFilter"
            :columns="allColumns"
            @onFilter="applyFilter"
            @onColumns="applyColumns"
        />

        <div id="table" ref="table"></div>

        <!-- <div ref="table-footer" class="d-flex align-center" style="width: 100%">
            <v-btn fab x-small class="mr-2 white--text" color="green"><v-icon>add</v-icon></v-btn>
            <v-btn fab x-small class="mr-2 white--text" color="indigo"><v-icon>edit</v-icon></v-btn>
            <v-btn fab x-small class="mr-2 white--text" color="red" :disabled="!selectedRow"><v-icon>delete</v-icon></v-btn>

            <v-spacer />
            {{ all_rows_count }} из {{ tablePagination.totalItems }}
        </div> -->
        <img v-if="!table" src="https://nabels.ru/upload/preload.gif" />
    </section>
</template>

<script>
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";

const tableLangs = {
    "ru-ru": {
        data: {
            loading: "Загрузка...",
            error: "Ошибка получения данных",
        },
        pagination: {
            page_size: "Записей на стр.",
            page_title: "Записей на стр.",
            first: "|<<",
            first_title: "Первая страница",
            last: ">>|",
            last_title: "Последняя страница",
            prev: "<",
            prev_title: "Предыдущая страница",
            next: ">",
            next_title: "Следующая страница",
            all: "Все",
            counter: {
                showing: "Отображено",
                of: "из",
                rows: "записей",
                pages: "страниц",
            },
        },
    },
};

export default {
    layout: "default",
    components: {
        "dynamic-filter": () => import("./dynamicFilter.vue"),
    },
    props: {
        tableName: { type: String, default: "" },
        filter: { type: Array, default: () => [] },
    },
    data() {
        return {
            table: null,
            columns: [],
            tableInfo: {},
            tablePagination: {},
            rows: [],
            selectedRow: null,
            string_dense: false,
            all_rows_count: 0,
            currentFilter: [],
            allColumns: null,
        };
    },
    watch: {
        tableName() {
            this.refresh();
        },
        filter() {
            if (!this.table) return;
            this.table.setFilter(this.filter);
        },
    },
    mounted() {
        this.refresh();
    },
    computed: {},

    methods: {
        showLoader(display) {
            this.$store.commit("SHOW_LOADER", display);
        },
        async refresh() {
            if (!this.tableName) return;
            this.showLoader(true);
            this.$api("table", this.tableName, "tableInfo").then(async (data) => {
                this.showLoader(false);
                this.tableInfo = data.info;
                this.tablePagination = data.pagination;
                this.columns = data.info.columns;
                this.rows = data.rows;
                this.initTable();
            });
        },
        async applyFilter(filter) {
            this.table.setFilter(filter);
            this.currentFilter = filter;
        },
        async applyColumns(columns) {
            if (!columns) return;
            if (columns.length == 0) return;
            columns = await this.initColumns(columns);
            this.table.setColumns(columns);
        },

        async initColumns(fromColumns) {
            let columns = await Promise.all(
                fromColumns.map(async (curField) => {
                    const fldParam = { field: curField.name, title: curField.label };
                    fldParam.editor = false;
                    fldParam.sorter = "string";
                    fldParam.width = curField.width || 150;
                    fldParam.visible = curField.hidden ? false : true;
                    fldParam.headerFilter = "input";

                    if (this.string_dense && (curField.type == "string" || curField.type == "text")) {
                        fldParam.formatter = "textarea";
                    }
                    if (curField.type == "images") {
                        fldParam.width = 80;
                        fldParam.headerFilter = false;
                        fldParam.formatter = (cell, params) => {
                            let itm = cell.getValue();
                            itm = itm && itm.length ? itm[0] : {};
                            //return "<a href='"+itm.src+"' target='_blank'>"+itm.name+"</a>";
                            return "<img src='" + itm.src + "' style='height:25px;'>";
                        };
                    }
                    if (curField.type == "files") {
                        fldParam.width = 180;
                        fldParam.headerFilter = false;
                        fldParam.formatter = (cell, params) => {
                            let itm = cell.getValue();
                            itm = itm && itm.length ? itm[0] : {};
                            return "<a href='" + itm.src + "' target='_blank'>" + itm.name + "</a>";
                        };
                    }
                    if (curField.type == "integer") {
                        fldParam.sorter = "number";
                    }
                    if (curField.type == "date" || curField.type == "dateTime") {
                        fldParam.formatter = (cell, params) => {
                            let fldName = cell._cell.column.field;
                            let row = cell._cell.row.data;
                            return row[fldName + "_text"];
                        };
                    }
                    if (curField.type == "select" || curField.type == "selectText") {
                        fldParam.headerFilter = "list";
                        fldParam.headerFilterParams = { values: { null: "- все -", ...curField.items }, clearable: true };
                        fldParam.formatter = (cell, params) => {
                            return curField.items[cell.getValue()];
                        };
                    }

                    if (curField.type == "linkTable") {
                        fldParam.headerFilter = false;
                        fldParam.formatter = (cell, params) => {
                            let fldName = cell._cell.column.field;
                            let row = cell._cell.row.data;
                            return row[fldName + "_text"];
                        };
                    }

                    return fldParam;
                })
            );
            return columns;
        },
        async initTable() {
            this.allColumns = JSON.parse(JSON.stringify(Object.values(this.columns)));
            let columns = await this.initColumns(this.allColumns);

            if (this.tableInfo.groupColumns) {
                columns = this.tableInfo.groupColumns.map((grp) => {
                    grp.cols = columns.filter((e) => grp.columns.includes(e.field));
                    return { title: grp.label, columns: grp.cols };
                });
            }

            const pageBound = this.$el.getBoundingClientRect();
            this.table = new Tabulator("#table-editor #table", {
                locale: true,
                langs: tableLangs,
                selectable: 1,
                reactiveData: true,
                filterMode: "remote",
                sortMode: "remote",

                progressiveLoad: "scroll",
                paginationSize: 100,

                ajaxURL: "https://",
                ajaxRequesting: (url, params) => {
                    return true;
                },
                ajaxRequestFunc: async (url, config, params) => {
                    return await this.loadTable(params);
                },
                ajaxResponse: async (url, params, response) => {
                    return response;
                },

                height: pageBound.height - 1,
                layout: "fitColumns", //fit columns to width of table (optional)
                footerElement: "<div class='table-footer-content' style='width:100%'></div>",
                columns,
            });

            this.table.on("rowClick", (e, row) => {
                //console.log("Row " + row.getData().id, row._row);
                this.selectedRow = row._row.data;
                this.canDelete = true;
            });
            this.table.on("rowDblClick", (e, row) => {
                this.$router.push("/cows/" + row._row.data.id);
            });

            setTimeout(() => {
                //let footerEl = document.querySelectorAll("#table .table-footer-content");
                //if (footerEl.length > 0) footerEl[0].appendChild(this.$refs["table-footer"]);
            }, 1);
        },

        async loadTable(params) {
            //console.log("updateTable",params);
            params.filter.forEach((e) => {
                e.oper = e.type;
            });
            params.filter = params.filter.filter((e) => e.value !== "null");
            if (params.size) params.limit = params.size;

            const result = await this.$api("table", this.tableName, "get", params);
            this.rows = result.rows;
            let last_row = result.pagination.totalItems >= 0 ? result.pagination.totalItems : this.rows.length;
            let last_page = Math.ceil(last_row / result.pagination.itemsPerPage);
            this.all_rows_count = last_row;
            return { last_page, last_row, data: this.rows };
        },
    }, //methods
};
</script>

<style>
#table-editor #table {
    margin: 5px 5px 0 5px;
}
.tabulator-header-filter input {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 3px;
}
</style>
