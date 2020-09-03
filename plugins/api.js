export default (context, inject) => {
    inject('api', async (module, controller, method, params) => {
        try {
            return await context.$axios['$'+(params ? 'post' : 'get')]('/'+module+'/'+controller+'/'+method, params);
        } catch (e) {
            throw e;
        }
    })
}