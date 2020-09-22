export const state = () => ({
  user: null,
  token: null
});

// mutations
export const mutations = {
  SET_TOKEN(state, token) {
    localStorage.setItem('token', token);
    state.token = token;
  },
  CLEAR_TOKEN(state) {
    localStorage.removeItem('token');
    state.token = null;
  },

  SET_USER(state, user) {
    localStorage.setItem('user', JSON.stringify(user));
    state.user = user;
  },
  CLEAR_USER(state) {
    localStorage.removeItem('user');
    state.user = null;
  },

  USER_REMEMBER(state) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token) {
        try {
            state.token = token;
            state.user = JSON.parse(user);
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

  async logout({ commit }) {
    try {
      await this.$api("auth", "logout", "index", {});
      commit("CLEAR_USER");
      commit("CLEAR_TOKEN");

      this.$router.push("/auth/login");
    } catch (e) {
      throw e;
    }
  }

}; //actions
