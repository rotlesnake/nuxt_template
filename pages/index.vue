<template>
    <section id="home" class="ma-4">
    </section>
</template>

<script>
export default {
    components: {
    },
    computed: {
    },
    head() {
        return {
            title: "Главное меню",
        };
    },

    data() {
        return {

        };
    },
    mounted() {
        this.$store.commit("SET_APP_TITLE", "Главное меню");
    },
    created() {},
    watch: {},

    methods: {
        showLoader(display) {
            this.$store.commit("SHOW_LOADER", display);
        },
    }, //methods
};
</script>
