const mongoose = require('mongoose');
const { genreSchema } = require('./genre');
const uniqueValidator = require('mongoose-unique-validator');
const Joi = require('joi');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, 
        maxlength: 50, 
        minlength: 5,  
        unique: true 
    },
    genre:{ 
        type: genreSchema,
        required: true
    },
    numberInStock:{
        type: Number, 
        required: true,
        min: 0
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0
    }
})
movieSchema.plugin(uniqueValidator);
const Movie = mongoose.model('Movie', movieSchema);

//function to use JOI validation.
const validateMovie = (movieName)=>{
    const schema = {
        title : Joi.string().min(5).max(50).required(),
        genreId : Joi.objectId().required(),
        numberInStock : Joi.number().required(),
        dailyRentalRate : Joi.number().required()
    };
    return Joi.validate(movieName,schema);
}

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;