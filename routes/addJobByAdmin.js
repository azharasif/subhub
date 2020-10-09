var bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();
const functions = require('../middleware/functions')

const userSchema = Joi.object().keys({
  userid: Joi.number().integer().required(),
  postby:Joi.string().required(),
  subname:Joi.string().required(),
  rating:Joi.number().integer().required(),
  distance:Joi.number().integer().required(),
  price:Joi.number().integer().required(),
  profile:Joi.string().required(),
  long:Joi.string().required(),
  lat:Joi.string().required(),
  issuperadmin: Joi.boolean()
});
router.post('/', async (req, res) => {
  try {
    let validated = userSchema.validate(req.body, { abortEarly: false });
    if (!validated.error) {
        console.log(req.body)
        var query = ``
      let user = await functions.runQuery(query);
      
      
        res.send({statusCode:200 , message: "job added"})

    } else {
      res.send({ statusCode: 405, message: validated.error.message })
    }
  } catch (err) {
    res.send({ statusCode: 405, message: err.message });
  }

  
})
module.exports = router;
