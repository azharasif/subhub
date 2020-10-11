var bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('@hapi/joi');
const crypto = require('crypto');
const router = express.Router();
const functions = require('../middleware/functions')
const con = require('../db');
const Schema = Joi.object().keys({
    userid: Joi.number().integer().required(),
    subname: Joi.string().required().allow(""),
    rating: Joi.number().integer().required().allow(""),
    distance: Joi.number().integer().required().allow(""),
    price:Joi.number().integer().required().allow(""),
    lng:Joi.number().integer().required().allow(""),
    lat:Joi.number().integer().required().allow(""),
});

router.post('/' , async  function (req, res) {
    try{
        let validated = Schema.validate(req.body, { abortEarly: false });
    if (!validated.error) {

                 let  query = (`Select *   from jobs where  subname like concat('%',"${req.body.subname}", '%')   or
                  rating = "${req.body.rating}"   or price =  "${req.body.price}" or 
                  lng = "${req.body.lng}" or lat =" ${req.body.lat}"`);
                  console.log(query)
                 let result =  await functions.runQuery(query);
                 res.send({statusCode:200, data:result})
                }
                
                else {
                    res.send({ statusCode: 405, message: validated.error.message });
                }
 }
    catch(err){

        res.send({statusCode:500 , message:err.message})
    }



})
    module.exports = router;
