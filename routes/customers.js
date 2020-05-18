const express = require('express');
const router = express.Router();
const {Customer, validateCustomer} = require('../models/customer');


router.get('/', async (req,res)=>{
    const customers = await Customer.find().sort('name');
    res.send(customers);
})


router.get('/:id',async (req,res)=>{
    const customer = Customer.findById(req.params.id);
    if(!customer) return res.status(404).send("customer with given ID not found!!!");
    res.send(customer);
});

router.post('/', async (req,res)=>{
    const { error } = validateCustomer(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }
    let customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    })
    try {
        customer =  await customer.save();
        res.status(200).send(customer);
    } catch (error) {
        
        console.error('Error during saving customer:###########',error.message);
        res.status(400).send(error.message);
    }
})

router.put('/:id', async (req,res)=>{
    //validate body    
    const { error } = validateCustomer(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    //update first approach
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
     }, {new:true});
    if(!customer) return res.status(404).send("customer with given ID not found!!!");
    res.send(customer);
})

router.delete('/:id',async (req,res)=>{
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if(!customer) {
        return res.status(404).send('Customer not found.')
    }
    res.send(customer);
})



module.exports = router;