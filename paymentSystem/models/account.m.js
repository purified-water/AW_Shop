const db = require('../utils/db');
module.exports = {
    addAccount: async(user_id, balance) => {
        const accountQuery = await db.getCondition('account', 'user_id', user_id);
        console.log('Account query: ', accountQuery);
        if (accountQuery.length > 0) {
            console.log('Already have account');
            return;
        } else {
            const data = await db.insert('account', {user_id: user_id, balance: balance}, 'user_id');
            console.log('Created a new account with user_id: ', user_id);
        }
        
        return;
    }



}