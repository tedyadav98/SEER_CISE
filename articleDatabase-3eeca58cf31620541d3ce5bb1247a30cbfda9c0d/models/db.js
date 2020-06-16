const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
var mongodb = 'mongodb://localhost:27017/ArticleDB';
//mongoose.connect('mongodb://localhost:27017/ArticleDB',{useNewUrlParser: true, useUnifiedTopology: true },(err)=>{
mongoose.connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true },(err)=>{
    if (!err){console.log('MongoDB COnnection Succeded')}
    else{console.log('Error in DB connection: '+ err)}
});

require('./article.model');