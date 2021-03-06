var bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();
const functions = require('../middleware/functions')

const userSchema = Joi.object().keys({
    userid: Joi.number().integer().required(),
    subname: Joi.string().required(),
    rating: Joi.number().integer().required(),
    distance: Joi.number().integer().required(),
    price: Joi.number().integer().required(),
    lng: Joi.string().required(),
    lat: Joi.string().required(),
    address:Joi.string().required(),
    issuperadmin: Joi.boolean()
});
router.post('/', async (req, res) => {
    try {
        let validated = userSchema.validate(req.body, { abortEarly: false });
        if (!validated.error) {
            console.log(req.body)
            var query = `insert into jobs  (postby  , subname , rating , distance ,price ,lng ,lat , address) values("admin" ,  "${req.body.subname}"  ,${req.body.rating} , ${req.body.distance} , ${req.body.price} ,"${req.body.lng}" ,"${req.body.lat}" , "${req.body.address}"  )`
           console.log(query)
            let user = await functions.runQuery(query);
            res.send({ statusCode: 200, message: "job added by admin" })

        } else {
            res.send({ statusCode: 405, message: validated.error.message })
        }
    } catch (err) {
        res.send({ statusCode: 405, message: err.message });
    }


})
module.exports = router;
