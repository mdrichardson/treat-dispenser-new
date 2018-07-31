const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user')
const mongoose = require('mongoose');
const db = 'mongodb://localhost:27017/treat-dispenser';
const cert = fs.readFileSync('./jwtRS256.key');

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
        return res.status(401).send('Unauthorized Reqest')
    }
    let payload = jwt.verify(token, cert);
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
    let userData = req.body;
    let user = new User(userData);
    user.save((error, registeredUser) => {
        if (error) {
            console.log(error);
        } else {
            let payload = { subject: registeredUser._id };
            let token = jwt.sign(payload, cert);
            res.status(200).send({token});
        }
    })
})

router.post('/login', (req, res) => {
    let userData = req.body;
    User.findOne({username: userData.username}, (error, user) =>{
    if (error) {
        console.log(error);
    } else {
        if (!user) {
            res.status(401).send('Invalid Username');
        } else {
            if (user.password !== userData.password) {
                res.status(401).send('Invalid Password');
            } else {
                let payload = { subject: user._id };
                let token = jwt.sign(payload, cert);
                res.status(200).send({token});
            }
        } 
    }       
    })
})

module.exports = router;