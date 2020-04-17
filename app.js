const Joi = require('joi');
const express = require('express');
const app = express();

//middleware to extract body
app.use(express.json());

const genres =[
    {id : 1, name:"soft"},
    {id : 2, name:"love"},
    {id : 3, name:"party"},
    {id : 4, name:"workout"}
]

app.get('/api/genres',(req,res)=>{
    res.send(genres);
})

app.get('/api/genres/:id',(req,res)=>{
  const genre = genres.find(gen=>gen.id === parseInt(req.params.id));
  if(!genre) return res.status(404).send("genre with given ID not found!!!");
  res.send(genre);
});

app.post('/api/genres',(req,res)=>{
    //way to handle request validation.
    // if(!req.body.name || req.body.name.length <3){
    //     res.status(400).send("Course name is required.");
    //     return;
    // }
    //using joi
    const {error} = validateRequest(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const genre = {
        id : genres.length +1,
        name : req.body.name
    }
    genres.push(genre);
    res.status(200).send(genre);
})

app.put('/api/genres/:id',(req,res)=>{
    //validate route parm from req.
    const genre = genres.find(gen=>gen.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send("genre with given ID not found!!!");
    //validate body    
    const { error } = validateRequest(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    //update the course
    genre.name = req.body.name;
    res.send(genre);
})

app.delete('/api/genres/:id',(req,res)=>{
    //validate route parm from req.
    const genre = genres.find(gen=>{ return gen.id === parseInt(req.params.id)});
    if(!genre) {
        return res.status(404).send('course not found.')
    }
    const index = genres.indexOf(genre);
    genres.splice(index,1);
    res.send(genre);
})

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`listening to port ${port}!`);
})

//function to use JOI validation.
const validateRequest = (genreName)=>{
    const schema = {
        name : Joi.string().min(3).max(30).required()
    };
    return Joi.validate(genreName,schema);
}