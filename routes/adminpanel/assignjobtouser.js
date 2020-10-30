
var bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();
const functions = require('../../middleware/functions')

const Schema = Joi.object().keys({
  userid: Joi.number().integer().required(),
  jobid: Joi.number().integer().required(),
  userid: Joi.number().integer().required(),
  issuperadmin: Joi.boolean()
});
router.post('/', async (req, res) => {
  try {
   
    let validation = Schema.validate(req.body, { abortEarly: false });
    
    if (!validation.error) {
      let query = ` update user set jobid = ${req.body.jobid}  where id = ${req.body.userid}  `;
      console.log(query)
      let result = await functions.runQuery(query)
      
      res.send({ statusCode: 200, message: "Job assign to user" });

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