const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const db = 'mongodb://localhost:27017/treat-dispenser';
const fs = require('fs');
const private_cert = fs.readFileSync('./jwtRS256.key');
const public_cert = fs.readFileSync('./jwtRS256.key.pub');

mongoose.connect(db, err => {
    if (err) {
        console.error('Error!' + err)
    } else {
        console.log('Connected to mongodb')
    }
})


// This can be used to verify JWT. Not needed currently.
verifyToken = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized Request')
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        return res.status(401).send('Unauthorized Request')
    }
    let payload = jwt.verify(token, public_cert);
    if (!payload) {
        return res.status(401).send('Unauthorized Request')
    }
    req.userId = payload.subject;
    next()
}

router.get('/', (req, res) => {
    res.send('API route works!')
})

router.post('/register', (req, res) => {
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
                    let payload = { subject: registeredUser._id };
                    let token = jwt.sign(payload, private_cert);
                    res.status(200).send({token});
                }
            })
        }
    })
})

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
                    let payload = { subject: user._id };
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

router.get('/user:id', verifyToken, (req, res) => {
    User.findById(req.user.id, (error, user) => {
        if (error) {
            console.log(error);
        } else {
            if (!user) {
                res.status(401).send('Invalid User ID');
            } else {
                console.log(res);
                res.status(200).send({res});
                }
            }
        }
    )
})

module.exports = router;