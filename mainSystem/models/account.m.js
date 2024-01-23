const dbcn = require('../utils/db')
const tableName = 'account'

module.exports = {
    getAccount: async(id) => {
        try {
            const data = await dbcn.getCondition(tableName, 'user_id', id);
            return data;
        }
        catch (e) {
            throw e
        }
    },
}