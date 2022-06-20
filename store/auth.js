export const state = () => ({
    user: null,
    organization: null,
    token: null,
});

// mutations
export const mutations = {
    SET_TOKEN(state, token) {
        localStorage.setItem("token", token);
        state.token = token;
    },
    CLEAR_TOKEN(state) {
        localStorage.removeItem("token");
        state.token = null;
    },

    SET_USER(state, user) {
        localStorage.setItem("user", JSON.stringify(user));
        state.user = user;
    },
    SET_ORGANIZATION(state, data) {
        state.organization = data;
    },
    CLEAR_USER(state) {
        localStorage.removeItem("user");
        state.user = null;
    },

    USER_REMEMBER(state) {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if (token) {
            try {
                state.token = token;
                state.user = JSON.parse(user);
                this.dispatch("auth/me", {});
            } catch (e) {
                this.$router.push("/auth/login");
            }
        } else {
            this.$router.push("/auth/login");
        }
    },
}; //mutations

// actions
export const actions = {
    async login({ commit }, data) {
        try {
            const result = await this.$api("auth", "login", "index", data);
            if (result.user) {
                commit("SET_USER", result.user);
                commit("SET_TOKEN", result.user.token);
                return result;
            } else {
                if (result.message) throw new Error(result.message);
            }
            throw new Error("Ошибка авторизации");
        } catch (e) {
            throw e;
        }
    },

    async register({ commit }, data) {
        try {
            const result = await this.$api("auth", "register", "index", data);
            if (result.user) {
                return result;
            } else {
                if (result.message) throw new Error(result.message);
            }
            throw new Error("Ошибка авторизации");
        } catch (e) {
            throw e;
        }
    },

    async me({ commit }, data) {
        try {
            const result = await this.$api("auth", "me", "index", data);
            if (result.token) {
                commit("SET_USER", result);
                commit("SET_TOKEN", result.token);
                return result;
            } else {
                this.dispatch("auth/logout", {});
                if (result.message) throw new Error(result.message);
            }
            throw new Error("Ошибка авторизации");
        } catch (e) {
            this.$router.push("/auth/login");
            throw e;
        }
    },

    async logout({ commit }) {
        try {
            commit("CLEAR_USER");
            commit("CLEAR_TOKEN");
            await this.$api("auth", "logout", "index", {});
            this.$router.push("/auth/login");
        } catch (e) {
            throw e;
        }
    },

    userHasRoles({ state, commit }, roles) {
        if (!roles) return false;
        var user_roles = state.user.role_id;
        if (typeof user_roles != "array") user_roles = [user_roles];

        for (let id in user_roles) {
            if (roles.indexOf(user_roles[id]) != -1) {
                return true;
            }
        }
        return false;
    },
}; //actions
