
const express = require('express');
const router = express.Router();
const moment = require('moment')

const auth = require('../middleware/auth');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const validate = require('../middleware/validateReq');



router.get('/',[auth,validate(validateReturn)] ,async (req, res)=>{
    // if(!req.body.customerId) return res.status(400).send("customer ID not found!");
    // if(!req.body.movieId) return res.status(400).send("movie ID not found!");

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if(!rental) return res.status(404).send("No Rental found for above movie/cutomer.");
    if(rental.dateReturned) return res.status(400).send("Rental already sattled");

    rental.return();
    await rental.save();

    await Movie.update({_id: rental.movie._id}, {
            $inc: { numberInStock: 1 }
        })

    return res.status(200).send("rental completed");


})

//function to use JOI validation.
const validateReturn = (req)=>{
    const schema = {
        customerId : Joi.objectId().required(),
        movieId : Joi.objectId().required()
    };
    return Joi.validate(req,schema);
}

module.exports = router;