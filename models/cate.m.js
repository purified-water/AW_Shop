const db = require('../utils/db');

module.exports = {
    getCates: () => {
        try {
            cateList = db.getCategories();
            // const cateList = await db.getAll('Category');
            return cateList;
        }
        catch(e) {
            console.log(e);
        }
    }
}