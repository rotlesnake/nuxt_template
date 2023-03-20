<template>
    <section class="pa-5">
        <div>
            <v-btn class="mx-1" @click="migrate()">Провести миграцию</v-btn>
            <v-btn class="mx-1" to="/admin/modules">Модули</v-btn>
            <v-btn class="mx-1" to="/admin/tables">База данных</v-btn>
        </div>
        <div class="my-4" style="color: grey" v-html="migrate_result"></div>
    </section>
</template>

<script>
export default {
    data() {
        return { migrate_result: "" };
    },
    methods: {
        migrate() {
            this.modules = [];
            this.$swal.showLoading();
            this.$axios
                .post("admin/migrate", {})
                .then((response) => {
                    console.log(response.data);
                    this.migrate_result = response.data;
                    this.$swal.close();
                })
                .catch((e) => {
                    this.$swal.close();
                });
        },
    },
};
</script>
