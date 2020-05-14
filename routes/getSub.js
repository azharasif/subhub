var bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('@hapi/joi');
const crypto = require('crypto');
const router = express.Router();
const functions = require('../middleware/functions')
const con = require('../db');

router.get('/' , async  function (req, res) {
    try{
        
                 let  query = (`select  postby , subname , rating , distance , price , profile  from subname`);
                 let result =  await functions.runQuery(query);
                 res.send({statusCode:200, data:result})
    }
    catch(err){

        res.send({statusCode:500 , message:err.message})
    }



})
    module.exports = router;
