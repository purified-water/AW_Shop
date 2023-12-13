const express = require('express');
const handlebars = require("express-handlebars");
const app = express();
const port = 3000;


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

app.get('/', (req, res) => {
    res.render("home");
});

const loginRoute = require('./routes/login.r');
app.use('/login', loginRoute);

// const signupRoute = require('./routes/signup.r');
// app.use('/signup', signupRoute);

// const signoutRoute = require('./routes/signout.r');
// app.use('/signout', signoutRoute);

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
});
  