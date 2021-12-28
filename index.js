const dotenv = require('dotenv-safe').config({ allowEmptyValues: true, example: './.env.example' });
const Config = require('./config.json')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const express = require('express');
const mysql = require('mysql');
const http = require('http');
var fs = require('fs');
const app = express();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

if (process.env.SERVER_PRODUCTION === 'FALSE') {
  process.env.TOKEN_EXPIRES = 86400;
  console.warn(`\n=========================================DEVELOPMENT=========================================\n` +
    `| DON'T FORGET TO CHANGE \".env\\SERVER_PRODUCTION\" TO \"TRUE\" BEFORE SUBMITTING TO PRODUCTION |\n` +
    `|===========================================================================================|\n`);
}

function verifyJWT(req, res, next) {
  if (!req.headers['x-resource-token']) {
    return res.status(401).send({ message: 'Token Verification Failed' });
  } else {
    db.query(`SELECT * FROM token_blacklist WHERE token = '${req.headers['x-resource-token']}'`, function (token_err, token_result, token_fields) {
      if (token_err) {
        console.error({ info: `Error Check Token`, route: req.protocol + '://' + req.get('host') + req.originalUrl, error: token_err.stack });
        return res.status(500).send({ message: 'Server Error' });
      } else {
        if (token_result.length > 0) {
          return res.status(401).send({ message: 'Token Unauthorized' });
        } else {
          var PublicKey = fs.readFileSync('./public.key', 'utf8');
          jwt.verify(req.headers['x-resource-token'], PublicKey, { algorithm: 'RS256' }, function (err, decoded) {
            if (err) {
              return res.status(500).send({ message: 'Server Failed To Generate Token' });
            } else {
              next();
            }
          });
        }
      }
    });
  }
}

app.get(`${Config.PATH}/`, verifyJWT, (req, res, next) => {
  return res.status(200).send({ message: "Token Authorized" });
});

app.post(`${Config.PATH}/login`, (req, res, next) => {
  if (!req.body.password || !req.body.email) {
    return res.status(401).send({ message: 'Invalid Data' });
  } else {
    db.query(`SELECT * FROM users WHERE email = '${req.body.email}'`, function (email_err, email_result, email_fields) {
      if (email_err) {
        console.error({ info: `Error Check E-Mail`, route: req.protocol + '://' + req.get('host') + req.originalUrl, error: token_err.stack });
        return res.status(500).send({ message: 'Server Error' });
      } else {
        if (email_result.length <= 0) {
          return res.status(401).send({ message: 'Invalid E-Mail' });
        } else {
          db.query(`SELECT * FROM users WHERE email = '${req.body.email}' AND password = MD5('${req.body.password}')`, function (password_err, password_result, password_fields) {
            if (password_err) {
              console.error({ info: `Error Check Password`, route: req.protocol + '://' + req.get('host') + req.originalUrl, error: token_err.stack });
              return res.status(500).send({ message: 'Server Error' });
            } else {
              if (password_result.length <= 0) {
                res.status(401).send({ message: 'Invalid Password' });
              } else {
                var UserID = password_result[0]['id'];
                var PrivateKey = fs.readFileSync('./private.key', 'utf8');
                var Token = jwt.sign({ UserID }, PrivateKey, {
                  expiresIn: process.env.TOKEN_EXPIRES,
                  algorithm: 'RS256'
                });
                return res.status(200).send({ message: 'User Authenticated', token: Token });
              }
            }
          });
        }
      }
    });
  }
});

app.post(`${Config.PATH}/register`, (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.email) {
    return res.status(401).send({ message: 'Invalid Data' });
  } else {
    db.query(`SELECT * FROM users WHERE username = '${req.body.username}' OR email = '${req.body.email}'`, function (check_err, check_result, check_fields) {
      if (check_err) {
        console.error({ info: `Error Check User Data`, route: req.protocol + '://' + req.get('host') + req.originalUrl, error: token_err.stack });
        return res.status(500).send({ message: 'Server Error' });
      } else {
        if (check_result.length > 0) {
          return res.status(401).send({ message: 'User Exist' });
        } else {
          db.query(`INSERT INTO users(username, password, email) VALUES ('${req.body.username}', MD5('${req.body.password}'), '${req.body.email}')`, function (register_err, register_result) {
            if (register_err) {
              console.error({ info: `Error Register User`, route: req.protocol + '://' + req.get('host') + req.originalUrl, error: token_err.stack });
              return res.status(500).send({ message: 'Server Error' });
            } else {
              return res.status(200).send({ message: 'Register Successfully' });
            }
          });
        }
      }
    });
  }
});

app.post(`${Config.PATH}/logout`, verifyJWT, (req, res) => {
  if (!req.headers['x-resource-token']) {
    return res.status(401).send({ message: 'Invalid Token' });
  } else {
    if (!req.body.password || !req.body.email) {
      return res.status(401).send({ message: 'Invalid User Data' });
    } else {
      db.query(`SELECT * FROM users WHERE email = '${req.body.email}'`, function (email_err, email_result, email_fields) {
        if (email_err) {
          console.error({ info: `Error Check E-Mail`, route: req.protocol + '://' + req.get('host') + req.originalUrl, error: token_err.stack });
          return res.status(500).send({ message: 'Server Error' });
        } else {
          if (email_result.length <= 0) {
            return res.status(401).send({ message: 'Invalid E-Mail' });
          } else {
            db.query(`SELECT * FROM users WHERE email = '${req.body.email}' AND password = MD5('${req.body.password}')`, function (password_err, password_result, password_fields) {
              if (password_err) {
                console.error({ info: `Error Check Password`, route: req.protocol + '://' + req.get('host') + req.originalUrl, error: token_err.stack });
                return res.status(500).send({ message: 'Server Error' });
              } else {
                if (password_result.length <= 0) {
                  return res.status(401).send({ message: 'Invalid Password' });
                } else {
                  var UserID = password_result[0]['id'];
                  db.query(`SELECT * FROM token_blacklist WHERE token = '${req.headers['x-resource-token']}'`, function (token_err, token_result, token_fields) {
                    if (token_err) {
                      console.error({ info: `Error Check Token`, route: req.protocol + '://' + req.get('host') + req.originalUrl, error: token_err.stack });
                      return res.status(500).send({ message: 'Server Error' });
                    } else {
                      if (token_result.length > 0) {
                        db.query(`UPDATE token_blacklist SET user_id = ${parseInt(UserID)} WHERE token = '${req.headers['x-resource-token']}'`, function (update_err, update_result) {
                          if (update_err) {
                            console.error({ info: `Error Update Token`, route: req.protocol + '://' + req.get('host') + req.originalUrl, error: token_err.stack });
                            return res.status(500).send({ message: 'Server Error' });
                          } else {
                            return res.status(200).send({ message: 'Logout Successfully' });
                          }
                        });
                      } else {
                        db.query(`INSERT INTO token_blacklist(token, user_id) VALUES ('${req.headers['x-resource-token']}', ${parseInt(UserID)})`, function (insert_err, insert_result) {
                          if (insert_err) {
                            console.error({ info: `Error Insert Token`, route: req.protocol + '://' + req.get('host') + req.originalUrl, error: token_err.stack });
                            return res.status(500).send({ message: 'Server Error' });
                          } else {
                            return res.status(200).send({ message: 'Logout Successfully' });
                          }
                        });
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  }
});

var server = http.createServer(app).listen(process.env.SERVER_PORT);
console.log(`API working on \"${Config.PROTOCOL}${Config.HOST}:${process.env.SERVER_PORT}${Config.PATH}\"`);