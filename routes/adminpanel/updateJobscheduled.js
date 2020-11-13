var bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();
const functions = require('../../middleware/functions')

const userSchema = Joi.object().keys({
  id :Joi.number().integer().required(),
  userid: Joi.number().integer().required(),
  status:Joi.number().integer().required().allow(0,1),
  issuperadmin: Joi.boolean()
});
router.post('/', async (req, res) => {
  try {
    let validated = userSchema.validate(req.body, { abortEarly: false });
    if (!validated.error) {
        let currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      let data = await functions.runQuery(`update scheduleInterview set isjobaccept = ${req.body.status}  where id = ${req.body.id} `);
      res.send({ statusCode: 200, message:"status updated"  })


    } else {
      res.send({ statusCode: 405, message: validated.error.message })
    }
  } catch (err) {
    res.send({ statusCode: 405, message: err.message });
  }

  
})
module.exports = router;
