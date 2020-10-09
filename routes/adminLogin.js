
const mysql = require("mysql");
const express = require('express');
var bcrypt = require('bcryptjs');
const crypto = require('crypto');
const router = express.Router();
const Joi = require('@hapi/joi');
// const config = require('../../config/databaseconfig');
// const connection = config.connection ;
const functions = require('../middleware/functions');
const userSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
  issuperadmin: Joi.boolean()
});

router.post('/', async function (req, res, next) {

  let validated = await userSchema.validate(req.body, { abortEarly: false });
  try {
    if (!validated.error) {
      let query = (`SELECT id , email, password, issuperadmin FROM user  WHERE email = '${req.body.email}'`);

      let user = await functions.runQuery(query);
      if (user.length) {
        if(user[0].issuperadmin){
          var hash = bcrypt.compareSync(req.body.password, user[0].password);
          if (hash == false) {
            res.send({ statusCode: 405, message: "Invalid credentials" })
          }
          else {
            let token = crypto.randomBytes(32).toString('hex');
            const response = {
              "token": token,
            }
            let query = `Insert into authtoken (token , userid, startdate, enddate) values("${response.token}" ,${user[0].id},
            CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP,  INTERVAL 12 DAY))`;
            await functions.runQuery(query);
            res.send({ statusCode: 200, data: response, message: "Logged in sucessfully" })
          }
        } else{
            res.send({ statusCode: 405, "message": "Access denied" });
        }
      } else {
        res.send({ statusCode: 405, "message": "Email not registered" });
      }
    } else {
      res.send({ statusCode: 405, "message": validated.error.message })
    }
  } catch (err) {
    res.send({ statusCode: 405, "message": err.message })
  }
})

module.exports = router;
