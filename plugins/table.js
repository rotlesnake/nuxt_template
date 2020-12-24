import { Model } from 'vue-db-query/src/'



export default function (ctx, inject) {
	Model.$http = ctx.$axios
	
	inject('table', (tablename) => {
		return class TableModel extends Model {
			baseURL() {
				return 'DBQuery';
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
