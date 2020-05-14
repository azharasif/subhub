const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const functions = require('../middleware/functions')
// const functions = require('../../middleware/functions');
var bcrypt = require('bcryptjs');



const resetPassword = Joi.object().keys({
    code: Joi.number().integer().required(),
    password: Joi.string().required(),
    issuperadmin: Joi.boolean()
});
router.post('/', async function (req, res, next) {
  try{
    var validated = resetPassword.validate(req.body, { abortEarly: false });
    if(!validated.error){
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);
        var queryResults = await functions.runQuery(`Update user  set  password = "${hashedPassword}" where id in(Select userid from forgotpassword where code = ${req.body.code})`);
        res.send({ statusCode: 200, message: "Password updated" });
    }
    else {
        res.send({ statusCode: 405, message: validated.error.message });
    }
  } catch(error) {
        res.send({ statusCode: 405, message: error.message });
  }

})

module.exports = router;
