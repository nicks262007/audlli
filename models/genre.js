const Joi = require('joi');
const mongoose = require('mongoose');


const genreSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxlength:50,
        minlength: 5
    }
})

const Genre = mongoose.model('genre', genreSchema);

//function to use JOI validation.
const validateGenre = (genreName)=>{
    const schema = {
        name : Joi.string().min(5).max(50).required()
    };
    return Joi.validate(genreName,schema);
}

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validateGenre = validateGenre;