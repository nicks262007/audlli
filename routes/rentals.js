const express = require('express');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const router = express.Router();
const {Rental, validateRantel} = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');

Fawn.init(mongoose);

router.get('/',async (req,res)=>{
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
})

router.get('/:id',async (req,res)=>{
    const movie = Movie.findById(req.params.id);
    if(!movie) return res.status(404).send("Movie with given ID not found!!!");
    res.send(movie);
});

router.post('/', async (req,res)=>{
    const {error} = validateRantel(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid Customer.');

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid Movie.');

    if(movie.numberInStock === 0) return res.status(400).send('Movie is not in stock.');

    let rental = new Rental({ 
        customer : {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie : {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try {
        var task = Fawn.Task();
        task.save('rentals', rental);
        task.update('movies', {_id: movie._id}, {$inc: {numberInStock: -1}});
        task.run();
    } catch (error) {
        res.status(500).send('Something went wrong!!!');
    }
    res.status(200).send(rental);
})

router.put('/:id', async (req,res)=>{

    //validate body    
    const { error } = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return status(400).send('Invalid Genre..');

    //update first approach
    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        name: req.body.title,
        genre:{_id: genre._id, name: genre.name},
        numberInStock : req.body.numberInStock,
        dailyRentalRate : req.body.dailyRentalRate        
     }, {new:true});
    if(!movie) return res.status(404).send("movie with given ID not found!!!");
    res.send(movie);
})

router.delete('/:id',async (req,res)=>{
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if(!movie) {
        return res.status(404).send('Movie not found.')
    }
    res.send(movie);
})




module.exports = router;