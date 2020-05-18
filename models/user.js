const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxlength:50,
        minlength: 5
    },
    email:{
        type: String,
        required: true,
        maxlength:255,
        minlength: 5,
        unique: true
    },
    password:{
        type: String,
        required: true,
        maxlength:1024,
        minlength: 5
    },
    isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this.id, isAdmin: this.isAdmin},'jwtprivatekey');
    return token;
}   

const User = mongoose.model('User', userSchema);

//function to use JOI validation.
const validateUser = (user)=>{
    const schema = {
        name : Joi.string().min(5).max(50).required(),
        email : Joi.string().min(5).max(255).required().email(),
        password : Joi.string().min(5).max(255).required(),
        isAdmin : Joi.boolean().required()
    };
    return Joi.validate(user,schema);
}


module.exports.User = User;
module.exports.validateUser = validateUser;