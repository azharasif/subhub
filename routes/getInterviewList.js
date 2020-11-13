var bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();
const functions = require('../middleware/functions')

const userSchema = Joi.object().keys({
  userid: Joi.number().integer().required(),
  issuperadmin: Joi.boolean()
});
router.post('/', async (req, res) => {
  try {
    let validated = userSchema.validate(req.body, { abortEarly: false });
    if (!validated.error) {
        let currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      let data = await functions.runQuery(`select si.*  , j.* , u.* from scheduleInterview si left join jobs j on si.jobid = j.id left join user u on u.id = si.userid  `);
      res.send({ statusCode: 200, data: data })


    } else {
      res.send({ statusCode: 405, message: validated.error.message })
    }
  } catch (err) {
    res.send({ statusCode: 405, message: err.message });
  }

  
})
module.exports = router;
