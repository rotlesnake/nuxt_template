export default (context, inject) => {
    inject("acl", (name) => {
        try {
            return context.store.state.auth.user.acl.includes(name);
        } catch (e) {
            throw e;
        }
    });
};
