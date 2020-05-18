const express = require('express');
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/',async (req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Incorrect Email or password.");

    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send("Incorrect Email or password.");
   
    // const token = jwt.sign({_id: user.id},config.get('jwtprivatekey'));
    const token = user.generateAuthToken();
    res.send(token);
})

const validate = (req)=>{
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password : Joi.string().min(5).max(255).required() 
    }
    return Joi.validate(req,schema);
}

module.exports = router;