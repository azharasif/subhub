const con = require('../db.js');
const { Expo } = require('expo-server-sdk');
const _ = require('lodash');
let expo = new Expo();

exports.runQuery = function (query){
  return new Promise((resolve, reject) => {
    con.query(query, (err, queryResults) => {
      if(err){
        reject(err);
      }
      else{
        resolve(queryResults);
      }
    })
  })
}
// exports.roundNumber = function (value, step) {
//   var inv = 1.0 / step;
//   return Math.round(value * inv) / inv;
// }

// exports.sendTipsNotifications = async function(start){
//   try{
//     let countResults = await exports.runQuery(`Select count(id) as count from devicetokens`);
//     let userDevices = await exports.runQuery(`Select d.deviceid as deviceid, d.userid as userid, u.offset, u.day, u.currentphase, u.checkintime,
//       s.stoptime, s.restarttime, u.steplevel from devicetokens d inner join user u on u.id = d.userid left join stopdays s on u.id = s.userid
//       inner join (Select id from devicetokens limit 100 offset ${start}) as d2 on d.id = d2.id`);
//       let query =` UPDATE user SET day = CASE id `;
//       let devicesFound={
//         id: [],
//         day:[]
//       }
//       let stringIds = '(';
//       let user = _.uniqBy(userDevices, "userid");
//       let j = 0;
//       user[j].stopdays = []
//       for(let i = 0; i < userDevices.length; i++){
//         if(user[j].userid == userDevices[i].userid){
//           user[j].stopdays.push({
//             stoptime: userDevices[i].stoptime,
//             restarttime: userDevices[i].restarttime
//           })
//         } else{
//           j = j + 1;
//           user[j].stopdays = []
//           i = i - 1;
//         }
//       }
//       let daysPassed = await exports.calculateDaysPassed(user, 0);
//       for(let i = 0; i < user.length; i++){
//         let currentTime = new Date();
//         await currentTime.setMinutes(currentTime.getMinutes()  - new Date().getTimezoneOffset());
//         let hours =currentTime.getHours();
//         if(user[i].day != daysPassed[i] && hours >= 6){
//           query+=`WHEN ${user[i].userid} THEN ${daysPassed[i]} `;
//           devicesFound.id.push(user[i].deviceid);
//           devicesFound.day.push(daysPassed[i]) ;
//           stringIds = (stringIds+user[i].userid+', ')
//         }
//       }
//       if(stringIds.length>1){
//         stringIds = stringIds.slice(0,-2);
//         stringIds+=')'
//         query+= `END WHERE id in ${stringIds}`;
//         await exports.runQuery(query);
//       }
//       let messages =[];
//       for (let i = 0; i < devicesFound.id.length; i++) {
//         query = `select description from tips where id = ${devicesFound.day[i]} `;
//         let queryResults = await exports.runQuery(query);
//         if (!Expo.isExpoPushToken(devicesFound.id[i])) {
//           console.error(`Push token ${devicesFound.id[i]} is not a valid Expo push token`);
//           continue;
//         }
//         messages.push({
//           to: devicesFound.id[i],
//           sound: 'default',
//           body: queryResults[0].description.toString()
//         })
//       }
//       let chunks, tickets = [];
//       if(messages.length){
//         chunks = expo.chunkPushNotifications(messages);
//         await (async () => {
//           for (let chunk of chunks) {
//             try {
//               let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
//               tickets.push(...ticketChunk);
//             } catch (error) {
//               console.error(error);
//             }
//           }
//         })();
//       }
//       let receiptIds = [];
//       for (let ticket of tickets) {
//         if (ticket.id) {
//           receiptIds.push(ticket.id);
//         }
//       }
//       let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
//       (async () => {
//         for (let chunk of receiptIdChunks) {
//           try {
//             let receipts = await expo.getPushNotificationReceiptsAsync(chunk);

//             for (let i = 0; i < receipts.length; i++) {
//               if (receipts[i].status === 'ok') {
//                 continue;
//               } else if (receipts[i].status === 'error') {
//                 console.error(`There was an error sending a notification: ${receipts[i].message}`);
//                 if (receipts[i].details && receipts[i].details.error) {
//                   console.error(`The error code is ${receipts[i].details.error}`);
//                 }
//               }
//             }
//           } catch (error) {
//             console.error(error);
//           }
//         }
//       })();
//       exports.sendCheckinNotifications(start);
//       start+=100;
//       if(start<countResults[0].count){
//         setTimeout(function() {
//           exports.sendTipsNotifications(start);
//         }, 120000);
//       } else{
//         start=0;
//         setTimeout(function() {
//           exports.sendTipsNotifications(start);
//         }, 1800000);
//       }
//     } catch(error){
//       console.log(error.message);
//     }
//   }

// exports.calculateDaysPassed = async function(user, check){
//     let daysPassed = [];
//     for(let i = 0; i < user.length; i++){
//       let checkInTime = new Date(user[i].checkintime);
//       await checkInTime.setMinutes(checkInTime.getMinutes()  - new Date().getTimezoneOffset() -user[i].offset);
//       checkInTime = Math.floor(checkInTime/86400000);
//       let daysStopped = 0;
//       for(let j = 0; j < user[i].stopdays.length; j++){
//         let restartDay = new Date(user[i].stopdays[j].restarttime);
//         await restartDay.setMinutes(restartDay.getMinutes()  - new Date().getTimezoneOffset() -user[i].offset);
//         restartDay = Math.floor(restartDay/86400000);
//         let stopDay = new Date(user[i].stopdays[j].stoptime);
//         await stopDay.setMinutes(stopDay.getMinutes()  - new Date().getTimezoneOffset() -user[i].offset);
//         stopDay = Math.floor(stopDay/86400000);
//         daysStopped+=(restartDay-stopDay);
//         if(daysStopped<0) {daysStopped = 0;}
//       }
//       let currentTime = new Date();
//       await currentTime.setMinutes(currentTime.getMinutes()  - new Date().getTimezoneOffset() -user[i].offset);
//       currentTime = Math.floor(currentTime/86400000);
//       daysPassed[i] = ((currentTime-checkInTime) - daysStopped) + 1;
//       let week = 0;
//       currentTime = new Date();
//       // await currentTime.setMinutes(currentTime.getMinutes() - new Date().getTimezoneOffset() - new Date().getTimezoneOffset() - (new Date().getTimezoneOffset()-req.body.offset));
//       currentTime = currentTime.toISOString().slice(0, 19).replace('T', ' ');;
//       switch(user[i].currentphase){
//         case 0:
//         daysPassed[i] = 0;
//         break;
//         case 1:
//         if(daysPassed[i]>21) {
//           await exports.runQuery(`Update user set currentphase = ${user[i].currentphase+1}, notificationscheck = 0,
//           workouttarget = workouttarget + 1 where id = ${user[i].userid}`);
//         }
//         break;
//         case 2:
//         if(daysPassed[i]>60) {
//           await exports.runQuery(`Update user set currentphase = ${user[i].currentphase+1}, notificationscheck = 0,
//           workouttarget = workouttarget + 1 where id = ${user[i].userid}`);
//         }
//         break;
//         case 3:
//         if(daysPassed[i]>74) {
//           daysPassed[i] =74;
//           await exports.runQuery(`Update user set finishedprogram = 1 where id = ${user[i].userid}`);
//         }
//         break;
//       }
//     if(Number.isNaN(daysPassed[i])||user[i].steplevel < 6){
//       daysPassed[i] = 0;
//     }
//   }
//   return daysPassed;
// }

// exports.sendCheckinNotifications = async function(start){
//   try{
//     let countResults = await exports.runQuery(`Select count(id) as count from devicetokens`);
//     let userDevices = await exports.runQuery(`Select d.deviceid as deviceid, d.userid as userid, u.offset, u.day, u.currentphase, u.checkintime,
//       s.stoptime, s.restarttime, u.steplevel, u.notificationscheck from devicetokens d inner join user u on u.id = d.userid left join stopdays s on u.id = s.userid
//       inner join (Select id from devicetokens limit 100 offset ${start}) as d2 on d.id = d2.id`);
//       let devicesFound={
//         id: [],
//         day:[]
//       }
//       let notificationsSent={
//         id: [],
//         check:[]
//       }
//       let user = _.uniqBy(userDevices, "userid");
//       let j = 0;
//       user[j].stopdays = []
//       for(let i = 0; i < userDevices.length; i++){
//         if(user[j].userid == userDevices[i].userid){
//           user[j].stopdays.push({
//             stoptime: userDevices[i].stoptime,
//             restarttime: userDevices[i].restarttime
//           })
//         } else{
//           j = j + 1;
//           user[j].stopdays = []
//           i = i - 1;
//         }
//       }
//       let daysPassed = await exports.calculateDaysPassed(user, 1);
//       for(let i = 0; i < user.length; i++){
//         switch(user[i].currentphase){
//           case 0:
//           break;
//           case 1:
//           switch(daysPassed[i]){
//             case 19:
//             if(user[i].notificationscheck < 1){
//               devicesFound.id.push(user[i].deviceid);
//               devicesFound.day.push(0);
//               notificationsSent.id.push(user[i].userid);
//               notificationsSent.check.push(1);
//             }
//             break;
//             case 21:
//             if(user[i].notificationscheck < 2){
//               devicesFound.id.push(user[i].deviceid);
//               devicesFound.day.push(1);
//               notificationsSent.id.push(user[i].userid);
//               notificationsSent.check.push(2);
//             }
//             break;
//             case 22:
//             if(user[i].notificationscheck < 3){
//               devicesFound.id.push(user[i].deviceid);
//               devicesFound.day.push(2);
//               notificationsSent.id.push(user[i].userid);
//               notificationsSent.check.push(3);
//             }
//             break;
//           }
//           break;
//           case 2:
//           switch(daysPassed[i]){
//             case 58:
//             if(user[i].notificationscheck < 1){
//               devicesFound.id.push(user[i].deviceid);
//               devicesFound.day.push(0);
//               notificationsSent.id.push(user[i].userid);
//               notificationsSent.check.push(1);
//             }
//             break;
//             case 60:
//             if(user[i].notificationscheck < 2){
//               devicesFound.id.push(user[i].deviceid);
//               devicesFound.day.push(1);
//               notificationsSent.id.push(user[i].userid);
//               notificationsSent.check.push(2);
//             }
//             break;
//             case 61:
//             if(user[i].notificationscheck < 3){
//               devicesFound.id.push(user[i].deviceid);
//               devicesFound.day.push(2);
//               notificationsSent.id.push(user[i].userid);
//               notificationsSent.check.push(3);
//             }
//             break;
//           }
//           break;
//           case 3:
//           switch(daysPassed[i]){
//             case 72:
//             if(user[i].notificationscheck < 1){
//               devicesFound.id.push(user[i].deviceid);
//               devicesFound.day.push(0);
//               notificationsSent.id.push(user[i].userid);
//               notificationsSent.check.push(1);
//             }
//             break;
//             case 74:
//             if(user[i].notificationscheck < 2){
//               devicesFound.id.push(user[i].deviceid);
//               devicesFound.day.push(1);
//               notificationsSent.id.push(user[i].userid);
//               notificationsSent.check.push(2);
//             }
//             break;
//             case 75:
//             if(user[i].notificationscheck < 3){
//               devicesFound.id.push(user[i].deviceid);
//               devicesFound.day.push(2);
//               notificationsSent.id.push(user[i].userid);
//               notificationsSent.check.push(3);
//             }
//             break;
//           }
//           break;
//         }
//       }
//       let messages =[];
//       for (let i = 0; i < devicesFound.id.length; i++) {
//         if (!Expo.isExpoPushToken(devicesFound.id[i])) {
//           console.error(`Push token ${devicesFound.id[i]} is not a valid Expo push token`);
//           continue;
//         }
//         switch(devicesFound.day[i]){
//           case 0:
//           messages.push({
//             to: devicesFound.id[i],
//             sound: 'default',
//             body: "Remember to check in for your next phase in 2 days time"
//           })
//           break;
//           case 1:
//           messages.push({
//             to: devicesFound.id[i],
//             sound: 'default',
//             body: "Remember to check in for your next phase today"
//           })
//           break;
//           case 2:
//           messages.push({
//             to: devicesFound.id[i],
//             sound: 'default',
//             body: "You missed your check-in. Kindly complete your check in asap"
//           })
//           break;
//         }
//       }
//       let chunks, tickets = [];
//       if(messages.length){
//         chunks = expo.chunkPushNotifications(messages);
//         await (async () => {
//           for (let chunk of chunks) {
//             try {
//               let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
//               tickets.push(...ticketChunk);
//             } catch (error) {
//               console.error(error);
//             }
//           }
//         })();
//       }
//       let receiptIds = [];
//       for (let ticket of tickets) {
//         if (ticket.id) {
//           receiptIds.push(ticket.id);
//         }
//       }
//       let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
//       (async () => {
//         for (let chunk of receiptIdChunks) {
//           try {
//             let receipts = await expo.getPushNotificationReceiptsAsync(chunk);

//             for (let i = 0; i < receipts.length; i++) {
//               if (receipts[i].status === 'ok') {
//                 continue;
//               } else if (receipts[i].status === 'error') {
//                 console.error(`There was an error sending a notification: ${receipts[i].message}`);
//                 if (receipts[i].details && receipts[i].details.error) {
//                   console.error(`The error code is ${receipts[i].details.error}`);
//                 }
//               }
//             }
//           } catch (error) {
//             console.error(error);
//           }
//         }
//       })();
//       let stringIds = '(';
//       query =` UPDATE user SET notificationscheck = CASE id `;
//       for(let i = 0; i < notificationsSent.id.length; i++){
//         query+=`WHEN ${notificationsSent.id[i]} THEN ${notificationsSent.check[i]} `;
//         stringIds = (stringIds+notificationsSent.id[i]+', ')
//       }
//       if(stringIds.length > 1){
//         stringIds = stringIds.slice(0,-2);
//         stringIds+=')'
//         query+= `END WHERE id in ${stringIds}`;
//         await exports.runQuery(query);
//       }
//     } catch(error){
//       console.log(error.message);
//     }

//   }
// exports.checkInPending = async function (id, week){
//     let query = ( `select * from checkin where userid = ${id} and week = ${week}`);
//     let queryResults =  await exports.runQuery(query);
//     if(queryResults.length){
//       return false;
//     } else{
//       return true;
//     }
//   }
