const express = require('express');
const handlebars = require("express-handlebars");
const app = express();
const port = 3000;
const session = require('express-session');
const passport =  require('passport');
const methodOverride = require('method-override')
const flash = require('express-flash')
const {isAuthenticated, isNotAuthenticated} = require('./middlewares/auth.middleware')
app.use(flash());

app.use(methodOverride('_method'));
app.use(session({
    secret: 'mySecrectKey',
    resave: true,
    saveUninitialized: true,
}))


app.set('view engine', 'hbs');

app.engine('hbs', handlebars.engine({
    layoutsDir:`views/layouts/`,
    defaultLayout: 'index',
    extname: 'hbs',
    partialsDir: 'views/partials/'
}));

const path = require('path');
app.use(express.static(path.join(__dirname, './')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());


//test locals
const users = []

const loginRoute = require('./routes/login.r');
app.use('/login', isNotAuthenticated, loginRoute);

const registerpRoute = require('./routes/register.r');
const cookieParser = require('cookie-parser');
app.use('/register', isNotAuthenticated, registerpRoute);
app.delete('/logout', (req,res) => {
    req.logOut(function(err) {
        if (err) {
            return res.status(500).json({ error: 'Error during logout'})
        }
        res.redirect('/login')
    })
})

app.get('/', isAuthenticated, (req, res) => {
    res.render("home");
});



// const signoutRoute = require('./routes/signout.r');
// app.use('/signout', signoutRoute);

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
});
  