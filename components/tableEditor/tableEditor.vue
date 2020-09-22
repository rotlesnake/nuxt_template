<template>
<section id="table-editor">

    <v-data-table 
        multi-sort
        :headers="columnsFiltered" :items="rows"
        :loading="isLoading" loading-text="Загрузка..." class="elevation-4"
    >
        <!-- TOP !-->
        <template v-slot:top v-if="showTop">
            <template v-if="$slots.top">
                <slot name="top"></slot>
            </template>
            <v-toolbar v-else flat color="toolbar">
                <v-btn icon @click="reloadTable()">
                    <v-icon>cached</v-icon>
                </v-btn>

                <v-divider inset vertical></v-divider>
                <v-toolbar-title class="mx-2">{{caption}}</v-toolbar-title>

                <v-divider inset vertical></v-divider>
                <v-btn v-if="!filterDialog.isFiltered" color="primary" class="mx-2" @click="filterDialog.active=true">
                    <v-icon>search</v-icon> Фильтр
                </v-btn>
                <v-btn v-else color="primary" class="mx-2"  @click="filterDialog.active=true">
                    <v-icon>clear</v-icon> Сброс фильтра
                </v-btn>

                <v-divider inset vertical></v-divider>
                <v-text-field class="mx-3" v-model="localTextFilter" append-icon="search" label="Поиск..." :disabled="pagination.totalItems>0" dense outlined hide-details></v-text-field>

                <v-divider inset vertical></v-divider>
                <v-tooltip top color="indigo">
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon @click="columnsDialog.active=true">
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>
                    </template>
                    <span>Видимость колонок</span>
                </v-tooltip>

            </v-toolbar>
        </template>
        <!-- !-->

    </v-data-table>

</section>
</template>

<script>
export default {
	components:{
    },
        
    props:{
        tableName:{type:String, default: ''},
        tableCaption:{type:String, default: ''},
        showTop:{type:Boolean, default: true},
    },

    data() {
        return {
            isLoading: false,
            filterDialog: {isFiltered:false, active:false, columns:{} },
            localTextFilter: '',
            pagination: {totalItems:-1},

            caption:'',
            columns:[],
            rows:[],
        }
    },
    watch: {
        tableName() {
            this.reloadTable();
        },
    },

    computed: {
        columnsFiltered(){
            try {
                return this.columns.filter((obj) => { return (obj.hidden!==true); });
            } catch(e) {
                return this.columns;
            }
        },
    },

    mounted() {
        this.reloadTable();
    },

    methods: {
        reloadTable(){
            this.isLoading = true;

            this.$api("table", this.tableName, "get/all/info", {}).then(response=>{
                this.isLoading = false;
                this.pagination = response.pagination;
                this.info = response.info;
                this.columns = this.convertColumns(response.info.columns);
                this.rows = response.rows;
                if (this.tableCaption=='') this.caption = response.info.name;
            }).catch(error=>{
                this.isLoading = false;
            });
        },//reloadTable

        convertColumns(columns){
            var rez = [];
            for (let item in columns) {
                var obj = columns[item];
                obj.text = obj.label;
                obj.value = item;
                rez.push(obj);
            }
            return rez;
        },


    },//methods


};
</script>
