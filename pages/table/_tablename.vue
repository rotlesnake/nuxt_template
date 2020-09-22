<template>
<section id="table" class="ma-4">

    <table-editor
        :table-name="tablename"
    >
    </table-editor>

</section>
</template>

<script>
export default {
	components:{
		"table-editor":()=>import('@/components/tableEditor/tableEditor.vue')
    },
        
    head() {
        return {
            title: "Редактор таблицы"
        };
    },
    watch: {
        $route() {
            this.tablename = this.$route.params.tablename;
        },
    },

    data() {
        return {
            tablename: this.$route.params.tablename,
        }
    },

    mounted() {

    },

    methods: {
        
    },

};
</script>
