const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
    title: { type: String },
    categories: { type: String },
    content: { type: String }
}, { collection: "posts" });

module.exports = mongoose.model('Posts', postsSchema);