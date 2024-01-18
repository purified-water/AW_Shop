const db = require('../utils/db');

module.exports = {
    donothing: () => {
        try {
            console.log('hehe');
        }
        catch (e) {
            throw e;
        }
    },
}