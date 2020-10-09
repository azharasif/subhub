const jwt = require('jsonwebtoken')
const functions = require('../middleware/functions');



exports.validJwt = async (req , res  , next)=>{
  if(req.body.userFor){
    exports.adminJwt(req, res, next);
    return;
  }
  const token =  JSON.stringify(req.headers.authorization)||1234;
  try{
    let query = `select u.id as userid,  a.id as tokenid, a.enddate from user u inner join authtoken a on u.id = a.userid where a.token = ${token}`;
    console.log(query);
    let queryResults =  await functions.runQuery(query);
    console.log(queryResults);
    if(queryResults.length){
      if(!queryResults[0].issuperadmin){
        let tokenEndDate = new Date(queryResults[0].enddate);
        await tokenEndDate.setMinutes(tokenEndDate.getMinutes() - new Date().getTimezoneOffset());
        let currentDate = new Date();
        await currentDate.setMinutes(currentDate.getMinutes() - new Date().getTimezoneOffset());
        if(tokenEndDate > currentDate){
          req.body.userid = queryResults[0].userid;
  
          next();
        } else {
          await functions.runQuery(`Delete from authtoken where id = ${queryResults[0].tokenid}`);
          res.send({statusCode:405, message: "Token has expired. Please login again."});
        }
      }else{
        exports.adminJwt(req, res, next);
        return;
      }
    } else{
      res.send({statusCode:405, message: "Invalid token. Please login."})
    }
  }catch(err){
    res.send({"statusCode": 405, "message": err.message});
  }
}
exports.adminJwt = async (req , res  , next)=>{
  const token =  JSON.stringify(req.headers.authorization)||1234;
  try{
    let query = `select u.id as userid, u.issuperadmin,  a.id as tokenid, a.enddate from user u inner join authtoken a on u.id = a.userid where a.token = ${token}`;
    let queryResults =  await functions.runQuery(query);
    if(queryResults.length&&queryResults[0].issuperadmin){
      let tokenEndDate = new Date(queryResults[0].enddate);
      await tokenEndDate.setMinutes(tokenEndDate.getMinutes() - new Date().getTimezoneOffset() );
      let currentDate = new Date();
      await currentDate.setMinutes(currentDate.getMinutes() - new Date().getTimezoneOffset());
      if(tokenEndDate > currentDate){
        if(!req.body.userFor){
          req.body.userid = queryResults[0].userid;
          req.body.issuperadmin = true;
          next();
        } else{
          req.body.userid = req.body.userFor;
          req.body.issuperadmin = false;
          next();
        }
      } else {
        query = `Delete from authtoken where id = ${queryResults[0].tokenid}`;
        await functions.runQuery(query);
        res.send({statusCode:405, message: "Token has expired. Please login again."});
      }
    }
    else
    res.send({statusCode:405, message: "Invalid token. Please login."})
  }catch(err){
    res.send({"statusCode": 405, "message": err.message});
  }

}
