const express = require('express');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/authentication');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User, validateUser, validatePassword } = require('../models/user');
const passwordComplexity = require('joi-password-complexity');

const complexityOption = {
    min: 5,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 5
}

router.get('/me',auth, async (req,res)=>{
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);

})
router.post('/',async (req,res)=>{
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send("Email already exist.");

    const {passwordErr} =  passwordComplexity().validate(req.body.password);
    console.log(passwordErr);
    if(passwordErr) return res.status(400).send(passwordErr);

    // user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // });
    user = new User(_.pick(req.body, ['name','email','password','isAdmin']));
    //encrypting the password using bcrypt.
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await (await user).save();
    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user, ['_id','name','email']));
})

module.exports = router;