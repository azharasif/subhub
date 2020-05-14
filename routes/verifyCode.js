const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const functions = require('../middleware/functions')



const CodeSchema = Joi.object().keys({
    code: Joi.number().integer().required(),
    issuperadmin: Joi.boolean()
  });
router.post('/', async function(req, res, next) {
  try{
    var validated = CodeSchema.validate(req.body, {abortEarly:false});
    if (!validated.error){
        var queryResults = await functions.runQuery(`select code from forgotpassword where code =${req.body.code}`);
        if(queryResults.length){
          res.send({statusCode: 200, message: "Code matched"});
        }else{
          res.send({statusCode: 405, message: "Code didn't match"});
        }
      } else {
        res.send({statusCode: 405, message: validated.error.message});
    }
  }catch (error){
      res.send({statusCode: 405, message: error.message});
    }
})
module.exports = router;
