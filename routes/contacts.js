const express = require('express');
const router = express.Router();
const User = require('./../models/users.js');
const jwt = require('jsonwebtoken');
const config = require(__base + 'config');
const localstorage = require('node-localstorage').LocalStorage;
const admin = require("firebase-admin");
const db = admin.database();
const ref = db.ref("server/contacts");

function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    if (!req.token) {
      req.token = bearerToken;
    }
    next();
  } else {
    res.sendStatus(403);
  }
};

// GET contacts for users
router.get('/', ensureToken, (req, res, next) => {
  jwt.verify(req.token, config.secret, (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      ref.orderByChild("owner").equalTo(data.user.email).once("value", (snapshot) => {
        res.render('contacts-table', {contacts: snapshot.val()});
      });
    }
  });
});

router.post('/add', ensureToken, (req, res) => {
  jwt.verify(req.token, config.secret, (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      if (data) {
        const newContact = {
          owner: data.user.email,
          fName: req.body.fName,
          lName: req.body.lName,
          phone: Number(req.body.phoneNumber),
          nickname: req.body.nickname
        };
        ref.push(newContact, (err) => {
          if (err) {
            res.json({
              success: false,
              reason: err
            });
          } else {
            res.json({
              success: true,
              message: "Added new contact."
            });
          }
        })
      } else {
        res.json({
          success: false,
          reason: "Required fields were not filled."
        });
      };
    };
  });
});

module.exports = router;
