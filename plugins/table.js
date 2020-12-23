import { Model } from 'vue-api-query'



export default function (ctx, inject) {
	Model.$http = ctx.$axios

	inject('table', (tablename) => {
		return class TableModel extends Model {
			baseURL() {
				return 'tableapi';
			}
			request(config) {
				return this.$http.request(config);
			}
			resource() {
				return tablename;
			}
		};
	})

}
