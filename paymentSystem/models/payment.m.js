const db = require('../utils/db');

module.exports = {
    getAccount: async function (user_id) {
        const data = await db.getCondition('account', 'user_id', user_id);
        return data;
    },
    updateAccount: async function (user_id, newBalance) {
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
    },
    payWithVNPay: async function (user_id, amount) {
        try {
            //Lấy user info của admin
            const adminUser = await db.getCondition('users', 'username', 'admin');
            const adminUserID = adminUser[0].id;

            //Lấy account info của admin
            const adminAccount = await this.getAccount(adminUserID);

            //Trừ tiền của client và cộng tiền cho admin
            const newAdminBalance = parseInt(adminAccount[0].balance) + amount;

            await this.updateAccount(adminUserID, newAdminBalance);
            return 1;
        } catch (error) {
            console.log('Error', error);
            return 0;
        }
    }
}