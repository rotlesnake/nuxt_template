<template>
    <section class="ma-2" v-if="tableName">
        <table-editor ref="table" :tableName="tableName" @dblSelect="$refs.table.openEditDialog('edit')" :dense="isDense" :subHeight="-30"></table-editor>
    </section>
</template>

<script>
export default {
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
            isDense: false,
        };
    },
    created() {
        this.$store.commit("SET_APP_TITLE", "Редактор таблиц");
        this.tableName = this.$route.params.name;
        this.isDense = this.$route.query.dense != undefined;
    },
    computed: {},

    methods: {
        showLoader(display) {
            this.$store.commit("SHOW_LOADER", display);
        },
    }, //methods
};
</script>
