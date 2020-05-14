const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const functions = require('../middleware/functions')

router.post('/', async function(req, res, next) {
  try{
    let validated = validateInput(req.body);
    if(!validated.error){
      let token = parseInt(Math.random()*10000).toString();
      let user = await functions.runQuery(`Select  id  from user  where email="${req.body.email}"`);
      if(!user.length) {throw({
        "message" : "Email not registered"
      });}
      token = parseInt(token + user[0].id);

      var query = (`Insert into forgotpassword (userid , code , startdate , enddate) values(${user[0].id}, ${token}, CURRENT_TIMESTAMP,
      DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 HOUR)) on duplicate key update code = values(code), startdate = values(startdate),
      enddate = values(enddate)`);

      let queryResults = await functions.runQuery(query);
      let smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'subhubappseedling@gmail.com',
          pass: 'subhub123'
        },
        tls:{
          rejectUnauthorized: false
        }
      });

      var mailOptions = {
        to: req.body.email,
        from: 'subhubappseedling@gmail.com',
        subject: 'subhub app Password Reset',
        text: 'You are receiving this because you (or someone else) has requested the reset of the password for your account.\n\n' +
          'Please paste this into your app to complete the process:\n\n'
           + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions);
      res.send({statusCode:200, message: `An e-mail has been sent to ${req.body.email} with further instructions.`});
    } else {
      res.send({statusCode: 405, message: validated.error.message});
    }
  } catch (error){
      res.send({statusCode: 405, message: error.message});
  }
});
function validateInput(input){
  const schema = Joi.object().keys({
    email: Joi.string().required(),
    issuperadmin: Joi.boolean()
  })
  const result = schema.validate(input);
  return result;
}

module.exports = router;
