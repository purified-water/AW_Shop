const db = require('../utils/db');

module.exports = {
    getAccount: async (user_id) => {
        const data = await db.getCondition('account', 'user_id', user_id);
        return data;
    },
    updateAccount: async (user_id, newBalance) => {
        const data = await db.update('account', { balance: newBalance }, 'user_id', user_id);
    },
    rechargeAccount: async function (user_id, amount)  {
        const account = await this.getAccount(user_id);
        if (account.length == 0) {
            return 0;
        }
        const newBalance = parseInt(account[0].balance) + parseInt(amount);

        await this.updateAccount(user_id, newBalance);
        // console.log('Upadae balance success');
        return 1;
    }
}