const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    isGold: {type: Boolean, default: false},
    name:{ type: String, required: true, maxlength:50, minlength:5,  unique: true },
    phone:{type: String, required: true, maxlength:50, minlength:5}
})
customerSchema.plugin(uniqueValidator);
const Customer = mongoose.model('Customer', customerSchema);

//function to use JOI validation.
const validateCustomer = (customerName)=>{
    const schema = {
        name : Joi.string().min(5).max(50).required(),
        phone : Joi.string().min(5).max(50).required(),
        isGold : Joi.boolean()
    };
    return Joi.validate(customerName,schema);
}

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;