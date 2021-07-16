const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true, unique: true},
    name: {type: String, required: true, unique: true},
    manufacturer: {type: String, required: true, unique: true},
    description: {type: String, required: true, unique: true},
    mainPepper: {type: String, required: true, unique: true},
    imageUrl: {type: String, required: true, unique: true},
    heat: {type: Number, required: true, unique: true},
    likes: {type: Number},
    dislikes: {type: Number},
    usersLiked: {type: [String]},
    usersDisliked: {type: [String]}
});

module.exports = mongoose.model('Sauce', sauceSchema);