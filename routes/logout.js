var bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('@hapi/joi');
const crypto = require('crypto');
const router = express.Router();
const functions = require('../middleware/functions')


const logoutSchema = Joi.object().keys({
    offset: Joi.number().integer(),
    userid: Joi.number().integer().required(),
    token: Joi.string().allow(""),
    issuperadmin: Joi.boolean()
});
router.post('/', async function (req, res) {

    try {
        var validated = logoutSchema.validate(req.body, { abortEarly: false });

        if (!validated.error) {
         
            queryResult = (`Delete from authtoken where token= '${req.headers.authorization}'`);
            result = await functions.runQuery(queryResult)
            res.send({ statusCode: 200, message: "Logout sucessfully" })
        }

    } catch (error) {
        res.send({ statusCode: 405, message: error.message });
    }
})



module.exports = router;
