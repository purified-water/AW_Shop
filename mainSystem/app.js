const express = require('express');
const handlebars = require("express-handlebars");
const app = express();
const port = 3000;
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override')
const flash = require('express-flash')
const { isAuthenticated, isNotAuthenticated } = require('./middlewares/auth.middleware')
const path = require('path');
const https = require('https');
const fs = require('fs');
const cookieParser = require('cookie-parser')


startServer();
async function startServer() {
    const db = require('./utils/db');


    app.use(flash());
    app.use(cookieParser());

    const maxAge = 60 * 60 * 1000;
    app.use(methodOverride('_method'));
    app.use(session({
        secret: 'mySecrectKey',
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: maxAge }
    }))
    // console.log('Dirname', __dirname);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hbs');

    app.engine('hbs', handlebars.engine({
        layoutsDir: 'mainSystem/views/layouts/',
        defaultLayout: 'index',
        extname: 'hbs',
        partialsDir: 'mainSystem/views/partials/',
        helpers: {
            json: function (context) {
                return JSON.stringify(context);
            },
            eq: function (a, b) {
                return a == b;
            },
            indexInc: function(index) {
                return index + 1;
            },
            formatPrice: function(price) {
                const formattedPrice = new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(price);
              
                // If the above doesn't work, try formatting without the currency symbol
                // const formattedPrice = new Intl.NumberFormat('it-IT').format(price);
              
                return formattedPrice;
            }
        },
    }));

    function formatPrice(price) {
        return price.toLocaleString('it-IT', {style: 'currency', currency : 'VND'})
    }
    console.log(formatPrice(5000));

    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(passport.initialize());
    app.use(passport.session());


    // get data
    const databaseRoute = require('./routes/db.r');
    app.use('/getAll', databaseRoute);

    //Authentications
    const authRoute = require('./routes/auth.r');
    app.use('/auth', authRoute);
    //Login
    const loginRoute = require('./routes/login.r');
    app.use('/login', isNotAuthenticated, loginRoute);
    //Register
    const registerRoute = require('./routes/register.r');
    app.use('/register', isNotAuthenticated, registerRoute);
    // app.delete('/logout', (req, res) => {
    //     req.logOut(function (err) {
    //         if (err) {
    //             return res.status(500).json({ error: 'Error during logout' })
    //         }
    //         res.redirect('/login')
    //     })
    // })


    // app.get('/', isAuthenticated, (req, res) => {
    //     console.log('Authenticated user', req.user);  
    //     res.render("home", {user: req.user[0] });
    // });
    const logOutRoute = require('./routes/logout.r');
    app.use('/logout', logOutRoute);

    app.use(isAuthenticated);
    const homeRoute = require('./routes/home.r');
    app.use('/', homeRoute);

    const cateRoute = require('./routes/cate.r');
    app.use('/cate', cateRoute);

    const prodRoute = require('./routes/prod.r');
    app.use('/product', prodRoute);

    const cartRoute = require('./routes/cart.r');
    app.use('/cart', cartRoute);

    const analyzeRoute = require('./routes/analyze.r');
    app.use('/analyze', analyzeRoute);

    const usersRoute = require('./routes/users.r');
    app.use('/user', usersRoute)

    const orderRoute = require('./routes/order.r');
    app.use('/order', orderRoute);

    app.get('/about', async (req, res) => {
        let nav = await db.getCategories()

        res.render("about", { user: req.user[0], pageTitle: "About", cateListNav: nav });
    });

    const server = https.createServer({
        key: fs.readFileSync("./mainSystem/configs/cert.key"),
        cert: fs.readFileSync("./mainSystem/configs/cert.crt"),
        // key: cert.key,
        // cert: cert.cert,
    }, app)
    server.listen(port, () => {
        console.log(`https://localhost:${port}`)
    });

}
