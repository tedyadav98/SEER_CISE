require('./models/db');

const express = require('express');
const path = require('path');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');

const articleController = require('./controllers/articleController');
//const searchControl = require('./controllers/searchControl');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
var app = express();
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({extname: 'hbs', defaultLayout: 'mainlayout', lauoutsdir:__dirname + '/views/layouts/', handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine','hbs');

app.listen(3000, () =>{
    console.log('Express server startedat port : 3000');
});

app.use('/article', articleController);
//app.use('/search',searchControl);



