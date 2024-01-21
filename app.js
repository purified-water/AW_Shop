const express = require('express');
const handlebars = require("express-handlebars");
const app = express();
const port = 3000;
const session = require('express-session');
const passport =  require('passport');
const methodOverride = require('method-override')
const flash = require('express-flash')
const {isAuthenticated, isNotAuthenticated} = require('./middlewares/auth.middleware')
const axios = require('axios');

const db = require('./utils/db');


app.use(flash());

const maxAge = 60*60*1000;
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mySecrectKey',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: maxAge }
}))


app.set('view engine', 'hbs');

app.engine('hbs', handlebars.engine({
    layoutsDir:`views/layouts/`,
    defaultLayout: 'index',
    extname: 'hbs',
    partialsDir: 'views/partials/',
    helpers: {
        json: function(context){
            return JSON.stringify(context);
        },
    },
}));

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
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
app.delete('/logout', (req,res) => {
    req.logOut(function(err) {
        if (err) {
            return res.status(500).json({ error: 'Error during logout'})
        }
        res.redirect('/login')
    })
})


// app.get('/', isAuthenticated, (req, res) => {
//     console.log('Authenticated user', req.user);  
//     res.render("home", {user: req.user[0] });
// });

const homeRoute = require('./routes/home.r');
app.use('/', homeRoute);

const cateRoute = require('./routes/cate.r');
app.use('/cate', (req, res, next) => {
    req.user = req.user || [];
    res.locals.user = req.user[0];
    next();
}, cateRoute);

const prodRoute = require('./routes/prod.r');
app.use('/product', (req, res, next) => {
    req.user = req.user || [];
    res.locals.user = req.user[0];
    next();
}, prodRoute);

const cartRoute = require('./routes/cart.r');
app.use('/cart', (req, res, next) => {
    req.user = req.user || [];
    res.locals.user = req.user[0];
    next();
}, cartRoute);

const analyzeRoute = require('./routes/analyze.r');
app.use('/analyze', (req,res,next) => {
    req.user = req.user || [];
    res.locals.user = req.user[0];
    next();
}, analyzeRoute);

const logOutRoute = require('./routes/logout.r');
app.use('/logout', logOutRoute);

const usersRoute = require('./routes/users.r');
app.use('/user',(req,res,next) => {
    req.user = req.user || [];
    res.locals.user = req.user[0];
    next();
}, usersRoute)

app.get('/about',(req,res,next) => {
    req.user = req.user || [];
    res.locals.user = req.user[0];
    res.render("about",{pageTitle: "About"});
})


app.listen(port, () => {
    console.log(`http://localhost:${port}`)
});
  
