<template>
    <section id="table-editor" style="width: 100%; height: 100%">
        <div id="table" ref="table"></div>
        <img v-if="!table" src="https://nabels.ru/upload/preload.gif" />
    </section>
</template>

<script>
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import "tabulator-tables/dist/css/tabulator.min.css";

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
            rows: [],
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
                this.initTable();
            });
        },
        async initTable(){
            const columns = await Promise.all(
                    Object.keys(this.columns).map(async (fldName) => {
                        const fldParam = { field: fldName, title: this.columns[fldName].label };
                        fldParam.editor = false;//!this.columns[fldName].protected;
                        fldParam.sorter = "string";
                        fldParam.width = this.columns[fldName].width || 150;
                        fldParam.visible = this.columns[fldName].hidden ? false : true;
                        fldParam.headerFilter = "input";

                        if (this.columns[fldName].type == "images") {
                            fldParam.width = 80;
                            fldParam.headerFilter = false;
                            fldParam.formatter=(cell,params)=>{
                                let itm = cell.getValue() ? cell.getValue()[0] : {};
                                return "<a href='"+itm.src+"' target='_blank'>"+itm.name+"</a>";
                                //return "<img src='"+itm+"' style='height:25px;'>";
                            };
                        }
                        if (this.columns[fldName].type == "files") {
                            fldParam.width = 180;
                            fldParam.headerFilter = false;
                            fldParam.formatter=(cell,params)=>{
                                let itm = cell.getValue() ? cell.getValue()[0] : {};
                                return "<a href='"+itm.src+"' target='_blank'>"+itm.name+"</a>";
                            };
                        }
                        if (this.columns[fldName].type == "integer") {
                            fldParam.sorter = "number";
                        }
                        if (this.columns[fldName].type == "date" || this.columns[fldName].type == "dateTime") {
                            //fldParam.sorter = "date";
                            //fldParam.formatter = "datetime";
                            //fldParam.formatterParams = {inputFormat:"yyyy-MM-dd HH:ss", outputFormat:"dd/MM/yy", invalidPlaceholder:"(invalid date)", timezone:"America/Los_Angeles"}
                        }
                        if (this.columns[fldName].type == "select") {
                            fldParam.headerFilterParams = {values:this.columns[fldName].items, clearable:true };
                        }
/*
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
*/

                        return fldParam;
                    })
                );


            const pageBound = this.$el.getBoundingClientRect();
            this.table = new Tabulator("#table-editor #table", {
                locale: true,
                selectable: 1,
                reactiveData:true,
                filterMode:"remote",
                sortMode:"remote",

                ajaxURL: "https://",
                ajaxRequesting: (url, params)=>{ return true; },
                ajaxRequestFunc: async (url, config, params)=>{
                    return await this.updateTable(params);
                },
                ajaxResponse: async (url, params, response)=>{
                    return response;
                },

             	height: pageBound.height-10,
             	data: this.rows,
             	layout: "fitColumns", //fit columns to width of table (optional)
             	columns
            });

            this.table.on("rowClick", function(e, row){ 
           	    console.log("Row " + row.getData().id, row);
            });
        },

        async updateTable(params) {
            console.log("updateTable",params);
            params.filter.forEach(e=>{
                e.oper = e.type;
            });
            const result = await this.$api("table", this.tableName, "get", params);
            this.rows = result.rows;
            return this.rows;
        },
    }, //methods
};
</script>

<style>
#table-editor #table {
    margin: 5px;
}
.tabulator-header-filter input { background:#fff; border: 1px solid #ccc; border-radius: 3px; }
</style>
