const db = require('../utils/db');
module.exports = {
    getAccount: async (user_id) => {
        const data = await db.getCondition('account', 'user_id', user_id);
        return data;
    },
    updateAccount: async (user_id, newBalance) => {
        const data = await db.update('account', {balance: newBalance}, 'user_id', user_id);
    },

}