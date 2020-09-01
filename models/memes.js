const { Schema, model } = require('mongoose')

module.exports = model('memes', new Schema({
    file_id: { type: String, required: true },
    file_unique_id: { type: String, required: true },
    tags: [{ type: String }]
}))