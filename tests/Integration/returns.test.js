const request = require('supertest');
const mongoose = require('mongoose');
const { Rental } = require('../../models/rental')
const { User } = require('../../models/user')
const { Movie } = require('../../models/movie');
const moment = require('moment')


describe('/api/returns', () =>{

    let server;
    let customerId;
    let movieId;
    let movie;
    let rental;
    let token;

    const exec = ()=>{
        return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send(customerId, movieId);
    }

    beforeEach( async () => { 
        server = require('../../app');
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();
        
        movie = new Movie({
            _id : movieId,
            title: '12345',
            dailyRantelRate: 2,
            genre: {name: 12345},
            numberInStock : 10 
        })

        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie:{
                _id: movieId,
                title: '12345',
                dailyRantelRate: 2
            }
        });

        await rental.save();

    })
    
    afterEach(async () => { 
        await server.close(); 
        await Rental.remove({});
        await Movie.remove({});
     });

     it('should work',async ()=>{
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
     })

     it('should should return 401 if client is not logged in.',async ()=>{
         token = '';
        const res = await exec();

        expect(res.status).toBe(401);
     })
     it('should should return 400 if custID is not passed',async ()=>{
        customerId = '';

        const res = await exec();
        
        expect(res.status).toBe(400);
     })
     it('should should return 400 if movie is not passed',async ()=>{
        movieId = '';

        const res = await exec();
        
        expect(res.status).toBe(400);
     })
     it('should should return 404 if no rental found',async ()=>{
        await rental.remove({});

        const res = await exec();
        
        expect(res.status).toBe(404);
     })
     it('should should return 400 if no rental already processed',async ()=>{
        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();
        
        expect(res.status).toBe(400);
     })
     it('should should return 200 if request valid',async ()=>{
        
        const res = await exec();
        
        expect(res.status).toBe(200);
     })
     it('should should set the return date if request valid',async ()=>{
        
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const timeDiff = new Date() - rentalInDb.dateReturned;
        
        expect(timeDiff).toBeLessThan(10*1000);
     })
     it('should should set rental amount.',async ()=>{
        rental.dateOut = moment().add(-7,'days').toDate();
        await rental.save();

        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBeDefined();
     })
     it('should should increase stock-in movie if input are valid.',async ()=>{
        
        const res = await exec();

        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock +1);
     })
     it('should should return a rental, if input are valid.',async ()=>{
        
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        // expect(res.body).toHaveProperty('dateOut');
        // expect(res.body).toHaveProperty('dateReturned');
        // expect(res.body).toHaveProperty('rentalFee');
        // expect(res.body).toHaveProperty('customer');
        // expect(res.body).toHaveProperty('movie');

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut','dateReturned','rentalFee','customer','movie'])
        )
     })
})