const mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    year: {
        type: String
    },
    doi: {
        type: String
    },
    rating: {
        type: String
    }
});

mongoose.model('Articles', articleSchema);