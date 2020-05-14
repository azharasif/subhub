var bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();
const functions = require('../middleware/functions');
const _ = require('lodash')
const getCheckInSchema = Joi.object().keys({
    limit: Joi.number().integer().required(),
    start: Joi.number().integer().required(),
    userid: Joi.number().integer().required(),
    waveid: Joi.number().integer(),
    searchParams: Joi.string(),
    userName: Joi.string().allow("")
});

router.post('/', async (req, res) => {
    try {

      console.log("userid" , userid);
        var validated = getCheckInSchema.validate(req.body, { abortEarly: false })
        if (!validated.error) {
            // let query = ( `select * , user.waveid as waveid  from user left   join wave w  on w.id = user.waveid  LIMIT ${req.body.limit} OFFSET ${req.body.start}`)
            var data = []
            // let query = (`select *   from checkin  left join user u   on  u.id = checkin.userid  join wave   LIMIT ${req.body.limit} OFFSET ${req.body.start}`)
            if(req.body.userName == undefined){
              req.body.userName = "";
            }
            if(req.body.waveid == undefined){
              req.body.waveid = null
            }
            let currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');;
            let query, count;
            switch(req.body.searchParams){
              case "past":
              query = `Select count(*) as totalRows from user inner join checkin u on user.id = u.userid inner join wave on wave.id=user.waveid
              WHERE ("${currentTime}" > wave.enddate) AND ("${req.body.userName}" = "" OR user.fullname = "${req.body.userName}")  `;
              count = await functions.runQuery(query);
              query = (`select *,user.id as userid, wave.name as wavename from user inner join checkin u on user.id = u.userid inner join wave on wave.id=user.waveid
              WHERE ("${currentTime}" > wave.enddate) AND ("${req.body.userName}" = "" OR user.fullname = "${req.body.userName}") LIMIT ${req.body.limit} OFFSET
              ${req.body.start}`)
              break;
              case "live":
              query = `Select count(*) as totalRows from user inner join checkin u on user.id = u.userid inner join wave on wave.id=user.waveid
              WHERE ("${currentTime}" < wave.enddate && "${currentTime}" > wave.startdate) AND ("${req.body.userName}" = "" OR
              user.fullname = "${req.body.userName}")  `;
              count = await functions.runQuery(query);
              query = (`select *,user.id as userid, wave.name as wavename from user inner join checkin u on user.id = u.userid inner join wave on wave.id=user.waveid
              WHERE ("${currentTime}" < wave.enddate && "${currentTime}" > wave.startdate) AND ("${req.body.userName}" = "" OR user.fullname = "${req.body.userName}")
              LIMIT ${req.body.limit} OFFSET ${req.body.start}`)
              break;
              case "upcoming":
              query = `Select count(*) as totalRows from user inner join checkin u on user.id = u.userid inner join wave on wave.id=user.waveid
              WHERE ("${currentTime}" < wave.startdate) AND ("${req.body.userName}" = "" OR user.fullname = "${req.body.userName}")   `;
              count = await functions.runQuery(query);
              query = (`select *,user.id as userid, wave.name as wavename from user inner join checkin u on user.id = u.userid inner join wave on wave.id=user.waveid
              WHERE ("${currentTime}" < wave.startdate) AND ("${req.body.userName}" = "" OR user.fullname = "${req.body.userName}") LIMIT ${req.body.limit} OFFSET
              ${req.body.start}`)
              break;
              case "all":
              query = `Select count(*) as totalRows from user inner join checkin u on user.id = u.userid inner join wave on wave.id=user.waveid
              WHERE ("${currentTime}" < wave.startdate) AND ("${req.body.userName}" = "" OR user.fullname = "${req.body.userName}")  `;
              count = await functions.runQuery(query);
              query = (`select *,user.id as userid, wave.name as wavename from user inner join checkin u on user.id = u.userid inner join wave on wave.id=user.waveid
              WHERE ("${currentTime}" < wave.startdate) AND ("${req.body.userName}" = "" OR user.fullname = "${req.body.userName}")`)
              break;
              default:
              query = `Select count(*) as totalRows from user inner join checkin u on user.id = u.userid inner join wave on wave.id=user.waveid
              WHERE (${req.body.waveid} is null OR wave.id = ${req.body.waveid}) AND ("${req.body.userName}" = "" OR user.fullname = "${req.body.userName}") `;
              count = await functions.runQuery(query);
              query = (`select *,user.id as userid, wave.name as wavename from user inner join checkin u on user.id = u.userid inner join wave on wave.id=user.waveid
              WHERE (${req.body.waveid} is null OR wave.id = ${req.body.waveid}) AND ("${req.body.userName}" = "" OR user.fullname = "${req.body.userName}") LIMIT
              ${req.body.limit} OFFSET ${req.body.start}`)
              break;
            }
            let queryResults = await functions.runQuery(query);
            let user = _.uniqBy(queryResults, 'userid');
            for (let i = 0; i < user.length; i++) {
                user[i] = _.pick(user[i], ['userid', 'fname', 'lname', 'mobileno', 'email', 'steplevel', 'gender', 'age', 'weight', 'height', 'activitylevel', 'itrain', 'day', 'weightgoal', 'currentphase', 'waveid', 'uwerebefore', 'emailverified', 'checkintime', 'stopdayscheck', 'image', 'caloriestarget', 'proteinstarget', 'wavename', 'noofuser', 'remaininguser', 'noofphases', 'startdate', 'enddate', 'price', 'adminid']);
                user[i].checkIn = [];
            }
            for (let i = 0; i < queryResults.length; i++) {
                let checkIn = _.pick(queryResults[i], ['lastweekweight', 'weightnow', 'trainfrequency', 'trainthisweek', 'describetraining', 'frontimage', 'backimage', 'sideimage', 'phase', 'userid']);
                let userIndex = _.findIndex(user, (obj) => {
                    return queryResults[i].userid == obj.userid;
                })
                user[userIndex].checkIn.push(checkIn);
            }

            res.send({ statusCode: 200, data: user, message: "Success retrieving check-ins" })
        }
        else {
            res.send({ statusCode: 405, message: validated.error.message })
        }

    } catch (error) {
        res.send({ statusCode: 405, message: error.message })
    }
})
module.exports = router;
