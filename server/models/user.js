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
})

module.exports = mongoose.model('user', userSchema, 'users');