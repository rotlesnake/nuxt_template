<template>
    <section class="ma-4" v-if="tableName">
        <table-editor ref="table" :tableName="tableName" @dblSelect="$refs.table.openEditDialog('edit')"></table-editor>
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
        };
    },
    mounted() {
        this.$store.commit("SET_APP_TITLE", "Редактор таблиц");
        this.tableName = this.$route.params.name;
    },
    computed: {},

    methods: {
        showLoader(display) {
            this.$store.commit("SHOW_LOADER", display);
        },
    }, //methods
};
</script>
