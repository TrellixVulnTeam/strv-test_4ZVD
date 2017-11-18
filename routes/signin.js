const express = require('express');
const router = express.Router();
const User = require('./../models/users');
const jwt = require('jsonwebtoken');
const config = require(__base + 'config');
const localstorage = require('node-localstorage').LocalStorage;
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
  res.render('sign-in');
});

router.post('/', (req, res, next) => {
  User.findOne({email: req.body.email}, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.json({success: false, message: "Authentication failed. User not found."})
    } else if (user) {

      bcrypt.compare(req.body.password, user.password, (err, bool) => {
        if (!bool) {
          res.json({success: false, message: "Authentication failed. Wrong password."})
        } else {
          const token = jwt.sign({user}, config.secret, {
            expiresIn: "1h"
          });
          res.json({
            success: true,
            message: "Logged in successfuly",
            token: token
          });
          localStorage.setItem('token', 'Bearer ' + token);
        }
      });
    };
  });
});

module.exports = router;
