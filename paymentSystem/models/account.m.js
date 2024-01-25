const db = require('../utils/db');
module.exports = {
    addAccount: async(user_id, balance) => {
        const accountQuery = db.getCondition('account', 'user_id', user_id);
        if (accountQuery.length > 0) {
            console.log('Already have account');
            return;
        }
        const data = db.insert('account', {user_id: user_id, balance: balance}, 'user_id');
        console.log('Created a new account with user_id: ', user_id);
        return;
    }



}