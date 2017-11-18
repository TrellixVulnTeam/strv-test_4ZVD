const express = require('express');
const router = express.Router();
const User = require('./../models/users');
const jwt = require('jsonwebtoken');
const localstorage = require('node-localstorage').LocalStorage;
const bcrypt = require('bcrypt');
const config = require(__base + 'config');

router.get('/', (req, res, next) => {
  res.render('sign-up');
});

router.post('/', (req, res, next) => {
  if (req.body.password === req.body.password2) {
    const pwdHashed = bcrypt.hash(req.body.password, 10, (err, hash) => {

      const user = new User({
        email: req.body.email,
        password: hash
      });

      user.save((err, user) => {
        if (err) {
          res.json({
            success: false,
            reason: err
          })
        } else {
          const token = jwt.sign({user}, config.secret, {
            expiresIn: "1h"
          });
          localStorage.setItem('token', 'Bearer ' + token);
          res.json({
            success: true,
            user: user,
            token: token
          });
        };
      });
    });
  } else {
    res.json({
      success: false,
      reason: "Passwords do not match!"
    });
    console.log("Passwords do not match.");
  }

});

module.exports = router;
