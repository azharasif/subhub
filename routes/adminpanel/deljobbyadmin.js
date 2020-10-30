
var bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();
const functions = require('../../middleware/functions')

const Schema = Joi.object().keys({
  userid: Joi.number().integer().required(),
  jobid: Joi.number().integer().required(),
  issuperadmin: Joi.boolean()
});
router.post('/', async (req, res) => {
  try {
   
    let validation = Schema.validate(req.body, { abortEarly: false });
    
    if (!validation.error) {
      let query = `delete from jobs where id = ${req.body.jobid}  `;
    
      let result = await functions.runQuery(query)
      
      res.send({ statusCode: 200, message: "jobs deleted by admin " });

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