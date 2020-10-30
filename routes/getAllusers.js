var bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();
const functions = require('../middleware/functions')

const userSchema = Joi.object().keys({

    userid:Joi.number().integer().required(),
    issuperadmin: Joi.boolean()
});
router.get('/', async (req, res) => {
  try {
      console.log("get user data")
    let validated = userSchema.validate(req.body, { abortEarly: false });
    if (!validated.error) {
      let user = await functions.runQuery(`SELECT *  from user where issuperadmin = 0  `);
      res.send({ statusCode: 200, message: user });
    } else {
      res.send({ statusCode: 405, message: validated.error.message })
    }
  } catch (err) {
    res.send({ statusCode: 405, message: err.message });
  }

  
})
module.exports = router;
