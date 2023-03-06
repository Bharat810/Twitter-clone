const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        UserId : {
            required : true,
            type : String,
            max: 140,
            min:1,
        },
        tweet : {
            required : true,
            type : String
        }



    }
)

module.exports = mongoose.model('Post',postSchema)