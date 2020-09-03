export const state = () => ({
  user: null,
  token: null
});

// mutations
export const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },

  CLEAR_TOKEN(state) {
    state.token = null;
  },

  SET_USER(state, user) {
    state.user = user;
  },

  CLEAR_USER(state) {
    state.user = null;
  }
}; //mutations

// actions
export const actions = {
  async login({ commit }, data) {
    try {
      const result = await this.$api("api", "auth", "login", data);
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

  async logout({ commit }) {
    try {
      await this.$api("api", "auth", "logout");
      commit("CLEAR_USER");
      commit("CLEAR_TOKEN");
      this.$router.push("/auth/logout");
    } catch (e) {
      throw e;
    }
  }
}; //actions
