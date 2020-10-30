
var bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();
const functions = require('../../middleware/functions')

const Schema = Joi.object().keys({
  userid: Joi.number().integer().required(),
  jobid: Joi.number().integer().required(),
  subname: Joi.string().required().allow(""),
  rating: Joi.number().integer().required().allow(""),
  distance: Joi.number().integer().required().allow(""),
  price: Joi.number().integer().required().allow(""),
  lng: Joi.string().required().allow(""),
  lat: Joi.string().required().allow(""),
  issuperadmin: Joi.boolean()
});
router.post('/', async (req, res) => {
  try {
   
    let validation = Schema.validate(req.body, { abortEarly: false });
    
    if (!validation.error) {
      let query = ` update jobs set postby = "admin" ,  subname = "${req.body.subname}" ,  rating = ${req.body.rating} , distance = ${req.body.distance} , price = ${req.body.city} ,  lng = "${req.body.lng}" , lat = "${req.body.lat}"  where id = ${req.body.jobid}  `;
      console.log(query)
      let result = await functions.runQuery(query)
      
      res.send({ statusCode: 200, message: "Profile updated  by admin " });

    }
    else {
    

      res.send({ statusCode: 405, message: validation.error.message });
    }
  }
  catch (err) {
   {
      console.log(err)
      res.send({ statusCode: 405, message: err.message });
    }
  }

});

module.exports = router;