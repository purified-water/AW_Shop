const category = require('../models/cate.m')
const db = require('../utils/db');

// // Route to handle paginated data
// app.post('/get_data', async (req, res) => {
//     const page = req.body.page || 1;
//     const itemsPerPage = 5;
//     const offset = (page - 1) * itemsPerPage;

//     try {
//       const result = await db.any(
//         'SELECT * FROM your_table OFFSET $1 LIMIT $2',
//         [offset, itemsPerPage]
//       );

//       res.json(result);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Internal Server Error');
//     }
//   });

//   // Route to handle total number of items for pagination
//   app.get('/get_total_items', async (req, res) => {
//     try {
//       const result = await db.one('SELECT COUNT(*) FROM your_table');
//       const totalItems = result.count;
//       res.json({ totalItems });
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Internal Server Error');
//     }
//   });
module.exports = {
    // loadCates: async (req,res,next) => {
    //     try {
    //         const cates = await category.getCates();
    //         // console.log('Category list: ', cates);
    //         res.render("cate",{cateList: cates});
    //     } catch (error) {
    //         next(error);
    //     }
    // },
    loadCates: async (req, res, next) => {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 5;
        const offset = (page - 1) * itemsPerPage;

        try {
            const cates = await db.getCategoriesByPage(offset, itemsPerPage);
            // console.log(cates);
            res.render("cate",{cateList: cates});
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    },

    getAllCates: async (req, res, next) => {

        try {
            const result = await db.getAllCategories()
            const totalItems = result.count;
            console.log(result);
            res.json({ totalItems });
            // res.render("cate",result);
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    },


    editCate: async (req, res, next) => {
        try {
            const { oldCateName } = req.query.oldCateName;
            const { newCateName } = req.body.newCateName;
            await category.editCate(oldCateName, newCateName);
            res.redirect('/cate');
        } catch (error) {
            next(error);
        }
    },

    deleteCate: async (req, res, next) => {
        try {
            const { cateName } = req.params.cateName;
            await category.deleteCate(cateName);
            res.redirect('/cate');
        } catch (error) {
            next(error);
        }
    }
}