const db = require('../utils/db');

module.exports = {
    getCates: () => {
        try {
            cateList = [
                { id: 1, name: 'Category 1' },
                { id: 2, name: 'Category 2' },
                { id: 3, name: 'Category 3' },
            ];
            // const cateList = await db.getAll('Category');
            return cateList;
        }
        catch(e) {
            console.log(e);
        }
    }
}