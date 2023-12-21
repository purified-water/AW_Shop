const dbcn = require('../utils/db')
const tableName = 'users'

module.exports = {
    insert: async(user) => {
        try {
            const data = await dbcn.insert(tableName, user,'id');
            return data;
        }
        catch (e) {
            throw e
        }
    },
    getUserByEmail: async(email) => {
        try {
            // console.log('email', email);
            const data = await dbcn.getCondition(tableName, 'email', email);
            // console.log('data', data);
            return data;
        }
        catch (e) {
            throw e
        }
    },
    getUserById: async(id) => {
        try {
            const data = await dbcn.getCondition(tableName, 'id', id);
            return data;
        }
        catch (e) {
            throw e
        }
    },
    getUserByUsername: async(username) => {
        try {
            const data = await dbcn.getCondition(tableName, 'username', username);
            return data;
        }
        catch (e) {
            throw e
        }
    }
}

