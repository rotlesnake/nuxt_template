<template>
    <section id="table-editor">
        <div id="table" ref="table"></div>
        <div ref="table-footer" style="width:350px;">
            <v-btn fab x-small class="mr-2 white--text" color="green"><v-icon>add</v-icon></v-btn>
            <v-btn fab x-small class="mr-2 white--text" color="indigo"><v-icon>edit</v-icon></v-btn>
            <v-btn fab x-small class="mr-2 white--text" color="red" :disabled="!selectedRow"><v-icon>delete</v-icon></v-btn>
        </div>
        <img v-if="!table" src="https://nabels.ru/upload/preload.gif" />
    </section>
</template>

<script>
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import "tabulator-tables/dist/css/tabulator.min.css";

const tableLangs = {
    "ru-ru": {
        "data":{
            "loading": "Загрузка...",
            "error": "Ошибка получения данных",
        },
        "pagination":{
            "page_size": "Записей на стр.", 
            "page_title": "Записей на стр.",
            "first": "|<<",
            "first_title": "Первая страница",
            "last": ">>|",
            "last_title": "Последняя страница",
            "prev": "<",
            "prev_title": "Предыдущая страница",
            "next": ">",
            "next_title": "Следующая страница",
            "all": "Все",
            "counter":{
                "showing": "Отображено",
                "of": "из",
                "rows": "записей",
                "pages": "страниц",
            }
        },
    }
};

export default {
    layout: "admin",
    components: {
    },
    head() {
        return {
            title: "Редактор таблиц",
        };
    },

    data() {
        return {
            tableName: null,
            table: null,
            columns: [],
            tableInfo: {},
            tablePagination: {},
            rows: [],
            selectedRow: null,
            string_dense: false,
        };
    },
    created() {
        if (this.$route.query.dense) this.string_dense = true;
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
            this.$api("table", this.tableName, "tableInfo").then(async (data) => {
                this.showLoader(false);
                this.tableInfo = data.info;
                this.tablePagination = data.pagination;
                this.columns = data.info.columns;
                this.rows = data.rows;
                this.initTable();
            });
        },
        async initTable(){
            let columns = await Promise.all(
                    Object.keys(this.columns).map(async (fldName) => {
                        const fldParam = { field: fldName, title: this.columns[fldName].label };
                        fldParam.editor = false;//!this.columns[fldName].protected;
                        fldParam.sorter = "string";
                        fldParam.width = this.columns[fldName].width || 150;
                        fldParam.visible = this.columns[fldName].hidden ? false : true;
                        fldParam.headerFilter = "input";

                        if (this.string_dense && (this.columns[fldName].type == "string" || this.columns[fldName].type == "text")) {
                            fldParam.formatter = "textarea";
                        }
                        if (this.columns[fldName].type == "images") {
                            fldParam.width = 80;
                            fldParam.headerFilter = false;
                            fldParam.formatter=(cell,params)=>{
                                let itm = cell.getValue();
                                itm = itm && itm.length ? itm[0] : {};
                                //return "<a href='"+itm.src+"' target='_blank'>"+itm.name+"</a>";
                                return "<img src='"+itm.src+"' style='height:25px;'>";
                            };
                        }
                        if (this.columns[fldName].type == "files") {
                            fldParam.width = 180;
                            fldParam.headerFilter = false;
                            fldParam.formatter=(cell,params)=>{
                                let itm = cell.getValue();
                                itm = itm && itm.length ? itm[0] : {};
                                return "<a href='"+itm.src+"' target='_blank'>"+itm.name+"</a>";
                            };
                        }
                        if (this.columns[fldName].type == "integer") {
                            fldParam.sorter = "number";
                        }
                        if (this.columns[fldName].type == "date" || this.columns[fldName].type == "dateTime") {
                            fldParam.formatter=(cell,params)=>{
                                let fldName = cell._cell.column.field;
                                let row = cell._cell.row.data;
                                return row[fldName+"_text"];
                            };
                        }
                        if (this.columns[fldName].type == "select") {
                            fldParam.headerFilter = "list";
                            fldParam.headerFilterParams = {values:{null:"- все -", ...this.columns[fldName].items}, clearable:true };
                            fldParam.formatter=(cell,params)=>{
                                return this.columns[fldName].items[cell.getValue()];
                            };
                        }
                        if (this.columns[fldName].type == "linkTable") {
                            fldParam.headerFilter = false;
                            fldParam.formatter=(cell,params)=>{
                                let fldName = cell._cell.column.field;
                                let row = cell._cell.row.data;
                                return row[fldName+"_text"];
                            };
                        }

                        return fldParam;
                    })
            );

            if (this.tableInfo.groupColumns) {
                columns = this.tableInfo.groupColumns.map(grp=>{
                    grp.cols = columns.filter(e=>grp.columns.includes(e.field)); 
                    return {title:grp.label, columns:grp.cols};
                });
            }

            const pageBound = this.$el.getBoundingClientRect();
            this.table = new Tabulator("#table-editor #table", {
                locale: true,
                langs: tableLangs,
                selectable: 1,
                reactiveData:true,
                filterMode:"remote",
                sortMode:"remote",

                pagination:true,
                paginationMode:"remote",
                paginationCounter: "rows",
                paginationSize: this.tableInfo.itemsPerPage,
                paginationSizeSelector: this.tableInfo.itemsPerPageVariants,
                paginationInitialPage: this.tablePagination.page,
                paginationCounter: (pageSize, currentRow, currentPage, totalRows, totalPages)=>{
                    let last_row = (currentRow+pageSize) <= totalRows ? (currentRow+pageSize) : totalRows;
                    return "Отображено записей с "+currentRow+" по "+last_row+",  всего: " + totalRows + " ";
                },

                ajaxURL: "https://",
                ajaxRequesting: (url, params)=>{ return true; },
                ajaxRequestFunc: async (url, config, params)=>{
                    return await this.updateTable(params);
                },
                ajaxResponse: async (url, params, response)=>{
                    return response;
                },

             	height: pageBound.height-1,
             	layout: "fitColumns", //fit columns to width of table (optional)
                footerElement:"<div class='table-footer-content'></div>",
             	columns
            });

            this.table.on("rowClick", (e, row)=>{ 
           	    //console.log("Row " + row.getData().id, row._row);
           	    this.selectedRow = row._row.data;
           	    this.canDelete = true;
            });

            setTimeout(()=>{
                let footerEl = document.querySelectorAll("#table .table-footer-content");
                if (footerEl.length>0) footerEl[0].appendChild(this.$refs["table-footer"]);
            }, 1);
        },

        async updateTable(params) {
            //console.log("updateTable",params);
            params.filter.forEach(e=>{
                e.oper = e.type;
            });
            params.filter = params.filter.filter(e=>e.value!=="null");
            if (params.size) params.limit = params.size;

            const result = await this.$api("table", this.tableName, "get", params);
            this.rows = result.rows;
            let last_row = result.pagination.totalItems>=0 ? result.pagination.totalItems : this.rows.length;
            let last_page = Math.ceil(last_row / result.pagination.itemsPerPage);
            return {last_page, last_row, data: this.rows};
        },
    }, //methods
};
</script>

<style>
#table-editor {
    width: 100%;
    height: calc(100% - 10px);
}
#table-editor #table {
    margin: 5px 5px 0 5px;
}
.tabulator-header-filter input { background:#fff; border: 1px solid #ccc; border-radius: 3px; }
</style>
