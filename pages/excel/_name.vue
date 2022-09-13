<template>
    <section class="excel-table ma-4" v-if="tableName">
        <vue-excel-editor
            v-model="rows"
            no-paging
            no-header-edit
            spellcheck
            disable-panel-setting
            new-if-bottom
            no-mouse-scroll
            :record-label="getRecordId"
            :cell-style="getCellStyle"
            @delete="deleteRow"
        >
            <vue-excel-column
                v-for="col in columnsArray.filter((e) => !e.hidden)"
                :key="col.name"
                :field="col.name"
                :label="col.label"
                :type="col.type"
                :readonly="col.protected"
                :change="onCellChange"
                :options="col.items"
                @keyup="deleteRow"
            />
            <!-- <vue-excel-column field="gender" label="Gender" type="select" width="50px" :options="['F', 'M', 'U']" />
            <vue-excel-column field="age" label="Age" type="number" width="70px" />
            <vue-excel-column field="birth" label="Date Of Birth" type="date" width="80px" /> -->
        </vue-excel-editor>
    </section>
</template>

<script>
import Vue from "vue";
import VueExcelEditor from "vue-excel-editor";
Vue.use(VueExcelEditor);
export default {
    layout: "admin",
    components: {
        "table-editor": () => import("mapdap/table/Table"),
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
        };
    },
    mounted() {
        this.$store.commit("SET_APP_TITLE", "Редактор таблиц");
        this.tableName = this.$route.params.name;
        this.refresh();
    },
    computed: {
        columnsArray() {
            return Object.keys(this.columns).map((key) => {
                let type = "string";
                if (this.columns[key].type == "dateTime") type = "datetime";
                if (this.columns[key].type == "linkTable") type = "map";
                if (this.columns[key].type == "select") type = "map";
                if (this.columns[key].type == "integer") type = "number";
                if (this.columns[key].type == "float") type = "number";
                this.columns[key].type = type;
                return this.columns[key];
            });
        },
    },

    methods: {
        showLoader(display) {
            this.$store.commit("SHOW_LOADER", display);
        },
        async refresh() {
            this.showLoader(true);
            this.$api("table", this.tableName, "get").then(async (data) => {
                this.showLoader(false);
                data.info.columns.id.hidden = true;
                this.columns = data.info.columns;
                this.rows = data.rows;
                Object.keys(this.columns).forEach(async (key) => {
                    if (this.columns[key].type == "linkTable") {
                        this.columns[key].items = {};
                        let responseData = await this.$api("table", this.columns[key].table, "get", { fast: true, mimi: true });
                        responseData.rows.forEach((respRow) => {
                            this.columns[key].items[respRow.id] = respRow[this.columns[key].field];
                        });
                    }
                });
            });
        },
        getRecordId(num, row) {
            return row.id;
        },
        getCellStyle(row, column) {
            let style = {};
            if (column.readonly) style.background = "#eee";
            return style;
        },

        onCellChange(newVal, oldVal, row, cell) {
            if (!newVal && !oldVal) return;
            if (newVal == oldVal) return;

            const updateData = {};
            updateData[cell.name] = newVal;
            if (row.id) {
                this.$api("table", this.tableName, "edit", row.id, updateData).then((data) => {});
            } else {
                this.$api("table", this.tableName, "add", updateData).then((data) => {
                    if (data.rows) {
                        Object.keys(data.rows[0]).map((key) => {
                            row[key] = data.rows[0][key];
                        });
                    }
                });
            }
            //console.log("change cell", newVal, oldVal, row.id, cell.name);
        },

        deleteRow(newVal, oldVal) {
            console.log("delete row", newVal, oldVal);
        },
    }, //methods
};
</script>

<style>
.excel-table .component-content {
    max-height: calc(100vh - 100px);
}
.excel-table .table-content {
    max-height: calc(100vh - 130px);
}
#systable {
    width: 100% !important;
}
</style>
