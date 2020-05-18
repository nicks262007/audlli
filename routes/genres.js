require('express-async-errors');
const express = require('express');
const router = express.Router();
const { Genre, validateGenre } = require('../models/genre');
const auth = require('../middleware/authentication');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');


// router.get('/',asyncMiddleware(async (req, res)=>{
//         const genres = await Genre.find().sort('name');
//         res.send(genres);
    
// }))


router.get('/',async (req, res)=>{
    // throw new Error('unable to fetch genres.');
    const genres = await Genre.find().sort('name');
    res.send(genres);

})

router.get('/:id',async (req,res)=>{
       const genre = Genre.findById(req.params.id);
        if(!genre) return res.status(404).send("genre with given ID not found!!!");
        res.send(genre);    
});

router.post('/', auth, async (req,res)=>{
    //way to handle request validation.
    // if(!req.body.name || req.body.name.length <3){
    //     res.status(400).send("Course name is required.");
    //     return;
    // }
    //using joi 
    const {error} = validateGenre(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    let genre = new Genre({ name : req.body.name });
    genre = await genre.save();
    res.status(200).send(genre);
})

router.put('/:id', async (req,res)=>{

    //validate body    
    const { error } = validateGenre(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    //update first approach
    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        name: req.body.name
     }, {new:true});
    if(!genre) return res.status(404).send("genre with given ID not found!!!");
    res.send(genre);
})

router.delete('/:id',[auth, admin],async (req,res)=>{
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if(!genre) {
        return res.status(404).send('course not found.')
    }
    res.send(genre);
})




module.exports = router;