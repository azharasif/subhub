var bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();
const functions = require('../middleware/functions')

const userSchema = Joi.object().keys({
  oldpassword: Joi.string().required(),
  newpassword: Joi.string().required(), 
  userid: Joi.number().integer().required(),
  offset: Joi.number().integer(),
  issuperadmin: Joi.boolean()
});
router.post('/', async (req, res) => {
  try {
    let validated = userSchema.validate(req.body, { abortEarly: false });
    if (!validated.error) {
      let user = await functions.runQuery(`SELECT  password FROM user  WHERE id = ${req.body.userid}`);
      if (user.length) {
        var hash = bcrypt.compareSync(req.body.oldpassword, user[0].password);
        if (hash == false) {
          res.send({ statusCode: 405, message: "Invalid Password" })
        } else {
          const hashedPassword = bcrypt.hashSync(req.body.newpassword, 8);
          let queryResults = await functions.runQuery(`UPDATE user SET  password = "${hashedPassword}" WHERE id = ${req.body.userid}`);
          res.send({ statusCode: 200, message: "Password updated" });
        }
      } else {
        res.send({ statusCode: 405, message: "Pasword not found" });
      }

    } else {
      res.send({ statusCode: 405, message: validated.error.message })
    }
  } catch (err) {
    res.send({ statusCode: 405, message: err.message });
  }

})
module.exports = router;
