const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb+srv://dbUser:KobeBryant24@cluster0-jnvsr.mongodb.net/ArticleDB?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true },(err)=>{
    if (!err){console.log('MongoDB COnnection Succeded')}
    else{console.log('Error in DB connection: '+ err)}
});

require('./article.model');