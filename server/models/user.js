const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: String,
    photonDeviceId: String,
    photonAccessToken: String,
    videoUrl: String,
    videoAuthToken: String,
    
    }, {
        toObject: {
        virtuals: true
        },
        toJSON: {
        virtuals: true 
        }
})

// Combine some values into new key/values
userSchema
    .virtual('photonApiUrl')
    .get(function () {
        return `https://api.particle.io/v1/devices/${this.photonDeviceId}/`
    })

userSchema
    .virtual('photonAccessString')
    .get(function () {
        return `?access_token=${this.photonAccessToken}`
    })

module.exports = mongoose.model('user', userSchema, 'users');