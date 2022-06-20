<template>
    <section class="ma-4">
        <v-card>
            <v-toolbar dense color="primary" elevation="0">
                <v-toolbar-title class="white--text">Профиль</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

            <v-card-text class="pt-4">
                <v-form ref="form" v-model="formValid">
                    <div v-for="(item, i) in modelInfoColumns" :key="i">
                        <form-field
                            :options="item"
                            :name="i"
                            v-model="row[i]"
                            :row="row"
                            v-if="!item.protected || i == 'login'"
                            :disabled="item.protected || i == 'login'"
                        ></form-field>
                    </div>
                </v-form>
            </v-card-text>

            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="mx-2" color="primary" @click="saveForm()"> <v-icon left>edit</v-icon> Изменить </v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </section>
</template>

<script>
export default {
    components: {
        "form-field": () => import("mapdap/form/FormField"),
    },
    head() {
        return {
            title: "Профиль пользователя",
        };
    },

    data() {
        return {
            formValid: true,
            modelInfo: {},
            row: {},
        };
    },

    computed: {
        modelInfoColumns() {
            if (!this.modelInfo.columns) return {};
            let columns = {};
            for (let item in this.modelInfo.columns) {
                let col = this.modelInfo.columns[item];
                col.outlined = true;
                col.rows = 2;
                col.rules = [(v) => !!v || "Заполните поле"];
                columns[item] = col;
            }
            return columns;
        },
    },

    mounted() {
        this.$store.commit("SET_APP_TITLE", "Профиль пользователя");

        this.$store.commit("SHOW_LOADER", true);
        this.$api("table", "users", this.$store.state.auth.user.id).then((response) => {
            this.modelInfo = response.info;
            this.row = response.rows[0];
            this.$store.commit("SHOW_LOADER", false);
        });
    },

    methods: {
        userHasRoles(roles) {
            //console.log(roles);
            if (!roles) return false;
            var user_roles = this.$store.state.auth.user.role_id;
            //console.log(user_roles);
            if (typeof user_roles != "array") user_roles = [user_roles];
            for (let id in user_roles) {
                if (roles.indexOf(parseInt(user_roles[id])) != -1) {
                    return true;
                }
            }
            return false;
        },
        saveForm() {
            this.$forceUpdate();
            this.$refs.form.validate();
            if (!this.formValid) {
                return;
            }

            // SAVE
            this.$store.commit("SHOW_LOADER", true);
            this.$api("table", "users", "edit", this.row.id, this.row)
                .then((response) => {
                    this.$store.dispatch("auth/me", {});
                    this.$store.commit("SHOW_LOADER", false);
                    this.$router.go(-1);
                })
                .catch((e) => {
                    this.$store.commit("SHOW_LOADER", false);
                    this.$swal.fire({ title: "Ошибка загрузки", icon: "error" });
                });
        },
    },
};
</script>
