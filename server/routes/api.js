const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const db = 'mongodb://mdrichardson.net:27017/treat-dispenser';
const fs = require('fs');
const private_cert = fs.readFileSync('./jwtRS256.key');
const public_cert = fs.readFileSync('./jwtRS256.key.pub');

// Quick allow/disallow of registration. True for allow, false for disallow
var allow_registration = false;

mongoose.connect(db, err => {
    if (err) {
        console.error('Error!' + err)
    } else {
        console.log('Connected to mongodb')
    }
})

// Verify API works at all
router.get('/', (req, res) => {
    res.send('API route works!')
})

// Register users
router.post('/register', (req, res) => {
    if (allow_registration) {
        bcrypt.hash(req.body.password, 10, function(err, hash){
            if (err) {
               return res.status(500).json({
                  error: err
               });
            } else {
                let userData = req.body;
                let user = new User(userData);
                user.password = hash;
                user.save((error, registeredUser) => {
                    if (error) {
                        console.log(error);
                    } else {
                        let payload = {
                            _id: registeredUser._id,
                            username: registeredUser.username,
                            role: registeredUser.role,
                            photonDeviceId: registeredUser.photonDeviceId,
                            photonAccessToken: registeredUser.photonAccessToken,
                            videoUrl: registeredUser.videoUrl,
                            videoAuthToken: registeredUser.videoAuthToken,
                            photonApiUrl: registeredUser.photonApiUrl,
                            photonAccessString: registeredUser.photonAccessString,
                        };
                        let token = jwt.sign(payload, private_cert);
                        res.status(200).send({token});
                    }
                })
            }
        })
    } else {
        res.status(500).send('Registration is currently disabled');
    }
})

// Allow users to login if they have a username/password already. Returns all user data as user object.
router.post('/login', (req, res) => {
    let userData = req.body;
    User.findOne({username: userData.username}, (error, user) => {
    if (error) {
        console.log(error);
    } else {
        if (!user) {
            res.status(401).send('Invalid Username');
        } else {
            bcrypt.compare(req.body.password, user.password, function(err, result) {
                if(err) {
                    return res.status(401).json({
                       failed: 'Unauthorized Access'
                    });
                 }
                 if(result) {
                    let payload = {
                        _id: user._id,
                        username: user.username,
                        role: user.role,
                        photonDeviceId: user.photonDeviceId,
                        photonAccessToken: user.photonAccessToken,
                        videoUrl: user.videoUrl,
                        videoAuthToken: user.videoAuthToken,
                        photonApiUrl: user.photonApiUrl,
                        photonAccessString: user.photonAccessString,
                    };
                    let token = jwt.sign(payload, private_cert, { expiresIn: '30d' });
                    return res.status(200).send({token});
                 }
                 return res.status(401).json({
                    failed: 'Unauthorized Access'
                 });
              });
            }
        } 
    }) 
})

// Ensure all routes require a token -- Must go after login/register, but before anything that should require valid token
router.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, public_cert, function(err, decoded) {      
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
  
    } else {
      return res.status(403).send({ 
          success: false, 
          message: 'No token provided.' 
      });
    }
  });

module.exports = router;