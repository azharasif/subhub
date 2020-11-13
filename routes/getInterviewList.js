var bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();
const functions = require('../middleware/functions')

const userSchema = Joi.object().keys({
  jobid :Joi.number().integer().required(),
  userid: Joi.number().integer().required(),
  issuperadmin: Joi.boolean()
});
router.post('/', async (req, res) => {
  try {
    let validated = userSchema.validate(req.body, { abortEarly: false });
    if (!validated.error) {
        let currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      let user = await functions.runQuery(`select u.*  , si.* , j.*  from user u  left join  scheduleInterview  si on  si.userid = u.id    (selec) `);
      res.send({ statusCode: 200, message: "Interview inserted" })


    } else {
      res.send({ statusCode: 405, message: validated.error.message })
    }
  } catch (err) {
    res.send({ statusCode: 405, message: err.message });
  }

  
})
module.exports = router;