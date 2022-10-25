export default (context, inject) => {

    inject('api', async (module, controller, method, args, params, axiosSettings) => {
        try {
            controller = controller || 'index';
            method = method || 'index';
            if (args && params) method += "/"+args;
            if (args && !params) params = args;

            return await context.$axios['$'+(params ? 'post' : 'get')]('/'+module+'/'+controller+'/'+method, params, axiosSettings);
        } catch (e) {
            throw e;
        }
    })

}
