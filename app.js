var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const con = require('./db');
var cors = require('cors');
const functions = require("./middleware/functions");
const VerifyTokenMiddleware = require('./middleware/validJwt');

//-----------------------------User Management-----------------------------//
const logout = require('./routes/logout');
const resetPassword = require('./routes/resetPassword');
const userLogin = require('./routes/userLogin');
const userSignup = require('./routes/userSignup');
const verifyCode = require('./routes/verifyCode');
const changePassword = require('./routes/changePassword')
const forgotPassword = require('./routes/forgotPassword');
const getsub = require('./routes/getSub')
const editUserProfile = require('./routes/editUserProfile')
const getUserdata = require('./routes/getuserdata')
const adminLogin = require('./routes/adminLogin')
const onacceptJob = require('./routes/userAceptJob')
const addNewjobAdmin = require('./routes/addJobByAdmin')


var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: true }));

//-----------------------------User Management-----------------------------//

app.use('/changePassword', VerifyTokenMiddleware.validJwt, changePassword);
app.use('/forgotPassword', forgotPassword);
app.use('/logout', VerifyTokenMiddleware.validJwt, logout);
app.use('/resetPassword', resetPassword);
app.use('/getsub' , VerifyTokenMiddleware.validJwt , getsub)
app.use('/userLogin', userLogin);
app.use('/userSignup', userSignup);
app.use('/verifyCode', verifyCode);
app.use('/editUserProfile'  , VerifyTokenMiddleware.validJwt , editUserProfile )
app.use('/getUserdata' , VerifyTokenMiddleware.validJwt , getUserdata)
app.use('/adminLogin' , adminLogin)
app.use('/onacceptJob' , VerifyTokenMiddleware.validJwt , onacceptJob)
app.use('/addNewjobAdmin' , VerifyTokenMiddleware.adminJwt , addNewjobAdmin)
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  res.status(err.status || 500).send({ message: err.message });
});


module.exports = app;
