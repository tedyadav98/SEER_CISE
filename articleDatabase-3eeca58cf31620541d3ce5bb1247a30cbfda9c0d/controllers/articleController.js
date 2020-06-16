const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Article = mongoose.model('Articles');

router.get('/',(req, res)=>{
    res.render("article/addOrEdit",{
        viewTitle : "Insert Article"
    });
});

// router.get('/',(req, res)=>{
//     res.render("search/searchBar",{
//         viewTitle : "Search Article"
//     });
// });

router.post('/',(req, res)=>{
    if(req.body._id=='')
    insertRecord(req,res);
    else
    updateRecord(req,res);
    
});
router.post('/update',(req, res)=>{
    
    updateRecord(req,res);
    
});

function updateRecord(req,res){
    Article.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err,doc)=>{
        if(!err){
            res.redirect('article/list');
        }
        else{
            console.log('Error during record insertion : '+ err);
        }

    });
}    

function insertRecord(req,res){
    var article = new Article();
    article.title = req.body.title;
    article.description = req.body.description;
    article.year = req.body.year; 
    article.doi = req.body.doi;
    article.rating = req.body.rating
    article.save((err, doc) => {
        if(!err)
            res.redirect('article/list');
        else
        {
            console.log('Error during record insertion : '+ err);
        }
        
    });
}

router.get('/list', (req, res) => {
    Article.find((err, docs) => {
        if (!err) {
            res.render("article/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving article list :' + err);
        }
    });
});
        //start of the search function
        router.get('/listsearch', (req, res) => {
            
            //using the regex function to generalize the text from user input
            const regexT = new RegExp(escapeRegex(req.query.searchTitle), 'gi');
            const regexD = new RegExp(escapeRegex(req.query.searchDescription), 'gi');
            const regexA = new RegExp(escapeRegex(req.query.searchdoi), 'gi');
            
            // const regexY = new RegExp(escapeRegex(req.query.searchYear), 'gi');
            // const regexS = new RegExp(escapeRegex(req.query.sort), 'gi');
            
            // to be added for the sort 
            if(req.query.sort=='title')
            {
                var mysort = { title: 1 };
            }
            else if(req.query.sort=='title descending')
            {
                var mysort = { title: -1 };
            }
            else if(req.query.sort=='description descending')
            {
                var mysort = { description: -1 };
            }
            else if(req.query.sort=='description')
            {
                var mysort = { description: -1 };
            }
            if(req.query.sort=='year')
            {
                var mysort = { year: 1 };
            }
            else if(req.query.sort=='year descending')
            {
                var mysort = { year: -1 };
            }
            else if(req.query.sort=='none')
            {
                var mysort = {};
            }

            else if(req.query.sort=='DOI')
            {
                var mysort = {doi: 1};
            }
            else if(req.query.sort=='DOI descending')
            {
                var mysort = {doi: -1};
            }
            else if(req.query.sort=='Rating')
            {
                var mysort = {rating: 1};
            }
            else if(req.query.sort=='Rating descending')
            {
                var mysort = {rating: -1};
            }

            // to be added for hidding the fields
            var myfield = "";
            if(req.query.hide=='title')
            {
                var myfield = "-title";
            }
            else if(req.query.hide=='author')
            {
                var myfield = "-description";
            }
            else if(req.query.hide=='year')
            {
                var myfield = "-year";
            }
            else if(req.query.hide=='DOI')
            {
                var myfield = "-doi";
            }
            else if(req.query.hide=='title and DOI')
            {
                var myfield = ["-title","-doi"];
            }
            else if(req.query.hide=='year and DOI')
            {
                var myfield = ["-year","-doi"];
            }
            else if(req.query.hide=='Author and DOI')
            {
                var myfield = ["-description","-doi"];
            }
            
            else if(req.query.hide=='author and year')
            {
                var myfield = ["-description","-year"];
            }
            else if(req.query.hide=='title and year')
            {
                var myfield= ["-title", "-year"] ;
            }
            else if(req.query.hide=='title and author')
            {
                var myfield = ["-title","-description"];
            }
            else if(req.query.hide=='title, author and DOI')
            {
                var myfield = ["-title","-description","-doi"];
            }
            else if(req.query.hide=='year, DOI and title')
            {
                var myfield = ["-title","-year","-doi"];
            }
            else if(req.query.hide=='Author, DOI and year')
            {
                var myfield = ["-description","-year","-doi"];
            }
            else if(req.query.hide=='Author, year and title')
            {
                var myfield = ["-description","-year","-title"];
            }
            else if(req.query.hide=='none')
            {
                var myfield = "";
            }
           
          
                    //all the if and else statements for the user input 
                    //if all the fields are provided by the user
                    if((req.query.searchTitle)&&(req.query.searchDescription)&&(req.query.searchYearLow)&&(req.query.searchYearHigh)&&(req.query.searchdoi))
                    {
                        Article.find({title : regexT,description : regexD,doi: regexA, year : {$gte:req.query.searchYearLow,$lte:req.query.searchYearHigh}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch",{ 
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((req.query.searchTitle)&&(req.query.searchDescription)&&(req.query.searchYearLow)&&(!req.query.searchYearHigh)&&(req.query.searchdoi))
                    {
                        Article.find({title : regexT,description : regexD,doi: regexA, year : {$gte:req.query.searchYearLow}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch",{ 
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((req.query.searchTitle)&&(req.query.searchDescription)&&(!req.query.searchYearLow)&&(req.query.searchYearHigh)&&(req.query.searchdoi))
                    {
                        Article.find({title : regexT,description : regexD,doi: regexA, year : {$lte:req.query.searchYearHigh}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch",{ 
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((req.query.searchTitle)&&(req.query.searchDescription)&&(!req.query.searchYearLow)&&(!req.query.searchYearHigh)&&(req.query.searchdoi))
                    {
                        Article.find({title : regexT,description : regexD,doi: regexA}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch",{ 
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }
                
                    //if the title and description are provided
                    else if((req.query.searchTitle)&&(req.query.searchDescription)&&(!req.query.searchYearLow)&&(!req.query.searchYearHigh)&&(!req.query.searchdoi))
                    {
                            Article.find({title: regexT,description : regexD}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((req.query.searchTitle)&&(!req.query.searchDescription)&&(!req.query.searchYearLow)&&(!req.query.searchYearHigh)&&(req.query.searchdoi))
                    {
                            Article.find({title: regexT,doi : regexA}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((req.query.searchTitle)&&(!req.query.searchDescription)&&(req.query.searchYearLow)&&(!req.query.searchYearHigh)&&(req.query.searchdoi))
                    {
                            Article.find({title: regexT,doi : regexA, year: {$gte:req.query.searchYearLow}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((req.query.searchTitle)&&(!req.query.searchDescription)&&(!req.query.searchYearLow)&&(req.query.searchYearHigh)&&(req.query.searchdoi))
                    {
                            Article.find({title: regexT,doi : regexA, year: {$lte:req.query.searchYearHigh}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((req.query.searchTitle)&&(!req.query.searchDescription)&&(req.query.searchYearLow)&&(req.query.searchYearHigh)&&(req.query.searchdoi))
                    {
                            Article.find({title: regexT,doi : regexA, year: {$gte:req.query.searchYearLow,$lte:req.query.searchYearHigh}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((!req.query.searchTitle)&&(req.query.searchDescription)&&(req.query.searchYearLow)&&(req.query.searchYearHigh)&&(req.query.searchdoi))
                    {
                            Article.find({description: regexD,doi : regexA, year: {$gte:req.query.searchYearLow,$lte:req.query.searchYearHigh}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((!req.query.searchTitle)&&(req.query.searchDescription)&&(!req.query.searchYearLow)&&(req.query.searchYearHigh)&&(req.query.searchdoi))
                    {
                            Article.find({description: regexD,doi : regexA, year: {$lte:req.query.searchYearHigh}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((!req.query.searchTitle)&&(req.query.searchDescription)&&(req.query.searchYearLow)&&(!req.query.searchYearHigh)&&(req.query.searchdoi))
                    {
                            Article.find({description: regexD,doi : regexA, year: {$gte:req.query.searchYearLow}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((!req.query.searchTitle)&&(req.query.searchDescription)&&(!req.query.searchYearLow)&&(!req.query.searchYearHigh)&&(req.query.searchdoi))
                    {
                            Article.find({description: regexD,doi : regexA}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((req.query.searchTitle)&&(req.query.searchDescription)&&(req.query.searchYearLow)&&(!req.query.searchYearHigh)&&(!req.query.searchdoi))
                    {
                            Article.find({title: regexT,description : regexD, year: {$gte:req.query.searchYearLow}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((req.query.searchTitle)&&(req.query.searchDescription)&&(!req.query.searchYearLow)&&(req.query.searchYearHigh)&&(!req.query.searchdoi))
                    {
                            Article.find({title: regexT,description : regexD, year: {$lte:req.query.searchYearHigh}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((req.query.searchTitle)&&(req.query.searchDescription)&&(req.query.searchYearLow)&&(req.query.searchYearHigh)&&(!req.query.searchdoi))
                    {
                            Article.find({title: regexT,description : regexD, year: {$gte:req.query.searchYearLow,$lte:req.query.searchYearHigh}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }
                    //if the title is provided 
                    else if((req.query.searchTitle)&&(!req.query.searchDescription)&&(!req.query.searchYearLow)&&(!req.query.searchYearHigh)&&(!req.query.searchdoi))
                    {
                        Article.find({title : regexT},  function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    //if the year range is provided
                   else if((!req.query.searchTitle)&&(!req.query.searchDescription)&&(req.query.searchYearLow)&&(req.query.searchYearHigh)&&(!req.query.searchdoi))
                    {
                        Article.find({year : {$gte:req.query.searchYearLow,$lte:req.query.searchYearHigh}},function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((!req.query.searchTitle)&&(!req.query.searchDescription)&&(!req.query.searchYearLow)&&(req.query.searchYearHigh)&&(!req.query.searchdoi))
                    {
                        Article.find({year : {$lte:req.query.searchYearHigh}},function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((!req.query.searchTitle)&&(!req.query.searchDescription)&&(req.query.searchYearLow)&&(!req.query.searchYearHigh)&&(!req.query.searchdoi))
                    {
                        Article.find({year : {$gte:req.query.searchYearLow}},function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }
            
                    //if the description is provided
                   else if((!req.query.searchTitle)&&(req.query.searchDescription)&&(!req.query.searchYearLow)&&(!req.query.searchYearHigh)&&(!req.query.searchdoi))
                    {
                        Article.find({description : regexD}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((!req.query.searchTitle)&&(!req.query.searchDescription)&&(!req.query.searchYearLow)&&(!req.query.searchYearHigh)&&(req.query.searchdoi))
                    {
                        Article.find({doi : regexA}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }


                    //if the title and year range are provided
                    else if((req.query.searchTitle)&&(!req.query.searchDescription)&&(req.query.searchYearLow)&&(req.query.searchYearHigh)&&(!req.query.searchdoi))
                    {
                        Article.find({title : regexT,year : {$gte:req.query.searchYearLow,$lte:req.query.searchYearHigh}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((!req.query.searchTitle)&&(req.query.searchDescription)&&(req.query.searchYearLow)&&(req.query.searchYearHigh)&&(!req.query.searchdoi))
                    {
                        Article.find({description : regexD,year : {$gte:req.query.searchYearLow,$lte:req.query.searchYearHigh}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }


                    else if((!req.query.searchTitle)&&(!req.query.searchDescription)&&(req.query.searchYearLow)&&(req.query.searchYearHigh)&&(req.query.searchdoi))
                    {
                        Article.find({doi : regexA,year : {$gte:req.query.searchYearLow,$lte:req.query.searchYearHigh}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }


                    //if the description and year range are provided
                    else if((!req.query.searchTitle)&&(req.query.searchDescription)&&(req.query.searchYearLow)&&(!req.query.searchYearHigh)&&(!req.query.searchdoi))
                    {
                            Article.find({description: regexD, year:{$gte:req.query.searchYearLow}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }    

                    else if((!req.query.searchTitle)&&(req.query.searchDescription)&&(!req.query.searchYearLow)&&(req.query.searchYearHigh)&&(!req.query.searchdoi))
                    {
                            Article.find({description: regexD, year:{$lte:req.query.searchYearHigh}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    } 

                    else if((req.query.searchTitle)&&(!req.query.searchDescription)&&(req.query.searchYearLow)&&(!req.query.searchYearHigh)&&(!req.query.searchdoi))
                    {
                        Article.find({title : regexT,year : {$gte:req.query.searchYearLow}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((!req.query.searchTitle)&&(!req.query.searchDescription)&&(req.query.searchYearLow)&&(!req.query.searchYearHigh)&&(req.query.searchdoi))
                    {
                        Article.find({doi : regexA,year : {$gte:req.query.searchYearLow}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }

                    else if((!req.query.searchTitle)&&(!req.query.searchDescription)&&(!req.query.searchYearLow)&&(req.query.searchYearHigh)&&(req.query.searchdoi))
                    {
                        Article.find({doi : regexA,year : {$lte:req.query.searchYearHigh}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }


                    else if((req.query.searchTitle)&&(!req.query.searchDescription)&&(!req.query.searchYearLow)&&(req.query.searchYearHigh)&&(!req.query.searchdoi))
                    {
                        Article.find({title : regexT,year : {$lte:req.query.searchYearHigh}}, function(err, docs){
                            if (!err) {
                                res.render("article/listsearch", {
                                    list: docs
                                });
                            }
                            else {
                                console.log('Error in retrieving article list :' + err);
                            }
                        }).sort(mysort).select(myfield);//add .sort for sort and .select for the fields to be hidden
                    }
                     
        });
            


     

        function escapeRegex(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        };

        router.get('/:id',(req, res)=>{
            Article.findById(req.params.id, (err, doc) =>{
                if(!err){
                    res.render("article/update", {
                        viewTitle: "Moderate Article",
                        
                        article: doc
                    });
                }
            });
            
        });
        router.get('/delete/:id', (req,res)=>{
           Article.findByIdAndRemove(req.params.id, (err,doc)=>{
            if(!err){
                res.redirect('/article/list');
            }
            else{
                console.log('Error in article delete : '+err)
            }
        });
        });
    

module.exports = router;