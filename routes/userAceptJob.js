var bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();
const functions = require('../middleware/functions')

const userSchema = Joi.object().keys({
  userid: Joi.number().integer().required(),
  jobid:Joi.number().integer().required(),
  issuperadmin: Joi.boolean()
});
router.post('/', async (req, res) => {
  try {
    let validated = userSchema.validate(req.body, { abortEarly: false });
    if (!validated.error) {
        var query = `update user set jobid = ${req.body.jobid}  where id = ${req.body.userid}`
      let user = await functions.runQuery(query);
      console.log(query)
      
        res.send({statusCode:200 , message: "job added"})

    } else {
      res.send({ statusCode: 405, message: validated.error.message })
    }
  } catch (err) {
    res.send({ statusCode: 405, message: err.message });
  }

  
})
module.exports = router;
