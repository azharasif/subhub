
var bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();
const functions = require('../../middleware/functions')

const Schema = Joi.object().keys({
  userid: Joi.number().integer().required(),
  id: Joi.number().integer().required(),
  fullname:Joi.string().required().allow(""),
  phone:Joi.string().required().allow(""),
  city:Joi.string().required().allow(""),
  issuperadmin: Joi.boolean()
});
router.post('/', async (req, res) => {
  try {
   
    let validation = Schema.validate(req.body, { abortEarly: false });
    
    if (!validation.error) {
      let query = ` update user set fullname = "${req.body.fullname}" ,  phone = "${req.body.phone}" , city = "${req.body.city}"  where id = ${req.body.id}  `;
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